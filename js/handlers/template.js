
// class Template {
//   constructor(title, message, hashtag, category, priority) {
//     this.title = title;
//     this.message = message;
//     this.hashtag = hashtag;
//     this.category = category;
//     this.priority = priority;
//   }

//   render() {
//     const templatesContainer = document.getElementById("templates-container");
//     if (!templatesContainer) return;

//     const li = document.createElement("li");
//     li.classList.add("p-4", "bg-gray-50", "border", "rounded", "shadow");

//     li.innerHTML = `
//       <h3 class="font-semibold">${this.title}</h3>
//       <p class="text-gray-600 text-sm italic">${this.message}</p>
//       <span class="text-green-500 text-sm">${this.hashtag}</span>
//       <p class="text-gray-700 text-sm">Categoría: ${this.category}</p>
//       <p class="text-yellow-500 text-sm">Prioridad: ${"★".repeat(this.priority)}${"☆".repeat(5 - this.priority)}</p>
//       <button class="mt-2 px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
//     `;

//     // Attach event listener to the remove button
//     const removeButton = li.querySelector("button");
//     removeButton.addEventListener("click", () => {
//       removeTemplate(this.title);
//     });

//     templatesContainer.appendChild(li);
//   }
// }

// function removeTemplate(title) {
//   const index = templates.findIndex(template => template.title === title);
//   if (index === -1) {
//     alert("No se encontró la plantilla a eliminar");
//     return;
//   }
//   templates.splice(index, 1);
//   renderTemplates(); // Re-renderizar la lista después de eliminar
// }
function addTemplate(template) {
  if (templates.some(t => t.title === template.title)) {
    alert("Esta plantilla ya existe");
    return;
  }
  templates.push(template);
  renderTemplates();
}

function removeTemplate(title) {
  const index = templates.findIndex(template => template.title === title);
  if (index === -1) {
    alert("No se encontró la plantilla a eliminar");
    return;
  }
  templates.splice(index, 1);
  renderTemplates(); // Re-renderizar la lista después de eliminar
}

function renderTemplates() {
  const templatesContainer = document.getElementById("templates-container");
  if (!templatesContainer) return;

  templatesContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos elementos
  
  templates.forEach(template => {
    templatesContainer.appendChild(template.render());
  });
}
