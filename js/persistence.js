function saveTemplates() {
    localStorage.setItem(
      "templates",
      JSON.stringify(window.templatesStore.getState())
    );
  }
  
  function loadTemplates() {
    const savedTemplates = localStorage.getItem("templates");
    
    if (savedTemplates) {
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
        return null;
      }
    }
    
    return null;
  }
  
  function initializeStore() {
    const savedTemplates = loadTemplates();
    
    if (savedTemplates && savedTemplates.length > 0) {
      // Sobrescribir el estado inicial con las plantillas guardadas
      templatesStore.setState(savedTemplates);
    }
  }
  
  function exportTemplates() {
    const templates = templatesStore.getState();
    const dataStr = JSON.stringify(templates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'plantillas-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  function importTemplates(jsonData) {
    try {
      const templates = JSON.parse(jsonData).map(template => {
        const newTemplate = new Template(
          template.title,
          template.message,
          template.hashtag,
          template.category,
          template.priority
        );
        
        // Preservar el ID y la fecha de creación originales si existen
        if (template.id) newTemplate.id = template.id;
        if (template.createdAt) newTemplate.createdAt = new Date(template.createdAt);
        
        return newTemplate;
      });
      
      // Añadir las plantillas importadas al store
      let currentTemplates = templatesStore.getState();
      templatesStore.setState([...currentTemplates, ...templates]);
      
      return templates.length;
    } catch (error) {
      console.error("Error al importar las plantillas:", error);
      throw new Error("El archivo no tiene un formato válido");
    }
  }