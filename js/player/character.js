import Animation from '../base/animation'

const textureSet = require('../atlas/atlas.js').textureSet
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const Status_Stand = 0
const Status_Move = 1
const Direction_North = 0
const Direction_SE = 3
const Direction_NW = 7
const ParamDict = { //IMPROVE: use method
  paladin: {
    atlasImgSrc: "images/" + textureSet.paladin.imgFile,
    atlasTexture: textureSet.paladin,
    frameNames: {
      stand: ["stand01", "stand02", "stand03", "stand04", "stand05", "stand01"],
      move: ["move01", "move02", "move03", "move04", "move05", "move01"],
    },
    frameRate: 6.6,
    speed: 11.5  //px per update //IMPROVE
  },
  swordman: {
    atlasImgSrc: "images/" + textureSet.swordman.imgFile,
    atlasTexture: textureSet.swordman,
    frameNames: {
      stand: ["stand01", "stand02", "stand03", "stand04", "stand05", "stand01"],
      move: ["move01", "move02", "move03", "move04", "move05", "move01"],
    },
    frameRate: 6.6,
    speed: 6
  }
}

export default class Character {
  constructor(ctx, name) {
    var param = ParamDict[name]
    this.ctx = ctx

    this.width = param.atlasTexture.maxFrameWidth
    this.height = param.atlasTexture.maxFrameHeight
    this.speed = param.speed

    //IMPROVE: 应由【数据管家】管理，不要重复new Image
    var atlasImg = new Image()
    atlasImg.src = param.atlasImgSrc
    this.anim = []
    this.anim[Status_Stand] = new Animation(atlasImg, param.atlasTexture, param.frameNames.stand)
    this.anim[Status_Move] = new Animation(atlasImg, param.atlasTexture, param.frameNames.move)

    this.init()
  }

  init(){
    // 玩家默认处于屏幕底部居中位置
    this.x = canvas.width / 2 - this.width / 2
    this.y = canvas.height / 2 - this.height / 2

    this.status = Status_Stand
    this.destX = 0
    this.destY = 0
    this.currDirection = Direction_SE
    this.switchDirection = false
    //this.startX = 0  //TEMP
    //this.startY = 0

    this.currStep = 0
    this.moveStepsX = []  //下一步的相对位移
    this.moveStepsY = []

    if (this.currAnim)
      this.currAnim.finish()
    this.currAnim = this.anim[this.status]
    this.currAnim.start()
  }

  changeStatusAndAnim(status){
  if (this.status == status)
      return

    if (this.status == Status_Stand && status == Status_Move){
      this.status = status
      this.currAnim.finish()
      this.currAnim = this.anim[this.status]
      this.currAnim.start()
    }
    else if (this.status == Status_Move && status == Status_Stand) {
      this.status = status
      this.currAnim.finish()
      this.currAnim = this.anim[this.status]
      this.currAnim.start()
    }
  }

  stand() {
    //改变状态&动画、清除移动相关坐标&步进[]
    if (this.status == Status_Stand)
      return
    this.changeStatusAndAnim(Status_Stand)
    this.destX = 0
    this.destY = 0
    this.moveStepsX = []
    this.moveStepsY = []
    this.currStep = 0
  }

  moveTo(destX, destY) {
    //1.算出moveStepsX[], moveStepsY[]
    let moveDistanceX = Math.abs(destX - this.x)
    let moveDistanceY = Math.abs(destY - this.y)
    let moveDistance = Math.sqrt(moveDistanceX * moveDistanceX + moveDistanceY * moveDistanceY)
    let moveSteps = Math.floor(moveDistance / this.speed) //IMPROVE: use timeElapsed to calculate steps
    let moveStepX = ((destX - this.x > 0) ? 1 : -1) * moveDistanceX / moveSteps;
    let moveStepY = ((destY - this.y > 0) ? 1 : -1) * moveDistanceY / moveSteps;
    let i = 0
    let moveStepsX = [], moveStepsY = []
    for (i = 0; i < moveSteps; i++) {
      //NOTE: use array for future extension(e.g. path-finding). currently every step is equal.
      moveStepsX[i] = moveStepX;
      moveStepsY[i] = moveStepY;
    }

    //2.改变状态&动画、移动相关坐标&步进[]
    if (moveSteps == 0){
      this.changeStatusAndAnim(Status_Stand)
    }
    else{
      this.changeStatusAndAnim(Status_Move)
      this.destX = destX
      this.destY = destY
      this.moveStepsX = moveStepsX
      this.moveStepsY = moveStepsY
      this.currStep = 0
    }
  }

