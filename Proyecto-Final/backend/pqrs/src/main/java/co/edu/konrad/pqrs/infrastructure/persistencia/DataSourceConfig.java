package co.edu.konrad.pqrs.infrastructure.persistencia;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Parses DATABASE_URL en formato `postgresql://user:pass@host/db?params`
 * (estilo Heroku/Render/Neon) y construye HikariDataSource con JDBC URL valido.
 * Necesario porque pgjdbc no acepta user:pass embebidos en jdbcUrl.
 */
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(@Value("${DATABASE_URL}") String rawUrl) throws URISyntaxException {
        URI uri = new URI(rawUrl);

        String userInfo = uri.getUserInfo();
        if (userInfo == null || !userInfo.contains(":")) {
            throw new IllegalStateException("DATABASE_URL debe incluir user:password — recibido: " + rawUrl);
        }
        String[] userPass = userInfo.split(":", 2);
        String user = userPass[0];
        String pass = userPass[1];

        int port = uri.getPort() == -1 ? 5432 : uri.getPort();

        // Neon pooler (PgBouncer) no acepta `options=-c search_path=...` como startup param.
        // El search_path se pin-ea a nivel de rol (`ALTER ROLE pqrs_app SET search_path = public`),
        // asi que filtramos el parametro de la query si llega en el URL.
        String query = uri.getRawQuery();
        String filteredQuery = null;
        if (query != null && !query.isBlank()) {
            filteredQuery = Arrays.stream(query.split("&"))
                    .filter(p -> !p.startsWith("options="))
                    .collect(Collectors.joining("&"));
            if (filteredQuery.isBlank()) {
                filteredQuery = null;
            }
        }

        String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath()
                + (filteredQuery != null ? "?" + filteredQuery : "");

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setUsername(user);
        ds.setPassword(pass);
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setMaximumPoolSize(10);
        ds.setMinimumIdle(2);
        return ds;
    }
}
