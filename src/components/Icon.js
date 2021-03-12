import React, { Component } from 'react'

export default class Icon extends Component {
  // static defaultProps = {}

  // constructor(props){
  // 	super(props)
  // }

  render() {
    var {item} = this.props
    if(!item.icon){
      return <div>{item.name}</div>
    }
    
    var spriteSize = 24
    var x = item.icon[0] - 1
    var y = item.icon[1] - 1
    var left = x * spriteSize
    var top = y * spriteSize
    var iconStyle = {
      backgroundImage : 'url(icons-24.png)',
      backgroundPosition : 'left -'+left+'px top -'+top+'px',
      height: spriteSize +'px',
      width: spriteSize +'px'
    }
      
    return (
      <div className="icon" title={item.name} style={iconStyle}></div>
    )
  }
}
