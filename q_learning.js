const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;

const BLACK_SPOTS = [7, 10, 14, 19, 20, 21, 24, 27, 30, 31, 37, 39, 40, 41];
const DESIRED_STATE = 50;

class Coordinate {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
}

var q = startQ();
var grid = startMap();

var numEpisodes = 3000;
var maxStepsPerEpisode = 100;
var learningRate = 0.5;
var explorationRate = 0.3;

function startCoordenate() {
    return new Coordinate(0, 0);
}

function startQ() {
    var newQ = Array(51);

    for (i = 1; i <= 50; i++) {
        newQ[i] = [0, 0, 0, 0];
    }

    return newQ;
}

function prinQ() {
    for (i = 1; i <= 50; i++){
        console.log(i);
        console.log(q[i]);
    }
}

function startMap() {
    var matrix = [];

    var maxY = 5;
    var x = 0;
    var y = 0;
    var direction = 1;
    var value = 1;

    for (var y = 0; y < 5; y++) {
        matrix[y] = new Array(10);
    }

    y = 0;

    while (value < 51) {
        if (y == maxY || y == -1) {
            direction *= -1;
            x++;
            y += direction;
        }
        else {
            matrix[y][x] = value;
            y += direction;
            value++;
        }
    }

    return matrix;
}

function move(currentCoordinate, direction) {
    var x;
    var y;

    switch (direction) {
        case NORTH:
            y = currentCoordinate.Y + 1;
            x = currentCoordinate.X;
            break;

        case SOUTH:
            y = currentCoordinate.Y - 1;
            x = currentCoordinate.X;
            break;

        case EAST:
            x = currentCoordinate.X + 1;
            y = currentCoordinate.Y;
            break;

        case WEST:
            x = currentCoordinate.X - 1;
            y = currentCoordinate.Y;
            break;
    }

    return new Coordinate(x, y);
}

function getReward(currentCoordinate) {
    if (currentCoordinate.X < 0 || currentCoordinate.Y < 0 || currentCoordinate.Y > 4 || currentCoordinate.X > 9)
        return -100;

    var state = grid[currentCoordinate.Y][currentCoordinate.X];

    if (BLACK_SPOTS.includes(state))
        return -100;

    if (state === DESIRED_STATE)
        return 100;

    return -1;
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function takeOneStep(currentCoordinate, action) {
    var nextCoordinate = move(currentCoordinate, action);

    var reward = getReward(nextCoordinate);

    if (reward === -100){
        var invalidPath = true;
        return { invalidPath: invalidPath, reward: reward };
    }
    else{
        var nextState = grid[nextCoordinate.Y][nextCoordinate.X];
        var invalidPath = false;
        return { nextCoorditate: nextCoordinate, reward: reward, done: nextState === DESIRED_STATE, invalidPath: invalidPath };
    }       
}

for (episode in range(1, numEpisodes)) {
    var coordinate = startCoordenate();
    var state = grid[coordinate.Y][coordinate.X];

    var done = false;

    for (step in range(1, maxStepsPerEpisode)) {

        var action;

        explorationRateThreshold = Math.random();

        if (explorationRateThreshold > explorationRate) {
            var maxValue = Math.max.apply(null, q[state])

            for (var i = 0; i < q[state].length; i++) {
                if (q[state][i] === maxValue)
                    action = i;
                break;
            }
        }
        else
            action = Math.floor(Math.random() * 4);

        var stepResult = takeOneStep(coordinate, action);

        if (stepResult.invalidPath) {
            q[state][action] = stepResult.reward;
            break;
        }

        var nextState = grid[stepResult.nextCoorditate.Y][stepResult.nextCoorditate.X];

        done = stepResult.done;

        q[state][action] = stepResult.reward + (learningRate * Math.max.apply(null, q[nextState]));

        coordinate = stepResult.nextCoorditate;
        state = nextState;

        if (done)
            break;
    }
}

prinQ();