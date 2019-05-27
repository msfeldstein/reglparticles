module.exports = function(canvas) {
    // MediaStream from canvas
    const stream = canvas.captureStream()
    // Collection of blobs of frame data
    const data = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = event => console.log("Data", event) || data.push(event.data)
    recorder.onstop = function() {
        console.log("Stopped, data: ", data)
        var options = {
            audioBitsPerSecond : 128000,
            videoBitsPerSecond : 30000000,
            mimeType : 'video/webm'
        }
        let recordedBlob = new Blob(data, options) 
        let downloadButton = document.createElement('a')
        const downloadURL = URL.createObjectURL(recordedBlob)
        downloadButton.href = downloadURL
        downloadButton.download = 'capture.webm'
        downloadButton.click()
        setTimeout(() => {
            window.URL.revokeObjectURL(downloadURL)
        }, 100);
    }
    recorder.onerror = function(e) {
        console.error("Recording error", e)
    }
    recorder.start()
    console.log("Starting recording")
    return {
        stop: function() {
            recorder.stop()
            stream.getTracks().forEach(track => track.stop()) 
        }
    }
}