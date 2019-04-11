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
    return Math.random() * 2 - 1
  })
  return posData
}