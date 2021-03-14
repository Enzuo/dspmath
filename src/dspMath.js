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
  chain = chain ? chain : []
  depth = depth ? depth + 1 : 1
  var id = ++nodeId
  var remoteProducedItems = options ? options.remoteProducedItems : [];
  
  if(!qtyDemand) {
    return chain
  }

  if(!itemName || !itemName.length){
    return chain
  }
  
  if (depth > 20) {
    return
  } 
  

  // TODO move down, merge with remoteProduced items ?
  var {recipe, itemIndex, allRecipes} = getRecipeForItem(itemName, options)

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
    allRecipes,
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
    
    // addFactory
    var factory = getFactoryForRecipe(recipe)
    node.factory = factory
    var nbFactory = Math.ceil((qtyRecipe / factory.ratio) * recipe.time)
    node.nbFactory = nbFactory
    
    // update qtyRecipe with nb factory
    // qtyRecipe = (nbFactory * factory.ratio) / recipe.time
    node.qtyRecipe = qtyRecipe
    
    // Multi output recipe
    node.produces = outputForRecipe(recipe, qtyRecipe)
  
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

function outputForRecipe(recipe, qty, item){
  if(!recipe.output){
    return [{ item, qty }]
  }
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

  var nodes = chain.reduce((arr, node) => {   

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

function getRecipeForItem (itemName, options) {
  var allRecipes = RECIPES.filter(function(r){
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

  var priorityRecipes = options && options.priorityRecipes ? options.priorityRecipes : [];
  // pick priority recipe first
  var recipe = allRecipes.find(r => {
    return priorityRecipes.includes(r.name)
  })

  // if no priority recipe pick the first one
  if(!recipe){
    recipe = allRecipes[0]
  }

  // if no recipe item itself is the recipe
  if(!recipe){
    return {recipe: {name: itemName}}
  }

  var itemIndex = recipe.output.findIndex(a => a[1] === itemName)

  return {recipe, itemIndex, allRecipes}
}

function getFactoryForRecipe(recipe) {
  var factory = ITEMS.find(item => {
    return item.subtype === recipe.facility
  })
  if(factory){
    return factory
  }
  return {name : recipe.facility, ratio : 1}
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
      newChain.push(mergedNode)
    }
    else {
      mergedNode.qtyRecipe += node.qtyRecipe
      mergedNode.depth = Math.max(mergedNode.depth, node.depth)
      mergedNode.nbFactory += node.nbFactory
      mergedNode.produces = outputForRecipe(mergedNode.recipe, mergedNode.qtyRecipe, mergedNode.produces[0].item)
      mergedNode.supplyNodes = mergedNode.supplyNodes.concat(node.supplyNodes)
    }
  }

  return newChain
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}


function getProductionChain(item, qty, options){
  var rawChain = computeProductionChain(item, qty, options)
  // console.log("raw production chain", rawChain)
  // var filteredChain = rawChain.filter(a => {
  //   var lfItem = 'hydrogen'
  //   if(a.recipe && a.recipe.output && a.recipe.output.find(b => b[1] === lfItem)){
  //     return true
  //   }
  //   if(a.recipe && a.recipe.input && a.recipe.input.find(b => b[1] === lfItem)){
  //     return true
  //   }
  //   return false
  // })
  // console.log("raw production chain", JSON.stringify(filteredChain, null, 2))

  var productionChain = mergeProductionChainNodes(rawChain)
  
  console.log("merged production chain", productionChain)
  return productionChain
}

function toggleItem(array, item){
  var index = array.findIndex(a => a === item.name)
  if(index >= 0){
    array.splice(index, 1)
    return array
  }
  array.push(item.name)
  return array
}

function togglePriorityRecipe(array, recipe){
  return toggleItem(array, recipe)
}

function getSnDFromChain(chain){
  var supply = []
  var demand = []
  supply = chain.reduce((arr, node) => {
    var production = node.produces.reduce((productionArray, produced) => {
      var qtyUsed = node.supplyNodes.reduce((qty, n) => {
        if(n.item === produced.item.name){
          return qty + n.qty
        }
        return qty
      }, 0)
      var qtyUnused = produced.qty - qtyUsed
      if(qtyUnused > 0){
        productionArray.push({item : clone(produced.item), qty : qtyUnused})
        return productionArray
      }
      return productionArray
    }, [])
    return arr.concat(production)
  }, [])

  // remove double
  supply = supply.reduce((acc, p) => {
    var item = acc.find(sup => {
      return sup.item.name === p.item.name
    })
    if(item){
      item.qty += p.qty
      return acc
    }
    acc.push(p)
    return acc
  }, [])

  demand = chain.reduce((arr, node) => {
    // if node is supplied by any other node then it's not an input
    var suppliedBy = chain.find((n) => {
      if(!n.supplyNodes){
        return false
      }
      for(var j=0; j<n.supplyNodes.length; j++){
        if(n.supplyNodes[j].id === node.id){
          return true
        }
      }
      return false
    })
    if(!suppliedBy){
      var production = node.produces[0]
      arr.push({ item : clone(production.item), qty : production.qty})
    }
    return arr
  }, [])

  return { supply, demand }
}

function planMall(items){
  var recipesList = items.map(i => {
    return getRecipeForItem(i)
  })

  var nodes = []
  nodes = recipesList.reduce((acc, r) => {
    var {recipe} = r
    var id = recipe.output[0][1]
    acc.push({id, type : 'building'})
    recipe.input.forEach(inp => {
      if(!acc.find(a => a.id === inp[1])){
        acc.push({id : inp[1], type : 'element'})
      }
    })
    return acc
  }, [])

  // Add icons
  nodes = nodes.map(a => {
    var item = getItemDetails(a.id)
    if(item){
      a.icon = item.icon
    }
    return a
  })

  var links = []
  links = recipesList.reduce((acc, r) => {
    var {recipe} = r
    recipe.input.forEach(inp => {
      acc.push({ source: recipe.output[0][1] , target: inp[1] })
    })
    return acc
  }, [])

  // var neededItems = recipesList.reduce((acc, d) => {
  //   return acc.concat(d.recipe.input)
  // }, [])
  console.log(nodes)
  return {nodes , links}
}

export default {
  getProductionChain,
  toggleItem,
  toggleRemoteProduceItem : toggleItem,
  togglePriorityRecipe,
  getSnDFromChain,
  planMall,
}
