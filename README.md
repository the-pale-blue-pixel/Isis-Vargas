# Sitio de Isis Vargas — estructura plana

Todos los archivos van juntos, en la misma carpeta, sin subcarpetas. Así:

```
index.html
style.css
script.js
fondo.png
favicon.ico
inicio.jpg
cv2.png
cv.pdf
Firma.gif
umbral.gif
umbral.jpg
umbral1.jpg
```

## Por qué se veía sin estilo

El navegador no encontraba `css/style.css` ni `js/script.js` porque estaban en subcarpetas que no llegaron a tu carpeta de trabajo. Con esta versión, `index.html` busca `style.css` y `script.js` directo, al lado suyo — sin subcarpetas.

## Archivos que aún debes agregar (con el nombre exacto)

Según tu captura ya tienes: `cv.pdf`, `cv2.png`, `Firma.gif`, `fondo.png`, `inicio.jpg`.

Todavía te faltan estos, en la misma carpeta:

| Archivo         | Dónde se usa                          |
|------------------|----------------------------------------|
| `favicon.ico`    | Ícono de la pestaña del navegador       |
| `umbral.gif`     | Galería — Umbral de Falla               |
| `umbral.jpg`     | Galería — Umbral de Falla               |
| `umbral1.jpg`    | Galería — Umbral de Falla               |

**Importante:** GitHub Pages distingue mayúsculas de minúsculas. Si un nombre de archivo no coincide exactamente con lo que dice `index.html` (por ejemplo `Firma.gif` vs `firma.gif`), la imagen no va a cargar. Si cambias algún nombre, avísame o ajústalo tú directamente en `index.html` (busca `src="..."` o `href="..."`).

## Verificar antes de subir a GitHub

Abre `index.html` haciendo doble clic (se abre en el navegador) y revisa:
- Que el menú lateral y la barra superior se vean con las líneas y la tipografía monoespaciada (no azul/subrayado por defecto).
- Que solo se vea **una** sección a la vez (Inicio al entrar).
- Si algo no carga, aprieta F12 en el navegador → pestaña "Console" o "Network" → ahí te dice qué archivo no encontró (esto te dice exactamente qué falta o qué nombre no coincide).

## Publicar en GitHub Pages

1. Sube **todos** estos archivos (sin carpetas) a la raíz de tu repositorio.
2. Settings → Pages → Branch: main → carpeta `/root` → Guardar.
3. Tu sitio queda en `https://tu-usuario.github.io/nombre-del-repo/`.
