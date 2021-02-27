import React from 'react'
import ItemSelect from './ItemSelect.js'
import ProductionChain from './ProductionChain.js'

import DSPMath from '../dspMath.js'


const ITEMS = require('../data/items.json')



export default class Main extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      items : ITEMS,
      productionChain : [],
      qtyWanted : 10,
      itemWanted : null
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  render(){
    return (
      <div>
        <ItemSelect items={this.state.items} onChange={this.handleSelectChange}></ItemSelect>
        <input value={this.state.qtyWanted} onChange={this.changeQtyWanted}></input>
        <ProductionChain chain={this.state.productionChain}></ProductionChain>
      </div>
    )
  }

  handleSelectChange(item){
    var chain = DSPMath.getProductionChain(item, this.state.qtyWanted)
    this.setState({
      productionChain : chain,
      itemWanted : item
    })
  }

  changeQtyWanted = (e) => {
    var qtyWanted = e.target.value
    var chain = DSPMath.getProductionChain(this.state.itemWanted, qtyWanted)
    this.setState({ 
      productionChain : chain,      
      qtyWanted : e.target.value 
    })
  }
}
