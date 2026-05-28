package co.edu.konrad.pqrs.api.rest;

import java.util.List;

public record PaginaResponse<T>(
        List<T> contenido,
        long total,
        int page,
        int size
) {
}
