module.exports = function(regl, data, size) {
  return (Array(2)).fill().map(() =>
    regl.framebuffer({
      color: regl.texture({
        radius: size,
        data: data,
        type: 'float',
        // We need nearest to ensure we don't interpolate between values
        mag: 'nearest',
        min: 'nearest'
      }),
      depthStencil: false
    }))
}