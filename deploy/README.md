# Despliegue en Portainer

El archivo `portainer-stack.yml` sigue el patrón de checkout por referencia Git
del stack suministrado. Cada despliegue resuelve la referencia seleccionada a un
commit, hace checkout separado y comprueba ese SHA antes de compilar o iniciar.

## Servicios

- `mt-rage-source`: prepara el commit del frontend.
- `mt-rage-api-source`: prepara el commit del API.
- `mt-rage-migrations`: genera Prisma y aplica las migraciones pendientes.
- `mt-rage-api`: ejecuta Express, Better Auth y Prisma en el puerto interno 3001.
- `mt-rage`: ejecuta Next.js en el puerto interno 3000.
- `mt-rage-postgres`: ejecuta PostgreSQL con almacenamiento persistente.

La base de datos no publica su puerto en el host. El API la alcanza mediante
`mt-rage-postgres:5432` dentro de `fl-network`. Sus datos sobreviven recreaciones
del stack en el volumen fijo `mt-rage-postgres-data`. Eliminar el stack no borra
ese volumen salvo que se elimine manualmente desde Portainer.

## Variables obligatorias

| Variable                  | Contenido                                                   |
| ------------------------- | ----------------------------------------------------------- |
| `RAGE_NODE_IMAGE`         | Imagen Node con Bash y Git, por ejemplo `node:24-bookworm`. |
| `RAGE_GIT_REF`            | Rama, etiqueta o SHA del frontend que se desplegará.        |
| `RAGE_API_REPOSITORY_URL` | URL Git del repositorio separado del API.                   |
| `RAGE_API_GIT_REF`        | Rama, etiqueta o SHA del API que se desplegará.             |
| `RAGE_PUBLIC_URL`         | URL HTTPS pública del sitio, sin barra final.               |
| `RAGE_POSTGRES_PASSWORD`  | Contraseña segura y apta para una URL PostgreSQL.           |
| `BETTER_AUTH_SECRET`      | Secreto aleatorio de al menos 32 caracteres.                |
| `DISCORD_CLIENT_ID`       | Client ID de la aplicación de Discord.                      |
| `DISCORD_CLIENT_SECRET`   | Client secret de Discord.                                   |
| `AUTHORIZED_DISCORD_IDS`  | IDs de usuarios autorizados, separados por comas.           |

`RAGE_REPOSITORY_URL`, `RAGE_POSTGRES_IMAGE`, `RAGE_POSTGRES_DATABASE` y
`RAGE_POSTGRES_USER` tienen valores predeterminados. La plantilla completa está
en `portainer-variables.example`.

Genera `BETTER_AUTH_SECRET` con:

```bash
openssl rand -base64 32
```

En Discord registra esta URL de redirección, sustituyendo el dominio:

```text
https://rage.example.com/api/auth/callback/discord
```

## Seleccionar un commit

En las variables del stack establece el SHA exacto:

```text
RAGE_GIT_REF=6e6f2de643d5a010c094a7e6fd6072556947ee8b
RAGE_API_GIT_REF=<sha-del-api>
```

Después pulsa **Update the stack** en Portainer. Los contenedores de preparación
fallan de forma explícita si la rama, etiqueta o SHA no existe. Los logs muestran
el commit completo que finalmente se compiló.

## Requisitos de Portainer

1. La red externa `fl-network` debe existir.
2. El proxy debe dirigir el dominio público a `mt-rage:3000` en esa red.
3. La API debe publicarse primero en un repositorio Git independiente. En el
   estado actual solo existe localmente en `../rage-motors-api`; la URL sugerida
   en el ejemplo todavía no existe en GitHub.
4. Pega `portainer-stack.yml` como Web editor y carga las variables de
   `portainer-variables.example` en **Environment variables**.

No se publican los puertos 3001 ni 5432 al host.
