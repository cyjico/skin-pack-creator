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

  /** @type {HTMLDivElement} */
  #skinContainer;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'closed'});

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'css/skin-info.css';

    // #info-container
    const infoContainer = document.createElement('div');
    infoContainer.id = 'info-container';

    // #name-element
    this.#nameElement = document.createElement('input');
    this.#nameElement.id = 'name-element'
    this.#nameElement.value = this.getAttribute('name') || '';
    
    this.#nameElement.placeholder = 'Name';
    this.#nameElement.spellcheck = false;
    this.#nameElement.type = 'text';
    this.#nameElement.addEventListener('change', () => {
      this.setAttribute('name', this.#nameElement.value);
    });

    // #type-container
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

    // #skin-container
    this.#skinContainer = document.createElement('div');
    this.#skinContainer.id = 'skin-container';

    {
      const skinElement = document.createElement('img');

      const skinRemover = document.createElement('button');
      skinRemover.innerText = 'Remove';
      skinRemover.addEventListener('click', () => {
        this.parentElement.removeChild(this);
      })

      this.#skinContainer.append(
        skinElement,
        skinRemover,
      );

      if (this.hasAttribute('skin')) {
        this.#updateSkinContainer();
      }
    }

    infoContainer.append(
      this.#skinContainer,
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
    this.#updateSkinContainer();
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

      this.#updateSkinContainer();
    });
  }

  /**
   * Updates the skin element with the specified 'skin' and 'type' attributes.
   * 
   * @ignore
   * @memberof SkinInfo
   */
  #updateSkinContainer() {
    SkinViewer.generate(
      this.getAttribute('skin'),
      this.getAttribute('type'),
    )
    .then((url) => {
      this.#skinContainer.firstChild.src = url;
    })
    .catch((reason) => {
      throw reason;
    });
  }
}

customElements.define('skin-info', SkinInfo);

export default SkinInfo;
