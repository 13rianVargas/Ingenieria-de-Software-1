package co.edu.konrad.pqrs.api.rest;

import java.time.Instant;

public record LoginResponse(String token, String rol, Instant expiraEn) {
}
