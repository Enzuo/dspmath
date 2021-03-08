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

    var icon = this.props.item.name
    if(item.icon){
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
      icon = (
        <div className="icon" title={this.props.item.name} style={iconStyle}></div>
      )
    }

    var name = this.props.showName ? <div>{item.name}</div> : null

    
    return (
      <div className="item">
        <div>
          {icon}
          <div title='u/s'>
            {this.props.qty}
          </div>
        </div>

        {name}
 
      </div>
    )
  }
}

