const __ = {
  timer: Symbol('timer'),
}

const Direction_North = 0
const Direction_SE = 3
const Direction_NW = 7
/**
 * 简易的帧动画类实现
 */
export default class Animation {
  constructor(atlasImage, atlasTexture, frameNames, frameRate = 6.6) {

    this.atlasImage = atlasImage
    this.atlasTexture = atlasTexture
    this.frameNames = frameNames
    this.frames = []
    let frame;
    for (let n = 0; n < frameNames.length; n++) {
      frame = this.atlasTexture.frames[frameNames[n]];
      if (frame) {
        this.frames.push(frame);
        //console.log("pushframe: " + frameNames[n]);
      }
    }
    this.frameRate = frameRate

    this.start();
    // 当前动画是否播放中
    //this.isPlaying = false  <-- isFinished()
    // 动画是否需要循环播放
    //this.loop = false
  }

  isFinished() {
    return this.age >= this.frames.length * 1000 / this.frameRate;
  }

  start() {
    this.age = 0;
    this.currFrame = 0;
  }

  finish() {
    this.age = this.frames.length * 1000 / this.frameRate;
  }

  update(timeElapsed) {
    this.age += timeElapsed;
    //frames per second
    this.currFrame = Math.floor(this.age / 1000 * this.frameRate);
    if (this.currFrame >= this.frames.length)
      this.currFrame = this.frames.length - 1;
    if (this.currFrame < 0)
      this.currFrame = 0;
  }

  // 将播放中的帧绘制到canvas上
  render(ctx, x, y, direction, width = 0, height = 0) {
    this.renderFrame(
      ctx,
      this.frames[this.currFrame],
      x,
      y,
      direction,
      width == 0 ? this.frames[this.currFrame].width : width,
      height == 0 ? this.frames[this.currFrame].height : height
    )
  }

  //----private methods -------------------------
  renderFrame(ctx, frame, x, y, direction, width, height) {
    ctx.drawImage(
      this.atlasImage,
      frame.x,
      frame.y + direction * this.atlasTexture.maxFrameHeight,
      frame.width,
      frame.height,
      frame.offsetX + x - this.atlasTexture.maxFrameWidth / 2,
      frame.offsetY + y - this.atlasTexture.maxFrameHeight / 2,
      width,
      height
    )
  }

}