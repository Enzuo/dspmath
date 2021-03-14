import React, { Component } from 'react'
import MallGraph from './MallGraph.js'
import dspMath from '../dspMath.js'

import ITEMS from '../data/items.json'
import Icon from './Icon.js'


export default class Mall extends Component {
  // static defaultProps = {}

  constructor(props){
  	super(props)

    this.state = {
      data : data,
      selectedItems : items,
    }
  }
  

  render() {
    var {selectedItems} = this.state
    var data = dspMath.planMall(selectedItems)

    return (
      <div>
        <MallGraph data={data}>

        </MallGraph>
        <ItemPanel items={ITEMS} selectedItems={this.state.selectedItems} onClick={this.handleClick}></ItemPanel>
      </div>
    )
  }

  handleClick = (item) => {
    var selectedItems = dspMath.toggleItem(this.state.selectedItems, item)
    this.setState({selectedItems})
  }
}

class ItemPanel extends Component {
  
  
  render () {

    var items
    var baseSize = 24
    var padding = 4
    var colNum = 12
    var rowNum = 8
    var height = rowNum*(baseSize + padding)
    var width = colNum*(baseSize + padding)

    var itemList = ITEMS.filter((i) => {
      if(i.type === 'building'){
        return true
      }
      return false
    })

    var itemIcons = itemList.map(i => {
      var selected = this.props.selectedItems.includes(i.name) ? true : false
      var selectedClass = selected ? 'bg-purple-600' : ''
      var posX = 0
      var posY = 0
      if(i.slot){
        posX = (i.slot[1]-1) * (baseSize + padding )
        posY = (i.slot[0]-1) * (baseSize + padding )
      }
      return (
        <div className={"absolute border border-black cursor-pointer hover:bg-purple-500 "+ selectedClass} style={{top:posY, left:posX}} onClick={e => {this.handleClick(i)}}>
          <Icon item={i}></Icon>
        </div>
      )
    })

    return (
      <div className="bg-gray-800 p-3 rounded flex">
        <div className="relative" style={{height:height+'px', width:width+'px'}}>
          {itemIcons}
        </div>
      </div>
    )
  }

  handleClick = (item) => {
    if(this.props.onClick){
      this.props.onClick(item)
    }
  }
}

// import data from './data/dataGraph.json'
var items = [
  'tesla tower',
  'wireless power tower',
  'satellite substation',
  'wind turbine',
  'thermal power station',
  'solar panel',
  'conveyor belt mk.I',
  'conveyor belt mk.II',
  'conveyor belt mk.III',
  'splitter',
  'storage mk.I',
  'storage mk.II',
  'storage tank',
  'sorter mk.I',
  'sorter mk.II',
  'sorter mk.III',
  'mining machine',
  'water pump',
  'oil extractor',
  'oil refinery',
]

var data = dspMath.planMall(items)
