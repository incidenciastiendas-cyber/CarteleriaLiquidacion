# Sistema de Cartelería

Sistema de autenticación y generación de carteles para tiendas.

## 🔐 Usuarios del Sistema

### Usuarios Actuales:

| Usuario | Contraseña | Email | Nombre |
|---------|-----------|-------|--------|
| `admin` | `Admin2025!` | incidenciastiendas@gdnargentina.com | Administrador |
| `tiendas` | `Tiendas2025!` | tiendas@gdnargentina.com | Usuario Tiendas |
| `gustavo.klobouk` | `AguanteBOCA12` | gustavo.klobouk@gdnargentina.com | Gustavo Klobouk |

## ➕ Agregar Nuevos Usuarios

Para agregar un nuevo usuario, editar el archivo `users.js` y agregar un nuevo objeto al array:

```javascript
{
  username: 'nombre.usuario',
  password: 'ContraseñaSegura123',
  email: 'usuario@gdnargentina.com',
  name: 'Nombre Completo'
}
```

## 🏠 Estructura del Sistema

```
/
├── index.html          → Página de login
├── home.html           → Home con acceso a los sistemas
├── liquidacion.html    → Sistema de cartelería de liquidación
├── cenefas.html        → Sistema de cenefas promocionales
├── auth.js             → Sistema de autenticación
├── users.js            → Base de datos de usuarios ⚠️ EDITAR AQUÍ
└── login.css           → Estilos del login
```

## 🔒 Características de Seguridad

- ✅ Sesión persistente (7 días)
- ✅ "Mantener conectado" con recordar usuario
- ✅ Protección automática de páginas
- ✅ Redirección si no está autenticado
- ✅ Opción de ver/ocultar contraseña
- ✅ Autocomplete del navegador

## 🎨 Sistemas Disponibles

### 1. Cartelería de Liquidación
Genera carteles A6 de rebaja en precio y obleas para productos en liquidación.
- Código de barras
- Precios y descuentos
- Fechas de vigencia

### 2. Cenefas Promocionales
Crea cenefas A5 horizontales para promociones especiales.
- Formato automático según tipo de oferta
- 2x1, 3x2, descuentos, cuotas, etc.
- Diseños predefinidos

## 📞 Contacto

Para problemas de acceso: **incidenciastiendas@gdnargentina.com**
