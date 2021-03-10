import DSPMath from './dspMath'


test('should return the production chain for energetic graphite which use both hydrogen and refined oil', () => {

  var chain = DSPMath.getProductionChain('energetic graphite', 10)
  console.log(JSON.stringify(chain, null, 2))

})


test('should return the needed factories', () => {

  var chain = DSPMath.getProductionChain('steel', 0.5)
  console.log(JSON.stringify(chain, null, 2))

  var SnD = DSPMath.getSnDFromChain(chain)
  console.log(JSON.stringify(SnD, null, 2))
})

test.only('should compute hydrogen', () => {

  var chain = DSPMath.getProductionChain('information matrix', 10)
  // console.log(JSON.stringify(chain, null, 2))

})
