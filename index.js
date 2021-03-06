const ParticleSystem = require('./ParticleSystem')
const TWEEN = require('tween.js')
const Fade = require('./fade')
const Blit = require('./copy-to-screen')

const Particles = function(canvas) {
  const camera = require('./canvas-orbit-camera')(canvas)
  // const camera = require('./auto-rotate-camera')(1)


  const regl = require('regl')({
    canvas: canvas,
    // We need float textures to store position data in a texture.
    // Float textures will be 0.0-1.0 instead of byte textures which are 0-255.
    extensions: ['OES_texture_float', 'WEBGL_color_buffer_float'],
    attributes: {
      premultipliedAlpha: true
    }
  })
  const fadeProgram = Fade(regl)

  const fbo = regl.framebuffer({
    width: canvas.width,
    height: canvas.height,
    colorType: 'float',
    depth: false,
    stencil: false
  })
  const blitProgram = Blit(regl, fbo)

  // This should be a power of two since we're using a texture to hold the data
  // The actual amount of points is SIZE squared
  const SIZE = 512;

  const initialState = require('./initializers/chase/initialize')(SIZE, 1)
  const tendrils = new ParticleSystem(regl, {
    size: SIZE,
    camera: camera,
    buffers: {
      targets: initialState.targets,
      positions: initialState.position,
      velocities: initialState.velocity
    },
    steps: [
      {
        src: require('./steps/shader-steps/chase/fall'),
        output: 'targets',
      },
      {
        src: require('./steps/shader-steps/chase/attract-to-targets'),
        output: 'positions',
      }
    ]
  })

  fbo.use(function() {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1
    })
  })

  regl.frame(({time}) => {
    TWEEN.update()
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1
    })
    fbo.use(function() {
      camera.tick()
      fadeProgram()
      tendrils.draw()
    })
    blitProgram()
    
  })

}
const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
document.body.style.margin = "0"
canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2
canvas.style.width = window.innerWidth + 'px'
canvas.style.height = window.innerHeight + 'px'
Particles(canvas)
module.exports = Particles