// app.js
function addNewTemplate() {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;
  const hashtag = document.getElementById("hashtag").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  
  if (!title || !message || !hashtag || !category || !priority) {
    alert("Todos los campos son obligatorios");
    return;
  }
  
  const newTemplate = new Template(title, message, hashtag, category, parseInt(priority));
  templatesStore.addTemplate(newTemplate);
  clearForm();
  showNotification("Plantilla guardada con éxito");
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("message").value = "";
  document.getElementById("hashtag").value = "";
  document.getElementById("category").value = "";
  document.getElementById("priority").value = "";
}

// Función para mostrar notificaciones temporales
function showNotification(message, duration = 3000, type = 'success') {
  // Verificar si ya existe una notificación y eliminarla
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Crear elemento de notificación
  const notification = document.createElement('div');
  
  // Clases según el tipo de notificación
  let bgColor = 'bg-green-500';
  if (type === 'error') {
    bgColor = 'bg-red-500';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-500';
  } else if (type === 'info') {
    bgColor = 'bg-blue-500';
  }
  
  notification.className = `notification fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg`;
  notification.textContent = message;
  
  // Añadir al DOM
  document.body.appendChild(notification);
  
  // Eliminar después de la duración especificada
  setTimeout(() => {
    notification.remove();
  }, duration);
}

// Función para buscar plantillas
function searchTemplates() {
  const searchInput = document.getElementById("searchInput").value;
  const filteredTemplates = templatesStore.searchTemplates(searchInput);
  renderFilteredTemplates(filteredTemplates);
}

// Función para filtrar por categoría
function filterByCategory() {
  const categorySelect = document.getElementById("categoryFilter");
  const selectedCategory = categorySelect.value;
  
  const filteredTemplates = templatesStore.filterByCategory(selectedCategory);
  renderFilteredTemplates(filteredTemplates);
}

// Función para ordenar plantillas
function sortTemplates() {
  const sortSelect = document.getElementById("sortBy");
  const selectedSort = sortSelect.value;
  const orderSelect = document.getElementById("sortOrder");
  const selectedOrder = orderSelect.value;
  
  const sortedTemplates = templatesStore.sortTemplates(selectedSort, selectedOrder);
  renderFilteredTemplates(sortedTemplates);
}

// Función para renderizar un conjunto específico de plantillas
function renderFilteredTemplates(templates) {
  const templatesContainer = document.getElementById("templates-container");
  if (!templatesContainer) return;
  
  templatesContainer.innerHTML = ""; // Limpiar el contenedor
  
  // Verificar si hay plantillas
  if (templates.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "col-span-full text-center py-6 text-gray-500";
    emptyMessage.textContent = "No hay plantillas que coincidan con tu búsqueda";
    templatesContainer.appendChild(emptyMessage);
  } else {
    // Renderizar cada plantilla
    templates.forEach(template => {
      const templateElement = template.render();
      templatesContainer.appendChild(templateElement);
    });
  }
}

// Función para actualizar el selector de categorías
function updateCategoryFilter() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = templatesStore.getAllCategories();
  
  // Limpiar opciones actuales
  categorySelect.innerHTML = "";
  
  // Añadir nuevas opciones
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Función para manejar la importación de plantillas
function handleFileImport(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedCount = importTemplates(e.target.result);
      showNotification(`Se importaron ${importedCount} plantillas con éxito`);
      
      // Actualizar la lista de categorías después de importar
      updateCategoryFilter();
    } catch (error) {
      showNotification(error.message, 3000, 'error');
    }
  };
  
  reader.readAsText(file);
  
  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  event.target.value = "";
}

