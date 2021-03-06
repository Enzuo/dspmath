import React from 'react'
import Icon from './Icon'
import Number from './Number'


export default class Item extends React.Component {
  static defaultProps = {
    showName : true
  }

  render() {

    var item = this.props.item

    var name = this.props.showName ? <div>{item.name}</div> : null

    
    return (
      <div className="mr-1 ml-1" onClick={this.handleClick}>
        <div>
          <Icon item={item}></Icon>
          <Number>{this.props.qty}</Number>
        </div>

        {name}
 
      </div>
    )
  }

  handleClick = () => {
    if(this.props.onClick){
      return this.props.onClick(this.props.item)
    }
  }
}

