const template = document.createElement('template');

template.innerHTML = `
  <style>
    .container {
      padding: 8px;
    }

    button {
      display: block;
      overflow: hidden;
      position: relative;
      padding: 0 16px;
      font-size: 16px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      outline: none;

      width: 100%;
      height: 40px;

      box-sizing: border-box;
      border: 1px solid #a1a1a1;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
    }
  </style>

  <div class="container">
    <button>Label</button>
  </div>
`;
// color: #363636;

class Button extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$container = this._shadowRoot.querySelector('.container');
    this.$button = this._shadowRoot.querySelector('button');

    this.$button.addEventListener('click', () => {
      console.log("my-button clicked from within!");
      // This custom event is usually not required, since normal events can be captured somewhere along the line of parents without issue.
      this.dispatchEvent(
        new CustomEvent('onClick', {
          bubbles: true,
          // cancelable: false,
          // composed: true,
          detail: 'Hello from within the Custom Element',
        })
      );
    });
  }

  static get observedAttributes() {
    return ['label'];
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    this.$button.innerHTML = this.label;
  }

  connectedCallback() {
    // This is used to remove the padding when the button is embedded within some other custom elements.
    if (this.hasAttribute('as-atom')) {
      this.$container.style.padding = '0px';
    }
  }

}

window.customElements.define('my-button', Button);