import React from 'react'
import getUid from 'get-uid'
import './PlanetList.css'
import Button from './Button'


export default class Planets extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      newName : '',
      imgId : 0
    }
  }

  render () {
    var planets = this.props.d.map((planet) => {
      var selected = this.props.selected ? planet.id === this.props.selected.id : false
      return <PlanetCard name={planet.name}imgId={planet.imgId} selected={selected} onClick={this.handleSelect} key={planet.id} id={planet.id}></PlanetCard>
    })
    var {imgId} = this.state
    return (
      <div className='max-w-md'>
        <h3 className="text-xl">Planets</h3>
        <div className="p-5 flex-auto flex space-x-3">
          <img className='h-12 w-12 cursor-pointer' src={'/planets/planet-'+imgId+'.png'} alt="Planet type" onClick={this.handleClick} title='shift + click to go back'></img>
          <input 
            className='border border-transparent  flex-1 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
            value={this.state.newName} onChange={e => this.setState({ newName : e.target.value})}>
          </input>
          <Button onClick={this.handleAdd}>Add</Button>
        </div>
        <ul className='p-3'>{planets}</ul>
      </div>
    )
  }

  handleAdd = (e) => {
    this.props.onPlanetAdd({id: getUid(), name: this.state.newName, imgId : this.state.imgId})
  }

  handleSelect = (planetId) => {
    this.props.onPlanetSelect(planetId)
  }

  handleClick = (e) => {
    var modifier = e.getModifierState('Shift')
    var imgId = modifier ? this.state.imgId - 1 : this.state.imgId + 1
    if(imgId > 13){
      imgId = 0
    }
    if(imgId < 0){
      imgId = 13
    }
    this.setState({
      imgId
    })
  }
}


function PlanetCard(props){
  var selectedClass = 'bg-purple-50'
  var className = props.selected ? selectedClass : null
  return (
    <div className={'p-2 m-0.5 mx-auto bg-white cursor-pointer shadow-md flex items-center space-x-4 hover:bg-purple-100 '+className} onClick={(e) => props.onClick(props.id)}>
      <div className="flex-shrink-0">
        <img className='h-12 w-12' src={'/planets/planet-'+props.imgId+'.png'} alt="Planet type"></img>
      </div>
      <div>
        <div className="text-md font-medium text-black">{props.name}</div>
      </div>
    </div>
  )
}
