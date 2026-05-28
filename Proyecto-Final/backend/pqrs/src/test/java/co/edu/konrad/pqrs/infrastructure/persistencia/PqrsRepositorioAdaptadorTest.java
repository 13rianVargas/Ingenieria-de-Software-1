package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class PqrsRepositorioAdaptadorTest {

    private PqrsJpaRepositorio jpa;
    private PqrsRepositorioAdaptador adaptador;

    @BeforeEach
    void setup() {
        jpa = Mockito.mock(PqrsJpaRepositorio.class);
        adaptador = new PqrsRepositorioAdaptador(jpa);
    }

    private PqrsEntidad entidad() {
        PqrsEntidad e = new PqrsEntidad();
        e.setId(7);
        e.setRadicado("PQRS-2026-000007");
        e.setTipo(TipoPqrs.queja);
        e.setAsunto("Asunto");
        e.setDescripcion("desc larga");
        e.setEstado(EstadoPqrs.nuevo);
        e.setClienteId(3);
        e.setGestorId(null);
        e.setFechaRadicado(LocalDateTime.now());
        return e;
    }

    @Test
    void guardarMapeaIdaYVuelta() {
        when(jpa.save(any())).thenReturn(entidad());
        Pqrs p = new Pqrs(TipoPqrs.queja, "Asunto", "desc larga", 3);
        p.setRadicado("PQRS-2026-000007");

        Pqrs r = adaptador.guardar(p);

        assertEquals(7, r.getId());
        assertEquals("PQRS-2026-000007", r.getRadicado());
        assertEquals(TipoPqrs.queja, r.getTipo());
        assertEquals(EstadoPqrs.nuevo, r.getEstado());
        assertEquals(3, r.getClienteId());
    }

    @Test
    void buscarPorIdPresente() {
        when(jpa.findById(7)).thenReturn(Optional.of(entidad()));
        Optional<Pqrs> r = adaptador.buscarPorId(7);
        assertTrue(r.isPresent());
        assertEquals("PQRS-2026-000007", r.get().getRadicado());
    }

    @Test
    void buscarPorClienteMapeaLista() {
        when(jpa.misPqrs(3, null)).thenReturn(List.of(entidad()));
        List<Pqrs> r = adaptador.buscarPorCliente(3, null);
        assertEquals(1, r.size());
    }

    @Test
    void bandejaYConteo() {
        when(jpa.bandeja(any(), any(), any(Pageable.class))).thenReturn(List.of(entidad()));
        when(jpa.contarBandeja(EstadoPqrs.nuevo, null)).thenReturn(5L);

        assertEquals(1, adaptador.buscarBandeja(EstadoPqrs.nuevo, null, 0, 20).size());
        assertEquals(5L, adaptador.contarBandeja(EstadoPqrs.nuevo, null));
    }
}
