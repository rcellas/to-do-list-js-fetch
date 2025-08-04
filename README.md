# 📝 Simple Todo List

Una aplicación minimalista de gestión de tareas construida con las mejores prácticas de desarrollo web. Utiliza JavaScript vanilla, Fetch API, json-server como API fake y localStorage como respaldo de datos.

## 🚀 Características

### ✨ Tecnologías Utilizadas
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsive y moderno
- **JavaScript Vanilla**: Sin frameworks, código puro y optimizado
- **Fetch API**: Para comunicación con la API
- **JSON Server**: API REST fake para desarrollo
- **LocalStorage**: Respaldo de datos y funcionamiento offline

### 🎯 Funcionalidades
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar tareas
- 🌐 **Modo Online/Offline**: Funciona con y sin conexión a internet
- 💾 **Persistencia Dual**: Datos guardados en servidor y localStorage
- 📱 **Responsive Design**: Adaptativo a todos los dispositivos
- 📊 **Estadísticas en Tiempo Real**: Contador de tareas
- 🔄 **Sincronización Automática**: Entre servidor y almacenamiento local

## 🛠️ Instalación y Configuración

### Prerequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd to-do-list
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de API**
```bash
npm start
```
Esto iniciará json-server en `http://localhost:3000`

4. **Abrir la aplicación**
- Abre `index.html` en tu navegador
- O usa Live Server en VS Code

## 📂 Estructura del Proyecto

```
to-do-list/
├── index.html              # Página principal
├── package.json            # Configuración del proyecto
├── db.json                 # Base de datos fake para json-server
├── README.md              # Documentación
└── src/
    ├── css/
    │   └── styles.css      # Estilos de la aplicación
    └── js/
        ├── api.js          # Módulo de comunicación con API
        ├── storage.js      # Módulo de localStorage
        ├── ui.js           # Módulo de interfaz de usuario
        ├── app.js          # Controlador principal
        └── script.js       # Archivo legacy (por actualizar)
```

## 🏗️ Arquitectura

### Separación de Responsabilidades

#### **API Module** (`api.js`)
- Maneja todas las comunicaciones HTTP
- Utiliza Fetch API
- Implementa manejo de errores
- Verifica conectividad

#### **Storage Module** (`storage.js`)
- Gestiona localStorage como respaldo
- Proporciona fallback offline
- Mantiene sincronización de datos

#### **UI Module** (`ui.js`)
- Controla toda la interfaz de usuario
- Renderizado dinámico del DOM
- Gestión de estados visuales
- Notificaciones al usuario

#### **App Module** (`app.js`)
- Controlador principal de la aplicación
- Coordina módulos
- Lógica de negocio
- Manejo de eventos

## 🔧 Uso de la Aplicación

### Operaciones Básicas

1. **Agregar Tarea**
   - Escribe en el campo de texto
   - Presiona Enter o click en "Agregar"

2. **Completar Tarea**
   - Click en el botón "✅" para marcar como completada
   - Click en "↩️" para desmarcar

3. **Eliminar Tarea**
   - Click en el botón "🗑️"
   - Confirma la eliminación

### Funcionamiento Online/Offline

#### Modo Online
- Las tareas se sincronizan con el servidor
- Cambios guardados en json-server
- Respaldo automático en localStorage

#### Modo Offline
- Funcionamiento completo con localStorage
- Notificaciones de estado offline
- Sincronización automática al recuperar conexión

## 🌐 API Endpoints

El json-server proporciona una API REST completa:

```
GET    /todos          # Obtener todas las tareas
POST   /todos          # Crear nueva tarea
PUT    /todos/:id      # Actualizar tarea
DELETE /todos/:id      # Eliminar tarea
```

### Estructura de Datos

```json
{
  "id": 1,
  "title": "Título de la tarea",
  "completed": false,
  "createdAt": "2025-08-04T10:00:00.000Z"
}
```

## 💾 LocalStorage

### Clave de Almacenamiento
- **Key**: `simple-todo-list`
- **Formato**: Array de objetos JSON

### Funciones de Respaldo
- Guarda automáticamente cada cambio
- Carga datos al iniciar sin conexión
- Sincroniza con servidor cuando está disponible

## � Diseño y UX

### Características del Diseño
- **Minimalista**: Interfaz limpia y enfocada
- **Responsive**: Adaptativo a móviles y escritorio
- **Accesible**: Navegación por teclado
- **Feedback Visual**: Notificaciones inmediatas

### Estados Visuales
- ✅ Estado de carga con spinner
- 📋 Estado vacío informativo
- 🔔 Notificaciones contextuales
- 📊 Estadísticas en tiempo real

## 🚀 Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Servidor con delay (simular latencia)
npm run dev

# Solo servidor de API
npm run server
```

## 🔧 Personalización

### Configurar Puerto de API
Edita `src/js/api.js`:
```javascript
const API = {
    BASE_URL: 'http://localhost:3001', // Cambiar puerto
    // ...
};
```

### Modificar Datos Iniciales
Edita `db.json` para cambiar las tareas predeterminadas.

### Estilos Personalizados
Modifica `src/css/styles.css` para personalizar la apariencia.

## 🧪 Testing

### Probar Funcionalidad Offline
1. Inicia la aplicación con el servidor
2. Agrega algunas tareas
3. Detén json-server
4. Prueba agregar/modificar/eliminar tareas
5. Reinicia el servidor
6. Observa la sincronización automática

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móviles modernos

## 🤝 Buenas Prácticas Implementadas

### JavaScript
- **Módulos separados** por responsabilidad
- **Async/await** para operaciones asíncronas
- **Error handling** robusto
- **Event delegation** para mejor rendimiento
- **Código documentado** con JSDoc

### CSS
- **Mobile-first** responsive design
- **CSS Grid y Flexbox** para layouts
- **Variables CSS** para colores y espaciado
- **Animaciones suaves** y transiciones

### HTML
- **Semántica correcta** con elementos apropiados
- **Accesibilidad** con ARIA labels
- **Meta tags** para viewport y charset

## 🎓 Conceptos Aprendidos

Este proyecto demuestra:

1. **Arquitectura Modular**: Separación clara de responsabilidades
2. **Programación Asíncrona**: Manejo de promesas y async/await
3. **Persistencia de Datos**: LocalStorage y APIs REST
4. **Manejo de Estados**: Online/offline y sincronización
5. **Responsive Design**: CSS Grid, Flexbox y media queries
6. **Event Handling**: Delegación y optimización de eventos
7. **Error Handling**: Manejo robusto de errores y fallbacks

## 📄 Licencia

MIT License - Siéntete libre de usar este código para aprender y experimentar.

---

**¡Feliz codificación! 🚀**

### Para comenzar:
1. `npm install`
2. `npm start`
3. Abre `index.html` en tu navegador
