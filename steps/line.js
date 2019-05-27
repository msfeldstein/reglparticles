const glslify = require('glslify')
module.exports = glslify`precision mediump float;
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
  
  uniform sampler2D positions;
  uniform sampler2D velocities;
  uniform float time;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(positions, uv);
    vec4 vel = texture2D(velocities, uv);
    float x = pos.x + vel.x * 0.001;
    float y = pos.y + vel.y * 0.001;
    gl_FragColor = vec4(x, y, vel.z, 1.0);
  }
`