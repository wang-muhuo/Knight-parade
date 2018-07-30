import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/background.jpg'
const BG_WIDTH     = 1448
const BG_HEIGHT    = 1016

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT) //IMPROVE: 不需Sprite

    this.ctx = ctx
    this.render(this.ctx)

    this.top = 0
  }

  update() {
    this.top += 2

    if ( this.top >= screenHeight )
      this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      screenWidth,
      screenHeight
    )

  }
}
