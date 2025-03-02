import { emitNavigationEvent, emitSubPageContainerEvent } from '../helper/dom.js';
import styles from '../style.css?inline';
import state from '../services/state.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${styles}

  :host {
    display: block;
  }

  div {
    margin-top: 25px;
    gap: 10px;
  }
  section {
    margin-top: 10px;
  }
</style>

<h1>Page 2</h1>
<a href="/page-one" class="nav-link">Go to Page One</a>

<div class="flex-line">
  <button id="tab1">tab-1</button>
  <button id="tab2">tab-2</button>
</div>

<section id="tab-container"></section>
`;

class Component extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$navLink = this._shadow.querySelector('.nav-link');
    this.$tab1 = this._shadow.getElementById("tab1");
    this.$tab2 = this._shadow.getElementById("tab2");
    this.$tabContainer = this._shadow.getElementById("tab-container");
  }

  // Attributes need to be observed to be tied to the lifecycle change callback.
  static get observedAttributes() { return ['label', 'data']; }

  // Attribute values are always strings, so we need to convert them in their getter/setters as appropriate.
  get data() { return JSON.parse(this.getAttribute('data')); }
  get label() { return this.getAttribute('label'); }

  set data(value) { this.setAttribute('data', value); }
  set label(value) { this.setAttribute('label', value); }

  // A web component implements the following lifecycle methods.
  attributeChangedCallback(name, oldVal, newVal) {
    // Attribute value changes can be tied to any type of functionality through the lifecycle methods.
    if (oldVal == newVal) return;
    switch(name) {
      default:
        break;
    }
  }
  connectedCallback() {
    // Triggered when the component is added to the DOM.
    emitSubPageContainerEvent(this.$tabContainer, "/page-two");

    this.$navLink.addEventListener('click', this.followLink.bind(this));
    this.$tab1.addEventListener('click', this.switchToTab.bind(this, "/page-two/tab-one"));
    this.$tab2.addEventListener('click', this.switchToTab.bind(this, "/page-two/tab-two"));
  }
  disconnectedCallback() {
    // Triggered when the component is removed from the DOM.
    // Ideal place for cleanup code.
    // Note that when destroying a component, it is good to also release any listeners.
    this.$navLink.removeEventListener('click', this.followLink);
    this.$tab1.removeEventListener('click', this.switchToTab);
    this.$tab2.removeEventListener('click', this.switchToTab);
}
  adoptedCallback() {
    // Triggered when the element is adopted through `document.adoptElement()` (like when using an <iframe/>).
    // Note that adoption does not trigger the constructor again.
  }

    /**
   *
   * @param {Event} event
   */
  followLink(event) {
    event.preventDefault();
    emitNavigationEvent(this.$navLink, '/page-one');
  }

  /**
   *
   * @param {Event} event
   */
  switchToTab(path, event) {
    event.stopPropagation();
    emitNavigationEvent(event.target, path);
  }
}

window.customElements.define('page-two', Component);