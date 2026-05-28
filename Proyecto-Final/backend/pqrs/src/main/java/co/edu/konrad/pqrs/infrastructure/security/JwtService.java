package co.edu.konrad.pqrs.infrastructure.security;

import co.edu.konrad.pqrs.domain.model.TokenSesion;
import co.edu.konrad.pqrs.domain.port.GeneradorToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService implements GeneradorToken {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    @Override
    public TokenSesion generar(String email, String rol) {
        Instant ahora = Instant.now();
        Instant expira = ahora.plusMillis(expirationMs);
        String token = Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(expira))
                .signWith(key)
                .compact();
        return new TokenSesion(token, rol, expira);
    }

    public String extraerEmail(String token) {
        return parse(token).getSubject();
    }

    public String extraerRol(String token) {
        return parse(token).get("rol", String.class);
    }

    public boolean esValido(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
