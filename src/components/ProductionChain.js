import React from 'react';

import Material from './Material'


class ProductionChain extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    var chain = this.props.chain

    const listMaterial = chain.map((material) =>
      <Material m={material}></Material>
    );
    return (
      <ul>{listMaterial}</ul>
    )
  }
}



export default ProductionChain
