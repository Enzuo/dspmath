import React from 'react'
import ItemSelect from './ItemSelect.js'
import ProductionChain from './ProductionChain.js'
import InputOutput from './InputOutput.js'
import PlanetList from './PlanetList.js'

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
      planets : [],
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
        <ProductionChain chain={productionChain} onItemClick={this.handleItemClick}></ProductionChain>
        <InputOutput d={io} onAdd={this.handleAddIO} planet={this.state.selectedPlanet}></InputOutput>
        <PlanetList d={this.state.planets} selected={this.state.selectedPlanet} onPlanetAdd={this.handlePlanetAdd} onPlanetSelect={this.handlePlanetSelect}></PlanetList>
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

  handleItemClick = (item) => {
    console.log('click on ', item)
    var remoteProducedItems = DSPMath.toggleRemoteProduceItem(this.state.remoteProducedItems, item)
    this.setState({
      remoteProducedItems
    })
  }

  handlePlanetAdd = (name) => {
    this.state.planets.push({name})
    this.setState({
      planets : this.state.planets
    })
  }

  handlePlanetSelect = (planet) => {
    this.setState({
      selectedPlanet : planet
    })
  }

  handleAddIO = (io) => {

  }
}
