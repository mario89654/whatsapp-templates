class Template {
    constructor(title, message, hashTag, link, date) {
      this.title = title;
      this.message = message;
      this.hashTag = hashTag;
      this.link = link;
      this.date = date;
    }
  
    saveTemplate() {
      templates.push(this);
    }
  
    render() {
      const li = document.createElement("li"); // li
      li.classList.add("bg-white", "p-4", "my-3", "rounded"); // li class
  
      const h4 = document.createElement("h4");
      h4.classList.add("text-xl", "font-semibold");
      h4.textContent = this.title;
  
      const hr = document.createElement("hr");
      hr.classList.add("block", "my-3");
  
      const message = document.createElement("p");
      message.classList.add("text-md", "text-gray-500");
      message.textContent = this.message;
  
      const hashTag = document.createElement("p");
      hashTag.classList.add("text-sm", "mt-3", "text-green-800");
      hashTag.textContent = this.hashTag;
  
      li.appendChild(h4);
      li.appendChild(hr);
      li.appendChild(message);
      li.appendChild(hashTag);
  
      templatesContainer.appendChild(li);
    }
  }