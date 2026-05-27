package co.edu.konrad.pqrs.domain.port;

public interface CodificadorClave {

    String codificar(String claveRaw);

    boolean verifica(String claveRaw, String hashGuardado);
}
