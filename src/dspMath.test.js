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


test.only('should return the needed factories', () => {

  var chain = DSPMath.getProductionChain('steel', 0.5)
  expect(chain[0].produces[0].item.name).toBe('steel')
  expect(chain[0].produces[0].qty).toBe(0.5)
  expect(chain[0].nbFactory).toBe(2)
  
  expect(chain[1].produces[0].item.name).toBe('iron ingot')
  expect(chain[1].produces[0].qty).toBe(1.5)
  expect(chain[1].nbFactory).toBe(2)

})

test('should merge ', () => {

  var chain = DSPMath.getProductionChain('information matrix', 10)
  // console.log(JSON.stringify(chain, null, 2))

})
