import React from 'react'


export default class Item extends React.Component {
  static defaultProps = {
    showName : true
  }
  constructor(props){
    super(props)
  }

  render() {

    var item = this.props.item

    var icon = ''
    if(item.icon){
      var spriteSize = 64
      var x = item.icon[0] - 1
      var y = item.icon[1] - 1
      var left = x * spriteSize
      var top = y * spriteSize
      var iconStyle = {
        backgroundImage : 'url(icons.png)',
        backgroundPosition : 'left -'+left+'px top -'+top+'px',
        height: '64px',
        width: '64px'
      }
      icon = (
        <div className="icon" style={iconStyle}></div>
      )
    }


    
    return (
      <div className="item">
        {icon}
        <div>
          {item.name}
        </div>
        <div>
          {this.props.qty} u/s 
        </div>
      </div>
    )
  }
}

