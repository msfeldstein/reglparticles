// Step forward a ste of fbos using a fragment shader with
// previous data in a 'prevData' sampler
module.exports = function(regl, fbos, shader, uniforms) {
  return regl({
    primitive: 'triangles',
    framebuffer: ({tick}) => fbos[(tick + 1) % 2],
    vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0, 1);
      }
    `,
    
    frag: shader,

    attributes: {
      position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
    },
    
    uniforms: Object.assign({
      prevData: ({tick}) => fbos[tick % 2],
    }, uniforms),

    count: 6
  })
}