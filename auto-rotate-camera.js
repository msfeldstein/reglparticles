var glm = require("gl-matrix")
var vec3 = glm.vec3
var mat3 = glm.mat3
var mat4 = glm.mat4
var quat = glm.quat

module.exports = function(r) {
    const camera = mat4.create()
    const eye = vec3.fromValues(0, -r, r/2)
    const center = vec3.fromValues(0, -r, 4)
    const up = vec3.fromValues(0, 1, 0)
    mat4.lookAt(camera, eye, center, up)
    let t = 0
    camera.tick = function() {
        // t += .003
        // vec3.set(eye, r * Math.cos(t), r * Math.sin(0.52 * t), r * Math.cos(Math.PI / 3 + 0.9 * t))

        // mat4.lookAt(camera, eye, center, up)
    }
    camera.view = function() {
        return camera
    }
    return camera
}