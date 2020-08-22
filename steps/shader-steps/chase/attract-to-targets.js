const glslify = require('glslify')
module.exports = glslify`precision mediump float;
  uniform sampler2D targets;
  uniform sampler2D positions;
  uniform float targetsWidth;
  uniform float positionsWidth;
  uniform float time;
  varying vec2 uv;
  void main() {
    float index = uv.x * positionsWidth + uv.y * positionsWidth;
    vec4 pos = texture2D(positions, uv);
    gl_FragColor = pos - vec4(0.0, 0.01, 0.0, 0.0);
  }
`
