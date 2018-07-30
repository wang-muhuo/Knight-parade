export default class Atlas {
  constructor(m_x, m_y, m_width, m_height, m_offsetX, m_offsetY, m_name)
  {


    this.m_x = m_x
    this.m_y = m_y
    this.m_width = m_width
    this.m_height = m_height
    this.m_offsetX = m_offsetX
    this.m_offsetY = m_offsetY
    this.m_name = m_name
  }
  readJson () {
    var postjson = require('../runtime/atlas')
    var JSONobject=JSON.parse(postjson)
    this.m_name = JSONobject.getString("name")
    this.m_x = JSONobject.getString("x")
    this.m_y = JSONobject.getString("y")
    this.m_width = JSONobject.getString("width")
    this.m_height = JSONobject.getString("height")
     // offset: based on the largest frame's width/height - this frame's width / height, otherwise sprite will "jump" in animation
    this.moffsetX = JSONobject.getString("offsetX")
    this.moffsetY = JSONobject.getString("offsetY")
     this.render = function (x, y) {
    //IMPROVE: sprite-related attribute: currDirection.
    context.drawImage(
      atlasImage,
      this.m_x,
      this.m_y + currDirection * atlasTexture.m_maxFrameHeight,
      this.m_width,
      this.m_height,
      this.m_offsetX + x - atlasTexture.m_maxFrameWidth / 2, 
      this.m_offsetY + y - atlasTexture.m_maxFrameHeight / 2,
      this.m_width, 
      this.m_height
      );
  }

  
  }

 
  

  
 
};