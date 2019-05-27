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

    float force = vel.w / (pos.y * pos.y) * .01;
    force = min(abs(force), 1.0) * sign(force);
    vel.y *= force;

    vel.x = 0.0;
    gl_FragColor = vel;
  }
  `