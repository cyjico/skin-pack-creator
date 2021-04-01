'use strict';

/** @type {File[]} */
let uploadedSkins = [];

{
  /**
   * @param {HTMLInputElement} button 
   */
  function addSkintypeSelection(button) {
    button.addEventListener('click', () => {
      button.classList.add('button-selected');
      (button.nextElementSibling || button.previousElementSibling).classList
      .remove('button-selected');
    });
  }
  
  /** @type {HTMLInputElement} */
  const skinUploader = document.getElementById('upload-skin');
  skinUploader.addEventListener('change', () => {
    const main = document.getElementsByTagName('main')[0];
    const footer = main.childNodes[main.childNodes.length - 2];

    for (let i = 0; i < skinUploader.files.length; i++) {
      uploadedSkins.push(skinUploader.files[i]);

      // skin
      const skin = document.createElement('div');
      skin.classList.add('skin');

      const skinDisplay = new Image();
      skinDisplay.src = URL.createObjectURL(skinUploader.files[i]);

      skin.appendChild(skinDisplay);

      // name
      const nameWrapper = document.createElement('div');
      nameWrapper.classList.add('skin-name');

      const nameInput = document.createElement('input');
      nameInput.placeholder = 'Skin name';
      nameInput.spellcheck = 'false';
      nameInput.type = 'text';

      nameWrapper.appendChild(nameInput);

      // type
      const outerTypeWrapper = document.createElement('div');
      outerTypeWrapper.classList.add('skin-type');

      const innerTypeWrapper = document.createElement('div');

      {
        const standardType = document.createElement('button');
        standardType.classList.add('button-selected');
        standardType.innerText = 'Standard';
        addSkintypeSelection(standardType);

        innerTypeWrapper.appendChild(standardType);

        const slimType = document.createElement('button');
        slimType.innerText = 'Slim';
        addSkintypeSelection(slimType);

        innerTypeWrapper.appendChild(slimType);
      }

      outerTypeWrapper.appendChild(innerTypeWrapper);

      main.insertBefore(skin, footer);
      main.insertBefore(nameWrapper, footer);
      main.insertBefore(outerTypeWrapper, footer);
    }
  });
}

{
  /**
   * @return {string}
   */
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

  const skinpackDownloader = document.getElementById('download-skinpack');
  skinpackDownloader.addEventListener('click', () => {
    if (uploadedSkins.length == 0) {
      alert('No skins present in the Skin pack.');
      return;
    }

    const zip = new JSZip();
    
    // manifest.json
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

    zip.file('manifest.json', JSON.stringify(manifestJSON));

    // skins.json
    const skinsJSON = {
      geometry: 'skinpacks/skins.json',
      skins: [],
      serialize_name: 'SkinpackCreator',
      localization_name: 'SkinpackCreator'
    };

    // texts/en_US.lang
    let en_US = `skinpack.SkinpackMaker=${manifestJSON.header.name}\n\n`;

    const divisonSkins = document.getElementsByClassName('skin');
    
    for (let i = 0; i < uploadedSkins.length; i++) {
      skinsJSON.skins.push({
        localization_name: 'Skin' + (i + 1).toString(),
        geometry: (divisonSkins[i].nextElementSibling.nextElementSibling
          .firstElementChild.classList.contains('selected') ?
          'geometry.humanoid.custom' : 'geometry.humanoid.customSlim'),
        texture: uploadedSkins[i].name,
        type: 'free',
      });
      
      const skinName = divisonSkins[i].nextElementSibling.firstElementChild.value;
      if (!skinName || skinName.length <= 0) {
        alert(`Skin ${i + 1} has no name.`);
        return;
      }

      en_US += `skin.SkinpackCreator.${skinsJSON.skins[i].localization_name}=${skinName}${(i === uploadedSkins.length - 1 ? '' : '\n')}`;

      zip.file(uploadedSkins[i].name, uploadedSkins[i]);
    }

    zip.file('skins.json', JSON.stringify(skinsJSON));
    zip.file('texts/en_US.lang', en_US);

    zip.generateAsync({
      type: 'blob',
      mimeType:  'application/octet-stream',
    })
    .then((content) => {
      saveAs(content, `${manifestJSON.header.name}.mcpack`);
    });
  });
}
