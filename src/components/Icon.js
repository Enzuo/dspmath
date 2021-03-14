import React, { Component } from 'react'

export default class Icon extends Component {

  render() {
    var {item, size} = this.props
    size = size || 24
    if(!item.icon){
      return <div>{item.name}</div>
    }

    var spriteSize = size
    var x = item.icon[0] - 1
    var y = item.icon[1] - 1
    var left = x * spriteSize
    var top = y * spriteSize
    var iconStyle = {
      backgroundImage : 'url(icons-'+size+'.png)',
      backgroundPosition : 'left -'+left+'px top -'+top+'px',
      height: spriteSize +'px',
      width: spriteSize +'px'
    }
      
    return (
      <div className="icon" title={item.name} style={iconStyle}></div>
    )
  }
}
