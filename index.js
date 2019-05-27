const ParticleSystem = require('./ParticleSystem')
const TWEEN = require('tween.js')
const Fade = require('./fade')
const Blit = require('./copy-to-screen')

module.exports = function(canvas) {
  // const camera = require('./canvas-orbit-camera')(canvas)
  const camera = require('./auto-rotate-camera')(1)


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

  const initialState = require('./initializers/blackhole/initialize')(SIZE, 1)

  const tendrils = new ParticleSystem(regl, {
    size: SIZE,
    camera: camera,
    buffers: {
      positions: initialState.position,
      velocities: initialState.velocity
    },
    steps: [
      {
        src: require('./steps/shader-steps/blackhole-gravity'),
        output: 'velocities',
      },
      {
        src: require('./steps/shader-steps/newton'),
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
    // regl.clear({
    //   color: [0, 0, 0, 255],
    //   depth: 1
    // })
    fbo.use(function() {
      camera.tick()
      fadeProgram()
      tendrils.draw()
    })
    blitProgram()
    
  })

}
