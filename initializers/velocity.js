module.exports = function(SIZE) {
  const data = new Array(SIZE * SIZE * 4).fill().map((x, i) => {
    const index = Math.floor(i / 4)
    const space = i % 4
    if (space == 0) {
      return Math.random() * 2 - 1
    } else if (space == 1) {
      return Math.random() * 2 - 1
    } else {
      return 0;
    }
  })
  return data
}