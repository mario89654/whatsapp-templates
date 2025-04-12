// Template.js
class Template {
  constructor(title, message, hashtag, category, priority) {
    this.id = Date.now() + Math.random().toString(36).substr(2, 9); // ID único
    this.title = title;
    this.message = message;
    this.hashtag = hashtag;
    this.category = category;
    this.priority = priority;
    this.createdAt = new Date();
    this.isFavorite = false;
  }

   // Método para duplicar la plantilla
   duplicateTemplate() {
    // Crear una nueva plantilla con los mismos datos pero nuevo ID
    const duplicatedTemplate = new Template(
      `${this.title} (copia)`,
      this.message,
      this.hashtag,
      this.category,
      this.priority
    );

    duplicatedTemplate.isFavorite = this.isFavorite;
    
    // Agregar la plantilla duplicada al store
    templatesStore.addTemplate(duplicatedTemplate);

    // Mostrar notificación
    showNotification("Plantilla duplicada con éxito");
  }
  
// Agregar el método toggleFavorite
toggleFavorite() {
  // Cambiar el estado
  this.isFavorite = !this.isFavorite;
  
  // Actualizar en el store
  templatesStore.editTemplate({
    ...this,
    isFavorite: this.isFavorite
  });
  
  // Actualizar el estado visual del botón
  const favoriteBtn = document.querySelector(`.favorite-btn[data-id="${this.id}"]`);
  if (favoriteBtn) {
    // Actualizar el SVG directamente
    const svg = favoriteBtn.querySelector('svg');
    svg.parentElement.className = `favorite-btn ${this.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`;
    
    // Forzar re-render del botón
    const newBtn = favoriteBtn.cloneNode(true);
    favoriteBtn.parentNode.replaceChild(newBtn, favoriteBtn);
    
    // Volver a añadir el event listener al nuevo botón
    newBtn.addEventListener('click', () => this.toggleFavorite());
  }
  
  // Mostrar notificación
  showNotification(this.isFavorite ? "Marcado como favorito" : "Desmarcado de favoritos");
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
      <div class="action-buttons flex gap-2 mb-2">
        <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${this.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button>
         <button class="duplicate-btn text-purple-500 hover:text-purple-700" data-id="${this.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
      </svg>
    </button>
     <button class="favorite-btn ${this.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500" data-id="${this.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
    </button>
        <button class="share-btn text-indigo-500 hover:text-indigo-700" data-id="${this.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
        </button>
      </div>
      <h3 class="font-bold pr-6">${this.title}</h3>
      <p class="text-gray-700">${this.message}</p>
      <p><strong>Hashtags:</strong> ${this.hashtag}</p>
      <p><strong>Categoría:</strong> ${this.category}</p>
      <p><strong>Prioridad:</strong> ${this.priority}</p>
      <p class="text-xs text-gray-500 mt-2">Creado: ${this.formatDate(this.createdAt)}</p>
    `;

    // Añadir event listener al botón de eliminar
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      // Ventana de confirmación antes de eliminar
      if (confirm("¿Estás seguro que deseas eliminar esta plantilla?")) {
        // Guardar plantilla para posible recuperación antes de eliminarla
        const deletedTemplate = templatesStore.getState().find(t => t.id === this.id);
        
        // Si existe el objeto para almacenar la última plantilla eliminada, guardarlo
        if (window.templateTrashBin === undefined) {
          window.templateTrashBin = {};
        }

        
        // Guardar la plantilla eliminada
        window.templateTrashBin.lastDeleted = deletedTemplate;
        
        // Eliminar la plantilla
        templatesStore.removeTemplate(this.id);
        
        // Actualizar localStorage con la última plantilla eliminada
        localStorage.setItem("lastDeletedTemplate", JSON.stringify(deletedTemplate));
        
        // Mostrar notificación
        showNotification("Plantilla eliminada con éxito");
        
        // Actualizar el indicador de estado de recuperación
        updateRecoveryStatus();
      }
    });

    // Añadir event listener al botón de editar
    const editBtn = div.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      this.openEditForm();
    });

// Añadir event listener al botón de duplicar
const duplicateBtn = div.querySelector('.duplicate-btn');
duplicateBtn.addEventListener('click', () => {
  this.duplicateTemplate();
});

const favoriteBtn = div.querySelector('.favorite-btn');
favoriteBtn.addEventListener('click', () => {
  this.toggleFavorite();
});

    // Añadir event listener al botón de compartir
    const shareBtn = div.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
      this.shareTemplate();
    });

    return div;
  }

  formatDate(date) {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openEditForm() {
    // Crear un modal para editar la plantilla
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Editar Plantilla</h2>
        <form id="edit-form">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-title">Título</label>
            <input type="text" id="edit-title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${this.title}">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-message">Mensaje</label>
            <textarea id="edit-message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4">${this.message}</textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-hashtag">Hashtags</label>
            <input type="text" id="edit-hashtag" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${this.hashtag}">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-category">Categoría</label>
            <input type="text" id="edit-category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${this.category}">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-priority">Prioridad</label>
            <input type="number" id="edit-priority" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${this.priority}" min="1" max="5">
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" id="cancel-edit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar el modal cuando se hace clic en cancelar
    document.getElementById('cancel-edit').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Manejar el envío del formulario
    document.getElementById('edit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener los valores editados
      const updatedTemplate = {
        id: this.id,
        title: document.getElementById('edit-title').value,
        message: document.getElementById('edit-message').value,
        hashtag: document.getElementById('edit-hashtag').value,
        category: document.getElementById('edit-category').value,
        priority: parseInt(document.getElementById('edit-priority').value),
        createdAt: this.createdAt,
        isFavorite: this.isFavorite
      };
      
      // Actualizar la plantilla en el store
      templatesStore.editTemplate(updatedTemplate);
      
      // Cerrar el modal
      document.body.removeChild(modal);
      
      // Mostrar notificación
      showNotification("Plantilla actualizada con éxito");
    });
  }
  
  copyToClipboard() {
    const textToCopy = `${this.title}\n\n${this.message}\n\nHashtags: ${this.hashtag}\nCategoría: ${this.category}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showNotification("Contenido copiado al portapapeles");
      })
      .catch(err => {
        showNotification("Error al copiar: " + err, 3000, 'error');
      });
  }
  
  shareTemplate() {
    // Simular compartir a través de un modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Compartir Plantilla</h2>
        <div class="mb-4">
          <p>Compartir "${this.title}" a través de:</p>
        </div>
        <div class="flex justify-center space-x-4 mb-4">
          <button class="p-2 bg-blue-600 text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
            </svg>
          </button>
          <button class="p-2 bg-sky-500 text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
            </svg>
          </button>
          <button class="p-2 bg-green-500 text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
          </button>
          <button class="p-2 bg-red-500 text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="share-link">Enlace para compartir:</label>
          <div class="flex">
            <input id="share-link" class="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" readonly value="https://plantillas.app/share/${this.id}">
            <button id="copy-link" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">Copiar</button>
          </div>
        </div>
        <div class="flex justify-end">
          <button id="close-share" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cerrar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar el modal al hacer clic en cerrar
    document.getElementById('close-share').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
// Moving export default to top level of file
    // Copiar el enlace
    document.getElementById('copy-link').addEventListener('click', () => {
      const linkInput = document.getElementById('share-link');
      linkInput.select();
      document.execCommand('copy');
      showNotification("Enlace copiado al portapapeles");
    });
  }
}
