import React from 'react'
import getUid from 'get-uid'
import './PlanetList.css'


export default class Planets extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      newName : ''
    }
  }

  render () {
    var planets = this.props.d.map((planet) => {
      var className = this.props.selected ? planet.id === this.props.selected.id ? 'selected' : null : null
      return (<li key={planet.id} data={planet.id} className={className} onClick={this.handleSelect}>{planet.name}</li>)
    })
    return (
      <div>
        <ul>{planets}</ul>
        <input value={this.state.newName} onChange={e => this.setState({ newName : e.target.value})}></input><button onClick={this.handleAdd}>Add</button>
      </div>
    )
  }

  handleAdd = (e) => {
    console.log('add planet')
    this.props.onPlanetAdd({id: getUid(), name: this.state.newName})
  }

  handleSelect = (e) => {
    var planetId = parseInt(e.target.getAttribute('data'))
    console.log('select planet', e.target.getAttribute('data'))
    this.props.onPlanetSelect(planetId)
  }
}