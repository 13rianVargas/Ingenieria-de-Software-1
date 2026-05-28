package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.Adjunto;
import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.model.Tramite;

import java.time.LocalDateTime;
import java.util.List;

/** Detalle completo de una PQRS: cabecera + timeline de tramites + adjuntos. */
public record PqrsDetalleResponse(
        Integer id,
        String radicado,
        TipoPqrs tipo,
        String asunto,
        String descripcion,
        EstadoPqrs estado,
        Integer clienteId,
        Integer gestorId,
        LocalDateTime fechaRadicado,
        LocalDateTime fechaCierre,
        List<TramiteItem> tramites,
        List<AdjuntoItem> adjuntos
) {
    public record TramiteItem(
            EstadoPqrs estadoAnterior,
            EstadoPqrs estadoNuevo,
            String justificacion,
            Integer gestorId,
            LocalDateTime timestamp
    ) {
        static TramiteItem desde(Tramite t) {
            return new TramiteItem(t.getEstadoAnterior(), t.getEstadoNuevo(),
                    t.getJustificacion(), t.getGestorId(), t.getTimestamp());
        }
    }

    public record AdjuntoItem(
            Integer id,
            String nombreArchivo,
            String tipoMime,
            long tamanoBytes,
            LocalDateTime fechaSubida
    ) {
        static AdjuntoItem desde(Adjunto a) {
            return new AdjuntoItem(a.getId(), a.getNombreArchivo(), a.getTipoMime(),
                    a.getTamanoBytes(), a.getFechaSubida());
        }
    }

    public static PqrsDetalleResponse desde(Pqrs p, List<Tramite> tramites, List<Adjunto> adjuntos) {
        return new PqrsDetalleResponse(
                p.getId(), p.getRadicado(), p.getTipo(), p.getAsunto(), p.getDescripcion(),
                p.getEstado(), p.getClienteId(), p.getGestorId(),
                p.getFechaRadicado(), p.getFechaCierre(),
                tramites.stream().map(TramiteItem::desde).toList(),
                adjuntos.stream().map(AdjuntoItem::desde).toList());
    }
}
