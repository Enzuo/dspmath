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
        <Node node={node} onClick={this.handleNodeClick} onItemClick={this.handleItemClick} onRecipeClick={this.handleRecipeClick} opts={this.props.opts}></Node>
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
    // if(this.props.onNodeClick){
    //   this.props.onNodeClick(node)
    // }
  }

  handleItemClick = (item) => {
    console.log('click on item', item)
    if(this.props.onRemoveItem){
      this.props.onRemoveItem(item)
    }
  }

  handleRecipeClick = (recipe) => {
    console.log('click on recipe', recipe)
    if(this.props.onPickRecipe){
      this.props.onPickRecipe(recipe)
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

  var items = node.produces.map(p => <Item item={p.item} qty={p.qty} onClick={props.onItemClick}></Item>)

  var recipes
  if (node.allRecipes && node.allRecipes.length > 1){
    recipes = node.allRecipes.map(r => {
      var inputs = r.input.map(a => '  ' + a[0] + ' '+ a[1])
      var selected = props.opts.priorityRecipes.includes(r.name) ? 'selected' : ''
      return <li className={selected} title={r.name + inputs} onClick={(e) => { props.onRecipeClick(r) }}>⚙️</li>
    })
  }

  return (
    <div className='node' onClick={(e) => { props.onClick(node) }}>
      {items}
      {factories}
      {recipes}
      <div className='clearfix'></div>
    </div>
  )
}

function formatNumber (nb) {
  return parseFloat(nb).toFixed(2).replace(/[.,]00$/, "")
}




export default ProductionChain
