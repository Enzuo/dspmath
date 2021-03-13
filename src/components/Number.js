import React, { Component } from 'react'
import { OptsContext, getUnit, convert } from './OptsContext'

export default class Number extends Component {
  // static defaultProps = {}

  // constructor(props){
  // 	super(props)
  // }

  render() {
    let options = this.context
    let number =  this.props.children
    number = convert(number, 0, options.unitsIndex)
    number = formatNumber(number)
    return (
      <div title={getUnit(options.unitsIndex)}>{number}</div>
    )
  }
}

Number.contextType = OptsContext

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}

