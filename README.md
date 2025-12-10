# Cartelería Masiva — versión estática

Esta carpeta contiene una versión ligera y ejecutable en el navegador de la funcionalidad **Cartelería Masiva** extraída de la app principal.

Qué incluye:

- `index.html`: UI estática con tabla de productos, importador CSV, botones de control y vista previa.
- `styles.css`: estilos para A4/A6/oblea y layout.
- `app.js`: lógica JS para gestionar productos, importar CSV (PapaParse) y generar códigos de barras (JsBarcode).
- `sample.csv`: CSV de ejemplo con la fila que me diste.

Uso rápido:

1. Abrí PowerShell en esta carpeta:

```powershell
cd "h:\Mi unidad\Colab Notebooks\App Carteleria\carteleria-static"
python -m http.server 8000
```

2. Abrí en tu navegador: `http://localhost:8000`.
3. Importá `sample.csv` o tu CSV real, abrí la vista previa y luego usa `Imprimir` del navegador para guardar como PDF.

Notas:

- La fuente principal es `Miso` (cargada desde Google Fonts).
- Los códigos de barras se generan con `JsBarcode` y se renderizan como SVG; soporta EAN/UPC/Code128 en modo `auto`.
- Si querés, puedo adaptar el CSS para copiar exactamente el `correccion2.pdf` (enviame el PDF) o exportar directamente PDFs desde el servidor usando wkhtmltopdf (requiere binario o instalar Node + librerías).
