import styles from '../style.css?inline';
import { eventNames } from '../data/enums.js';
import { emitCustomEvent } from '../helper/dom.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${styles}

  :host {
    display: block;
    width: 100%;
  }

  label {
    align-self: flex-start;
  }

  input {
    margin-bottom: 10px;
    padding: 5px 10px;
  }
</style>

<div class="flex-column">
  <label>Label</label>
  <input id="" type="text">
</div>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$label = this._shadow.querySelector("label");
    this.$field = this._shadow.querySelector("input");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['label', 'id', 'hint', 'type', 'required', 'validationFailureMsg']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get hint() { return this.getAttribute('hint'); }
  get id() { return this.getAttribute('id'); }
  get label() { return this.getAttribute('label'); }
  get required() { return this.getAttribute('required'); }
  get type() { return this.getAttribute('type'); }
  get validationFailureMsg() { return this.getAttribute('validationFailureMsg'); }

  set hint(value) { this.setAttribute('hint', value); }
  set id(value) { this.setAttribute('id', value); }
  set label(value) { this.setAttribute('label', value); }
  set required(value) { this.setAttribute('required', value); }
  set type(value) { this.setAttribute('type', value); }
  set validationFailureMsg(value) { this.setAttribute('validationFailureMsg', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch(name) {
      case 'hint':
        this.$field.setAttribute("placeholder", this.hint);
        break;
      case 'id':
        this.$label.setAttribute("for", this.id);
        this.$field.setAttribute("id", this.id);
        break;
      case 'label':
        this.$label.innerText = this.label;
        break;
      case 'required':
        if (this.required == 'yes') {
          this.$field.setAttribute("required", "");
        }
        else {
          this.$field.removeAttribute("required");
        }
        break;
      case 'type':
        this.$field.setAttribute("type", this.type);
        break;
      default:
        break;
    }
  }
  connectedCallback() {
    // Triggered when the component is added to the DOM.
    this.$field.addEventListener("keyup", this.fieldKeyEvent.bind(this));
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    this.$field.removeEventListener("keyup", this.fieldKeyEvent);
  }
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

  /**
   * @param {Event} event
   */
  fieldKeyEvent(event) {
    if (["Enter", "NumpadEnter"].includes(event.code)) {
      emitCustomEvent(this.$field, eventNames.INPUT_CONTROL.description, {
        keyCode: code
      });
      this.$field.blur();
    }
  }

  getValue() {
    return this.$field.value;
  }

  validateValue() {
    console.log(`---> validateValue(${this.id})`);
    this.$field.checkValidity();
    this.$field.setCustomValidity(this.validationFailureMsg);
    return this.$field.reportValidity();
  }
}

window.customElements.define('input-field', Component);