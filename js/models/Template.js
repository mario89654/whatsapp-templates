// Template.js
class Template {
  constructor(title, message, hashtag, category, priority) {
    this.id = Date.now() + Math.random().toString(36).substr(2, 9); // ID único
    this.title = title;
    this.message = message;
    this.hashtag = hashtag;
    this.category = category;
    this.priority = priority;
  }
  
  render() {
    const div = document.createElement("div");
    div.className = "template p-3 border rounded shadow-sm relative";
    div.innerHTML = `
      <button class="delete-btn absolute top-2 right-2 text-red-500 hover:text-red-700" data-id="${this.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </button>
      <h3 class="font-bold pr-6">${this.title}</h3>
      <p class="text-gray-700">${this.message}</p>
      <p><strong>Hashtags:</strong> ${this.hashtag}</p>
      <p><strong>Categoría:</strong> ${this.category}</p>
      <p><strong>Prioridad:</strong> ${this.priority}</p>
    `;
    
    // Añadir event listener al botón de eliminar
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      templatesStore.removeTemplate(this.id);
      showNotification("Plantilla eliminada con éxito");
    });
    
    return div;
  }
}