const JSZip = require('jszip')
const command = `
#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
echo $BASEDIR/%04d.png
cd "$BASEDIR"
ffmpeg -i %04d.png -pix_fmt yuv420p out.mp4
open out.mp4
`

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = function(canvas, noop) {
  window.ig = this
  this.canvas = canvas
  this.zip = new JSZip()
  this.zip.file('_run_me_to_create_mp4', command, {unixPermissions: "755"})
  this.frames = []
  this.framesLeft = 24 * 30;
  this.frameNumber = 1;
  this.record = false;
  window.addEventListener('keydown', (e) => {
    if (e.keyCode == 82) {
      if (this.record) {
        this.record = false;
        this.download()
      } else {
        this.record = true
      }
    }
  })
  this.begin = function() {
    noop = false
  }

  this.frameReady = function() {
    if (!this.record) return
    if (this.framesLeft > 0) {
      this.zip.file(`${pad(this.frameNumber, 4)}.png`, atob(this.canvas.toDataURL().substr(22)), {binary: true})
    }
    if (this.framesLeft == 0) {
      this.download()
    }
    this.framesLeft--
    this.frameNumber++
    console.log("Frames", this.framesLeft)
    
  }
  
  this.download = () => {
    this.zip.generateAsync({
      type: 'blob'
    }).then((blob) => {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'images.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}