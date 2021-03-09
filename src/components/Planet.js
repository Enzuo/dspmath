import React from 'react'
import InputOutput from './InputOutput.js'


export default class Planet extends React.Component {

  render () {
    var planet = this.props.planet
    if(!planet) return null
    var io = planet.io || []
    var towerList = io.map((d) => {
      var io = <InputOutput d={d}></InputOutput>
      return (
        <li>{d.tower.name}{io}</li>
      )
    })
    var totalIo = mergeIO(io)
    return (
      <div>
        <div>{planet.name}</div>
        <ul>{towerList}</ul>
        Totals :
        <InputOutput d={totalIo}></InputOutput>
      </div>
    )
  }
}


function mergeIO (IOarray) {
  var mergedInputs = mergeTowersIO(IOarray, 'inputs')
  var mergedOutputs = mergeTowersIO(IOarray, 'outputs')
  var mergedIos = takeInputsFromOutputs(mergedInputs, mergedOutputs)
  return mergedIos
}

function mergeTowersIO (towerArray, key) {
  var mergedArray = []

  for(var i=0; i<towerArray.length; i++) {
    var io = towerArray[i][key]
    for(var j=0; j<io.length; j++) {
      var node = io[j]
      // eslint-disable-next-line no-loop-func
      var totalNode = mergedArray.find(a => {
        if(a.item.name === node.item.name) {
          return true
        }
        return false
      })

      if(totalNode){
        totalNode.qty += node.qty
      }
      else {
        mergedArray.push(clone(node))
      }
    }
  }

  return mergedArray
}

function takeInputsFromOutputs (inputs, outputs){
  for(var i=0; i<inputs.length; i++){
    var input = inputs[i]
    // eslint-disable-next-line no-loop-func
    var output = outputs.find(output => {
      if(output.item.name === input.item.name){
        return true
      }
      return false
    })

    if(!output) continue

    var min = Math.min(output.qty, input.qty)
    output.qty -= min;
    input.qty -= min;
  }

  inputs = inputs.filter(a => a.qty !== 0)
  outputs = outputs.filter(a => a.qty !== 0)

  return {inputs, outputs}
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
