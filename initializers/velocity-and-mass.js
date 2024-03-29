// Generates random velocities of from -range / 2 to +range / 2
// [velX, velY, velZ, mass]
module.exports = function(SIZE, range) {
  const data = new Array(SIZE * SIZE * 4).fill().map((x, i) => {
    const index = Math.floor(i / 4)
    const space = i % 4
    if (space == 0) {
      return Math.random() * range - range * 0.5
    } else if (space == 1) {
      return Math.random() * range - range * 0.5
    } else if (space == 2){
      return Math.random() * range - range * 0.5
    } else if (space == 3){
      // return Math.floor(Math.random() * 5) / 5 + Math.random() * .05;
      // strange attractor interval
      return Math.random()
    }
  })
  return data
}