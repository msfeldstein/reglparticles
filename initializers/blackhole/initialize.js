module.exports = function(SIZE, r) {
    const posData = []
    const velData = []
    const pi2 = Math.PI / 2
    for (var i = 0; i < SIZE * SIZE * 4; i += 4) {
        const theta = i
        posData.push(
            r * Math.cos(theta) + (Math.random() - 0.5) * 0.5,
            r * Math.sin(theta) + (Math.random() - 0.5) * 0.5,
            0,
            0
        )

        velData.push(
            r * Math.cos(theta + pi2),
            r * Math.sin(theta + pi2),
            0,
            1 + Math.random() * 1
        )
    }
    return {
        position: posData,
        velocity: velData
    }
}