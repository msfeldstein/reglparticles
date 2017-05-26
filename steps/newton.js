const datastep = require('./datastep')
module.exports = function(regl, opts) {
  return datastep(regl, opts, `
    precision mediump float;
    uniform sampler2D positions;
    uniform sampler2D velocities;
    varying vec2 uv;
    void main() {
      vec4 pos = texture2D(positions, uv);
      vec4 vel = texture2D(velocities, uv);
      gl_FragColor = pos + vel / 1000.0;
    }
  `)
}