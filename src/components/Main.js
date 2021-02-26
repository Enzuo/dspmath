import itemSelect from "./ItemSelect"
import React from 'react'
import ItemSelect from './ItemSelect.js'

const ITEMS = require('../data/items.json')



export default class Main extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      items : ITEMS
    }
  }

  render(){
    return (
      <div>
        <ItemSelect items={this.state.items}></ItemSelect>
      </div>
    )
  }
}
