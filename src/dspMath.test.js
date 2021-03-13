import dspMath from './dspMath'
import DSPMath from './dspMath'


test('should return the production chain for energetic graphite which use both hydrogen and refined oil', () => {

  var chain = DSPMath.getProductionChain('energetic graphite', 10)

  expect(chain.length).toBe(3)
  expect(chain[0].produces[0].item.name).toBe('energetic graphite')
  expect(chain[0].produces[0].qty).toBe(10)
  expect(chain[0].produces[1].item.name).toBe('hydrogen')
  expect(chain[0].produces[1].qty).toBe(30)

  expect(chain[1].produces[0].item.name).toBe('hydrogen')
  expect(chain[1].produces[0].qty).toBe(5)
  expect(chain[1].produces[1].item.name).toBe('refined oil')
  expect(chain[1].produces[1].qty).toBe(10)

  expect(chain[2].produces[0].item.name).toBe('crude oil')
  expect(chain[2].produces[0].qty).toBe(10)
})


test('should return the needed factories', () => {

  var chain = DSPMath.getProductionChain('steel', 0.5)
  expect(chain[0].produces[0].item.name).toBe('steel')
  expect(chain[0].produces[0].qty).toBe(0.5)
  expect(chain[0].nbFactory).toBe(2)
  
  expect(chain[1].produces[0].item.name).toBe('iron ingot')
  expect(chain[1].produces[0].qty).toBe(1.5)
  expect(chain[1].nbFactory).toBe(2)

})

test.skip('should test ', () => {
  var priorityRecipes = ["Plasma refining"]
  var remoteProducedItems = [
    "dyson sphere component",
    "quantum chip",
    "super-magnetic ring",
    "titanium alloy"
  ]
  var options = { priorityRecipes, remoteProducedItems}
  var chain = DSPMath.getProductionChain('small carrier rocket', 10, options)
  console.log(JSON.stringify(chain, null, 2))
})

test.only('should plan mall from a list of items', () => {
  var items = [
    'tesla tower',
    'wireless power tower',
    'satellite substation',
    'wind turbine',
    'thermal power station',
    'solar panel',
    'conveyor belt mk.I',
    'conveyor belt mk.II',
    'conveyor belt mk.III',
    'splitter',
    'storage mk.I',
    'storage mk.II',
    'storage tank',
    'sorter mk.I',
    'sorter mk.II',
    'sorter mk.III',
    'mining machine',
    'water pump',
    'oil extractor',
    'oil refinery',
  ]
  var plan = dspMath.planMall(items)


  console.log(plan)

})
