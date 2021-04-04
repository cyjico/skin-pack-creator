import SkinViewer from './skin-viewer.js';

/**
 * Information about the Minecraft skin.
 *
 * @class SkinInfo
 * @extends {HTMLElement}
 */
class SkinInfo extends HTMLElement {
  /** @type {HTMLInputElement} */
  #nameElement;

  /** @type {HTMLDivElement} */
  #typeContainer;

  /** @type {HTMLImageElement} */
  #skinElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'closed'});

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'css/skin-info.css';

    const infoContainer = document.createElement('div');
    infoContainer.id = 'info-container';

    // #nameElement
    this.#nameElement = document.createElement('input');
    this.#nameElement.value = this.getAttribute('name') || '';
    
    this.#nameElement.placeholder = 'Name';
    this.#nameElement.spellcheck = false;
    this.#nameElement.type = 'text';
    this.#nameElement.addEventListener('change', () => {
      this.setAttribute('name', this.#nameElement.value);
    });

    // #typeContainer
    this.#typeContainer = document.createElement('div');
    this.#typeContainer.id = 'type-container';
    
    {
      const broad = document.createElement('button');
      broad.innerText = 'Broad';
      this.#addTypeSelection(broad);

      const slim = document.createElement('button');
      slim.innerText = 'Slim';
      this.#addTypeSelection(slim);

      (this.getAttribute('type') === 'slim' ? slim : broad)
      .classList.add('type-selected');

      this.#typeContainer.append(broad, slim);
    }

    // #skinElement
    this.#skinElement = document.createElement('img');
    if (this.hasAttribute('skin'))
      this.#updateSkinElement();

    infoContainer.append(
      this.#skinElement,
      this.#nameElement,
      this.#typeContainer,
    );

    shadowRoot.append(
      linkElement,
      infoContainer,
    );
  }

  get skin() {
    return this.getAttribute('skin') || '';
  }

  set skin(value) {
    this.setAttribute('skin', value);
    this.#updateSkinElement();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value) {
    this.#nameElement.value = value;
  }

  get type() {
    return this.getAttribute('type') || 'broad';
  }

  set type(value) {
    switch (value) {
      case 'broad':
        this.#typeContainer.firstElementChild.click();
        break;
      case 'slim':
        this.#typeContainer.lastElementChild.click();
        break;
      default:
        return;
    }
  }

  /**
   * Add type selection for a button.
   * 
   * @ignore
   * @param {HTMLButtonElement} button 
   * @memberof SkinInfo
   */
  #addTypeSelection(button) {
    button.addEventListener('click', () => {
      this.setAttribute('type', button.innerText.toLowerCase());

      button.classList.add('type-selected');
      (button.nextElementSibling || button.previousElementSibling).classList
      .remove('type-selected');

      this.#updateSkinElement();
    });
  }

  /**
   * Updates the skin element with the specified 'skin' and 'type' attributes.
   * 
   * @ignore
   * @memberof SkinInfo
   */
  #updateSkinElement() {
    SkinViewer.generate(
      this.getAttribute('skin'),
      this.getAttribute('type'),
    )
    .then((url) => {
      this.#skinElement.src = url;
    })
    .catch((reason) => {
      throw reason;
    });
  }
}

customElements.define('skin-info', SkinInfo);

export default SkinInfo;
