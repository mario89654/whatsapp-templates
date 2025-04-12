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

  function editTemplate(updatedTemplate) {
    setState(state.map(template => 
      template.id === updatedTemplate.id ? 
      Object.assign(new Template(
        updatedTemplate.title, 
        updatedTemplate.message, 
        updatedTemplate.hashtag, 
        updatedTemplate.category, 
        updatedTemplate.priority
      ), {id: updatedTemplate.id, createdAt: updatedTemplate.createdAt}) : 
      template
    ));
  }

  function duplicateTemplate(id) {
    const original = state.find(template => template.id === id);
    if (!original) return;

    let copyTitle = original.title;
    let copyIndex = 1;
    while (state.some(t => t.title === copyTitle)) {
      copyTitle = `${original.title} (Copia ${copyIndex})`;
      copyIndex++;
    }

    const duplicated = new Template(
      copyTitle,
      original.message,
      original.hashtag,
      original.category,
      original.priority
    );

    addTemplate(duplicated);
  }

  function searchTemplates(query) {
    if (!query) return getState();
    
    const lowerQuery = query.toLowerCase();
    return state.filter(template => 
      template.title.toLowerCase().includes(lowerQuery) || 
      template.message.toLowerCase().includes(lowerQuery) || 
      template.hashtag.toLowerCase().includes(lowerQuery) || 
      template.category.toLowerCase().includes(lowerQuery)
    );
  }

  function filterByCategory(category) {
    if (!category || category === 'Todas') return getState();
    return state.filter(template => template.category === category);
  }

  function sortTemplates(field, order = 'asc') {
    const sortedState = [...state];
    
    sortedState.sort((a, b) => {
      let comparison;
      
      if (field === 'priority') {
        comparison = a.priority - b.priority;
      } else if (field === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        comparison = a[field].localeCompare(b[field]);
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
    
    return sortedState;
  }

  function getAllCategories() {
    const categories = new Set(state.map(template => template.category));
    return ['Todas', ...Array.from(categories)];
  }

  function suscribe(listener) {
    listeners.push(listener);
    listener(state);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }

  function getLastDeletedTemplate() {
    return window.templateTrashBin?.lastDeleted || null;
  }

  function recoverLastDeletedTemplate() {
    const lastDeleted = getLastDeletedTemplate();
    
    if (lastDeleted) {
      const recoveredTemplate = new Template(
        lastDeleted.title,
        lastDeleted.message,
        lastDeleted.hashtag,
        lastDeleted.category,
        lastDeleted.priority
      );
      
      recoveredTemplate.id = lastDeleted.id;
      recoveredTemplate.createdAt = new Date(lastDeleted.createdAt);
      
      addTemplate(recoveredTemplate);
      
      window.templateTrashBin.lastDeleted = null;
      localStorage.removeItem("lastDeletedTemplate");
      
      return true;
    }
    
    return false;
  }

  return { 
    getState, 
    setState, 
    addTemplate, 
    removeTemplate, 
    editTemplate,
    searchTemplates,
    filterByCategory,
    sortTemplates,
    getAllCategories,
    suscribe,
    getLastDeletedTemplate,
    recoverLastDeletedTemplate,
    duplicateTemplate // Agregado aquí
  };
}

const templatesStore = createStore([
  new Template("Bienvenida", "Hola, bienvenido al curso", "#hash1, #hash2", "Curso", 1),
  new Template("Oferta especial", "Oferta única en abril", "#hash1, #hash2", "Promoción", 2)
]);

window.templatesStore = templatesStore;
