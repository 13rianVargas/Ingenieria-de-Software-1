package co.edu.konrad.pqrs.infrastructure.integraciones;

import co.edu.konrad.pqrs.domain.port.AlmacenAdjuntos;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;

/**
 * Sube adjuntos a Cloudflare R2 (S3-compatible). Activo solo con r2.enabled=true
 * y credenciales presentes. Devuelve la URL publica del objeto.
 */
@Component
@ConditionalOnProperty(name = "r2.enabled", havingValue = "true")
public class R2AlmacenAdjuntos implements AlmacenAdjuntos {

    private final S3Client s3;
    private final String bucket;
    private final String publicBase;

    public R2AlmacenAdjuntos(@Value("${r2.endpoint}") String endpoint,
                             @Value("${r2.access-key-id}") String accessKey,
                             @Value("${r2.secret-access-key}") String secretKey,
                             @Value("${r2.bucket}") String bucket,
                             @Value("${r2.public-base:}") String publicBase) {
        this.bucket = bucket;
        this.publicBase = publicBase.isBlank() ? endpoint + "/" + bucket : publicBase;
        this.s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.US_EAST_1) // R2 ignora la region pero el SDK la exige
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    @Override
    public String subir(String ruta, byte[] contenido, String tipoMime) {
        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(ruta)
                        .contentType(tipoMime)
                        .build(),
                RequestBody.fromBytes(contenido));
        return publicBase + "/" + ruta;
    }
}