  //calculate the direction(0:North,.. 7:N-W) when moving from start to end. 
  getDirection(startX, startY, endX, endY) {
    let xDelta = (endX - startX);
    let yDelta = (endY - startY);
    let tan = (yDelta == 0) ? -1 : Math.abs(yDelta / xDelta); //PI/2:0, 0:-1
    let TAN_1 = 0.41421356; //Math.tan(Math.PI / 8);
    let TAN_2 = 2.41421356; //Math.tan(Math.PI*3 / 8);
    //alert(TAN_1 + "," + TAN_2);
    let radian = 0; //0:0, 1:PI/4, 2:PI/2
    if (tan == 0 || tan > TAN_2)
      radian = 2;
    else if (tan > TAN_1 && tan < TAN_2)
      radian = 1;
    else
      radian = 0;

    if (xDelta > 0 && yDelta > 0) {
      return (radian == 0) ? 2 : ((radian == 1) ? 3 : 4);
    } else if (xDelta < 0 && yDelta > 0) {
      return (radian == 0) ? 6 : ((radian == 1) ? 5 : 4);
    } else if (xDelta < 0 && yDelta < 0) {
      return (radian == 0) ? 6 : ((radian == 1) ? 7 : 0);
    } else if (xDelta > 0 && yDelta < 0) {
      return (radian == 0) ? 2 : ((radian == 1) ? 1 : 0);
    }
  }
   //Randomly change direction during Stand status.
  calcRandomDirection(){
    let MAX_RAND = 10
    let randNum = Math.random() * MAX_RAND + 0
    //console.log("randNum: " + randNum)
    if (this.switchDirection && this.currAnim != null ) {
        if (Math.random() > 0.5) {
          if (++this.currDirection > Direction_NW) 
            this.currDirection = Direction_North;
        }
        else {
          if (--this.currDirection < Direction_North) 
            this.currDirection = Direction_NW;
        }
        this.switchDirection = false;
    } else if (!this.switchDirection && (randNum < MAX_RAND * 0.1)) {
        this.switchDirection = true;
    }
  }

  //IMPROVE 有效区域判断
  isInArea(testx, testy) {
    if (testx < 0 || testx > 680 || testy < 60 || testy > 320) {  //IMPRVE
      return false
    }

    let vertx = [0, 140, 680, 680, 320, 250, 0]
    let verty = [60, 60, 260, 320, 320, 200, 190]
    let i = 0
    let j = 0
    let nvert = 7
    let c = false
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (((verty[i] > testy) != (verty[j] > testy)) &&
        (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
        c = !c;
    }
    return c;
  }

  update(timeElapsed) {
    //1.状态、坐标变更
    if(this.status == Status_Move){
      if (this.currStep == 0) {
        this.currDirection = this.getDirection(this.x, this.y, this.destX, this.destY);
        //console.log("")
      }
      //IMPROVE: 补边界判断：isInArea
      
      let nextX = Math.floor(this.x + this.moveStepsX[this.currStep]);
      let nextY = Math.floor(this.y + this.moveStepsY[this.currStep]);
      if (!this.isInArea(nextX, nextY)) {
        this.stand()
      }
      else{
        this.x = nextX
        this.y = nextY
        this.currStep++;
        if (this.currStep == this.moveStepsX.length)
          this.stand();
      }
    }
    else if (this.status == Status_Stand && this.currAnim.isFinished()) {
      this.calcRandomDirection();
    }
    if (this.currAnim.isFinished())
      this.currAnim.start()
    
    //2.动画帧更新
    this.currAnim.update(timeElapsed)
  }

  render(){
    this.currAnim.render(this.ctx, this.x, this.y, this.currDirection)
  }
}