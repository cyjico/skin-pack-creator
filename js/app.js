import SkinInfo from './skin-info.js';

/**
 * @typedef ManifestJSON File that describes the skin pack.
 * @property {number} format_version
 * @property {object} header
 * @property {string} header.name
 * @property {string} header.uuid
 * @property {[1, 1, 0]} header.version
 * @property {{
 *   type: 'skin_pack',
 *   uuid: string,
 *   version: [ 1, 1, 0 ]
 * }} modules
 */

/**
 * @typedef SkinsJSON File that describes each skin of the skin pack.
 * @property {'skinpacks/skins.json'} geometry
 * @property {Object[]} skins
 * @property {string} skins[].localization_name
 * @property {'geometry.humanoid.customSlim'|
 * 'geometry.humanoid.custom'} skins[].geometry
 * @property {string} skins[].texture
 * @property {'free'} skins[].type
 * @property {string} serialize_name
 * @property {string} localization_name
 */

/** @type {{parse: (file: string) => {skinpack: string, skins: string[]}}} */
const LANG = {
  /**
   * Converts a Minecraft .lang file into a JavaScript Object.
   *
   * @param {string} file 
   * @return {{skinpack: string, skins: string[]}}
   */
  parse(file) {
    /** @type {{skinpack: string, skins: string[]}} */
    const result = {skinpack: '', skins: []};

    file.split('\n').forEach((value) => {
      if (value.length <= 0) {
        return;
      }

      const indexOfEqualSign = value.indexOf('=') + 1;
      if (indexOfEqualSign <= 0) {
        return;
      }

      const definition = value.substring(indexOfEqualSign).trim();

      if (value.startsWith('skinpack', 0)) {
        result.skinpack = definition;
      } else if (value.startsWith('skin', 0)) {
        result.skins.push(definition);
      }
    });

    return result;
  },
};

(function() {
  /** @type {File[]} */
  const uploadedSkins = [];
  
  /** @type {HTMLInputElement} */
  const importElement = document.getElementById('import-skinpack');
  /** @type {HTMLInputElement} */
  const headerInputElement = document.querySelector('header > input');
  const mainElement = document.getElementsByTagName('main')[0];
  const footerElement = document.getElementsByTagName('footer')[0];
  /** @type {HTMLInputElement} */
  const uploadElement = document.getElementById('upload-skin');

  // Event Listener

  const importListener = (function() {
    return () => {
      const zip = new JSZip();

      zip.loadAsync(importElement.files[0])
      .then((contents) => {
        importElement.value = null;

        return Promise.all([
          contents.files['skins.json'].async('string'),
          contents.files['texts/en_US.lang'].async('string'),
          contents.files
        ]);
      })
      .then((values) => {
        const skins = JSON.parse(values[0]).skins;
        const en_US = LANG.parse(values[1]);

        headerInputElement.value = en_US.skinpack;

        for (let i = 0; i < skins.length; i++) {
          const filePath = skins[i].texture;

          values[2][filePath].async('blob')
          .then((blob) => {
            /** @type {SkinInfo} */
            const element = document.createElement('skin-info');
            element.skin = URL.createObjectURL(blob);
            element.type = (
              skins[i].geometry == 'geometry.humanoid.custom' ?
              'broad' : 'slim'
            );
            element.name = en_US.skins[i];

            uploadedSkins.push(new File([blob], filePath));
            mainElement.insertBefore(element, footerElement);
          });
        }
      });
    };
  })();

  const uploadListener = (function() {
    return () => {
      for (let i = 0; i < uploadElement.files.length; i++) {
        uploadedSkins.push(uploadElement.files[i]);

        /** @type {SkinInfo}  */
        const element = document.createElement('skin-info');
        element.skin = URL.createObjectURL(uploadElement.files[i]);
        
        mainElement.insertBefore(
          element,
          footerElement,
        );
      }
      
      uploadElement.value = null;
    }
  })();
  
  const downloadListener = (function() {
    /** @return {string} */
    function generateUUID() {
      if (!crypto) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      } else {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    }

    return () => {
      if (uploadedSkins.length == 0) {
        alert('No skins present in the skin pack.');
        return;
      }
  
      const zip = new JSZip();
      
      /** @type {ManifestJSON} */
      const manifestJSON = {
        format_version: 1,
        header: {
            name: document.querySelector('header > input').value,
            uuid: generateUUID(),
            version: [
                1,
                1,
                0
            ]
        },
        modules: [
            {
                type: 'skin_pack',
                uuid: generateUUID(),
                version: [
                    1,
                    1,
                    0
                ]
            }
        ]
      };
  
      if (manifestJSON.header.name.length <= 0) {
        alert('Skin pack has no name.');
        return;
      }
  
      /** @type {SkinsJSON} */
      const skinsJSON = {
        geometry: 'skinpacks/skins.json',
        skins: [],
        serialize_name: 'SkinPackCreator',
        localization_name: 'SkinPackCreator'
      };
  
      /**
       * File that describes the text of each skin in US-English.
       *
       * @type {string} 
       */
      let en_US = `skinpack.SkinPackCreator=${manifestJSON.header.name}\n`;
  
      /** @type {HTMLCollectionOf<SkinInfo>} */
      const skinInfo = document.getElementsByTagName('skin-info');
      
      for (let i = 0; i < uploadedSkins.length; i++) {
        if (skinInfo[i].name.length <= 0) {
          alert(`Skin ${i + 1} has no name.`);
          return;
        }

        skinsJSON.skins.push({
          localization_name: `Skin${i + 1}`,
          geometry: 'geometry.humanoid.custom' +
          (skinInfo[i].getAttribute('type') === 'slim' ? 'Slim' : ''),
          texture: uploadedSkins[i].name,
          type: 'free',
        });
  
        en_US += 'skin.SkinPackCreator.' +
        `${skinsJSON.skins[i].localization_name}=${skinInfo[i].name}\n`;
  
        zip.file(uploadedSkins[i].name, uploadedSkins[i]);
      }
  
      zip
      .file('manifest.json', JSON.stringify(manifestJSON))
      .file('skins.json', JSON.stringify(skinsJSON))
      .file('texts/en_US.lang', en_US)
      .generateAsync({
        type: 'blob',
        mimeType: 'application/octet-stream',
      })
      .then((content) => {
        saveAs(content, `${manifestJSON.header.name}.mcpack`)
      });
    }
  })();

  // Event Binding

  document.getElementById('import-skinpack').addEventListener(
    'change',
    importListener,
  );

  document.getElementById('upload-skin').addEventListener(
    'change',
    uploadListener,
  );

  document.getElementById('download-skin-pack').addEventListener(
    'click',
    downloadListener,
  );
})();
