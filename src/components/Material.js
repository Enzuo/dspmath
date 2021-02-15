import React from 'react';

class Material extends React.Component {
  constructor(props){
    super(props)
    console.log('Material constructor')
    var unitPerSecond = props.m.qty || 1
    this.state = { 
      unitPerSecond : formatNumber(unitPerSecond), 
      unitPerMinute : formatNumber(unitPerSecond * 60)
    }

    this.handleUnitPerMinute = this.handleUnitPerMinute.bind(this);
    this.handleUnitPerSecond = this.handleUnitPerSecond.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
  }
  render() {
    return (
      <div className="Element">
        <div>
          {this.props.m.name}
        </div>
        <div>
          u/min <input type="number" name="unitPerMinute" value={this.state.unitPerMinute} onChange={this.handleUnitPerMinute} onBlur={this.handleQtyChange}></input>
        </div>
        <div>
          u/s <input type="number" name="unitPerSecond" value={this.state.unitPerSecond} onChange={this.handleUnitPerSecond} onBlur={this.handleQtyChange}></input>
        </div>
        <div>
          factories required :
          {formatNumber(this.props.m.nbFactory)}
        </div>
      </div>
    )
  }
  handleUnitPerMinute (e) {
    this.setState({
      unitPerSecond : formatNumber(e.target.value / 60),
      unitPerMinute : e.target.value
    })
  }
  
  handleUnitPerSecond (e) {
    this.setState({
      unitPerSecond : e.target.value,
      unitPerMinute : formatNumber(e.target.value * 60)
    })
  }

  handleQtyChange () {
    this.props.onChange(this.state.unitPerSecond)
  }
}

function formatNumber (nb) {
  return nb.toFixed(2).replace(/[.,]00$/, "")
}

export default Material
