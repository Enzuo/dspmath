import React from 'react'
import ItemSelect from './ItemSelect.js'
import ProductionChain from './ProductionChain.js'
import InputOutput from './InputOutput.js'

import DSPMath from '../dspMath.js'


const ITEMS = require('../data/items.json')



export default class Main extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      items : ITEMS,
      // productionChain : [],
      qtyWanted : 10,
      itemWanted : null,
      remoteProducedItems : [],
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
        <InputOutput d={io}></InputOutput>
      </div>
    )
  }

  handleSelectChange(item){
    // var chain = DSPMath.getProductionChain(item, this.state.qtyWanted)
    this.setState({
      itemWanted : item
    })
  }

  handleQtyWantedChange = (e) => {
    var qtyWanted = e.target.value
    // var chain = DSPMath.getProductionChain(this.state.itemWanted, qtyWanted)
    this.setState({      
      qtyWanted : e.target.value 
    })
  }

  handleItemClick = (item) => {
    console.log('click on ', item)
    var remoteProducedItems = DSPMath.toggleRemoteProduceItem(this.state.remoteProducedItems, item)
    this.setState({
      remoteProducedItems
    })
  }
}
