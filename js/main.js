import Character from './player/character'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Settings from './runtime/settings'

let ctx = canvas.getContext('2d')

const UpdateRate = 6.6

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    //console.log('constructor....')

    // 维护当前requestAnimationFrame的id
    this.renderLoopId = 0
    this.updateInterval = 1000 / UpdateRate

    this.bg = new BackGround(ctx)
    this.settings = new Settings(ctx)
    this.character = new Character(ctx, "paladin")

    //.......
    this.restart()

    // 初始化事件监听
    this.initEvent()
  }


  restart() {
    //console.log('restart....')
    this.lastRenderTime = new Date().getTime()

    this.bindloopUpdate = this.loopUpdate.bind(this)
    if (this.updateTimer)
      clearInterval(this.updateTimer)
    this.updateTimer = setInterval(
      this.bindloopUpdate,
      this.updateInterval
    )

    this.bindloopRender = this.loopRender.bind(this)
    if (this.renderLoopId !=0)
      // 清除上一局的动画
      window.cancelAnimationFrame(this.renderLoopId);
    this.renderLoopId = window.requestAnimationFrame(
      this.bindloopRender,
      canvas
    )
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if (x < 110 && y < 75) { //回避角色选择Panel //IMPROVE
        
        return
      } else {
        this.startX = this.x
        this.startY = this.y
        this.destX = e.touches[0].clientX - this.width / 2
        this.destY = e.touches[0].clientY - this.height / 2
        if (Math.abs(this.destX - this.startX) < 10 && Math.abs(this.destY - this.startY) < 10) {
          return
        } else {
          this.character.moveTo(x, y) //.....
        }
      }
    }).bind(this))
  }

  // 游戏逻辑更新主函数
  update(timeElapsed) {
    this.character.update(timeElapsed)
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    //console.log('render#1....')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //console.log('render#2....')
    this.bg.render()
    this.settings.render()

    //console.log('render#3....')
    this.character.render()
  }

  // 实现游戏帧循环
  loopUpdate() {
    let timeElapsed = new Date().getTime() - this.lastRenderTime
    this.lastRenderTime = new Date().getTime()
    this.update(timeElapsed)
  }

  loopRender() {
    //console.log('loopRender....')
    this.render()

    //console.log('loopRender again....')
    this.renderLoopId = window.requestAnimationFrame(
      this.bindloopRender,
      canvas
    )
  }

}