module.exports = function(regl, amt) {
  return regl({
    primitive: 'triangles',
    vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0, 1);
      }
    `,
    
    frag: `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.01);
      }
    `,
    
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1
      },
      equation: {
        rgb: 'add',
        alpha: 'add'
      },
      color: [0, 0, 0, 0]
    },
    
    depth: {
      enable: false,
    },

    attributes: {
      position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
    },

    count: 6
  })
}