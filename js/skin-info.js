import SkinViewer from './skin-viewer.js';

/**
 * Information about skin
 *
 * @class SkinInfo
 * @extends {HTMLElement}
 */
class SkinInfo extends HTMLElement {
  /** @type {HTMLImageElement} */
  #skinElement;
  
  /** @type {SkinViewer} */
  #skinViewer;

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
    this.#skinViewer = new SkinViewer(
      this.hasAttribute('skin') ? this.getAttribute('skin') : ''
    );

    this.#nameElement = document.createElement('input');
    if (this.hasAttribute('name')) {
      this.#nameElement.value = this.getAttribute('name');
    }
    
    this.#nameElement.placeholder = 'Name';
    this.#nameElement.spellcheck = false;
    this.#nameElement.type = 'text';
    this.#nameElement.onchange = () => {
      this.setAttribute('name', this.#nameElement.value);
    };

    this.#typeElement = document.createElement('div');
    
    const broad = document.createElement('button');
    broad.innerText = 'Broad';
    this.#addTypeSelection(broad);

    const slim = document.createElement('button');
    slim.innerText = 'Slim';
    this.#addTypeSelection(slim);

    this.#typeElement.append(broad, slim);

    (this.getAttribute('type') === 'slim' ? slim : broad)
    .classList.add('type-selected');

    shadowRoot.append(
      linkElement,
      this.#skinElement,
      this.#nameElement,
      this.#typeElement,
    );

    const attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const attributeValue = this.getAttribute(mutation.attributeName);

          switch(mutation.attributeName) {
            case 'skin':
              if (this.#skinViewer.address !== attributeValue) {
                this.#skinViewer.address = attributeValue;
                this.#skinViewer.generate(this.getAttribute('type'))
                .then((url) => {
                  this.#skinElement.src = url;
                });
              }
              break;
            case 'name':
              if (this.#nameElement.value !== attributeValue) {
                this.#nameElement.value = attributeValue;
              }
              break;
            case 'type':
              if (this.#skinViewer.address !== attributeValue) {
                this.#skinViewer.generate(attributeValue)
                .then((url) => {
                  this.#skinElement.src = url;
                });
              }
              break;
          }
        }
      }
    });

    attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: ['skin', 'name', 'type']
    });
  }

  get skin() {
    return this.getAttribute('skin') || '';
  }

  set skin(value) {
    this.setAttribute('skin', value);
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value) {
    this.setAttribute('name', value);
  }

  get type() {
    return this.getAttribute('type') || 'broad';
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
      button.classList.add('type-selected');
      (button.nextElementSibling || button.previousElementSibling).classList
      .remove('type-selected');
    });
  }
}

customElements.define('skin-info', SkinInfo);

export default SkinInfo;
