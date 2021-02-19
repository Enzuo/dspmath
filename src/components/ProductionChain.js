import React from 'react';

import Material from './Material'
import DSPMath from '../dspMath.js'


class ProductionChain extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      chain : [],
      selectedMaterial : 'conveyor mkI'
    }

    this.handleChange = this.handleChange.bind(this);

    this.state.chain = this.pickMaterial()
  }

  render() {
    console.log('render', this.state, this.state.chain[0].depth === 1)
    const listMaterial = this.state.chain.map((material) =>
      <Material m={material} onChange={this.handleChange} isEditable={material.depth[0] === 1}></Material>
    );
    console.log('listMaterial', listMaterial)
    return (
      <ul>{listMaterial}</ul>
    )
  }
  pickMaterial () {
    // console.log(DSPMath)
    var chain = DSPMath.getProductionChain(this.state.selectedMaterial, 3)
    return chain
  }

  handleChange (newQty, obj) {
    console.log('handleChange', newQty, obj)
    if(obj){
      this.setState({ selectedMaterial : obj})
    }
    var chain = DSPMath.getProductionChain(obj || this.state.selectedMaterial, newQty)
    this.setState({ chain })
  }
}



export default ProductionChain
