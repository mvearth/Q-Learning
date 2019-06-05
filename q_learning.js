const NORTH = 0
const SOUTH = 1
const EAST = 2
const WEST = 3

const BLACK_SPOTS = [7, 10, 14, 19, 20, 21, 24, 27, 30, 31, 37, 39, 40, 41]
const DESIRED_STATE = 50

class Coordinate {
    constructor(x, y) {
        this.X = x
        this.Y = y
    }
}

var state = startCoordenate()
var q = startQ()
var map = startMap()

function startCoordenate() {
    return new Coordinate(0, 0)
}

function startQ() {
    var newQ = Array(51)

    for (i = 1; i <= 50; i++)
        newQ[i] = [0, 0, 0, 0]

    return newQ
}

function prinQ(){
    for (i = 1; i <= 50; i++)
        console.log(q[i])
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

// for (var y = 0; y < 10; y++) {
//     for (var x = 0; x < 5; x++) {
//         console.log(map[x][y])
//     }
// }

function move(currentCoordinate, direction) {
    var x, y

    switch (direction) {
        case NORTH:
            y = currentCoordinate.Y + 1
            x = currentCoordinate.X
            break

        case SOUTH:
            y = currentCoordinate.Y - 1
            x = currentCoordinate.X
            break

        case EAST:
            x = currentCoordinate.X + 1
            y = currentCoordinate.Y
            break

        case WEST:
            x = currentCoordinate.X - 1
            y = currentCoordinate.Y
            break
    }

    return new Coordinate(x, y)
}

function getReward(currentCoordinate) {
    if (currentCoordinate.X < 0 || currentCoordinate.Y < 0 || currentCoordinate.Y > 4 || currentCoordinate.X > 9)
        return -100

    var state = map[currentCoordinate.Y][currentCoordinate.X]

    if (BLACK_SPOTS.includes(state))
        return -100

    if (state === DESIRED_STATE)
        return 100

    return -1
}

function action(currentCoordinate, direction) {
    var currentState = map[currentCoordinate.Y][currentCoordinate.X]

    if (currentState === DESIRED_STATE) {
        return getReward(currentCoordinate)
    }
    else {
        var nextDirection = 2

        var nextCoordinate = move(currentCoordinate, nextDirection)

        var reward = action(nextCoordinate, nextDirection)

        var maxReward = Math.max(...q[currentState])

        var result = reward  + 0.5 * maxReward

        q[currentState][direction] = reward

        return result
    }
}

action(state, 2)
prinQ()

