package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.port.GeneradorRadicado;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class GeneradorRadicadoJdbc implements GeneradorRadicado {

    private final JdbcTemplate jdbc;

    public GeneradorRadicadoJdbc(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public String siguiente() {
        Long next = jdbc.queryForObject("SELECT nextval('pqrs_radicado_seq')", Long.class);
        return String.format("PQRS-%d-%06d", LocalDate.now().getYear(), next);
    }
}
