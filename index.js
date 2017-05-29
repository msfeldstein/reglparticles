const ParticleSystem = require('./ParticleSystem')
const fit = require('canvas-fit')
const canvas = document.body.appendChild(document.createElement('canvas'))

const live = true
if (live) {
  window.addEventListener('resize', fit(canvas, window, window.devicePixelRatio), false)
} else {
  canvas.width = 1080*2
  canvas.height = 1080*2
  canvas.style.width = '1080px'
  canvas.style.height = '1080px'
}
const camera = require('./canvas-orbit-camera')(canvas)

const IGCapture = require('./igcapture')
const capturer = new IGCapture(canvas, true)
const regl = require('regl')({
  canvas: canvas,
  // We need float textures to store position data in a texture.
  // Float textures will be 0.0-1.0 instead of byte textures which are 0-255.
  extensions: ['OES_texture_float'],
  attributes: {
    premultipliedAlpha: true
  }
})

// This should be a power of two since we're using a texture to hold the data
// The actual amount of points is SIZE squared
const SIZE = 512;
// const system = new ParticleSystem(regl, {
//   size: SIZE,
//   camera: camera,
//   initialPositions: require('./initializers/eye-ring-position')(SIZE),
//   positionStep : require('./steps/rings'),
//   drawStep: require('./steps/draw-eye-ring')
// })

const tendrils = new ParticleSystem(regl, {
  size: SIZE,
  camera: camera,
  buffers: {
    positions: require('./initializers/eye-tendrils-position-straight')(SIZE),
    velocities: require('./initializers/eye-tendrils-position-straight')(SIZE),
  },
  steps: [
    {
      src: require('./steps/eye-tendrils'),
      output: 'positions',
      inputs: [
        'velocities'
      ]
    }
  ]
  // positionStep : require('./steps/eye-tendrils')
})



regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1
  })
  camera.tick()
  tendrils.draw()
  capturer.frameReady()
})
