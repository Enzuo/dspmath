import React, { Component } from 'react'
import MallGraph from './MallGraph.js'
import dspMath from '../dspMath.js'

export default class Mall extends Component {
  // static defaultProps = {}

  constructor(props){
  	super(props)

    this.state = {
      data : data
    }
  }
  

  render() {
    var {data} = this.state
    return (
      <div>
        <MallGraph data={data}>

        </MallGraph>

      </div>
    )
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
