import React from 'react'
import Button from './Button'
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

    var addToPlanet = this.props.planet ? <Button onClick={this.handleAddToPlanet}>Add SnD to {this.props.planet.name}</Button> : null

    return (
      <div className='io flex'>
        <div className="mr-6">
          <h3 className="mr-2">Demand</h3>
          <ul>
            {listDemand}
          </ul>
          <div className='clearfix'></div>
        </div>
        <div>
          <h3 className="mr-2">Supply</h3>
          <ul>
            {listSupply}
          </ul>
          <div className='clearfix'></div>
        </div>
        {addToPlanet}
      </div>
    )
  }

  handleAddToPlanet = (e) => {
    var {supply, demand} = this.props.d
    this.props.onAdd({supply, demand, planet : this.props.planet})
  }
}
