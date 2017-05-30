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
    float x = vel.x + sin(cos(uv.x * 100.32) * 132.3 + uv.y + time * uv.y) * 0.01;
    float y = vel.y + sin(cos(uv.y * 100.32) * 421.3 + uv.x * 103.03 + time * uv.x) * 0.01;
    float theta = atan(y, x);
		float r = sqrt(x * x + y * y);
    float thetaOff = pnoise2(
			vec2(
				theta,
				r - time * r / 3.0
			),
			vec2(3.14159, 10.0)
		);
		// thetaOff = thetaOff / 2.0 + 0.5;
		theta += thetaOff * 0.10;
    
    x = r * cos(theta);
    y = r * sin(theta);
    gl_FragColor = vec4(x, y, vel.z, 1.0);
  }
`