# Cartelería Liquidación

Sistema de generación de carteles para productos en liquidación y cenefas promocionales.

## 📁 Estructura del Proyecto

```
CarteleriaLiquidacion/
├── index.html              # Login (página inicial)
├── home.html               # Dashboard principal
├── liquidacion.html        # Cartelería de liquidación (A6 + obleas)
├── cenefas.html            # Cenefas promocionales (A5 horizontal)
├── traductor.html          # Traductor Master (Excel a CSV)
│
├── styles/                 # Archivos CSS
│   ├── styles.css          # Estilos base del proyecto
│   ├── login.css           # Estilos del login
│   ├── home.css            # Estilos del home
│   ├── cenefas-styles.css  # Estilos de cenefas
│   └── traductor-styles.css # Estilos del traductor
│
├── js/                     # Archivos JavaScript
│   ├── auth.js             # Autenticación
│   ├── users.js            # Base de datos de usuarios
│   ├── app.js              # Lógica de liquidación
│   ├── cenefas-app.js      # Lógica de cenefas
│   └── traductor-app.js    # Lógica del traductor
│
├── fonts/                  # Fuentes y recursos tipográficos
├── assets/                 # Recursos (imágenes, logos)
├── sample.csv              # CSV de ejemplo para liquidación
├── sample-cenefas.csv      # CSV de ejemplo para cenefas
└── IniciarCarteleria.bat   # Launcher de la aplicación
```

## 🚀 Módulos

### 1. Sistema de Login

- **Archivo**: `index.html`
- **Función**: Autenticación de usuarios
- **Usuarios**: Definidos en `js/users.js`

### 2. Cartelería de Liquidación

- **Archivo**: `liquidacion.html`
- **Función**: Generación de carteles A6 y obleas
- **Formatos**: PDF individual o masivo
- **Entrada**: CSV con datos de productos

### 3. Cenefas Promocionales

- **Archivo**: `cenefas.html`
- **Función**: Creación de cenefas A5 horizontal
- **Tipos**: NxN, Descuentos, Cuotas, MásClub, etc.
- **Entrada**: CSV o carga manual

### 4. Traductor Master

- **Archivo**: `traductor.html`
- **Función**: Convierte Excel de eventos a CSV para cenefas
- **Características**:
  - Drag & drop de archivos Excel
  - Procesamiento automático de reglas
  - Estadísticas por departamento
  - Exporta CSV compatible con cenefas
  - Envío directo a Cenefas Promocionales

#### Pasos del Procesamiento

1. **Filtrar**: Solo filas con `Testimonial = "SI"`
2. **Procesar cada fila**: Extraer CSI, CCQ, Incluye/Excluye, Hasta%, tipo de acción, precios del título
3. **Filtrar departamentos**: Si tipo = "$precio", solo departamentos 80, 43, 21, 93, 98
4. **Combinar MC+Regular**: Si hay 25% y 30%MC del mismo título → crear `25%O30%MC` y eliminar las 2 originales
5. **Unificar títulos**: Agrupar por departamento+tipo → unir títulos (máx 4, cada uno <30 caracteres)
6. **Generar CSV**: Con punto y coma (;) como separador, incluye columna de departamento

#### Reglas de Procesamiento

**Tipo de Acción:**

- `1+1 $500` → `$500` (ignora combo 1+1)
- `1+1 40%` → `40%` (ignora combo 1+1)
- `1x25%` → `25%`
- `2x1` → `2x1`
- `#2x70%` → `70%2`
- `80%2O2X1MC` → `80%2O2X1MC` (combo descuento 2da O NxN con MC)
- `Mas 6CSI` → `+6Q` (agregado al tipo)
- Si `Tu Club = "Si"` → Se agrega "MC" al final

**Extracción de Precios del Título:**

- `MANTECOL TROZADO $1589 X 100 GR` → Tipo: `$1589`, Título: `MANTECOL TROZADO X 100 GR`
- El precio se extrae automáticamente del título y se mueve al tipo de acción

**Procesamiento de Título:**

- `Hasta 30% en adornos` → Tipo: `H30%`, Título: `En adornos`
- `CCQ` o `Combinalo como quieras` → Va a campo "Aclaración 2"
- `Coca cola excluye envases` → Título: `Coca cola`, Incluye/Excluye: `Excluye envases`

**Combinación MC + Regular:**

- Mismo título con versión regular (25%) y MásClub (30%MC)
- Se combina en: `25%O30%MC`
- Las dos filas originales se eliminan automáticamente

**Legales Dinámicos:**

- **Legal 1**: Siempre "EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS..."
- **Legal 2** (dinámico según):
  - Dpto 96 (Bebidas con alcohol): Legal específico con advertencia +18
  - Cuotas sin interés: Legal con CFT 0%, TEA 0%, TNA 0%
  - Tu Club activo: Legal de Más Club con condiciones
  - Genérico: Legal estándar con vigencia

## 📝 Uso

1. Abrir `IniciarCarteleria.bat` o acceder a `index.html`
2. Iniciar sesión con credenciales
3. Seleccionar módulo desde el dashboard
4. Cargar datos (CSV o Excel según módulo)
5. Previsualizar y descargar resultados

## 🔧 Desarrollo

### Agregar nuevos usuarios

Editar `js/users.js` y agregar entrada en el array de usuarios.

### Modificar estilos

Todos los archivos CSS están en la carpeta `styles/`.

### Actualizar lógica

Los archivos JavaScript están organizados en la carpeta `js/`.

## 📦 Dependencias Externas

- **PapaParse**: Parsing de CSV
- **html2canvas**: Captura de elementos DOM
- **jsPDF**: Generación de PDFs
- **SheetJS (xlsx.js)**: Lectura de archivos Excel
- **Material Icons**: Iconografía

## 🎨 Diseño

- Background: `#bdd5fa`
- Cards: Blanco con bordes redondeados (16px)
- Tipografía: System fonts + Miso (custom)
- Iconos: Material Icons

## 📚 Documentación Adicional

- [Traductor Master - Reglas de Procesamiento](TRADUCTOR-README.md)
- [Gestión de Usuarios](USUARIOS.md)
