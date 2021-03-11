import React, { Component } from 'react'

export default class Button extends Component {
  render() {
    return (
      <button 
      className='p-2 flex items-center justify-center rounded bg-purple-700 text-white' 
      onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
