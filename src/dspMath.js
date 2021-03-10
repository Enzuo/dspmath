const ITEMS = require('./data/items.json')
const factories = require('./data/factories.json')
const RECIPES   = require('./data/recipes.json')


/**
 * return all items needed for the production of one item
 * @param {String} itemName name
 * @param {Number} qtyDemand
 * @param {Array} chain production chain array
 * @param {Integer} depth
 * @param {Integer} demandNode
 */
var nodeId = 0;
function computeProductionChain(itemName, qtyDemand, options, chain, depth, demandNodeId) {
  console.log('addProductionChain', itemName)
  chain = chain ? chain : []
  depth = depth ? depth + 1 : 1
  var id = ++nodeId
  var remoteProducedItems = options ? options.remoteProducedItems : [];
  
  if(!qtyDemand) {
    return chain
  }
  
  if (depth > 20) {
    return
  } 
  

  // TODO move down, merge with remoteProduced items ?
  var {recipe, itemIndex} = getRecipeForItem(itemName)

  var supplyNodes = []
  if(demandNodeId){
    supplyNodes.push({
      id : demandNodeId,
      qty : qtyDemand,
      item : itemName
    })
  }


  var node = {
    id,
    depth,
    recipe,
    qtyRecipe : qtyDemand,
    produces : [{ item : getItemDetails(itemName), qty : qtyDemand }],
    supplyNodes,
  }

  chain.push(node)

  // Item not produced here
  if(remoteProducedItems.find(a => a === itemName)){
    return chain
  }




  if (recipe.input) {
    var qtyMadePerRecipe = recipe.output[itemIndex][0]
    var qtyRecipe = qtyDemand / qtyMadePerRecipe

    node.qtyRecipe = qtyRecipe

    // Multi output recipe
    var producedItems = []
    for(var j=0; j< recipe.output.length; j++){
      producedItems.push({
        item : getItemDetails(recipe.output[j][1]),
        qty : recipe.output[j][0] * qtyRecipe,
      })
    }
    node.produces = producedItems
  
    for (var i=0; i < recipe.input.length; i++) {
      let itemDemand = recipe.input[i][1]
      let qtyDemand = recipe.input[i][0] * qtyRecipe

      // first find if item is produced in chain but not consumed
      qtyDemand = addSupplyFromChain(itemDemand, qtyDemand, options, chain, depth, id)
  
      computeProductionChain(itemDemand, qtyDemand, options, chain, depth, id)
    }
  }

  return chain
}

function outputForRecipe(recipe, qty){
  var producedItems = []
  for(var j=0; j< recipe.output.length; j++){
    producedItems.push({
      item : getItemDetails(recipe.output[j][1]),
      qty : recipe.output[j][0] * qty,
    })
  }
  return producedItems
}

/**
 * 
 * @param {*} itemName 
 * @param {*} qtyDemand 
 * @param {*} options 
 * @param {*} chain 
 * @param {*} depth 
 * @param {*} demandNodeId 
 * @returns {Number} qty added from current supply chain
 */
function addSupplyFromChain(itemName, qtyDemand, options, chain, depth, demandNodeId){
  // find all nodes producing this item with unused item
  // var nodes = chain.filter(node => {
  //   var item = node.items.find(item => {
  //     return item.name === itemName ? true : false
  //   })
  //   return item ? true : false
  // })

  // if(!nodes.length){
  //   return 0
  // }

  var nodes = chain.reduce((arr, node) => {   
    // cannot demand from himself TODO or can we ?
    if(demandNodeId === node.id) {
      return arr
    }

    var item = node.produces.find(a => {
      return a.item.name === itemName ? true : false
    })
    if(item){
      var qtyProduced = item.qty
      var qtyUsed = 0
      var usage = node.supplyNodes.find(a => {
        return a.item === itemName ? true : false
      })
      qtyUsed = usage ? usage.qty : 0
      var qtyUnused = qtyProduced - qtyUsed
      if(qtyUnused > 0){
        arr.push({ id : node.id, qtyUnused})
      }
    }
    return arr
  }, [])

  // add demand to found nodes with available supply
  var qtyToDemand = qtyDemand
  for(var i=0; i<nodes.length && qtyToDemand > 0; i++){
    // eslint-disable-next-line no-loop-func
    var node = chain.find(node => {
      return node.id === nodes[i].id ? true : false
    })
    var qty = Math.min(nodes[i].qtyUnused, qtyToDemand)
    node.supplyNodes.push({
      id : demandNodeId,
      qty,
      item : itemName,
    })
    qtyToDemand -= qty
  }

  // qty left to demand
  return qtyToDemand
}

