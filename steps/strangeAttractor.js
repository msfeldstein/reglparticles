const datastep = require('./datastep')
module.exports = function(regl, posFbos) {
  return datastep(regl, posFbos, `
    precision mediump float;
    uniform sampler2D prevData;
    varying vec2 uv;
    void main() {
      vec4 pos = texture2D(prevData, uv);
      float sigma = 3.0;
      float rho = 10.0; // How wide spread
      float beta = 0.30;
      float interval = pos.w;
      float x = pos.x;
      float y = pos.y;
      float z = pos.z;
      float newx = x - sigma * x * interval + sigma * y * interval;
      float newy = y + rho * x * interval - y * interval - pos.z * x * interval;
      float newz = z - beta * z * interval + (x * y) * interval;
      
      gl_FragColor = vec4(newx, newy, newz, pos.w);
    }
  `)
}