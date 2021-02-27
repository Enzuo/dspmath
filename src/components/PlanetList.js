import React from 'react'

export default class Planets extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      newName : ''
    }
  }

  render () {
    var planets = this.props.d.map((planet) => {
      return (<li data={planet.name} onClick={this.handleSelect}>{planet.name}</li>)
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
    // TODO generate ids ?
    this.props.onPlanetAdd(this.state.newName)
  }

  handleSelect = (e) => {
    var planet = e.target.getAttribute('data')
    console.log('select planet', e.target.getAttribute('data'))
    this.props.onPlanetSelect(planet)
  }
}
