const Noise = require('noisejs')
const noise = new Noise.Noise();
window.Noise = Noise
const numTendrils = 256 // Must be power of two
const tendrilLength = 1
const irisRadius = 0.3;

const rand = (min, max) => min + (max - min) * Math.random()
module.exports = function(SIZE) {
  const numPoints = SIZE * SIZE
  const pointsPerTendril = numPoints / numTendrils
  let i = 0;
  const posData = new Array(numPoints * 4).fill(0).map(() => Math.random())
  for (let t = 0; t < numTendrils / 2; t++) {
    let rootTheta = t / (numTendrils / 2) * 2 * Math.PI
    let walkSeed = Math.random() * 3.23
    let lengthOffset = Math.random() * 0.4 - 0.3
    for (let s = 0; s < pointsPerTendril; s++) {
      let tendrilPos = s / pointsPerTendril
      let r = irisRadius + (1.0 + lengthOffset) * tendrilPos * tendrilLength 
      let theta = rootTheta + tendrilPos * 
        (noise.simplex2(walkSeed, tendrilPos) / 9 +
        noise.simplex2(walkSeed, tendrilPos * 2) / 12
        )
      let x = r * Math.cos(theta)
      let y = r * Math.sin(theta)
      let jitterX = rand(-.001, .001) * (1 - tendrilPos)
      let jitterY = rand(-.001, .001) * (1 - tendrilPos)
      posData[i * 4] = x + jitterX
      posData[i * 4 + 1] = y + jitterY
      posData[i * 4 + 2] = rand(-0.05, 0.05) * (1 - tendrilPos)
      posData[i * 4 + 3] = 1.0
      theta += (Math.random() - 0.5) * .01 * (tendrilPos)
      i++
      
      jitterX = rand(-.1, .1)
      jitterY = rand(-.1, .1)
      posData[i * 4] = x + jitterX
      posData[i * 4 + 1] = y + jitterY
      posData[i * 4 + 2] = rand(-0.2, 0.2) * (1 - tendrilPos)
      posData[i * 4 + 3] = 1.0
      theta += (Math.random() - 0.5) * .01 * (tendrilPos)
      i++
    }
  }
  console.log("Num Points", i, numPoints)
  return posData
}