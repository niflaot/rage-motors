# Despliegue en Portainer

Este stack contiene únicamente la aplicación `mt-rage` y PostgreSQL. El propio
contenedor de la aplicación descarga el repositorio, resuelve la referencia Git
seleccionada a un commit exacto, instala también las dependencias necesarias para
compilar Tailwind y Next.js, compila el proyecto y lo inicia.

## Servicios y persistencia

- `mt-rage`: ejecuta el commit elegido del repositorio en el puerto interno 3000.
- `mt-rage-postgres`: ejecuta PostgreSQL sin publicar el puerto 5432 al host.

PostgreSQL guarda sus datos en el volumen fijo `mt-rage-postgres-data`. Los datos
sobreviven a la recreación o actualización del stack. Solo se pierden si ese
volumen se elimina manualmente desde Portainer.

## Variables

La plantilla completa está en `portainer-variables.example`. Debes cambiar como
mínimo estas variables:

| Variable                 | Contenido                                          |
| ------------------------ | -------------------------------------------------- |
| `RAGE_GIT_REF`           | Rama, etiqueta o SHA exacto que quieres desplegar. |
| `RAGE_POSTGRES_PASSWORD` | Contraseña segura para el usuario de PostgreSQL.   |
| `BETTER_AUTH_SECRET`     | Secreto aleatorio de al menos 32 caracteres.       |
| `BETTER_AUTH_URL`        | URL HTTPS pública del sitio, sin barra final.      |
| `DISCORD_CLIENT_ID`      | Client ID de la aplicación de Discord.             |
| `DISCORD_CLIENT_SECRET`  | Client secret de la aplicación de Discord.         |
| `AUTHORIZED_DISCORD_IDS` | IDs autorizados de Discord separados por comas.    |

Estas variables ya tienen valores predeterminados y puedes modificarlas cuando
lo necesites:

| Variable                 | Valor predeterminado                         |
| ------------------------ | -------------------------------------------- |
| `RAGE_NODE_IMAGE`        | `node:24-bookworm`                           |
| `RAGE_REPOSITORY_URL`    | `https://github.com/niflaot/rage-motors.git` |
| `RAGE_POSTGRES_IMAGE`    | `postgres:17.6-alpine`                       |
| `RAGE_POSTGRES_DATABASE` | `ragem`                                      |
| `RAGE_POSTGRES_USER`     | `ragem`                                      |

La aplicación recibe automáticamente `DATABASE_URL` apuntando a
`mt-rage-postgres:5432`; no tienes que definirla manualmente.

Genera `BETTER_AUTH_SECRET` con:

```bash
openssl rand -base64 32
```

Todas estas variables se cargan juntas en **Environment variables** del stack y
Portainer las inyecta en `mt-rage`. No subas sus valores reales al repositorio.
En el portal de Discord registra, sustituyendo el dominio, esta redirección:

```text
https://ragemotors.niflaot.dev/api/auth/callback/discord
```

## Elegir el commit

Para fijar exactamente una versión, copia el SHA completo en las variables del
stack:

```text
RAGE_GIT_REF=6e6f2de643d5a010c094a7e6fd6072556947ee8b
```

Después pulsa **Update the stack** en Portainer. También puedes usar una rama o
etiqueta. Los logs de `mt-rage` muestran el SHA final que se compiló, y el
despliegue falla claramente si la referencia no existe.

## Requisitos de Portainer

1. La red externa `fl-network` debe existir.
2. El proxy debe dirigir el dominio público a `mt-rage:3000` dentro de esa red.
3. Pega `portainer-stack.yml` en el editor del stack y carga las variables de
   `portainer-variables.example` en **Environment variables**.

## Alcance actual del repositorio

Este repositorio está definido como frontend y actualmente delega el catálogo,
las solicitudes y el inicio de sesión a un servicio HTTP externo. Este stack
crea PostgreSQL y entrega su conexión a la aplicación, pero esas funciones no
usarán la base de datos directamente hasta que exista el contrato de backend
correspondiente. No se incluye ni se despliega ningún servicio `rage-api`.
