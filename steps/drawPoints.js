const mat4 = require('gl-mat4')
const out = mat4.create()
module.exports = function(regl, opts) {
  const camera = opts.camera
  const points = opts.points
  const positionFbos = opts.positions
  return regl({
    primitive: 'points',
    blend: {
      enable: false,
      func: {
        src: 'one',
        dst: 'one'
      },
      equation: {
        rgb: 'add',
        alpha: 'add'
      },
    },
    depth: {
      enable: false
    },
    frag: `
      precision mediump float;
      uniform vec4 color;
      varying float vIndex;
      void main() {
        gl_FragColor = vec4(192.0 / 255.0, 161.0 / 255.0, 94.0 / 255.0, 0.21);
      }`,

    vert: opts.drawStep || `
      precision mediump float;
      attribute float index;
      uniform float time;
      uniform sampler2D positions;
      uniform float dataSize;
      varying float vIndex;
      uniform mat4 proj;
      uniform mat4 model;
      uniform mat4 view;
      void main() {
        float offset = index / 10.0;
        
        vec2 posDataPosition = vec2(
          mod(index, dataSize) / dataSize,
          floor(index / dataSize) / dataSize
        );
        vec4 pos = texture2D(positions, posDataPosition);
        vec4 mvpPos = proj * view * vec4(pos.x, pos.y, pos.z, 1.0);
        gl_Position = mvpPos;
        gl_PointSize = 1.0;
        vIndex = index;
      }`,

    attributes: {
      index: regl.buffer(points)
    },

    uniforms: {
      // This defines the color of the triangle to be a dynamic variable
      time: regl.prop('time'),
      positions: ({tick}) => positionFbos[tick % 2],
      dataSize: regl.prop('dataSize'),
      proj: ({viewportWidth, viewportHeight}) =>
        mat4.perspective([],
          Math.PI / 2,
          viewportWidth / viewportHeight,
          0.01,
          1000),
      model: mat4.identity([]),
      view: () => camera.view()
    },

    // This tells regl the number of vertices to draw in this command
    count: points.length
  })
}