import React from 'react';

import Item from './Item'


class ProductionChain extends React.Component {
  constructor(props){
    super(props)
  }

  render() {



    var chain = this.props.chain

    const listItem = chain.map((node) => {
      return (
        <Node node={node} onClick={this.handleNodeClick}></Node>
      )
    }
    );
    return (
      <ul>{listItem}</ul>
    )
  }

  handleNodeClick = (node) => {
    // var node = e.currentTarget.getAttribute('data')
    // console.log('click on node', node, e.currentTarget, e.target)
    console.log('click on node', node)
    if(this.props.onNodeClick){
      this.props.onNodeClick(node)
    }
  }
}

function Node (props) {

  var node = props.node

  var factories = (
    <div>
      factories required :
      {formatNumber(node.nbFactory)}
    </div>
  )

  return (
    <div className='node' onClick={(e) => { props.onClick(node) }}>
      <Item item={node.item} qty={node.qty}></Item>
      {factories}
    </div>
  )
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}




export default ProductionChain
