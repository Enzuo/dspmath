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
        <button onClick={this.handleAddToPlanet}>Add IO to planet</button>
      </div>
    )
  }

  handleAddToPlanet = (e) => {

  }
}
