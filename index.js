const ParticleSystem = require('./ParticleSystem')
const fit = require('canvas-fit')
const canvas = document.body.appendChild(document.createElement('canvas'))
const camera = require('./canvas-orbit-camera')(canvas)
const live = true
if (live) {
  window.addEventListener('resize', fit(canvas, window, window.devicePixelRatio), false)
} else {
  canvas.width = 1080*2
  canvas.height = 1080*2
  canvas.style.width = '1080px'
  canvas.style.height = '1080px'
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
const SIZE = 512;
const system = new ParticleSystem(regl, {
  size: 512,
  camera: camera,
  initialPositions: require('./initializers/rings-position')(SIZE),
  initialVelocities: require('./initializers/rings-position')(SIZE, 0),
  velocityStep : require('./steps/rings'),
  positionStep : require('./steps/rings')
  
})



regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  camera.tick()
  system.draw()
  capturer.frameReady()
})
