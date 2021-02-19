const materials = require('./data/materials.json')
const factories = require('./data/factories.json')
const RECIPES   = require('./data/recipes.json')


/**
 * return all materials needed for the production of this material
 * @param {String} material name
 * @param {Number} qtyNeededPerSecond
 * @param {Array} chain production chain array
 * @param {Integer} depth
 */
function computeProductionChain(material, qtyNeededPerSecond, chain, depth) {
  chain = chain ? chain : []
  depth = depth ? depth + 1 : 1
  var qty = qtyNeededPerSecond ? qtyNeededPerSecond : 0

  if (depth > 20) return 
  
  var materialObj = getMaterialDetails(material)
  materialObj.name = material
  materialObj.qty = qty
  materialObj.depth = depth

  chain.push(materialObj)

  var {recipe, materialIndex} = findRecipe(material)

  if (recipe) {
    materialObj.recipe = recipe
    var qtyMadePerRecipe = recipe.output[materialIndex][0]
    var qtyMadePerSecondPerRecipe = qtyMadePerRecipe / recipe.time
    var qtyRecipeNeededPerSecond = qtyNeededPerSecond / qtyMadePerSecondPerRecipe
  
    for (var i=0; i < recipe.input.length; i++) {
      var neededMaterial = recipe.input[i][1]
      var neededQuantity = recipe.input[i][0] * qtyRecipeNeededPerSecond
  
      computeProductionChain(neededMaterial, neededQuantity, chain, depth)
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

function findRecipe (material) {
  var materialIndex
  var recipe = RECIPES.find(function(r){
    for(var j=0; j < r.output.length; j++) {
      if(r.output[j][1] === material){
        materialIndex = j
        return true
      }
    }
  });

  if(!recipe){
    return {recipe: null}
  }

  return {recipe, materialIndex}
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
      newChain.push(mergedMaterial)
      continue
    }

    mergedMaterial.qty += material.qty
    mergedMaterial.depth.push(material.depth)
  }

  return newChain
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function addNeededFactories (productionChain) {
  for(var i=0; i<productionChain.length; i++) {
    var material = productionChain[i]
    
    var factory
    if(material.recipes){
      var recipe = material.recipes[0]
      factory = factories.find(function(a){
        if(a.type === recipe.factory[0]){
          return true
        }
      })
    }
    
    var factoryRatio = factory ? factory.ratio : 1       
    
    material.factory = factory ? factory.name : 'unknow'

    // qty needed per second / ((qty per sec) * factory speed ratio)
    material.nbFactory = material.qty / ((1/material.time) * factoryRatio)
  }

  return productionChain
}


function getProductionChain(material, qty){
  var chain = computeProductionChain(material, qty)
  var mergedChain = mergeProductionChain(chain)
  var productionChain = addNeededFactories(mergedChain)

  console.log("return chainn", productionChain)
  return productionChain
}

export default {
  getProductionChain
}
