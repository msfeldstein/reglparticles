const glslify = require('glslify')
module.exports = glslify`precision mediump float;
  uniform sampler2D targets;
  uniform float time;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(targets, uv);
    gl_FragColor = pos - vec4(0.0, 0.01, 0.0, 0.0);
  }
`