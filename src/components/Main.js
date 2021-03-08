import React from 'react'
import ItemSelect from './ItemSelect.js'
import ProductionChain from './ProductionChain.js'
import InputOutput from './InputOutput.js'
import Planet from './Planet.js'
import PlanetList from './PlanetList.js'
import getUid from 'get-uid'


import DSPMath from '../dspMath.js'


const ITEMS = require('../data/items.json')



export default class Main extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      items : ITEMS,
      qtyWanted : 10,
      itemWanted : null,
      remoteProducedItems : [],
      planets : JSON.parse(localStorage.getItem('planets')) || [],
      selectedPlanet : null,
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  render(){
    var remoteProducedItems = this.state.remoteProducedItems
    var productionChain = DSPMath.getProductionChain(this.state.itemWanted, this.state.qtyWanted, {remoteProducedItems})
    var io = DSPMath.getIOFromChain(productionChain)
    return (
      <div>
        <ItemSelect items={this.state.items} onChange={this.handleSelectChange}></ItemSelect>
        <input value={this.state.qtyWanted} onChange={this.handleQtyWantedChange}></input>
        <ProductionChain chain={productionChain} onNodeClick={this.handleNodeClick}></ProductionChain>
        <InputOutput d={io} onAdd={this.handleAddIO} planet={this.state.selectedPlanet}></InputOutput>
        <PlanetList d={this.state.planets} selected={this.state.selectedPlanet} onPlanetAdd={this.handlePlanetAdd} onPlanetSelect={this.handlePlanetSelect}></PlanetList>
        <Planet planet={this.state.selectedPlanet} ></Planet>
      </div>
    )
  }

  handleSelectChange(item){
    this.setState({
      itemWanted : item
    })
  }

  handleQtyWantedChange = (e) => {
    var qtyWanted = e.target.value
    this.setState({      
      qtyWanted
    })
  }

  handleNodeClick = (node) => {
    console.log('click on node', node)
    var item = node.item
    var remoteProducedItems = DSPMath.toggleRemoteProduceItem(this.state.remoteProducedItems, item)
    console.log('remote produced items : ',remoteProducedItems)
    this.setState({
      remoteProducedItems
    })
  }

  handlePlanetAdd = (planet) => {
    var planets = this.state.planets
    planets.push(planet)
    this.setState({planets})
    localStorage.setItem('planets', JSON.stringify(planets))
  }

  handlePlanetSelect = (planetId) => {
    var planet = this.state.planets.find((a) => {
      if(a.id === planetId) return true
    })
    if (planet) {
      this.setState({
        selectedPlanet : planet
      })
    }
  }

  handleAddIO = (d) => {
    var {inputs, outputs} = d
    var io = { 
      tower : {id: getUid(), name : 'tower'}, 
      inputs, 
      outputs
    }
    var planet = d.planet
    if(!planet.io){
      planet.io = []
    }
    planet.io.push(io)

    
    this.setState({
      selectedPlanet : planet
    })

    var planets = this.state.planets
    this.setState({ planets })
    localStorage.setItem('planets', JSON.stringify(planets))
  }
}
