import React from 'react'
import Item from './Item'


export default class InputOutput extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    var listInput = this.props.d.inputs.map(function(a){
      return <Item item={a.item} qty={a.qty} showName={false}></Item>
    })
    var listOutput = this.props.d.outputs.map(function(a){
      return <Item item={a.item} qty={a.qty} showName={false}></Item>
    })

    var addToPlanet = this.props.planet ? <button onClick={this.handleAddToPlanet}>Add IO to {this.props.planet.name}</button> : null

    return (
      <div>
        <h3>Inputs :</h3>
        <ul>
          {listInput}
        </ul>
        <div className='clearfix'></div>
        <h3>Outputs :</h3>
        <ul>
          {listOutput}
        </ul>
        <div className='clearfix'></div>
        {addToPlanet}
      </div>
    )
  }

  handleAddToPlanet = (e) => {
    var {inputs, outputs} = this.props.d
    this.props.onAdd({inputs, outputs, planet : this.props.planet})
  }
}
