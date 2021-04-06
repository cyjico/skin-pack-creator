import SkinViewer from "./skin-viewer.js";

/**
 * Information about the Minecraft skin.
 *
 * @class SkinInfo
 */
class SkinInfo {
  /** @type {HTMLDivElement} */
  #skinContainer;
  /** @type {string} */
  #skin;

  /** @type {HTMLInputElement} */
  #nameElement;

  /** @type {HTMLDivElement} */
  #typeContainer;

  /**
   * Creates an instance of SkinInfo.
   *
   * @param {string|HTMLImageElement} skin
   * @param {string} [name='']
   * @param {string} [type='broad']
   * @memberof SkinInfo
   */
  constructor(skin, name = "", type = "broad") {
    // skin-container
    this.#skinContainer = document.createElement("div");
    this.#skinContainer.classList.add("skin-container");

    this.#skin = skin instanceof Image ? skin.src : skin;

    {
      const skinElement = document.createElement("img");

      const skinRemover = document.createElement("button");
      skinRemover.innerText = "Remove";
      skinRemover.addEventListener("click", () => {
        this.#skinContainer.remove();
        this.#nameElement.remove();
        this.#typeContainer.remove();
      });

      this.#skinContainer.append(skinElement, skinRemover);
    }

    // name-element
    this.#nameElement = document.createElement("input");
    this.#nameElement.placeholder = "Name";
    this.#nameElement.classList.add("name-element");
    this.#nameElement.spellcheck = false;
    this.#nameElement.type = "text";
    this.#nameElement.value = name;

    // type-container
    this.#typeContainer = document.createElement("div");
    this.#typeContainer.classList.add("type-container");

    {
      const broad = document.createElement("button");
      broad.innerText = "Broad";
      this.#bindTypeSelectionEvent(broad);

      const slim = document.createElement("button");
      slim.innerText = "Slim";
      this.#bindTypeSelectionEvent(slim);

      if (type === "broad") {
        broad.classList.add("type-selected");
      } else {
        slim.classList.add("type-selected");
      }

      this.#typeContainer.append(broad, slim);
    }

    this.#updateSkinContainer();
  }

  /**
   * @type {[HTMLDivElement, HTMLInputElement, HTMLDivElement]}
   * @readonly
   * @memberof SkinInfo
   */
  get elements() {
    return [this.#skinContainer, this.#nameElement, this.#typeContainer];
  }

  get skin() {
    return this.#skin;
  }

  set skin(value) {
    this.#skin = value;
    this.#updateSkinContainer();
  }

  get name() {
    return this.#nameElement.value;
  }

  set name(value) {
    this.#nameElement.value = value;
  }

  get type() {
    return this.#typeContainer.firstElementChild.classList.contains(
      "type-selected",
    )
      ? "broad"
      : "slim";
  }

  set type(value) {
    switch (value) {
      case "broad":
        this.#typeContainer.firstElementChild.click();
        break;
      case "slim":
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
  #bindTypeSelectionEvent(button) {
    button.addEventListener("click", () => {
      button.classList.add("type-selected");
      (
        button.nextElementSibling || button.previousElementSibling
      ).classList.remove("type-selected");

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
    SkinViewer.generate(this.skin, this.type)
      .then((url) => {
        this.#skinContainer.firstElementChild.src = url;
      });
  }
}

export default SkinInfo;
