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
      productionChain : []
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  render(){
    return (
      <div>
        <ItemSelect items={this.state.items} onChange={this.handleSelectChange}></ItemSelect>
        <ProductionChain chain={this.state.productionChain}></ProductionChain>
      </div>
    )
  }

  handleSelectChange(item){
    var chain = DSPMath.getProductionChain(item, 10)
    this.setState({
      productionChain : chain
    })
  }
}
