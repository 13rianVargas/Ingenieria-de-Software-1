# 5. Vista de Desarrollo

La vista de desarrollo describe la organizacion del codigo fuente en modulos, paquetes y dependencias. Sigue el patron de arquitectura hexagonal (puertos y adaptadores).

Diagrama: `diagramas/arquitectura/4-vista-desarrollo.puml`.

## 5.1 Estructura del backend

```
backend/
  api/
    rest/                              Controllers HTTP
  domain/
    model/                             POJOs puros (Usuario, Pqrs, Tramite, ...)
    service/                           Casos de uso (RadicarPqrsService, ...)
    port/                              Interfaces (PqrsRepository, NotificacionPort, ...)
  infrastructure/
    persistencia/                      JPA Adapters
    integraciones/                     Email, NAS, PDF Adapters
  shared/
    security/                          JWT + BCrypt + Roles
    auditoria/                         AOP Aspect
    logging/                           GlobalErrorHandler
```

Regla de oro: el paquete domain/ no importa Spring ni JPA. Define interfaces (puertos) que la infrastructure/ implementa. Esto permite:

- Testear el dominio sin contexto Spring (tests rapidos, sin levantar contexto completo).
- Cambiar la persistencia sin tocar las reglas de negocio.
- Mantener el dominio puramente alineado al lenguaje del negocio.

## 5.2 Estructura del frontend

```
frontend/pqrs-app/src/app/
  core/                                Servicios singleton (auth, pqrs, guards, interceptors)
  shared/                              Componentes reutilizables (modales, spinners, etc.)
  web/                                 Pages exclusivas del Gestor
    login/
    dashboard/
    tramite/
  mobile/                              Pages exclusivas del Cliente
    login/
    radicar/
    historial/
    detalle/
```

El core/ contiene los servicios HTTP, guards de autenticacion e interceptors de JWT. Web/ y mobile/ son territorios separados con dueños distintos (Santi para web, Juli Avila para mobile). Cualquier cambio en core/ requiere review de ambos.

## 5.3 Modulos clave

| Modulo o Paquete | Responsabilidad |
|---|---|
| api/rest/ | Controllers REST. Valida entrada, delega al dominio. |
| domain/model/ | Entidades puras: Usuario, Pqrs, Tramite, Adjunto. |
| domain/service/ | Servicios de aplicacion: RadicarPqrsService, TramitarPqrsService, GenerarReporteService. |
| domain/port/ | Interfaces (puertos) implementadas por la infraestructura. |
| infrastructure/persistencia/ | Adaptadores JPA. Conecta con PostgreSQL. |
| infrastructure/integraciones/ | Adaptadores: EmailAdapter, NasAdjuntoAdapter, PdfReportAdapter. |
| shared/security/ | Autenticacion JWT, autorizacion por roles, hashing BCrypt. |
| shared/auditoria/ | Aspecto AOP que intercepta CRUD y registra en auditoria. |
| shared/logging/ | Manejador global de errores mas logging estructurado. |
| core/ (front) | Servicios HTTP, guards, interceptors, models compartidos. |

## 5.4 Stack de build y dependencias

Backend:

- Build: Maven (pom.xml en Proyecto-Final/backend/).
- Test: JUnit 5 mas Spring Boot Test mas Testcontainers (PostgreSQL real en tests de integracion).
- Lint: Checkstyle o SpotBugs (a definir por el owner del backend).

Frontend:

- Build: Angular CLI.
- Package manager: pnpm SIEMPRE. npm prohibido.
- Test: Karma mas Jasmine (config Ionic por defecto).
- Lint: ESLint con plugins @angular-eslint y @typescript-eslint.
