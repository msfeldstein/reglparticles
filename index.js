const regl = require('regl')({
  extensions: ['OES_texture_float'],
})
// Calling regl() creates a new partially evaluated draw command
const SIZE = 32;
var points = new Array(SIZE * SIZE).fill().map((x, i) => i)
const startTime = Date.now()
const posData = require('./initializers/position')(SIZE)
const velData = require('./initializers/velocity')(SIZE)

const posTex = regl.texture({
  width: SIZE,
  height: SIZE,
  data: posData
})

const posPingPong = (Array(2)).fill().map(() =>
  regl.framebuffer({
    color: regl.texture({
      radius: SIZE,
      data: posData,
      type: 'float',
      wrap: 'repeat',
      mag: 'nearest',
      min: 'nearest'
    }),
    depthStencil: false
  }))

const stepPositions = regl({
  primitive: 'triangles',
  framebuffer: ({tick}) => posPingPong[(tick + 1) % 2],
  vert: `
    precision mediump float;
    
  `,
  
  frag: `
    precision mediump float;
    uniform sampler2D prevPosSampler;
    varying vec2 uv;
    void main() {
      vec4 prevPos = texture2D(prevPosSampler, uv);
      gl_FragColor = prevPos + vec4(0.001, 0.0, 0.0, 0.0);
    }
  `,
  vert: `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0, 1);
    }`,

  attributes: {
    position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
  },
  
  uniforms: {
    prevPosSampler: ({tick}) => posPingPong[tick % 2],
  },

  count: 6
})
const drawPoints = regl({
  primitive: 'points',
  frag: `
    precision mediump float;
    uniform vec4 color;
    varying float vIndex;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
      gl_PointSize = 4.0;
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
    posData: ({tick}) => posPingPong[tick % 2],
    dataSize: regl.prop('dataSize')
  },

  // This tells regl the number of vertices to draw in this command
  count: points.length
})

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  stepPositions({
    
  })
  drawPoints({
    time: regl.now(),
    dataSize: SIZE
  })
})