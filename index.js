const regl = require('regl')({
  extensions: ['OES_texture_float'],
  attributes: {
    premultipliedAlpha: false
  }
})
const datastep = require('./datastep')

const SIZE = 256;
var points = new Array(SIZE * SIZE).fill().map((x, i) => i)
const startTime = Date.now()
const posData = require('./initializers/position')(SIZE)
const velData = require('./initializers/velocity-and-mass')(SIZE, 0.001)

let mouseX = 0.5
let mouseY = 0.5
const posFbos = (Array(2)).fill().map(() =>
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
  
const velFbos = (Array(2)).fill().map(() =>
  regl.framebuffer({
    color: regl.texture({
      radius: SIZE,
      data: velData,
      type: 'float',
      wrap: 'repeat',
      mag: 'nearest',
      min: 'nearest'
    }),
    depthStencil: false
  }))

const stepVelocities = datastep(regl, velFbos, `
  precision mediump float;
  varying vec2 uv;
  uniform sampler2D prevData;
  uniform sampler2D posData;
  uniform vec2 attractor;

  void main() {
    vec4 prevVel = texture2D(prevData, uv);
    vec4 pos = texture2D(posData, uv);
    vec2 delta = attractor - pos.xy;
    float dist = length(delta);
    float timeStep = 1.0 / 16.66;
    float attractorMass = 1.0;
    float pointMass = prevVel.w;
    float force = dist * dist;
    float dvdt = force / pointMass;
    vec4 vel = prevVel + vec4(delta * pow(dist, 0.5) * 0.001 * prevVel.w, 0.0, 0.0);
    vel *= 0.998; // friction
    gl_FragColor = vel;
  }
`, {
  posData: ({tick}) => posFbos[(tick) % 2],
  attractor: () => [mouseX, mouseY]
})

const stepPositions = datastep(regl, posFbos, `
  precision mediump float;
  uniform sampler2D prevData;
  uniform sampler2D velData;
  varying vec2 uv;
  void main() {
    vec4 prevPos = texture2D(prevData, uv);
    vec4 vel = texture2D(velData, uv);
    gl_FragColor = prevPos + vel;
  }
`, {
  velData: ({tick}) => velFbos[(tick) % 2]
})

const drawPoints = require('./steps/drawPoints')(regl, points, posFbos)

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  stepVelocities({
    
  })
  stepPositions({
    
  })
  drawPoints({
    time: regl.now(),
    dataSize: SIZE
  })
})

window.addEventListener('mousemove', function(e) {
  mouseX = e.clientX / window.innerWidth
  mouseY = 1 - e.clientY / window.innerHeight
})