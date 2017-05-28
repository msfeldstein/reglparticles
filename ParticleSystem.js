const datastep = require('./steps/datastep')
const PingPongBuffer = require('./PingPongBuffer')
class ParticleSystem {
  constructor(regl, opts) {
    this.regl = regl
    this.camera = opts.camera
    this.size = opts.size || 128
    this.points = new Array(this.size * this.size).fill().map((x, i) => i)
    const posData = opts.initialPositions
    const velData = opts.initialVelocities
    this.posFbos = PingPongBuffer(regl, posData, this.size)
    this.velFbos = PingPongBuffer(regl, velData, this.size)

    this.stepVelocities = new datastep(regl, {
      output: this.velFbos,
      inputs: {
        positions: this.posFbos,
        velocities: this.velFbos
      }
    }, opts.velocityStep)
    
    this.stepPositions = datastep(regl, {
      output: this.posFbos,
      inputs: {
        positions: this.posFbos,
        velocities: this.velFbos
      }
    }, opts.positionStep)
    
    // Draw the points to the screen using the camera as a projection
    this.drawPoints = require('./steps/drawPoints')(
      regl, this.points, this.posFbos, this.camera)
  }
  
  draw() {
    // stepVelocities({})
    this.stepPositions({})
    this.drawPoints({
      time: this.regl.now(),
      dataSize: this.size
    })
  }
  
  createPingPongBuffer(data) {
    
  }
}

module.exports = ParticleSystem