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
    float mass = vel.w;
    vel.x = 0.0;
    float f = mass / (pos.y * pos.y);
    f = f * f * sign(pos.y) * -1.0;
    vel.y = vel.y + f;
    vel.y *= 0.9;
    vel.y = min(abs(vel.y), 10.0 * vel.w) * sign(vel.y);
    vel.z = 0.0;
    gl_FragColor = vel;
  }
`