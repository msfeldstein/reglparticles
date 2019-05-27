module.exports = function(regl, texture) {
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
        varying vec2 uv;
        uniform sampler2D texture;
        void main() {
          gl_FragColor = texture2D(texture, uv);
        }
      `,
      
      depth: {
        enable: false,
      },

      uniforms: {
          texture: texture
      },
  
      attributes: {
        position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
      },
  
      count: 6
    })
  }