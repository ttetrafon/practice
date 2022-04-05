export default class MyModal extends HTMLElement {

  constructor(number) {
    // It’s called when the component is first initialized. It must call super() and can set any defaults or perform other pre-rendering processes.
    super();
    this.number = number;
  }

  static get observedAttributes() {
    // Returns an array of attributes that the browser will observe.
    return ['number'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    // Called whenever an observed attribute is changed.
    // Those defined in HTML are passed immediately, but JavaScript can modify them:
    // document.querySelector('my-modal').setAttribute('number', '111111');
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }

  connectedCallback() {
    // This function is called when the Web Component is appended to a Document Object Model. It should run any required rendering.
    this.textContent = `I am a custom modal number ${this.number}!`;
  }

  disconnectedCallback() {
    // It’s called when the Web Component is removed from a Document Object Model. This may be useful if you need to clean up.
  }

  adoptedCallback() {
    // This function is called when a Web Component is moved from one document to another.
  }

}

customElements.define( 'my-modal', MyModal );