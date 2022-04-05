export default class ShadowModal extends HTMLElement {

  constructor(name) {
    // It’s called when the component is first initialized. It must call super() and can set any defaults or perform other pre-rendering processes.
    super();
    this.name = name;
  }

  static get observedAttributes() {
    // Returns an array of attributes that the browser will observe.
    return [ 'name' ];
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

    // Attach the Shadow DOM to the element.
    const shadow = this.attachShadow({ mode: 'closed' });
    // 'open': JS in the outer page can access the element's shadow DOM (with `Element.shadowRoot`).
    // 'closed': The shadow DOM can be accessed only within the web component. Styles not explicitly defined are inherited as normal.

    // The CSS :host selector can style the outer 'shadow-modal' selector from within the web component.
    // Can also apply conditional styles when the modal is using specific classes.

    shadow.innerHTML = `
    <style>
      :host(.inverted) {
        transform: rotate(180deg);
      }
      :host(.yellow) {
        color: yellow;
      }
      p {
        text-align: center;
        font-weight: normal;
        padding: 1em;
        margin: 0 0 2em 0;
        background-color: #eee;
        border: 1px solid #666;
      }
    </style>
    <p>Hello ${ this.name }!</p>`;
  }

  disconnectedCallback() {
    // Called when the Web Component is removed from a Document Object Model. This may be useful if you need to clean up.
  }

  adoptedCallback() {
    // This function is called when a Web Component is moved from one document to another.
  }

}

customElements.define( 'shadow-modal', ShadowModal );