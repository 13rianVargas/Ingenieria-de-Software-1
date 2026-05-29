# PLAN-MAESTRO — Implementación MVP PQRS (Fase 2)

> Índice de los planes de implementación por área. Fuente de verdad operativa para Fase 2 (post-documental, pre-feria).
>
> **Cronograma**: 11 días (22-may → 2-jun-2026). Demo confirmada **2-jun**. Backup **26-may** si docente adelanta.
>
> **Owner del plan maestro**: Brian Vargas (`@13rianVargas`).

---

## 0. Lectura obligatoria antes de empezar

1. [`Proyecto-Final/AGENTS.md`](./AGENTS.md) — guía global del proyecto + Fase 2 (§10–§12).
2. [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) — convenciones de commits, ramas, ownership.
3. **Tu PLAN-*.md** (sección de tu área).

Sin estos 3 documentos leídos, **no toques código**.

---

## 1. Planes por área

| Plan | Owner | Estado | Branch | Descripción corta |
|---|---|---|---|---|
| [`PLAN-DB.md`](./PLAN-DB.md) | Brian | ✅ Completado | merged | Seeds + V6 secuencia radicado + health checks. |
| [`PLAN-BACK.md`](./PLAN-BACK.md) | Brian (impl) | ✅ Completado + LIVE | merged | CU-01..07 + RF-12. Render: `ingenieria-de-software-1-uxxj.onrender.com`. R2 + Gmail SMTP. 76% cobertura. |
| [`PLAN-WEB.md`](./PLAN-WEB.md) | Santi | 🟡 En progreso | `feature/frontend-web-core` | Completar tramite + reportes + shared + build prod. Backend LIVE disponible. |
| [`PLAN-MOBILE.md`](./PLAN-MOBILE.md) | Juli Avila | 🟡 En progreso (rescoped) | `feature/frontend-mobile-core` | **Web localhost (sin APK)**. Login + radicar + historial + detalle vs Render. |
| [`PLAN-CICD.md`](./PLAN-CICD.md) | Brian | ✅ Casi completo | merged | backend-ci activo + Kanban + Dependabot + templates. mobile-ci cancelado (redundante). |

**Convención de estado**: 🔴 bloqueado / bloquea | 🟡 en progreso | 🟢 listo | ✅ completado.

---

## 2. Cronograma global (11 días — 22-may a 2-jun-2026)

