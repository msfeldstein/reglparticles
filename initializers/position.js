module.exports = function(SIZE) {
  const posData = new Array(SIZE * SIZE * 4).fill().map((x, i) => {
    const index = Math.floor(i / 4)
    const space = i % 4
    if (space == 0) {
      // x
      let x = index % SIZE
      x = x / SIZE
      return x
    } else if (space == 1) {
      // y
      let y = Math.floor(index / SIZE)
      y = y / SIZE
      return y
    } else if (space == 2) {
      // z
      return Math.random();
    } else if (space == 3) {
      // w
      return 1.0
    }
    return 0
  })
  return posData
}