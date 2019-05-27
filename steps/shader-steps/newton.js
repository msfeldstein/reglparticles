const glslify = require('glslify')
module.exports = glslify`precision mediump float;
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
  
    precision mediump float;
    uniform sampler2D positions;
    uniform sampler2D velocities;
    varying vec2 uv;
    void main() {
      vec4 pos = texture2D(positions, uv);
      vec4 vel = texture2D(velocities, uv);
      gl_FragColor = pos + vel / 100.0;
    }
`