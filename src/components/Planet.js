import React from 'react'
import SupplyDemand from './SupplyDemand.js'


export default class Planet extends React.Component {

  render () {
    var planet = this.props.planet
    if(!planet) return null
    var SnD = planet.SnD || []
    var towerList = SnD.map((d) => {
      var io = <SupplyDemand d={d}></SupplyDemand>
      return (
        <div className='m-2 p-6 mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4'>
          <div>
            <div className="text-left text-xl font-medium text-black">{d.tower.name}</div>
            <div className="text-gray-500">{io}</div>
          </div>
          
        </div>
      )
    })
    var totalSnD = mergeSnD(SnD)
    return (
      <div className="flex-1">
        <h3 className='text-xl'>{planet.name}</h3>
        <ul>{towerList}</ul>
        <div className='m-2 p-6 mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4'>
          <div className="text-gray-500">
            <SupplyDemand d={totalSnD}></SupplyDemand>
          </div>
        </div>
      </div>
    )
  }
}


function mergeSnD (IOarray) {
  var mergedDemand = mergeTowersSnD(IOarray, 'demand')
  var mergedSupply = mergeTowersSnD(IOarray, 'supply')
  var mergedIos = takeDemandFromSupply(mergedSupply, mergedDemand)
  return mergedIos
}

function mergeTowersSnD (towerArray, key) {
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

function takeDemandFromSupply (supply, demand){
  for(var i=0; i<demand.length; i++){
    var dm = demand[i]
    // eslint-disable-next-line no-loop-func
    var sup = supply.find(output => {
      if(output.item.name === dm.item.name){
        return true
      }
      return false
    })

    if(!sup) continue

    var min = Math.min(sup.qty, dm.qty)
    sup.qty -= min;
    dm.qty -= min;
  }

  demand = demand.filter(a => a.qty !== 0)
  supply = supply.filter(a => a.qty !== 0)

  return {demand, supply}
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
