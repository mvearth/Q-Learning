const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;

const BLACK_SPOTS = [7, 10, 11, 14, 19, 20, 21, 24, 27, 30, 31, 37, 39, 40, 41];
const DESIRED_STATE = 50;

class Coordinate {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
}

var q = startQ();
var grid = startMap();

var numEpisodes = 10000;
var maxStepsPerEpisode = 100;
var learningRate = 0.5;
var explorationRate = 0.3;
var speed = 20;
var running = false;

function startCoordinate() {
    return new Coordinate(0, 0);
}

function startQ() {
    var newQ = Array(51);

    for (i = 1; i <= 50; i++) {
        newQ[i] = [0, 0, 0, 0];
    }

    return newQ;
}

function printQ() {
    for (i = 1; i <= 50; i++) {
        console.log(i);
        console.log(q[i]);
    }
}

function hideAllStates() {
    for (var i = 1; i < 51; i++) {
        var element = document.getElementById(i)
        element.style.visibility = "hidden";
    }
}

function clearQ() {
    q = startQ();
}

function showState(item) {
    var element = document.getElementById(item)
    element.style.visibility = "visible";
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

function isInvalidCoordinate(currentCoordinate) {
    return currentCoordinate.X < 0 || currentCoordinate.Y < 0 || currentCoordinate.Y > 4 || currentCoordinate.X > 9
}

function getReward(currentCoordinate) {
    if (isInvalidCoordinate(currentCoordinate))
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

    if (reward === -100) {
        var invalidPath = true;
        return { invalidPath: invalidPath, reward: reward };
    }
    else {
        var nextState = grid[nextCoordinate.Y][nextCoordinate.X];
        var invalidPath = false;
        return { nextCoorditate: nextCoordinate, reward: reward, done: nextState === DESIRED_STATE, invalidPath: invalidPath };
    }
}

async function startQLearning() {
    document.getElementById("startButton").disabled = true;
    clearQ();
    hideAllStates();

    numEpisodes = document.getElementById("numEpisodes").value;
    maxStepsPerEpisode = document.getElementById("maxStepsPerEpisode").value;
    learningRate = document.getElementById("learningRate").value;
    explorationRate = document.getElementById("explorationRate").value;
    speed = document.getElementById("speed").value;

    var count = 0;  
    var lastEpisode = 0;

    for (episode in range(1, numEpisodes)) {

        var changesQ = false;

        if (count == 5)
            break;

        var coordinate = startCoordinate();
        var state = grid[coordinate.Y][coordinate.X];

        showState(state);

        for (step in range(1, maxStepsPerEpisode)) {
            await sleep();

            var action;

            explorationRateThreshold = Math.random();

            if (explorationRateThreshold > explorationRate) {
                var maxValue = Math.max.apply(null, q[state])

                for (var i = 0; i < q[state].length; i++) {
                    if (q[state][i] === maxValue) {
                        action = i;
                        break;
                    }
                }
            }
            else
                action = Math.floor(Math.random() * 4);

            var stepResult = takeOneStep(coordinate, action);

            if (stepResult.invalidPath) {
                q[state][action] = stepResult.reward;
                continue;
            }

            var nextState = grid[stepResult.nextCoorditate.Y][stepResult.nextCoorditate.X];

            var possibleNewQValue = stepResult.reward + (learningRate * Math.max.apply(null, q[nextState]));

            var actualQValue = q[state][action];

            if(possibleNewQValue != actualQValue){
                q[state][action] = possibleNewQValue;
                changesQ = true;
            }

            coordinate = stepResult.nextCoorditate;
            state = nextState;

            showState(state);

            if(stepResult.done)
                break;
        }

        if (!changesQ)
            count++;

        hideAllStates();

        lastEpisode = episode;
    }

    printQ();

    console.log(lastEpisode);

    document.getElementById("bestWayButton").disabled = false;
    document.getElementById("startButton").disabled = false;
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, speed));
}

function printBestWay() {

    if (running)
        return;

    hideAllStates();

    coordinate = startCoordinate();
    var state = grid[coordinate.Y][coordinate.X];

    var done = false;

    var repetitionCount = 0;

    var previousState = state;

    while (!done) {
        showState(state);

        var maxValue = Math.max.apply(null, q[state])

        var maxes = [];

        for (var i = 0; i < q[state].length; i++) {
            if (q[state][i] === maxValue) {
                maxes.push(i);
            }
        }

        var indices = Math.floor(Math.random() * maxes.length);

        var nextMove = maxes[indices];

        var nextCoordinate = move(coordinate, nextMove);
        coordinate = nextCoordinate;

        if (grid[coordinate.Y][coordinate.X] === previousState)
            repetitionCount++;

        if (repetitionCount === 5)
            break;

        previousState = state;

        state = grid[coordinate.Y][coordinate.X];

        if (state === DESIRED_STATE) {
            done = true;
            showState(state);
        }
    }
}  