/**
 * Return material info
 * @param {String} material 
 */
function getItemDetails(itemName) {
  var item = ITEMS.find(a => {
    return a.name === itemName ? true : false
  })

  if(!item){
    return { name : itemName }
  }
  return clone(item)
}

function getRecipeForItem (itemName) {
  var itemIndex
  var recipe = RECIPES.find(function(r){
    // if item is in input for the recipe we don't want to pick this recipe to produce this item (looking at you hydrogen)
    for(var i=0; i < r.input.length; i++) {
      if(r.input[i][1] === itemName){
        return false
      }
    }
    for(var j=0; j < r.output.length; j++) {
      if(r.output[j][1] === itemName){
        itemIndex = j
        return true
      }
    }
    return false
  });

  if(!recipe){
    return {recipe: {name: itemName}}
  }

  return {recipe, itemIndex}
}

function mergeProductionChainNodes(chain) {
  var newChain = []
  for(var i=0; i<chain.length; i++) {
    var node = chain[i]

    // eslint-disable-next-line no-loop-func
    var mergedNode = newChain.find((a) => {
      return a.recipe.name === node.recipe.name ? true : false
    })

    if(!mergedNode){
      mergedNode = clone(node)
      // mergedNode.depth =
      // if(mergedMaterial.feedNodeId){
      //   mergedMaterial.feedNodes = [[mergedMaterial.feedNodeId, mergedMaterial.qty]]
      // }
      // else {
      //   mergedMaterial.feedNodes = []
      // }
      newChain.push(mergedNode)
    }
    else {
      mergedNode.qtyRecipe += node.qtyRecipe
      mergedNode.depth = Math.max(mergedNode.depth, node.depth)
      mergedNode.produces = outputForRecipe(mergedNode.recipe, mergedNode.qtyRecipe)
      mergedNode.supplyNodes.concat(node.supplyNodes)
    }
    // mergedMaterial.qty += material.qty
    // mergedMaterial.depth.push(material.depth)
    // if(material.feedNodeId){
    //   mergedMaterial.feedNodes.push([material.feedNodeId, material.qty])
    // }
  }

  return newChain
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function addNeededFactories (productionChain) {
  for(var i=0; i<productionChain.length; i++) {
    var itemObj = productionChain[i]
    
    var factory
    if(itemObj.recipe){

      var recipe = itemObj.recipe
      factory = factories.find(function(a){
        if(a.type === recipe.facility){
          return true
        }
      })
      var factoryRatio = factory ? factory.ratio : 1       
      itemObj.factory = factory ? factory.name : 'unknow'

      itemObj.nbFactory = (itemObj.qty * recipe.time)/factoryRatio
    }
    
  }

  return productionChain
}


function getProductionChain(item, qty, options){
  var rawChain = computeProductionChain(item, qty, options)
  console.log("raw production chain", rawChain)

  var mergedChain = mergeProductionChainNodes(rawChain)
  var productionChain = addNeededFactories(mergedChain)
  
  console.log("merged production chain", productionChain)
  return productionChain
}

function toggleRemoteProduceItem(array, item){

  // var chainNode = chain.find(function(n){
  //   if(n.id === item.id){
  //     return true
  //   }
  // })
  // chainNode.isRemotelyProduced = true;
  var index = array.findIndex(a => a === item.name)
  if(index >= 0){
    array.splice(index, 1)
    return array
  }
  array.push(item.name)
  return array
}

function getIOFromChain(chain){
  var inputs = []
  var outputs = []
  for(var i=0; i<chain.length; i++){
    var item = chain[i]
    if(!item.feedNodes || !item.feedNodes.length){
      outputs.push(item)
      continue
    }
    // if item is fed by any other node then it's not an input
    var fedByNode = chain.find((node) => {
      for(var j=0; j<node.feedNodes.length; j++){
        if(node.feedNodes[j][0] === item.id){
          return true
        }
      }
      return false
    })
    if(!fedByNode){
      inputs.push(item)
    }
  }

  return {inputs, outputs}
}

export default {
  getProductionChain,
  toggleRemoteProduceItem,
  getIOFromChain,
}
