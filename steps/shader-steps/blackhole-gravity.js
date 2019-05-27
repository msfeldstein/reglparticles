const glslify = require('glslify')
module.exports = glslify`precision mediump float;
  uniform sampler2D positions;
  uniform sampler2D velocities;
  uniform float time;
  varying vec2 uv;
  void main() {
    vec4 pos = texture2D(positions, uv);
    vec4 vel = texture2D(velocities, uv);
    float mass = vel.w;
    float r = distance(pos.xyz, vec3(0.0, 0.0, 0.0));
    vec3 f = 0.01 *  mass / (r * r) * -pos.xyz;
    vel.xyz += f;
    gl_FragColor = vel;
  }
`