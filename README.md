# Gestor de Plantillas WhatsApp

## Implementación del Patrón Store y Manejo de Estado Inmutable

### Implementación del Patrón Store

En este proyecto implementé un patrón Store personalizado para la gestión centralizada del estado de la aplicación. El patrón Store sigue principios similares a los utilizados en librerías como Redux pero con una implementación más ligera y específica para esta aplicación de gestión de plantillas.

#### Componentes del Store

El store está construido sobre los siguientes componentes clave:

1. **Estado (State)**: Un array que contiene todas las plantillas almacenadas.

   ```javascript
   let state = initialState;
   ```

2. **Métodos para manipular el estado**:
   - `getState()`: Devuelve una copia del estado actual, evitando modificaciones directas.
   - `setState()`: Actualiza el estado y notifica a todos los suscriptores.
   - `addTemplate()`: Añade una nueva plantilla al estado.
   - `removeTemplate()`: Elimina una plantilla específica por ID.

3. **Sistema de suscripción (patrón Observer)**:

   ```javascript
   let listeners = [];
   
   function suscribe(listener) {
     listeners.push(listener);
     return () => {
       const index = listeners.indexOf(listener);
       if (index > -1) listeners.splice(index, 1);
     };
   }
   ```

4. **Notificación de cambios**: Cada vez que el estado cambia, todos los componentes suscritos son notificados automáticamente.

   ```javascript

   function setState(newState) {
     state = newState;
     listeners.forEach(listener => listener(state));
   }
   ```

### Mantenimiento de la Inmutabilidad del Estado

Para mantener la inmutabilidad del estado, implementé varias estrategias que aseguran que el estado original nunca sea modificado directamente:

#### 1. Operaciones no mutables para actualizar el estado

En lugar de modificar directamente el array de estado, siempre creo un nuevo array:

- **Al añadir plantillas**:

  ```javascript
  function addTemplate(newTemplate) {
    setState([...state, newTemplate]); // Spread operator crea un nuevo array
  }
  ```

- **Al eliminar plantillas**:

  ```javascript

  function removeTemplate(id) {
    setState(state.filter(template => template.id !== id)); // Filter crea un nuevo array
  }
  ```

#### 2. Protección del estado contra modificaciones externas

Para prevenir que componentes externos modifiquen accidentalmente el estado, implementé una barrera defensiva:

```javascript
function getState() {
  return [...state]; // Devuelve una copia del estado, no una referencia
}
```

#### 3. Actualización atomizada del estado

Cada cambio de estado ocurre como una operación atómica, lo que garantiza que:

- No hay estados intermedios expuestos
- No hay riesgo de actualizaciones parciales
- Las notificaciones se envían solo cuando el estado está completamente actualizado

#### 4. Identificadores únicos para manipulación segura

Implementé un sistema de IDs únicos para cada plantilla:

```javascript
this.id = Date.now() + Math.random().toString(36).substr(2, 9);
```

Esto permite operaciones específicas sobre elementos individuales sin afectar a otros elementos y sin necesidad de modificar el array original.

## Ventajas de esta implementación

1. **Predecibilidad**: Los cambios de estado siguen un flujo unidireccional.
2. **Depuración sencilla**: Cada cambio es rastreable y aislado.
3. **Actualización eficiente de la UI**: Solo es necesario re-renderizar cuando hay cambios reales.
4. **Evita efectos secundarios**: La inmutabilidad previene bugs difíciles de detectar causados por cambios inesperados.
5. **Escalabilidad**: El patrón se puede extender fácilmente para manejar más acciones y tipos de estados.

## Funcionalidades

- Crear nuevas plantillas con título, mensaje, hashtag, categoría y prioridad
- Visualizar plantillas en formato lista o grilla
- Eliminar plantillas con confirmación visual
- Notificaciones temporales de acciones realizadas
- Mensaje cuando no hay plantillas disponibles

## Cómo ejecutar el proyecto

1. Clona este repositorio
2. Abre el archivo `index.html` en tu navegador
3. ¡Comienza a gestionar tus plantillas!

## Tecnologías utilizadas

- HTML5
- CSS3 con Tailwind CSS
- JavaScript (ES6+)
- Patrón de diseño Store
- Programación orientada a objetos