# Traductor Master - Documentación

## Descripción

El Traductor Master es una herramienta que convierte archivos Excel de eventos promocionales al formato CSV compatible con el sistema de Cenefas Promocionales.

## Características

- ✅ **Procesamiento automático**: Carga un Excel y obtén el CSV listo
- ✅ **Drag & Drop**: Arrastra y suelta tu archivo
- ✅ **Sin instalación**: Funciona 100% en el navegador
- ✅ **Estadísticas detalladas**: Ve cuántas promociones de cada tipo se generaron
- ✅ **Vista previa**: Revisa los datos antes de descargar

## Reglas de Procesamiento

### 1. Filtrado Inicial

- Solo se procesan filas donde `Testimonial = "SI"`

### 2. Agrupación

- Se agrupan por valores únicos del campo `Título acción`
- Se toma una fila representativa por cada grupo

### 3. Mapeo de Campos

| Campo Excel       | Campo CSV    | Transformación           |
| ----------------- | ------------ | ------------------------ |
| Fecha Inicio Item | fechaDesde   | Formato dd/mm/aaaa       |
| Fecha Fin Item    | fechaHasta   | Formato dd/mm/aaaa       |
| Descripción       | objetoOferta | Sin cambios              |
| Tipo acción       | tipoOferta   | Según reglas (ver abajo) |
| Título acción     | -            | Se procesa según reglas  |

### 4. Transformación de Tipo de Acción

#### Formatos Básicos

- `1x25%` → `25%`
- `2x1` → `2x1`
- `#2x70%` → `70%2`
- `$13333` → `$13333`

#### MásClub

- Si `Tu Club = "Si"` → Se agrega `MC` al final
- Ejemplos:
  - `25%` + MásClub → `25%MC`
  - `2x1` + MásClub → `2x1MC`

### 5. Interpretación Inteligente del Título

#### Hasta X%

- **Entrada**: `Hasta 30% en adornos navidad`
- **Salida**:
  - `tipoOferta`: `H30%`
  - `título`: `En adornos navidad`

#### Cuotas Sin Interés (CSI)

- **Formatos reconocidos**: `12CSI`, `12 CSI`, `6csi`, `6 CSI`
- **Entrada**: `30% + 12CSI en tecnología`
- **Salida**:
  - `tipoOferta`: `30%+12Q`
  - `título`: `En tecnología`

#### Combinalo Como Quieras

- **Formatos reconocidos**: `CCQ`, `ccq`, `Combinalo como quieras`
- **Acción**: Se mueve a `aclaracion2` y se elimina del título
- **Salida**: `COMBINALO COMO QUIERAS`

### 6. Precios Productos

- Solo se incluyen precios para departamentos: **80, 43, 21, 93**
- Otros departamentos no muestran precio de producto

### 7. Textos Legales

- **Legal 1**: Texto estándar sobre aplicación en cajas
- **Legal 2**: Se genera automáticamente con las fechas de vigencia

## Estadísticas Generadas

El sistema muestra:

- 📊 **Filas Originales**: Total de filas en el Excel
- ✅ **Filas Procesadas**: Filas que pasaron el filtro Testimonial=SI
- 🎯 **Promociones Únicas**: Cantidad de promociones diferentes generadas
- ⭐ **Total MásClub**: Promociones exclusivas para socios

### Detalle por Tipo

- **MásClub**:

  - Descuentos MásClub
  - Cuotas MásClub
  - Desc + Cuotas MásClub

- **Regulares**:
  - Descuentos
  - Cuotas
  - NxN (2x1, 3x2, etc.)
  - Precios
  - Otros

## Uso

1. Accede al Traductor Master desde el Home
2. Arrastra tu archivo Excel o haz clic para seleccionar
3. Espera el procesamiento (automático)
4. Revisa las estadísticas y vista previa
5. Descarga el CSV generado
6. Carga el CSV en Cenefas Promocionales

## Archivo de Salida

El CSV generado contiene las siguientes columnas:

```
tipoOferta,fechaDesde,fechaHasta,objetoOferta,aclaracionObjeto,aclaracion,legal1,legal2
```

Este formato es compatible directamente con el sistema de Cenefas Promocionales.

## Ejemplos

### Ejemplo 1: Descuento Simple

**Excel**:

- Tipo acción: `1x25%`
- Título acción: `CUNNINGTON SUAVES Y CLASICAS`
- Tu Club: `No`

**CSV**:

- tipoOferta: `25%`
- objetoOferta: `CUNNINGTON SUAVES Y CLASICAS`

### Ejemplo 2: Descuento con MásClub

**Excel**:

- Tipo acción: `1x30%`
- Título acción: `En productos seleccionados`
- Tu Club: `Si`

**CSV**:

- tipoOferta: `30%MC`

### Ejemplo 3: Hasta con Cuotas

**Excel**:

- Tipo acción: `1x40%`
- Título acción: `Hasta 40% + 12CSI en tecnología`
- Tu Club: `No`

**CSV**:

- tipoOferta: `H40%+12Q`
- título: `En tecnología`

## Soporte

Para dudas o problemas, consulta con el equipo de Marketing o IT.
