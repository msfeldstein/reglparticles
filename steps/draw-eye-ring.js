module.exports = `
  precision mediump float;
  attribute float index;
  uniform float dataSize;
  uniform sampler2D positions;
  uniform float time;
  uniform mat4 proj;
  uniform mat4 model;
  uniform mat4 view;
  
  void main() {
    
    float offset = index / 10.0;
    
    vec2 posDataPosition = vec2(
      mod(index, dataSize) / dataSize,
      floor(index / dataSize) / dataSize
    );
    vec4 pos = texture2D(positions, posDataPosition);
    float x = pos.r * cos(pos.g * 3.14159 * 2.0 + time / 10.0 * pos.g) + 1.0;
    float y = pos.r * sin(pos.g * 3.14159 * 2.0 + time / 10.0 * pos.g) + 1.0;
    gl_Position = proj * view * model * vec4(x, y, 0.0, 1.0);
  }
`