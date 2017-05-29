module.exports = `
  precision mediump float;
  uniform sampler2D positions;
  uniform sampler2D velocities;
  uniform float time;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(positions, uv);
    vec4 vel = texture2D(velocities, uv);
    float x = vel.x + sin(cos(uv.x * 100.32) * 132.3 + uv.y + time * uv.y) * 0.01;
    float y = vel.y + sin(cos(uv.y * 100.32) * 421.3 + uv.x * 103.03 + time * uv.x) * 0.01;
    float theta = atan(y, x);
    theta += vel.w * 10.0;
    float r = sqrt(x * x + y * y);
    x = r * cos(theta);
    y = r * sin(theta);
    gl_FragColor = vec4(x, y, vel.z, 1.0);
  }
`