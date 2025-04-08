function saveTemplate() {
    // tenemos acceso of store?
    // window templatesStore = getState()
    localStorage.setItem("template", JSON.stringify(window.templatesStore.getState()));
}
// persistence.js

// Guarda las plantillas actuales en localStorage
 

function saveTemplate() {
    localStorage.setItem("template", JSON.stringify(window.templatesStore.getState()));
    console.log("Plantillas guardadas en localStorage");
}

/**
 * Carga las plantillas desde localStorage y las convierte en objetos Template
 * @returns {Array} Array de objetos Template
 */
function loadTemplates() {
    const templatesJson = localStorage.getItem("template");
    
    if (!templatesJson) {
        console.log("No hay plantillas guardadas en localStorage");
        return null;
    }
    
    try {
        const templates = JSON.parse(templatesJson);
        const mappedTemplates = templates.map(template => {
            return new Template(
                template.title,
                template.message,
                template.hashtag,
                template.category,
                template.priority
            );
        });
        
        console.log("Plantillas cargadas desde localStorage:", mappedTemplates.length);
        return mappedTemplates;
    } catch (error) {
        console.error("Error al cargar plantillas:", error);
        return null;
    }
}

/**
 * Inicializa el store con plantillas guardadas si existen
 */
function initializeStore() {
    const savedTemplates = loadTemplates();
    
    if (savedTemplates && savedTemplates.length > 0) {
        // Si hay plantillas guardadas, inicializar el store con ellas
        window.templatesStore.setState(savedTemplates);
        console.log("Store inicializado con plantillas guardadas");
    }
}