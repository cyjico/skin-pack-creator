
/**
 * @typedef LANG An instrinc object that parses `.lang` Minecraft files.
 * @property {(file: string) => {skinPack: string, skins: string[]}} parse
 */

/**
 * @type {LANG}
 */
 const LANG = {
  parse(file) {
    const result = {skinPack: '', skins: []};

    file.split('\n').forEach((value) => {
      const indexOfEqualSign = value.indexOf('=') + 1;

      if (value.length <= 0 || indexOfEqualSign <= 0) {
        return;
      }
      
      const definition = value.substring(indexOfEqualSign).trim();

      if (value.startsWith('skinpack', 0)) {
        result.skinPack = definition;
      } else if (value.startsWith('skin', 0)) {
        result.skins.push(definition);
      }
    });

    return result;
  },
};

export default LANG;
