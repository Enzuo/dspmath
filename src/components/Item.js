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
    
    return (
      <div className="material" onClick={this.handleClick}>
        <div>
          {this.props.m.name}
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
