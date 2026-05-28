package co.edu.konrad.pqrs.domain.model;

import java.time.Instant;

public record TokenSesion(String token, String rol, Instant expiraEn) {
}
