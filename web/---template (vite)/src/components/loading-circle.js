import styles from '../style.css?inline';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  ${styles}

  .spinner-parent {
    position: fixed;
    background-color: var(--colour-secondary-a);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  #spinner::before {
    content: "";
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    height: 40px;
    width: 40px;
    margin-top: -20px;
    margin-left: -20px;
  }

  #spinner::before {
    border-radius: 50%;
    border: 3px solid var(--colour-background);
    border-top-color: var(--colour-primary);
    border-bottom-color: var(--colour-primary);
    animation: spinner 0.7s ease infinite;
  }
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<div id="spinner-parent" class="spinner-parent">
  <div id="spinner"></div>
</div>
`;

class LoadingCircle extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() { return [ 'level', 'lang' ]; }

  get level() {
    let l = this.getAttribute("level");
    return l ? l : ".";
  }
  get lang() { return this.getAttribute("lang"); }

  set level(value) { this.setAttribute("level", value); }
  set lang(value) { this.setAttribute("lang", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
  }
}

window.customElements.define('loading-circle', LoadingCircle);