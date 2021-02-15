const materials = require('./materials.json')
const factories = require('./factories.json')


/**
 * return all materials needed for the production of this material
 * @param {String} material name
 * @param {Number} qty per second
 * @param {Array} chain production chain array
 * @param {Integer} depth
 */
function getProductionChain(material, qty, chain, depth) {
  console.log(material, depth)
  chain = chain ? chain : []
  depth = depth ? depth + 1 : 1
  qty = qty ? qty : 1

  if (depth > 20) return 
  
  material = getMaterialDetails(material)
  material.qty = qty
  material.depth = depth

  chain.push(material)

  if(material.recipes){
    var recipe = material.recipes[0]
  
    for (var i=0; i < recipe.materials.length; i++) {
      var neededMaterial = recipe.materials[i][1]
      var neededQuantity = recipe.materials[i][0] * qty
  
      getProductionChain(neededMaterial, neededQuantity, chain, depth)
    }
  }

  return chain
}

/**
 * Return material info
 * @param {String} material 
 */
function getMaterialDetails(materialName) {
  material = materials.find(function (a) {
    if (a.name === materialName) {
      return true
    }
  })

  if(!material){
    return { name : materialName }
  }
  return clone(material)
}

function mergeProductionChain(chain) {
  var newChain = []
  for(var i=0; i<chain.length; i++) {
    var material = chain[i];
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
    
    var factory;
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

var chain = getProductionChain('conveyor mkI', 3)
var mergedChain = mergeProductionChain(chain)
var productionChain = addNeededFactories(mergedChain)
console.log('MERGED')
console.dir(productionChain, { depth: null })