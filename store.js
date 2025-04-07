// store.js
function createStore(initialState = []) {
  let state = initialState;
  let listeners = [];
  
  function getState() {
    return [...state]; // Devuelve una copia del estado
  }
  
  function setState(newState) {
    state = newState;
    listeners.forEach(listener => listener(state));
  }
  
  function addTemplate(newTemplate) {
    setState([...state, newTemplate]);
  }
  
  function removeTemplate(id) {
    setState(state.filter(template => template.id !== id));
  }
  
  function suscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }
  
  return { getState, setState, addTemplate, removeTemplate, suscribe };
}

// 🔹 Aquí aseguramos que el estado inicial tenga 2 plantillas precargadas
const templatesStore = createStore([
  new Template("Bienvenida", "Hola, bienvenido al curso", "#hash1, #hash2", "Curso", 1),
  new Template("Oferta especial", "Oferta única en abril", "#hash1, #hash2", "Promoción", 2)
]);

window.templatesStore = templatesStore;
