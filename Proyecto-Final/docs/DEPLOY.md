# Deploy Backend en Render

## Setup inicial (Juli C, una sola vez)

1. Crear cuenta en https://render.com (gratis).
2. Dashboard → New → Web Service → Connect GitHub repo `Ingenieria-de-Software-1`.
3. Configuración:
   - Branch: `develop`
   - Root directory: `Proyecto-Final/backend/pqrs`
   - Runtime: Docker
   - Plan: Free
   - Auto-deploy: Yes
4. Environment variables (desde Render dashboard):
   - `DATABASE_URL` (pooled, Neon)
   - `JWT_SECRET` (generate value)
   - `RESEND_API_KEY`
   - `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`
5. Health check path: `/actuator/health`.
6. Deploy → esperar 5-10 min.

## URL pública

Render genera URL tipo `https://pqrs-backend-XXXX.onrender.com`. Compartir con Santi + Juli A por WhatsApp privado.

## Auto-deploy

Cada push a `develop` que toque `Proyecto-Final/backend/pqrs/**` dispara redeploy automático. Sin GitHub Action adicional.

## Sleep mode (free tier)

Después de 15 min sin tráfico, instancia hiberna. Primer request tarda ~50 s en despertar.

**Pre-warm pre-demo**: 5 min antes ejecutar:

```bash
curl https://pqrs-backend-XXXX.onrender.com/actuator/health
```

Para la feria (2-jun), correr en loop cada 4 min las 2 h previas:

```bash
while true; do curl -s https://pqrs-backend-XXXX.onrender.com/actuator/health > /dev/null; sleep 240; done
```

## Logs

Render dashboard → Service → Logs (live tail).

## Plan B si Render cae el día de la demo

1. Juli C arranca backend local: `./mvnw spring-boot:run` en `Proyecto-Final/backend/pqrs`.
2. Habilitar hotspot WiFi en su laptop.
3. APK móvil + frontend web apuntan a `http://<IP-LAN>:8080`.
4. Verificar `application.yml` permite CORS desde IP LAN.
