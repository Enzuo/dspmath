import React from 'react'
import Item from './Item'


export default class InputOutput extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    var listInput = this.props.d.inputs.map(function(a){
      return <Item m={a} showFactories={false}></Item>
    })
    var listOutput = this.props.d.outputs.map(function(a){
      return <Item m={a} showFactories={false}></Item>
    })

    var addToPlanet = this.props.planet ? <button onClick={this.handleAddToPlanet}>Add IO to {this.props.planet.name}</button> : null

    return (
      <div>
        Inputs :
        <ul>
          {listInput}
        </ul>
        Outputs :
        <ul>
          {listOutput}
        </ul>
        {addToPlanet}
      </div>
    )
  }

  handleAddToPlanet = (e) => {
    var {inputs, outputs} = this.props.d
    this.props.onAdd({inputs, outputs, planet : this.props.planet})
  }
}
