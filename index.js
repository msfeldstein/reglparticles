const fit = require('canvas-fit')
const canvas = document.body.appendChild(document.createElement('canvas'))
const camera = require('canvas-orbit-camera')(canvas)
window.addEventListener('resize', fit(canvas, window, window.devicePixelRatio), false)

// datastep pulls all the logic for running a processing step on data encoded 
// in a texture, you just need to supply the fragment shader.
const datastep = require('./datastep')

const regl = require('regl')({
  canvas: canvas,
  // We need float textures to store position data in a texture.
  // Float textures will be 0.0-1.0 instead of byte textures which are 0-255.
  extensions: ['OES_texture_float'],
  attributes: {
    premultipliedAlpha: false
  }
})

// This should be a power of two since we're using a texture to hold the data
// The actual amount of points is SIZE squared
const SIZE = 1024;
const points = new Array(SIZE * SIZE).fill().map((x, i) => i)
// Initialize an array with all the points positions (xyz) and slightly random 
// value for attractor interval or mass (w)
const posData = require('./initializers/position')(SIZE)
// Set up two fbos for position, so we can read from one while we write to the other.
// This is called a pingpong buffer
const posFbos = (Array(2)).fill().map(() =>
  regl.framebuffer({
    color: regl.texture({
      radius: SIZE,
      data: posData,
      type: 'float',
      // We need nearest to ensure we don't interpolate between values
      mag: 'nearest',
      min: 'nearest'
    }),
    depthStencil: false
  }))

// Run the strange attractor code in a fragment shader
const stepPositions = datastep(regl, posFbos, `
  precision mediump float;
  uniform sampler2D prevData;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(prevData, uv);
    float sigma = 4.0;
    float rho = 10.0;
    float beta = 0.30;
    float interval = pos.w;
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;
    float newx = x - sigma * x * interval + sigma * y * interval;
    float newy = y + rho * x * interval - y * interval - pos.z * x * interval;
    float newz = z - beta * z * interval + (x * y) * interval;
    
    gl_FragColor = vec4(newx, newy, newz, pos.w);
  }
`)

// Draw the points to the screen using the camera as a projection
const drawPoints = require('./steps/drawPoints')(
  regl, points, posFbos, camera)

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  camera.tick()
  stepPositions({})
  drawPoints({
    time: regl.now(),
    dataSize: SIZE
  })
})

// window.addEventListener('mousemove', function(e) {
//   mouseX = e.clientX / window.innerWidth
//   mouseY = 1 - e.clientY / window.innerHeight
// })