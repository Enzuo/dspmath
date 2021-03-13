import React from 'react'

export const OptsContext = React.createContext({
  units : 'u/s'
});


export const UNITS = ['u/s', 'u/min', 'u/h']

export function convert(value ,from, to){
  from = typeof from === 'number' ? UNITS[from] : from
  to = typeof to === 'number' ? UNITS[to] : to
  value = from === 'u/min' ? value / 60 : value
  value = from === 'u/h' ? value / 3600 : value

  value = to === 'u/min' ? value * 60 : value
  value = to === 'u/h' ? value * 3600 : value
  return value
}

export function getUnit(index){
  return UNITS[index]
}
