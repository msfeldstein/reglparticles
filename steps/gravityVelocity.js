const datastep = require('./datastep')
module.exports = function(regl, opts) {
  return datastep(regl, opts, `
    precision mediump float;
    uniform sampler2D positions;
    uniform sampler2D velocities;
    varying vec2 uv;
    void main() {
      vec2 attractor = vec2(0.5);
      vec4 pos = texture2D(positions, uv);
      vec4 vel = texture2D(velocities, uv);
      vec2 p = pos.xy - attractor;
      float r = length(p);
      float r2 = r * r;
      float theta = atan(p.y, p.x);
      theta -= 3.14159 / 2.0;
      float mass = vel.w + 0.01;
      vel.x += cos(theta) * vel.w * 0.001 / r; 
      vel.y += sin(theta) * vel.w * 0.001 / r;
      vel.x -= p.x * vel.w * .025 / r;
      vel.y -= p.y * vel.w * .025 / r;
       
      gl_FragColor = vel;
    }
  `)
}