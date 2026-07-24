class HtmlTemplate extends HTMLElement {

  constructor() {
    super();
    this.name = 'World';
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }

  connectedCallback() {
    const
      shadow = this.attachShadow({ mode: 'closed' }),
      template = document.getElementById('html-template').content.cloneNode(true),
      hwMsg = `Hello ${ this.name }`;

    Array.from(template.querySelectorAll('.hw-text'))
      .forEach(n => n.textContent = hwMsg);

    shadow.append(template);
  }

}

customElements.define('html-template', HtmlTemplate);