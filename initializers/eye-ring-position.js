// [
//   radius
//   speed
//   unused
//   unused
// ]
const Noise = require('noisejs')
const noise = new Noise.Noise();
window.Noise = Noise
module.exports = function(SIZE) {
  const posData = new Array(SIZE * SIZE * 4).fill().map((x, i) => {
    const index = Math.floor(i / 4)
    const space = i % 4
    if (space == 0) {
      let r = Math.random() * 0.3 + 0.7;
      if (noise.perlin2(0.3, r * 30) > 0) {
        r += 1.0;
      }
      return r;
    } else if (space == 1) {
      return Math.random() + 0.3
    
    } else if (space == 2) {
      return 0;
    } else if (space == 3) {
      // w
      return 0.005 + Math.random()
    }
    return 0
  })
  return posData
}