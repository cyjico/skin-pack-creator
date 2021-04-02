
/**
 * Abstract class that creates skin viewers.
 *
 * @class SkinViewer
 */
class SkinViewer {
  #isLowDefinition = false;
  #isStandardDefinition = false;
  #isHighDefinition = false;

  /**
   * Creates an instance of SkinViewer.
   *
   * @param {HTMLImageElement} image
   * @memberof SkinViewer
   */
  constructor(image) {
    this.imageElement = image;

    if (
      this.imageElement.width === 64 &&
      this.imageElement.height === 32
    ) {
      this.#isLowDefinition = true;
    } else if (
      this.imageElement.width === 64 &&
      this.imageElement.height === 64
    ) {
      this.#isStandardDefinition = true;
    } else if (
      this.imageElement.width === 128 &&
      this.imageElement.height === 128
    ) {
      this.#isHighDefinition = true;
    } else {
      throw new Error('Invalid skin format.');
    }
  }

  /**
   * Generate head for skin-viewing.
   *
   * @param {CanvasRenderingContext2D} context
   * @param {number} mulitplier 
   * @param {boolean} isSlimType
   * @memberof SkinViewer
   */
  #generateHead(context, multiplier, isSlimType) {
    const sSize = 16 * multiplier;
    const dx = (isSlimType ? 6 : 8) * multiplier;

    context.drawImage(
      this.imageElement,
      sSize,
      sSize,
      sSize,
      sSize,
      dx,
      0,
      sSize,
      sSize
    );
  
    context.drawImage(
      this.imageElement,
      80 * multiplier,
      sSize,
      sSize,
      sSize,
      dx,
      0,
      sSize,
      sSize
    );
  }

  /**
   * Generate torso for skin-viewing.
   *
   * @param {CanvasRenderingContext2D} context 
   * @param {number} multiplier 
   * @param {boolean} isSlimType
   * @memberof SkinViewer
   */
  #generateTorso(context, multiplier, isSlimType) {
    const sCoord = 40 * multiplier;
    const sw = 16 * multiplier;
    const sh = 24 * multiplier;
    const dx = (isSlimType ? 6 : 8) * multiplier;
    const dy = 16 * multiplier;

    context.drawImage(
      this.imageElement,
      sCoord,
      sCoord,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );

    const sy = 72 * multiplier;
    context.drawImage(
      this.imageElement,
      sCoord,
      sy,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );
  }

  /**
   * Generate right/left arm for skin-viewing.
   *
   * @param {CanvasRenderingContext2D} context 
   * @param {number} multiplier 
   * @param {boolean} isSlimType
   * @param {boolean} isRightSide
   * @memberof SkinViewer
   */
  #generateArm(context, multiplier, isSlimType, isRightSide) {
    const sw = (isSlimType ? 6 : 8) * multiplier;
    const sh = 24 * multiplier;
    const dx = (isRightSide ? 0 : (isSlimType ? 6 : 8) + 16) * multiplier;
    const dy = 16 * multiplier;

    isRightSide = isRightSide ? true : this.#isLowDefinition;

    context.drawImage(
      this.imageElement,
      (isRightSide ? 88 : 72) * multiplier,
      (isRightSide ? 40 : 104) * multiplier,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh,
    );

    context.drawImage(
      this.imageElement,
      (isRightSide ? 88 : 104) * multiplier,
      (isRightSide ? 72 : 104) * multiplier,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh,
    );
  }

  /**
   * Generate right/left arm for skin viewing.
   *
   * @param {CanvasRenderingContext2D} context 
   * @param {number} multiplier 
   * @param {boolean} isSlimType 
   * @param {boolean} isRightSide
   * 
   * @memberof SkinViewer
   */
  #generateLeg(context, multiplier, isSlimType, isRightSide) {
    const sw = 8 * multiplier;
    const sh = 24 * multiplier;
    const dx = (isSlimType ? 6 : 8) * multiplier + (isRightSide ? 0 : sw);
    const dy = 40 * multiplier;

    isRightSide = isRightSide ? true : this.#isLowDefinition;

    context.drawImage(
      this.imageElement,
      (isRightSide ? 8 : 40) * multiplier,
      (isRightSide ? 40 : 104) * multiplier,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );
    
    context.drawImage(
      this.imageElement,
      8 * multiplier,
      (isRightSide ? 72 : 104) * multiplier,
      sw,
      sh,
      dx,
      dy,
      sw,
      sh
    );
  }

  /**
   * @param {boolean} isSlimType
   * @memberof SkinViewer
   */
  generate(isSlimType) {
    const canvas = document.createElement('canvas');
    const multiplier = this.#isHighDefinition ? 1 : 0.5;
    canvas.width = ((isSlimType ? 6 : 8) * 2 + 16) * multiplier;
    canvas.height = (16 + 24 * 2) * multiplier;
    
    const context = canvas.getContext('2d');
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    this.#generateHead(context, multiplier, isSlimType);
    this.#generateArm(context, multiplier, isSlimType, true);
    this.#generateArm(context, multiplier, isSlimType, false);
    this.#generateTorso(context, multiplier, isSlimType);
    this.#generateLeg(context, multiplier, isSlimType, true);
    this.#generateLeg(context, multiplier, isSlimType, false);

    return canvas.toDataURL();
  }
}

export default SkinViewer;
