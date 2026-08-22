# Crawling y robots.txt

## Alcance real del proyecto

El portfolio se publica como GitHub Project Pages en `https://romicaubarrere.github.io/personal/`.

`public/robots.txt` se despliega por lo tanto en `https://romicaubarrere.github.io/personal/robots.txt`. Ese archivo puede documentar el sitemap del portfolio, pero no controla el crawling del host completo: el `robots.txt` efectivo para `romicaubarrere.github.io` debe existir en `https://romicaubarrere.github.io/robots.txt`.

## Diagnóstico WEB-140

Verificado el 22/08/2026:

- el repositorio `romicaubarrere/personal` sí publica el sitio de proyecto;
- no existe un repositorio administrable `romicaubarrere/romicaubarrere.github.io` en la cuenta conectada;
- por lo tanto este repositorio no puede publicar ni afirmar control sobre `/robots.txt` en la raíz del host;
- el sitemap propio permanece en `https://romicaubarrere.github.io/personal/sitemap.xml` y es la URL canónica que se anuncia desde el robots del subpath.

No se crea un workaround que pretenda que `/personal/robots.txt` sustituye al robots de raíz.

## Verificación de producción

`scripts/verify-production.mjs` comprueba después de cada despliegue de `main`:

- que `/personal/sitemap.xml` responde correctamente y contiene las rutas esperadas;
- que `/personal/robots.txt` responde correctamente y referencia el sitemap real;
- que `/robots.txt` en la raíz del host se consulta explícitamente;
- si la raíz devuelve `404`, se registra como limitación conocida de infraestructura en vez de interpretar el robots del subpath como equivalente;
- si la raíz existe pero no referencia el sitemap del portfolio, se registra una advertencia sin atribuir control a este proyecto.

## Resolución futura

Si en el futuro se crea y administra `romicaubarrere/romicaubarrere.github.io`, el robots raíz deberá publicarse allí. En ese momento este documento y el smoke test deben actualizarse para exigir la presencia del sitemap del portfolio en el robots efectivo del host.
