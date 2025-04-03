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
    templatesStore.addTemplate(newTemplate); // Se usa la Store en lugar de variables sueltas
    clearForm();
  }
  
  function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("message").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("category").value = "";
    document.getElementById("priority").value = "";
  }
  
  // Ejecutar cuando se cargue la página
  document.addEventListener("DOMContentLoaded", () => {
    renderTemplates();
  });
  
  function renderTemplates() {
    const templatesContainer = document.getElementById("templates-container");
    templatesContainer.innerHTML = ""; // Limpiar el contenedor
  
    templatesStore.getTemplates().forEach(template => template.render());
  }
  