// store.js
// function initializeStore() { // ver como agregarlo al proyecto
//   const template = localStorage.getItem("template");
//   const newTemplates = template === null ? [] : JSON.parse(template);
//   const mappedTemplates = newTemplates.map(newTemplate => {
//     return new Template(
//       newTemplate.title,
//       newTemplate.message,
//       newTemplate.hashtag,
//       newTemplate.link,
//       newTemplate.date
//     );
//   });
// }
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
window.templatesStore.suscribe(saveTemplate); // verificar si el store tiene acceso a la función de guardar
window.templatesStore.suscribe(renderTemplate); // verificar si el store tiene acceso a la función de guardar