// Función para abrir el formulario modal de creación de plantilla rápida
function openQuickTemplateForm() {
  // Crear modal para plantilla rápida
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Plantilla Rápida</h2>
      <textarea id="quick-template" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="6" placeholder="Escribe tu mensaje completo aquí. El sistema detectará automáticamente hashtags y categorías."></textarea>
      <div class="flex justify-end gap-2 mt-4">
        <button type="button" id="cancel-quick" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
        <button type="button" id="create-quick" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Crear</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar el modal cuando se hace clic en cancelar
  document.getElementById('cancel-quick').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Procesar la plantilla rápida
  document.getElementById('create-quick').addEventListener('click', () => {
    const quickText = document.getElementById('quick-template').value;
    
    if (!quickText.trim()) {
      showNotification("El texto no puede estar vacío", 3000, 'error');
      return;
    }
    
    // Extraer título (primera línea)
    const lines = quickText.split('\n');
    const title = lines[0].trim();
    
    // Extraer mensaje (resto del texto)
    const message = lines.slice(1).join('\n').trim();
    
    // Detectar hashtags
    const hashtagRegex = /#[\w\d]+/g;
    const hashtags = quickText.match(hashtagRegex) || [];
    const hashtagsStr = hashtags.join(', ');
    
    // Detectar categoría (simplemente usamos el primer hashtag sin el #)
    let category = "General";
    if (hashtags.length > 0) {
      category = hashtags[0].substring(1);
    }
    
    // Crear la plantilla
    const newTemplate = new Template(
      title || "Sin título",
      message || title,
      hashtagsStr || "#general",
      category,
      3 // Prioridad media por defecto
    );
    
    templatesStore.addTemplate(newTemplate);
    showNotification("Plantilla rápida creada con éxito");
    
    // Cerrar el modal
    document.body.removeChild(modal);
  });
}
// Función para exportar plantillas
function exportTemplates() {
  const templates = templatesStore.getState();
  
  if (templates.length === 0) {
    showNotification("No hay plantillas para exportar", 3000, 'warning');
    return;
  }
  
  const dataStr = JSON.stringify(templates, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  
  const exportFileName = `plantillas_export_${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
  
  showNotification(`${templates.length} plantillas exportadas con éxito`);
}

// Función para importar plantillas
function importTemplates(jsonData) {
  try {
    const templates = JSON.parse(jsonData);
    
    if (!Array.isArray(templates)) {
      throw new Error("El formato de importación no es válido");
    }
    
    let importCount = 0;
    
    templates.forEach(template => {
      try {
        const newTemplate = new Template(
          template.title || "Sin título",
          template.message || "",
          template.hashtag || "#importado",
          template.category || "Importado",
          template.priority || 3
        );
        
        // Preservar ID y fecha si están disponibles
        if (template.id) newTemplate.id = template.id;
        if (template.createdAt) newTemplate.createdAt = new Date(template.createdAt);
        
        templatesStore.addTemplate(newTemplate);
        importCount++;
      } catch (error) {
        console.error("Error al importar plantilla:", error);
      }
    });
    
    return importCount;
  } catch (error) {
    throw new Error("Error al importar: El archivo no es un JSON válido");
  }
}

// Función para resetear todas las plantillas
function resetTemplates() {
  // Guardar una copia para posible recuperación
  const deletedTemplates = templatesStore.getState();
  
  // Limpiar el estado
  templatesStore.setState([]);
  
  // Limpiar localStorage
  localStorage.removeItem("templates");
  localStorage.removeItem("lastDeletedTemplate");
  
  // Limpiar el contenedor de recuperación
  if (window.templateTrashBin) {
    window.templateTrashBin = {};
  }
  
  showNotification("Todas las plantillas han sido eliminadas");
  updateRecoveryStatus();
}
// Ejecutar cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
  // Cargar la última plantilla eliminada si existe
const lastDeletedTemplate = localStorage.getItem("lastDeletedTemplate");
if (lastDeletedTemplate) {
  if (window.templateTrashBin === undefined) {
    window.templateTrashBin = {};
  }
  window.templateTrashBin.lastDeleted = JSON.parse(lastDeletedTemplate);
}

// Inicializar los indicadores
updateStorageStatus();
updateRecoveryStatus();
  // Configurar evento para resetear todas las plantillas
const resetButton = document.getElementById("resetButton");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    // Mostrar confirmación antes de eliminar
    if (confirm("¿Estás seguro que deseas eliminar todas las plantillas? Esta acción no se puede deshacer.")) {
      resetTemplates();
    }
  });
}
  // Inicializar el store con datos del localStorage
  initializeStore();
  
  // Suscribirse a cambios en el store
  templatesStore.suscribe(() => {
    renderTemplates();
    updateCategoryFilter();
  });
  
  // Configurar botones de vista
  const listViewButton = document.getElementById("listView");
  const gridViewButton = document.getElementById("gridView");
  const templatesContainer = document.getElementById("templates-container");
  
  if (listViewButton && gridViewButton && templatesContainer) {
    listViewButton.addEventListener("click", () => {
      templatesContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2");
      templatesContainer.classList.add("block");
    });
    
    gridViewButton.addEventListener("click", () => {
      templatesContainer.classList.remove("block");
      templatesContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2");
    });
  }
  
  // Configurar eventos para búsqueda y filtrado
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", searchTemplates);
  }
  
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterByCategory);
  }
  
  const sortBySelect = document.getElementById("sortBy");
  const sortOrderSelect = document.getElementById("sortOrder");
  if (sortBySelect && sortOrderSelect) {
    sortBySelect.addEventListener("change", sortTemplates);
    sortOrderSelect.addEventListener("change", sortTemplates);
  }
  
  // Configurar evento para importar plantillas
  const importInput = document.getElementById("importInput");
  if (importInput) {
    importInput.addEventListener("change", handleFileImport);
  }
  
  // Configurar evento para exportar plantillas
  const exportButton = document.getElementById("exportButton");
  if (exportButton) {
    exportButton.addEventListener("click", exportTemplates);
  }
  
  // Configurar evento para plantilla rápida
  const quickTemplateButton = document.getElementById("quickTemplateButton");
  if (quickTemplateButton) {
    quickTemplateButton.addEventListener("click", openQuickTemplateForm);
  }
  
  // Renderizar plantillas iniciales
  renderTemplates();
  
  // Actualizar selector de categorías
  updateCategoryFilter();
});

function renderTemplates() {
  const templatesContainer = document.getElementById("templates-container");
  if (!templatesContainer) return;
  
  templatesContainer.innerHTML = ""; // Limpiar el contenedor
  
  const templates = templatesStore.getState();
  
  // Verificar si hay plantillas
  if (templates.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "col-span-full text-center py-6 text-gray-500";
    emptyMessage.textContent = "No hay plantillas guardadas";
    templatesContainer.appendChild(emptyMessage);
  } else {
    // Renderizar cada plantilla
    templates.forEach(template => {
      const templateElement = template.render();
      templatesContainer.appendChild(templateElement);
    });
  }
}

// Función para mostrar el estado de almacenamiento
function updateStorageStatus() {
  const statusContainer = document.getElementById("storage-status");
  if (!statusContainer) return;
  
  const templates = templatesStore.getState();
  const lastSaveTime = new Date().toLocaleTimeString();
  
  statusContainer.innerHTML = `
    <div class="flex items-center">
      <span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
      <span class="text-sm">${templates.length} plantillas guardadas</span>
      <span class="text-xs text-gray-500 ml-2">Último guardado: ${lastSaveTime}</span>
    </div>
  `;
}
// Función para mostrar el botón de recuperación cuando hay una plantilla eliminada
function updateRecoveryStatus() {
  const recoveryContainer = document.getElementById("recovery-button-container");
  if (!recoveryContainer) return;
  
  const lastDeleted = templatesStore.getLastDeletedTemplate();
  
  if (lastDeleted) {
    recoveryContainer.innerHTML = `
      <button id="recover-button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1 px-3 rounded text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="mr-1">
          <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
        </svg>
        Recuperar última plantilla
      </button>
    `;
    
    // Añadir event listener al botón de recuperación
    document.getElementById("recover-button").addEventListener("click", () => {
      if (templatesStore.recoverLastDeletedTemplate()) {
        showNotification("Plantilla recuperada con éxito");
        updateRecoveryStatus();
      } else {
        showNotification("No hay plantilla para recuperar", 3000, 'warning');
      }
    });
  } else {
    recoveryContainer.innerHTML = '';
  }
}

