import React from 'react';

import Item from './Item'


class ProductionChain extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    var chain = this.props.chain

    const listItem = chain.map((item) =>
      <Item m={item} onClick={this.props.onItemClick}></Item>
    );
    return (
      <ul>{listItem}</ul>
    )
  }
}



export default ProductionChain
