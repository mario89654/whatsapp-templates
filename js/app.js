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
function showNotification(message, duration = 3000) {
  // Verificar si ya existe una notificación y eliminarla
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'notification fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
  notification.textContent = message;
  
  // Añadir al DOM
  document.body.appendChild(notification);
  
  // Eliminar después de la duración especificada
  setTimeout(() => {
    notification.remove();
  }, duration);
}

// Ejecutar cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
  // Suscribirse a cambios en el store
  templatesStore.suscribe(() => {
    renderTemplates();
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
  
  // Renderizar plantillas iniciales
  renderTemplates();
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