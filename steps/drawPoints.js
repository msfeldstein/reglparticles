const mat4 = require('gl-mat4')

module.exports = function(regl, points, positionFbos, camera) {
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
    frag: `
      precision mediump float;
      uniform vec4 color;
      varying float vIndex;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.21);
      }`,

    vert: `
      precision mediump float;
      attribute float index;
      uniform float time;
      uniform sampler2D posData;
      uniform float dataSize;
      varying float vIndex;
      uniform mat4 proj;
      uniform mat4 model;
      uniform mat4 view;
      void main() {
        float offset = index / 10.0;
        gl_PointSize = 1.0;
        vec2 posDataPosition = vec2(
          mod(index, dataSize) / dataSize,
          floor(index / dataSize) / dataSize
        );
        vec4 pos = texture2D(posData, posDataPosition);
        gl_Position = proj * view * model * vec4(-1.0 + pos.x * 2.0, -1.0 + pos.y * 2.0, pos.z, 1.0);
        vIndex = index;
      }`,

    attributes: {
      index: regl.buffer(points)
    },

    uniforms: {
      // This defines the color of the triangle to be a dynamic variable
      time: regl.prop('time'),
      posData: ({tick}) => positionFbos[tick % 2],
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