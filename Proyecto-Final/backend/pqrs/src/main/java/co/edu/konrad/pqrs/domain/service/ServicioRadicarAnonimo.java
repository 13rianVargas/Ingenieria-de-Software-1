package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.NotificadorCredenciales;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

/**
 * Radicacion anonima (CU-03 + CU-01): un ciudadano sin cuenta radica una PQRS.
 * Si el email no existe, se crea un usuario cliente con clave temporal y se le
 * envian las credenciales por correo. Si ya existe, se radica a su nombre.
 */
@Service
public class ServicioRadicarAnonimo {

    private static final String ALFABETO =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepositorio usuarioRepositorio;
    private final CodificadorClave codificadorClave;
    private final NotificadorCredenciales notificadorCredenciales;
    private final ServicioRadicarPqrs servicioRadicarPqrs;

    public ServicioRadicarAnonimo(UsuarioRepositorio usuarioRepositorio,
                                  CodificadorClave codificadorClave,
                                  NotificadorCredenciales notificadorCredenciales,
                                  ServicioRadicarPqrs servicioRadicarPqrs) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.codificadorClave = codificadorClave;
        this.notificadorCredenciales = notificadorCredenciales;
        this.servicioRadicarPqrs = servicioRadicarPqrs;
    }

    public record DatosCliente(TipoDocumento tipoDoc, String numDoc, String nombres,
                               String apellidos, String email, String telefono) {
    }

    @Transactional
    public Pqrs radicar(DatosCliente cliente, TipoPqrs tipo, String asunto, String descripcion,
                        ServicioRadicarPqrs.Anexo anexo) {
        Usuario existente = usuarioRepositorio.buscarPorCorreo(cliente.email()).orElse(null);

        Integer clienteId;
        String clavePlana = null;
        if (existente != null) {
            clienteId = existente.getId();
        } else {
            clavePlana = generarClave();
            Usuario nuevo = new Usuario(
                    cliente.tipoDoc(), cliente.numDoc(), cliente.nombres(), cliente.apellidos(),
                    cliente.email(), cliente.telefono(), codificadorClave.codificar(clavePlana));
            clienteId = usuarioRepositorio.guardar(nuevo).getId();
        }

        Pqrs radicada = servicioRadicarPqrs.radicar(tipo, asunto, descripcion, clienteId, anexo);

        if (clavePlana != null) {
            notificadorCredenciales.enviarCredenciales(
                    cliente.email(), cliente.nombres(), clavePlana, radicada.getRadicado());
        }
        return radicada;
    }

    private String generarClave() {
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            sb.append(ALFABETO.charAt(RANDOM.nextInt(ALFABETO.length())));
        }
        return sb.toString();
    }
}
