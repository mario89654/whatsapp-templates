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

// Ejecutar cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
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
  
  listViewButton.addEventListener("click", () => {
    templatesContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2");
    templatesContainer.classList.add("block");
  });
  
  gridViewButton.addEventListener("click", () => {
    templatesContainer.classList.remove("block");
    templatesContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2");
  });
  
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