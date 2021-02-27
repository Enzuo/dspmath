import React from 'react'


class Item extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="material" onClick={this.handleClick}>
        <div>
          {this.props.m.name}
        </div>
        <div>
          {this.props.m.qty} u/s 
        </div>
        <div>
          factories required :
          {formatNumber(this.props.m.nbFactory)}
        </div>
      </div>
    )
  }

  handleClick = (e) => {
    this.props.onClick(this.props.m)
  }
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}

export default Item
