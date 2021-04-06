import SkinPack from "./skin-pack.js";
import SkinInfo from "./skin-info.js";
import SkinViewer from "./skin-viewer.js";
import alertModal from "./alert-modal.js";

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
      const fileName = uploadElement.files[i].name;
      const image = document.createElement('img');
      image.src = URL.createObjectURL(uploadElement.files[i]);

      image.onload = () => {
        const format = SkinViewer.getImageFormat(image);
        if (format.length <= 0) {
          alertModal(`"${fileName}" is an invalid Minecraft skin.`);
        } else {
          const elements = skinPack.upload(
            uploadElement.files[i],
            new SkinInfo(image),
          );

          mainElement.insertBefore(elements[0], footerElement);
          mainElement.insertBefore(elements[1], footerElement);
          mainElement.insertBefore(elements[2], footerElement);
        }
      }
    }

    uploadElement.value = null;
  }

  function downloadListener() {
    skinPack.download().catch();
  }

  function importListener() {
    skinPack
      .import(importElement.files[0], (elements) => {
        mainElement.insertBefore(elements[0], footerElement);
        mainElement.insertBefore(elements[1], footerElement);
        mainElement.insertBefore(elements[2], footerElement);
      })
      .catch();

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
