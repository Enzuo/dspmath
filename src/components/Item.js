import React from 'react'


export default class Item extends React.Component {
  static defaultProps = {
    showFactories : true
  }
  constructor(props){
    super(props)
  }

  render() {

    var factories = (
      <div>
        factories required :
        {formatNumber(this.props.m.nbFactory)}
      </div>
    )
    if(this.props.showFactories === false){
      factories = null
    }

    var item = this.props.m.item

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
        <div class="icon" style={iconStyle}></div>
      )
    }


    
    return (
      <div className="material" onClick={this.handleClick}>
        {icon}
        <div>
          {item.name}
        </div>
        <div>
          {this.props.m.qty} u/s 
        </div>
        {factories}
      </div>
    )
  }

  handleClick = (e) => {
    if(this.props.onClick) {
      this.props.onClick(this.props.m)
    }
  }
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}
