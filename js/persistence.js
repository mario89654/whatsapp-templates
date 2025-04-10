// persistence.js
function saveTemplates() {
  localStorage.setItem(
    "templates",
    JSON.stringify(window.templatesStore.getState())
  );
  
  // Actualizar el indicador de estado de almacenamiento
  updateStorageStatus();
}

function loadTemplates() {
  const savedTemplates = localStorage.getItem("templates");
  
  // Usando operador ternario para manejar el caso de LocalStorage vacío
  return savedTemplates ? 
    (() => {
      try {
        // Convierte las plantillas guardadas en objetos Template
        const templates = JSON.parse(savedTemplates).map(template => {
          const newTemplate = new Template(
            template.title,
            template.message,
            template.hashtag,
            template.category,
            template.priority
          );
          
          // Preservar el ID y la fecha de creación originales
          newTemplate.id = template.id;
          newTemplate.createdAt = new Date(template.createdAt);
          
          return newTemplate;
        });
        
        return templates;
      } catch (error) {
        console.error("Error al cargar las plantillas:", error);
        return [];
      }
    })() : 
    []; // Retorna un arreglo vacío si no hay plantillas en localStorage
}

function initializeStore() {
  const savedTemplates = loadTemplates();
}
