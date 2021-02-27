import React from 'react'
import ItemSelect from './ItemSelect.js'

import DSPMath from '../dspMath.js'


const ITEMS = require('../data/items.json')



export default class Main extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      items : ITEMS
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  render(){
    return (
      <div>
        <ItemSelect items={this.state.items} onChange={this.handleSelectChange}></ItemSelect>
      </div>
    )
  }

  handleSelectChange(item){
    DSPMath.getProductionChain(item, 10)
  }
}
