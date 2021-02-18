import React from 'react';

class Material extends React.Component {
  constructor(props){
    super(props)
    console.log('Material constructor')
    // var unitPerSecond = props.m.qty || 1
    this.state = { 
      unitPerSecond : this.props.m.qty,
      unitPerMinute : this.props.m.qty * 60,
    }

    this.handleUnitPerMinute = this.handleUnitPerMinute.bind(this);
    this.handleUnitPerSecond = this.handleUnitPerSecond.bind(this);
  }
  render() {
    var unitPerSecond = formatNumber(this.props.m.qty)
    var unitPerMinute = formatNumber(this.props.m.qty * 60)
    if (this.props.isEditable) {
      unitPerSecond = this.state.unitPerSecond
      unitPerMinute = this.state.unitPerMinute
    }

    return (
      <div className="material">
        <div>
          {this.props.m.name}
        </div>
        <div>
          u/min <EditableField type="number" name="unitPerMinute" value={unitPerMinute} onChange={this.handleUnitPerMinute} isEditable={this.props.isEditable}></EditableField>
        </div>
        <div>
          u/s <EditableField type="number" name="unitPerSecond" value={unitPerSecond} onChange={this.handleUnitPerSecond} isEditable={this.props.isEditable}></EditableField>
        </div>
        <div>
          factories required :
          {formatNumber(this.props.m.nbFactory)}
        </div>
      </div>
    )
  }
  handleUnitPerMinute (e) {
    var newQty = e.target.value
    this.setState({
      unitPerSecond : formatNumber(newQty / 60),
      unitPerMinute : newQty
    })
    this.props.onChange(newQty/60)
  }
  
  handleUnitPerSecond (e) {
    var newQty = e.target.value
    this.setState({
      unitPerSecond : newQty,
      unitPerMinute : formatNumber(newQty * 60)
    })
    this.props.onChange(newQty)
  }
  
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}

export default Material


class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value)
  }

  handleBlur(e) {
    this.props.onBlur()
  }

  render() {
    if(this.props.isEditable){
      return <input type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} onBlur={this.props.onBlur}></input>
    }
    return <span>{this.props.value}</span>
  }
}
