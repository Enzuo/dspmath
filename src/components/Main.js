import React from 'react'
import ItemSelect from './ItemSelect.js'
import ProductionChain from './ProductionChain.js'
import SupplyDemand from './SupplyDemand.js'
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
      priorityRecipes : [],
      planets : JSON.parse(localStorage.getItem('planets')) || [],
      selectedPlanet : null,
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  render(){
    var {remoteProducedItems, priorityRecipes} = this.state
    var opts = {remoteProducedItems, priorityRecipes}
    var productionChain = DSPMath.getProductionChain(this.state.itemWanted, this.state.qtyWanted, opts)
    var SnD = DSPMath.getSnDFromChain(productionChain)
    return (
      <div>
        <ItemSelect items={this.state.items} onChange={this.handleSelectChange}></ItemSelect>
        <input value={this.state.qtyWanted} onChange={this.handleQtyWantedChange}></input>
        <div className='mb-10'>
          <ProductionChain chain={productionChain} onNodeClick={this.handleNodeClick} onRemoveItem={this.handleRemoveItem} onPickRecipe={this.handlePickRecipe} opts={opts}></ProductionChain>
          <SupplyDemand d={SnD} onAdd={this.handleAddSnD} planet={this.state.selectedPlanet}></SupplyDemand>
        </div>
        <div className='flex'>
          <PlanetList d={this.state.planets} selected={this.state.selectedPlanet} onPlanetAdd={this.handlePlanetAdd} onPlanetSelect={this.handlePlanetSelect}></PlanetList>
          <Planet planet={this.state.selectedPlanet} ></Planet>
        </div>
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

  handleRemoveItem = (item) => {
    var remoteProducedItems = DSPMath.toggleRemoteProduceItem(this.state.remoteProducedItems, item)
    this.setState({
      remoteProducedItems
    })
  }

  handlePickRecipe = (recipe) => {
    var priorityRecipes = DSPMath.togglePriorityRecipe(this.state.priorityRecipes, recipe)
    this.setState({
      priorityRecipes
    })
  } 

  handlePlanetAdd = (planet) => {
    var planets = this.state.planets
    planet.idTower = 0
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

  handleAddSnD = (d) => {
    var {supply, demand} = d
    var planet = d.planet
    var id = ++planet.idTower
    var SnD = { 
      tower : {id: id, name : 'tower '+id}, 
      supply,
      demand, 
    }
    if(!planet.SnD){
      planet.SnD = []
    }
    planet.SnD.push(SnD)

    
    this.setState({
      selectedPlanet : planet
    })

    var planets = this.state.planets
    this.setState({ planets })
    localStorage.setItem('planets', JSON.stringify(planets))
  }
}