| Bloque (días) | Fechas | Brian | Juli C | Santi | Juli A |
|---|---|---|---|---|---|
| **D1-D2** | jue 22 + vie 23 may | T-0.1 rotar passwords + T-0.2 cleanup leak + T-DB.3 seeds reales + T-5.4 Kanban GH Project | T-2.1 fix scaffold (config + anotaciones + SecurityConfig + deps pom) | T-3.2 environment refactor + T-3.3 prep login | T-4.1 instalar Capacitor + T-4.2 Android Studio + T-4.3 environment |
| **D3-D5** | sab 24 + dom 25 + lun 26 may | T-DB.4 cargar seeds Neon + T-DB.5 health checks docs + T-5.1 backend-ci real | T-2.2 CU-02 Auth JWT + T-2.3 CU-01 registro interno + T-2.4 CU-03 Radicar PQRS (R2 + sequence) | T-3.3 login validado contra Render + T-3.4 dashboard real | T-4.4 login mobile + T-4.5 Radicar PQRS con FilePicker |
| **D6-D8** | mar 27 + mie 28 + jue 29 may | T-5.2 mobile-ci + T-5.5 issue templates + T-5.6 PR template + T-5.7 Dependabot | T-2.5 CU-04 mis PQRS + T-2.6 CU-05 Bandeja + T-2.7 CU-06 Tramitar (AOP audit) | T-3.5 Tramite page (descargar anexo + cambiar estado) + T-3.7 shared components | T-4.6 Historial (lista + pull-refresh + buscar) + T-4.7 Detalle PQRS (timeline + descargar) |
| **D9-D10** | vie 30 + sab 31 may | T-5.3 deploy Render docs + Render config inicial | T-2.8 CU-07 Reportes PDF + T-2.9 RF-12 Resend async + T-2.10 deploy backend Render | T-3.6 Exportar PDF + T-3.8 build prod verify | T-4.8 build APK debug Android Studio |
| **D11** | dom 1-jun | TCs manuales (#37-#46) sobre APK + dry-run completo + pre-warm Render | smoke tests E2E + revisar logs Render | smoke web + verificar all flows | T-4.9 publicar APK GitHub Release v0.1.0-mvp + instalar en 2-3 cels |
| **D12 (demo)** | **lun 2-jun** | **DEMO en aula + plan B activado si falla algo** | | | |

**Backup demo 26-may**: si docente adelanta, D5 lunes 26-may cierra MVP mínimo (CU-02 Auth + CU-03 Radicar + login web). Resto deshabilitado en UI hasta D11.

---

## 3. Dependencias entre planes

```
PLAN-DB.md           ──> PLAN-BACK.md (DATABASE_URL)
                  ──> PLAN-CICD.md (DATABASE_URL_DIRECT en Secret)

PLAN-BACK.md         ──> PLAN-WEB.md (endpoints REST + API contract)
                  ──> PLAN-MOBILE.md (endpoints REST + CORS)
                  ──> PLAN-CICD.md (backend-ci real cuando exista código)

PLAN-WEB.md, PLAN-MOBILE.md ──> independientes entre sí (monorepo Angular)
                  ──> PLAN-CICD.md (mobile-ci build web bundle)

PLAN-CICD.md         ──> habilita auto-deploy + Kanban + reglas branch protection
```

**Implicación**: si PLAN-BACK.md no arranca en semana 1, web/mobile mockean datos. Brian apoya a Juli C en T-2.1 si va lento.

---

## 4. Acuerdos operativos

- **Daily WhatsApp**: cada uno reporta a las 18:00 (zona Bogotá UTC-5) "ayer / hoy / blockers" en 3 líneas.
- **PR review**: en ≤ 24 h. Owner asignado. Otro dev opcional.
- **Branch protection**: 1 review + 3 checks (commitlint, frontend-ci, backend-ci). Conversation resolution obligatoria.
- **Merge**: solo cuando CI verde + review aprobada.
- **Bypass admin**: solo Brian, solo si urgente, documentado en PR.
- **Hotfix**: rama `hotfix/*` desde `main`, PR a `main` + `develop`.

---

## 5. Definition of Done (por CU)

Para cada CU del MVP (CU-01..CU-07):

- [ ] Backend: endpoint REST implementado.
- [ ] Backend: test JUnit + Testcontainers (happy path + ≥ 1 caso error).
- [ ] Backend: cobertura ≥ 70 % medida por JaCoCo.
- [ ] Frontend (web o mobile o ambos según CU): UI conectada al endpoint real.
- [ ] Frontend: maneja error 401, 403, 400, 500 con mensaje al usuario.
- [ ] TC manual ejecutado por Brian o Juli C, marcado como Pass en issue GitHub.
- [ ] PR mergeado a `develop`.
- [ ] Kanban actualizado a "Done".

---

## 6. Plan de feria (D11 + D12, 1-jun a 2-jun)

### 6.1 Preparación D11 (domingo 1-jun)

- Brian: pre-warm Neon (curl 5 min antes).
- Juli C: confirmar Render no esté en sleep, redeploy si necesario.
- Juli A: APK en celular Android del equipo (mínimo 2 cels).
- Santi: laptop con frontend web build prod servido localmente o demo en URL Render.
- Todos: ensayo dry-run completo (radicar → bandeja → tramitar → reporte).

### 6.2 Día de la feria (lunes 2-jun)

**Flujo demo (10–15 min)**:

1. Cliente abre APK móvil, login con usuario demo.
2. Radica PQRS con PDF adjunto. Recibe confirmación visual con radicado.
3. Cliente revisa su historial. Ve la nueva PQRS en estado "nuevo".
4. Gestor abre App Web (laptop), login.
5. Gestor ve PQRS recién radicada en bandeja.
6. Gestor descarga PDF adjunto.
7. Gestor cambia estado a "en_proceso" con justificación.
8. Gestor exporta reporte PDF de bandeja.
9. Mostrar correo recibido por el Cliente (vista Resend logs o bandeja real).

**Datos demo**:

- `seeds/demo.sql` cargado: 3 usuarios (Cliente, Gestor, Admin) + 3 PQRS demo previas.
- 1 PDF de prueba "factura.pdf" en celular (~ 500 KB).

### 6.3 Plan B si algo falla

- **Render down**: Juli C arranca backend local + hotspot WiFi. APK apunta a IP local LAN.
- **Neon cold start lento**: pre-warm con script `curl https://api...../actuator/health` cada 4 min en las 2 h previas.
- **APK no instala**: descargar APK de GitHub Release directo en cel del demo. ~ 1 min.
- **Resend rate limit**: ya enviamos < 10 correos demo. Sin riesgo.
- **PDF R2 falla**: backend ya retorna 200 OK con radicado igual; PDF cae async. Demo no se rompe.

---

## 7. Dashboard de estado (actualizar al final de cada sesión)

| Plan | Última actualización | Tareas completadas | Bloqueos actuales |
|---|---|---|---|
| PLAN-DB | 28-may | 7 / 7 ✅ | — |
| PLAN-BACK | 28-may | 10 / 10 ✅ + LIVE | — (Brian implementó; Juli C no disponible) |
| PLAN-WEB | (Santi) | en progreso | ninguno — backend LIVE disponible |
| PLAN-MOBILE | 28-may (rescoped) | en progreso | ninguno — web localhost vs Render, sin APK |
| PLAN-CICD | 28-may | 6 / 7 ✅ | mobile-ci cancelado (redundante con frontend-ci) |

---

## 8. FAQ

**¿Puedo trabajar en otro módulo si el mío está bloqueado?**
Sí, pero solo apoyando al owner del módulo destino (pair-programming o PR sugerido). NO commit directo sin coordinar.

**¿Qué pasa si me quedo sin tokens (IA) a mitad?**
Deja commit con el estado actual + actualiza tu `PLAN-*.md` con el paso exacto donde quedaste. La siguiente IA o dev continúa desde ahí.

**¿Cliente del enunciado se renombra a docente?**
NO. Cliente = "SuperMarket" (ficticio del enunciado). Decisión lockeada.

**¿Pulir CSS o agregar features post-MVP?**
NO durante Fase 2. Fase 3 (post-software, pre-entrega final docs DOCX) cubre eso.

**¿Puedo agregar nuevas funcionalidades fuera del MVP (CU-08, #13-#17)?**
NO. MVP estricto = CU-01..CU-07 + RF-12. Lo demás es post-MVP, fuera de alcance feria.
