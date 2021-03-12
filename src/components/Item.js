import React from 'react'
import Icon from './Icon'


export default class Item extends React.Component {
  static defaultProps = {
    showName : true
  }
  constructor(props){
    super(props)
  }

  render() {

    var item = this.props.item

    var name = this.props.showName ? <div>{item.name}</div> : null

    
    return (
      <div className="item" onClick={this.handleClick}>
        <div>
          <Icon item={item}></Icon>
          <div title='u/s'>
            {this.props.qty}
          </div>
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

