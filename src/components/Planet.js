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
        <li>Tower : {d.tower.name}{io}</li>
      )
    })
    return (
      <div>
        <div>{planet.name}</div>
        <ul>{towerList}</ul>
      </div>
    )
  }
}
