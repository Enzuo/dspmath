import React from 'react';

class Material extends React.Component {
  constructor(props){
    super(props)
    console.log('Material constructor')
    // var unitPerSecond = props.m.qty || 1
    this.state = { 
      unitPerSecond : null,
      unitPerMinute : null,
    }

    this.handleUnitPerMinute = this.handleUnitPerMinute.bind(this);
    this.handleUnitPerSecond = this.handleUnitPerSecond.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
  }
  render() {
    var unitPerMinute = this.props.m.qty * 60
    var unitPerSecond = this.props.m.qty

    var MyInput = function (props) {
      if(props.isEditable){
        return <input type={props.number} name={props.name} value={props.value} onChange={props.onChange} onBlur={props.onBlur}></input>
      }
      return <span>{props.value}</span>
    }
    return (
      <div className="Element">
        <div>
          {this.props.m.name}
        </div>
        <div>
          u/min <MyInput type="number" name="unitPerMinute" value={unitPerMinute} onChange={this.handleUnitPerMinute} onBlur={this.handleQtyChange} isEditable={this.props.isEditable}></MyInput>
        </div>
        <div>
          u/s <MyInput type="number" name="unitPerSecond" value={unitPerSecond} onChange={this.handleUnitPerSecond} onBlur={this.handleQtyChange} isEditable={this.props.isEditable}></MyInput>
        </div>
        <div>
          factories required :
          {formatNumber(this.props.m.nbFactory)}
        </div>
      </div>
    )
  }
  handleUnitPerMinute (e) {
    // this.setState({
    //   unitPerSecond : formatNumber(e.target.value / 60),
    //   unitPerMinute : e.target.value
    // })
    var newQty = e.target.value / 60
    // this.props.onChange(newQty)
  }
  
  handleUnitPerSecond (e) {
    var newQty = e.target.value
    // console.log(newQty)
    this.props.onChange(newQty)
  }

  handleQtyChange () {
    // this.props.onChange(this.state.unitPerSecond)
  }
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}

export default Material
