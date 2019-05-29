const NORTH = 0
const SOUTH = 1
const EAST = 2
const WEST = 3

var q = startQ()
var map = startMap()

function startQ() {
    var t = Array(51)

    for (i = 1; i <= 50; i++)
        t[i] = new Array(4)

    return t
}

function startMap() {
    var matrix = [], height = 6, width = 11

    for (var y = 0; y < 5; y++) {
        matrix[y] = new Array(10)
    }
    var maxY = 5, x = y = 0, direction = value = 1

    while (value < 51) {
        if (y == maxY || y == -1) {
            direction *= -1
            x++
            y += direction
        }
        else {
            matrix[y][x] = value
            y += direction
            value++
        }
    }

    return matrix
}

for (var y = 0; y < 10; y++) {
    for (var x = 0; x < 5; x++) {
        console.log(map[x][y]);
    }
}

function reward(state, action) {
    if (state === 50)
        return 100

}

function action(state, action) {
  
}

