import SkinPack from "./skin-pack.js";
import SkinInfo from "./skin-info.js";

(function () {
  const skinPack = new SkinPack(document.querySelector("header > input"));

  /** @type {HTMLInputElement} */
  const importElement = document.getElementById("import-skinpack");
  /** @type {HTMLInputElement} */
  const uploadElement = document.getElementById("upload-skin");

  const mainElement = document.getElementsByTagName("main")[0];
  const footerElement = document.getElementsByTagName("footer")[0];

  // Event Listener

  function uploadListener() {
    for (let i = 0; i < uploadElement.files.length; i++) {
      const elements = skinPack.upload(
        uploadElement.files[i],
        new SkinInfo(URL.createObjectURL(uploadElement.files[i])),
      );

      mainElement.insertBefore(elements[0], footerElement);
      mainElement.insertBefore(elements[1], footerElement);
      mainElement.insertBefore(elements[2], footerElement);
    }

    uploadElement.value = null;
  }

  async function downloadListener() {
    await skinPack.download();
  }

  async function importListener() {
    await skinPack.import(importElement.files[0], (elements) => {
      mainElement.insertBefore(elements[0], footerElement);
      mainElement.insertBefore(elements[1], footerElement);
      mainElement.insertBefore(elements[2], footerElement);
    });

    importElement.value = null;
  }

  // Event Binding

  document
    .getElementById("upload-skin")
    .addEventListener("change", uploadListener);

  document
    .getElementById("download-skin-pack")
    .addEventListener("click", downloadListener);

  document
    .getElementById("import-skinpack")
    .addEventListener("change", importListener);
})();
