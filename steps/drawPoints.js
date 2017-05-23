module.exports = function(regl, points, positionFbos) {
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
      void main() {
        float offset = index / 10.0;
        gl_PointSize = 1.0;
        vec2 posDataPosition = vec2(
          mod(index, dataSize) / dataSize,
          floor(index / dataSize) / dataSize
        );
        vec4 pos = texture2D(posData, posDataPosition);
        gl_Position = vec4(-1.0 + pos.x * 2.0, -1.0 + pos.y * 2.0, 0.0, 1.0);
        vIndex = index;
      }`,

    attributes: {
      index: regl.buffer(points)
    },

    uniforms: {
      // This defines the color of the triangle to be a dynamic variable
      time: regl.prop('time'),
      posData: ({tick}) => positionFbos[tick % 2],
      dataSize: regl.prop('dataSize')
    },

    // This tells regl the number of vertices to draw in this command
    count: points.length
  })
}