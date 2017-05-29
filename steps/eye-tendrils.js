module.exports = `
  precision mediump float;
  uniform sampler2D positions;
  uniform sampler2D velocities;
  uniform float time;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(positions, uv);
    vec4 vel = texture2D(velocities, uv);
    float x = vel.r * cos(vel.g * 3.14159 * 2.0 + time / 10.0 * vel.g) + 1.0;
    float y = vel.r * sin(vel.g * 3.14159 * 2.0 + time / 10.0 * vel.g) + 1.0;
    gl_FragColor = vec4(x, y, 0.0, 1.0);
  }
`