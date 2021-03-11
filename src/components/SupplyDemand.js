import React from 'react'
import Item from './Item'


export default class SnD extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    var listSupply = this.props.d.supply.map(function(a){
      return <Item item={a.item} qty={a.qty} showName={false}></Item>
    })
    var listDemand = this.props.d.demand.map(function(a){
      return <Item item={a.item} qty={a.qty} showName={false}></Item>
    })

    var addToPlanet = this.props.planet ? <button onClick={this.handleAddToPlanet}>Add SnD to {this.props.planet.name}</button> : null

    return (
      <div className='io'>
        <h3>Demand</h3>
        <ul>
          {listDemand}
        </ul>
        <div className='clearfix'></div>
        <h3>Supply</h3>
        <ul>
          {listSupply}
        </ul>
        <div className='clearfix'></div>
        {addToPlanet}
      </div>
    )
  }

  handleAddToPlanet = (e) => {
    var {supply, demand} = this.props.d
    this.props.onAdd({supply, demand, planet : this.props.planet})
  }
}