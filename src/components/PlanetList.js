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
      var selected = this.props.selected ? planet.id === this.props.selected.id : false
      // return (<li key={planet.id} data={planet.id} className={className} onClick={this.handleSelect}>{planet.name}</li>)
      return <PlanetCard name={planet.name} selected={selected} onClick={this.handleSelect} key={planet.id} id={planet.id}></PlanetCard>
    })
    return (
      <div>
        <ul className='flex p-3'>{planets}</ul>
        <input value={this.state.newName} onChange={e => this.setState({ newName : e.target.value})}></input><button onClick={this.handleAdd}>Add</button>
      </div>
    )
  }

  handleAdd = (e) => {
    console.log('add planet')
    this.props.onPlanetAdd({id: getUid(), name: this.state.newName})
  }

  handleSelect = (planetId) => {
    // var planetId = parseInt(e.target.getAttribute('data'))
    // console.log('select planet', e.target.getAttribute('data'))
    this.props.onPlanetSelect(planetId)
  }
}


function PlanetCard(props){
  var selectedClass = 'bg-purple-100'
  var className = props.selected ? selectedClass : null
  return (
    <div className={'p-3 max-w-xs mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 '+className} onClick={(e) => props.onClick(props.id)}>
      <div className="flex-shrink-0">
        <img className='h-12 w-12' src="/planets/3LXleaA.png" alt="Planet type"></img>
      </div>
      <div>
        <div className="text-xl font-medium text-black">{props.name}</div>
      </div>
    </div>
  )
}
