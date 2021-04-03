
/**
 * Class that grants the ability to view skins.
 *
 * @class SkinViewer
 */
class SkinViewer {
  /**
   * Creates an instance of SkinViewer.
   *
   * @param {string} address
   * @memberof SkinViewer
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * Generate head for skin-viewing.
   *
   * @param {HTMLImageElement} image
   * @param {CanvasRenderingContext2D} context
   * @param {number} resolutionFactor 
   * @param {number} armWidth
   * @memberof SkinViewer
   */
  #generateHead(image, context, resolutionFactor, armWidth) {
    const sSize = 16 * resolutionFactor;

    context.drawImage(
      image,
      sSize,
      sSize,
      sSize,
      sSize,
      armWidth,
      0,
      sSize,
      sSize
    );
  
    context.drawImage(
      image,
      80 * resolutionFactor,
      sSize,
      sSize,
      sSize,
      armWidth,
      0,
      sSize,
      sSize
    );
  }

  /**
   * Generate torso for skin-viewing.
   *
   * @param {HTMLImageElement} image
   * @param {CanvasRenderingContext2D} context 
   * @param {number} resolutionFactor 
   * @param {number} armWidth
   * @memberof SkinViewer
   */
  #generateTorso(image, context, resolutionFactor, armWidth) {
    const sCoord = 40 * resolutionFactor;
    const sw = 16 * resolutionFactor;
    const sh = 24 * resolutionFactor;
    const dy = 16 * resolutionFactor;

    context.drawImage(
      image,
      sCoord,
      sCoord,
      sw,
      sh,
      armWidth,
      dy,
      sw,
      sh
    );

    const sy = 72 * resolutionFactor;
    context.drawImage(
      image,
      sCoord,
      sy,
      sw,
      sh,
      armWidth,
      dy,
      sw,
      sh
    );
  }

  /**
   * Generate right/left arm for skin-viewing.
   *
   * @param {HTMLImageElement} image
   * @param {CanvasRenderingContext2D} context 
   * @param {number} resolutionFactor 
   * @param {number} armWidth
   * @param {boolean} isLowRes
   * @param {boolean} isRight
   * @memberof SkinViewer
   */
  #generateArm(image, context, resolutionFactor, armWidth, isLowRes, isRight) {
    const sh = 24 * resolutionFactor;
    const dx = (isRight ? 0 : 16 * resolutionFactor + armWidth);
    const dy = 16 * resolutionFactor;

    isRight = isRight || isLowRes;

    context.drawImage(
      image,
      (isRight ? 88 : 72) * resolutionFactor,
      (isRight ? 40 : 104) * resolutionFactor,
      armWidth,
      sh,
      dx,
      dy,
      armWidth,
      sh,
    );

    context.drawImage(
      image,
      (isRight ? 88 : 104) * resolutionFactor,
      (isRight ? 72 : 104) * resolutionFactor,
      armWidth,
      sh,
      dx,
      dy,
      armWidth,
      sh,
    );
  }

  /**
   * Generate right/left arm for skin viewing.
   *
   * @param {HTMLImageElement} image
   * @param {CanvasRenderingContext2D} context 
   * @param {number} resolutionFactor 
   * @param {number} armWidth 
   * @param {boolean} isLowRes 
   * @param {boolean} isRight
   * 
   * @memberof SkinViewer
   */
  #generateLeg(image, context, resolutionFactor, armWidth, isLowRes, isRight) {
    const sw = 8 * resolutionFactor;
    const sh = 24 * resolutionFactor;
    const dx = armWidth + (isRight ? 0 : sw);
    const dy = 40 * resolutionFactor;

    isRight = isRight || isLowRes;

    context.drawImage(
      image,
      (isRight ? 8 : 40) * resolutionFactor,
      (isRight ? 40 : 104) * resolutionFactor,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );
    
    context.drawImage(
      image,
      8 * resolutionFactor,
      (isRight ? 72 : 104) * resolutionFactor,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );
  }

  /**
   * @param {string} type
   * @return {Promise<string>}
   * @memberof SkinViewer
   */
  generate(type) {
    const image = new Image();
    image.src = this.address;

    return new Promise((resolve, reject) => {
      image.addEventListener('load', () => {
        const isLowRes = image.width === 64 && image.height === 32;
        const isHighRes = image.width === 128 && image.height === 128;
  
        if (!(isLowRes || (image.width === 64 && image.height === 64) || isHighRes)) {
          throw new Error('Invalid skin format.');
        }
  
        const canvas = document.createElement('canvas');
        const resolutionFactor = isHighRes ? 1 : 0.5;
        const armWidth = (type === 'slim' ? 6 : 8) * resolutionFactor;
        canvas.width = 16 * resolutionFactor + armWidth * 2;
        canvas.height = (16 + 24 * 2) * resolutionFactor;
        
        const context = canvas.getContext('2d');
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    
        this.#generateHead(image, context, resolutionFactor, armWidth);
        this.#generateArm(image, context, resolutionFactor, armWidth, isLowRes,
          true);
        this.#generateArm(image, context, resolutionFactor, armWidth, isLowRes,
          false);
        this.#generateTorso(image, context, resolutionFactor, armWidth)
        this.#generateLeg(image, context, resolutionFactor, armWidth, isLowRes,
          true);
        this.#generateLeg(image, context, resolutionFactor, armWidth, isLowRes,
          false);
    
        resolve(canvas.toDataURL());
      });
    }) 
  }
}

export default SkinViewer;
