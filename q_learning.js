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

prinQ();

var numEpisodes = 100;
var maxStepsPerEpisode = 100;
var learningRate = 0.5;
var discountRate = 0.99;

var explorationRate = 0.3

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
    for (i = 1; i <= 50; i++)
        console.log(q[i]);
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

function takeOneStep(currentCoordinate, action) {
    var nextCoordinate = move(currentCoordinate, action);

    var reward = getReward(nextCoordinate);

    var nextState = currentCoordinate;

    if (nextCoordinate.Y < grid.length && nextCoordinate.X < grid[nextCoordinate.Y].le)
        nextState = grid[nextCoordinate.Y][nextCoordinate.X];
    else
        nextCoordinate = currentCoordinate;

    return { nextCoorditate: nextCoordinate, reward: reward, done: nextState === DESIRED_STATE };
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function getRandomAction(currentCoordinate) {
    var actionRangeEnd = 4;
    var possibleActions = [0, 1, 2, 3]

    if (currentCoordinate.X === 0 && currentCoordinate.Y === 0) {
        possibleActions = [0, 2];
        actionRangeEnd = 2;
    }
    else if (currentCoordinate.X === 0 && currentCoordinate.Y === 4) {
        possibleActions = [1, 2];
        actionRangeEnd = 2;
    }
    else if (currentCoordinate.X === 9 && currentCoordinate.Y === 4) {
        possibleActions = [1, 3];
        actionRangeEnd = 2;
    }
    else if (currentCoordinate.X === 9 && currentCoordinate.Y === 0) {
        possibleActions = [0, 3];
        actionRangeEnd = 2;
    }
    else if (currentCoordinate.Y === 0) {
        possibleActions = [0, 2, 3];
        actionRangeEnd = 3;
    }
    else if (currentCoordinate.X === 0) {
        possibleActions = [0, 1, 2];
        actionRangeEnd = 3;
    }
    else if (currentCoordinate.Y === 4) {
        possibleActions = [1, 2, 3];
        actionRangeEnd = 3;
    }
    else if (currentCoordinate.X === 9) {
        possibleActions = [0, 1, 3];
        actionRangeEnd = 3;
    }

    return possibleActions[Math.floor(Math.random() * actionRangeEnd)];
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
            action = getRandomAction(coordinate);

        var stepResult = takeOneStep(coordinate, action);

        var nextState = grid[stepResult.nextCoorditate.Y][stepResult.nextCoorditate.X];

        var reward = stepResult.reward;

        done = stepResult.done;

        q[state, action] = q[state][action] + learningRate * Math.max.apply(null, q[nextState]);

        coordinate = stepResult.nextCoorditate;

        if (done)
            break;
    }

    console.log(episode)
}

prinQ();