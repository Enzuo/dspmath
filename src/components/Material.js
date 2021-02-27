import React from 'react'


class Material extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="material">
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
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}

export default Material
