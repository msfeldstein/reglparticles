const datastep = require('./steps/datastep')
const PingPongBuffer = require('./PingPongBuffer')
const RandomInitializer = require('./initializers/random')

class ParticleSystem {
  constructor(regl, opts) {
    this.regl = regl
    this.camera = opts.camera
    this.size = opts.size || 128
    this.points = new Array(this.size * this.size).fill().map((x, i) => i)
    const posData = opts.initialPositions || RandomInitializer(this.size)
    const velData = opts.initialVelocities || RandomInitializer(this.size)
    this.posFbos = PingPongBuffer(regl, posData, this.size)
    this.velFbos = PingPongBuffer(regl, velData, this.size)
    if (opts.velocityStep) {
      this.stepVelocities = new datastep(regl, {
        output: this.velFbos,
        inputs: {
          positions: this.posFbos,
          velocities: this.velFbos
        }
      }, opts.velocityStep)  
    }
    
    if (opts.positionStep) {
      this.stepPositions = datastep(regl, {
        output: this.posFbos,
        inputs: {
          positions: this.posFbos,
          velocities: this.velFbos
        }
      }, opts.positionStep)  
    }
    
    // Draw the points to the screen using the camera as a projection
    this.drawPoints = require('./steps/drawPoints')(regl, {
      points: this.points,
      positions: this.posFbos,
      camera: this.camera,
      drawStep: opts.drawStep
    })
  }
  
  draw() {
    if (this.stepVelocities){
      this.stepVelocities({})  
    }
    if (this.stepPositions) {
      this.stepPositions({})  
    }
    this.drawPoints({
      time: this.regl.now(),
      dataSize: this.size
    })
  }
  
  createPingPongBuffer(data) {
    
  }
}

module.exports = ParticleSystem