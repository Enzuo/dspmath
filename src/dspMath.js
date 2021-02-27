const materials = require('./data/materials.json')
const factories = require('./data/factories.json')
const RECIPES   = require('./data/recipes.json')


/**
 * return all items needed for the production of one item
 * @param {String} itemName name
 * @param {Number} qtyNeeded
 * @param {Array} chain production chain array
 * @param {Integer} depth
 * @param {Integer} feedNode
 */
var nodeId = 0;
function computeProductionChain(itemName, qtyNeeded, options, chain, depth, feedNodeId) {
  chain = chain ? chain : []
  depth = depth ? depth + 1 : 1
  qtyNeeded = qtyNeeded ? qtyNeeded : 0
  var id = ++nodeId

  if (depth > 20) return 
  
  var itemObj = {} // getMaterialDetails(itemName)
  itemObj.id = id
  itemObj.name = itemName
  itemObj.qty = qtyNeeded
  itemObj.depth = depth
  itemObj.feedNodeId = feedNodeId

  chain.push(itemObj)

  if(options){
    var remoteProducedItems = options.remoteProducedItems
    if(remoteProducedItems.find(a => a === itemName)){
      return chain
    }
  }

  var {recipe, itemIndex} = getRecipeForItem(itemName)

  if (recipe) {
    // time : 2 , out : 1, need : 2
    itemObj.recipe = recipe

    var qtyMadePerRecipe = recipe.output[itemIndex][0]
    // var qtyMadePerSecondPerRecipe = qtyMadePerRecipe / recipe.time
    var qtyRecipeNeeded = qtyNeeded / qtyMadePerRecipe
  
    for (var i=0; i < recipe.input.length; i++) {
      var neededMaterial = recipe.input[i][1]
      var neededQuantity = recipe.input[i][0] * qtyRecipeNeeded //* qtyRecipeNeededPerSecond
  
      computeProductionChain(neededMaterial, neededQuantity, options, chain, depth, id)
    }
  }

  return chain
}

/**
 * Return material info
 * @param {String} material 
 */
function getMaterialDetails(materialName) {
  var material = materials.find(function (a) {
    if (a.name === materialName) {
      return true
    }
  })

  if(!material){
    return { name : materialName }
  }
  return clone(material)
}

function getRecipeForItem (itemName) {
  var itemIndex
  var recipe = RECIPES.find(function(r){
    for(var j=0; j < r.output.length; j++) {
      if(r.output[j][1] === itemName){
        itemIndex = j
        return true
      }
    }
  });

  if(!recipe){
    return {recipe: null}
  }

  return {recipe, itemIndex}
}

function mergeProductionChain(chain) {
  var newChain = []
  for(var i=0; i<chain.length; i++) {
    var material = chain[i]

    var mergedMaterial = newChain.find(function(a){
      if (a.name === material.name) {
        return true
      }
    })

    if(!mergedMaterial){
      mergedMaterial = clone(material)
      mergedMaterial.depth = [mergedMaterial.depth]
      mergedMaterial.feedNodes = [[mergedMaterial.feedNodeId, mergedMaterial.qty]]
      newChain.push(mergedMaterial)
      continue
    }

    mergedMaterial.qty += material.qty
    mergedMaterial.depth.push(material.depth)
    mergedMaterial.feedNodes.push([material.feedNodeId, material.qty])
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

  var mergedChain = mergeProductionChain(rawChain)
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
    array.splice(index)
    return array
  }
  array.push(item.name)
  return array
}

export default {
  getProductionChain,
  toggleRemoteProduceItem,
}
