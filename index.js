const fit = require('canvas-fit')
const canvas = document.body.appendChild(document.createElement('canvas'))
const camera = require('./canvas-orbit-camera')(canvas)
const live = true
if (live) {
  window.addEventListener('resize', fit(canvas, window, window.devicePixelRatio), false)
} else {
  canvas.width = 2048
  canvas.height = 2048
  canvas.style.width = '1024px'
  canvas.style.height = '1024px'
}

const IGCapture = require('./igcapture')
const capturer = new IGCapture(canvas, live)
const regl = require('regl')({
  canvas: canvas,
  pixelRatio: 2,
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
const velData = require('./initializers/velocity-and-mass')(SIZE, 0)
// Set up two fbos for position, so we can read from one while we write to the other.
// This is called a pingpong buffer
const pingPongFboFromData = function(data) {
  return (Array(2)).fill().map(() =>
    regl.framebuffer({
      color: regl.texture({
        radius: SIZE,
        data: data,
        type: 'float',
        // We need nearest to ensure we don't interpolate between values
        mag: 'nearest',
        min: 'nearest'
      }),
      depthStencil: false
    }))
}
const posFbos = pingPongFboFromData(posData)
const velFbos = pingPongFboFromData(velData)

const stepVelocities = require('./steps/gravityVelocity')(regl, {
  output: velFbos,
  inputs: {
    positions: posFbos,
    velocities: velFbos
  }
})
const stepPositions = require('./steps/newton.js')(regl, {
  output: posFbos,
  inputs: {
    positions: posFbos,
    velocities: velFbos
  }
})

// Draw the points to the screen using the camera as a projection
const drawPoints = require('./steps/drawPoints')(
  regl, points, posFbos, camera)

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  camera.tick()
  stepVelocities({})
  stepPositions({})
  drawPoints({
    time: regl.now(),
    dataSize: SIZE
  })
  capturer.frameReady()
})
