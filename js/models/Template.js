// // Template.js
// const templates = [];

// function addNewTemplate() {
//   const title = document.getElementById("title").value;
//   const message = document.getElementById("message").value;
//   const hashtag = document.getElementById("hashtag").value;
//   const category = document.getElementById("category").value;
//   const priority = document.getElementById("priority").value;

//   if (!title || !message || !hashtag || !category || !priority) {
//     alert("Todos los campos son obligatorios");
//     return;
//   }

//   const newTemplate = new Template(title, message, hashtag, category, parseInt(priority));
//   addTemplate(newTemplate);
//   clearForm(); // Limpiar el formulario después de agregar la plantilla
// }

// function clearForm() {
//   document.getElementById("title").value = "";
//   document.getElementById("message").value = "";
//   document.getElementById("hashtag").value = "";
//   document.getElementById("category").value = "";
//   document.getElementById("priority").value = "";
// }

// document.addEventListener("DOMContentLoaded", () => {
//   renderTemplates(); // Renderizar las plantillas al cargar la página
// });
// Template.js
class Template {
  constructor(title, message, hashtag, category, priority) {
    this.title = title;
    this.message = message;
    this.hashtag = hashtag;
    this.category = category;
    this.priority = priority;
  }

  render() {
    const div = document.createElement("div");
    div.className = "template";
    div.innerHTML = `
      <h3>${this.title}</h3>
      <p>${this.message}</p>
      <p><strong>Hashtags:</strong> ${this.hashtag}</p>
      <p><strong>Categoría:</strong> ${this.category}</p>
      <p><strong>Prioridad:</strong> ${this.priority}</p>
    `;
    return div;
  }
}