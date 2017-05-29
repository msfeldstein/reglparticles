const datastep = require('./steps/datastep')
const PingPongBuffer = require('./PingPongBuffer')
const RandomInitializer = require('./initializers/random')

class ParticleSystem {
  constructor(regl, opts) {
    this.regl = regl
    this.camera = opts.camera
    this.size = opts.size || 128
    this.points = new Array(this.size * this.size).fill().map((x, i) => i)
    this.fbos = {}
    for (let name in opts.buffers) {
      let bufferData = opts.buffers[name]
      if (bufferData === true) {
        bufferData = RandomInitializer(this.size)
      }
      this.fbos[name] = PingPongBuffer(regl, bufferData, this.size)
    }
    this.stepPrograms = []
    opts.steps.forEach((step) => {
      this.stepPrograms.push(new datastep(regl, {
        output: this.fbos[step.output],
        inputs: this.fbos
      }, step.src))
    })
    
    // Draw the points to the screen using the camera as a projection
    this.drawPoints = require('./steps/drawPoints')(regl, {
      points: this.points,
      positions: this.fbos.positions,
      camera: this.camera,
      drawStep: opts.drawStep
    })
  }
  
  draw() {
    this.stepPrograms.forEach((f) => f({}))
    
    this.drawPoints({
      time: this.regl.now(),
      dataSize: this.size
    })
  }
  
  createPingPongBuffer(data) {
    
  }
}

module.exports = ParticleSystem