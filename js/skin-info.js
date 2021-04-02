import SkinViewer from './skin-viewer.js';

/**
 * Information about skin
 *
 * @class SkinInfo
 * @extends {HTMLElement}
 */
class SkinInfo extends HTMLElement {
  /** @type {Image} */
  #skinViewerImage;
  /** @type {SkinViewer} */
  #skinViewer;

  /** @type {HTMLImageElement} */
  #skinElement;

  /** @type {HTMLInputElement} */
  #nameElement;

  /** @type {HTMLDivElement} */
  #typeElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'closed'});

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'css/skin-info.css';

    this.#skinElement = document.createElement('img');

    this.#nameElement = document.createElement('input');
    this.#nameElement.placeholder = 'Name';
    this.#nameElement.spellcheck = false;
    this.#nameElement.value = this.name;
    this.#nameElement.type = 'text';

    this.#nameElement.addEventListener('change', (ev) => {
      this.setAttribute('name', ev.currentTarget.value);
    });

    this.#typeElement = document.createElement('div');
    
    {
      const broad = document.createElement('button');
      broad.innerText = 'Broad';
      this.#addTypeSelection(broad);

      const slim = document.createElement('button');
      slim.innerText = 'Slim';
      this.#addTypeSelection(slim);

      this.#typeElement.append(broad, slim);
      
      // Select type from attribute. (broad is default)
      (this.type === 'slim' ? slim : broad).classList.add('type-selected');
    }

    this.#skinViewerImage = new Image();
    this.#skinViewerImage.src = this.skin;
    this.#skinViewerImage.onload = () => {
      this.#skinViewer = new SkinViewer(this.#skinViewerImage);
      this.#skinElement.src = this.#skinViewer.generate(this.type === 'slim');
    };

    shadowRoot.append(
      linkElement,
      this.#skinElement,
      this.#nameElement,
      this.#typeElement,
    );
  }

  get skin() {
    return this.getAttribute('skin') || '';
  }

  set skin(value) {
    this.setAttribute('skin', value);
    this.#skinViewerImage.src = value;
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value) {
    this.setAttribute('name', value);
    this.#nameElement.value = value;
  }

  get type() {
    return this.getAttribute('type') || '';
  }

  set type(value) {
    switch (value) {
      case 'broad':
        this.#typeElement.firstElementChild.click();
        break;
      case 'slim':
        this.#typeElement.lastElementChild.click();
        break;
      default:
        return;
    }

    this.#skinElement.src = this.#skinViewer.generate(value === 'slim');
  }

  /**
   * Add type selection for a button.
   * 
   * @private
   * @param {HTMLButtonElement} button 
   * 
   * @memberof SkinInfo
   */
  #addTypeSelection(button) {
    button.addEventListener('click', () => {
      this.setAttribute('type', button.innerText.toLowerCase());
      this.#skinElement.src = this.#skinViewer.generate(
        button.innerText.toLowerCase() === 'slim'
      );

      button.classList.add('type-selected');
      (button.nextElementSibling || button.previousElementSibling).classList
      .remove('type-selected');
    });
  }
}

customElements.define('skin-info', SkinInfo);

export default SkinInfo;
