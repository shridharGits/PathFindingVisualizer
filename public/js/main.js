const startBtn = document.querySelector('#start')
const reload = document.querySelector('#reload')
const container = document.querySelector('.container')
const edges = document.querySelector('#edges')
const algorithm = document.querySelector('#algorithm')
const speed = document.querySelector('#speed')

var mouseIsDown = false;
var rows = 15;
var cols = 30;
var startRow = 7;
var startCol = 5;
var endRow = 7;
var endCol = 25
// to load grid
window.onload = () => {
    refreshBoard(edges.value)
}

// to take inputs
startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    start()
})

// to add weights to nodes
edges.addEventListener('click', (e) => {
    refreshBoard(edges.value)
})

// to refresh weights
reload.addEventListener('click', (e) => {
    refreshBoard(edges.value)
    startBtn.style.visibility = 'visible'
})

// to set walls
container.addEventListener('mousedown', function () {
    mouseIsDown = true;
})

container.addEventListener('mouseup', function () {
    mouseIsDown = false;
})

container.addEventListener('mouseover', setWall)


// tp create each div in grid
function createNode(row, col, weight) {
    var node = document.createElement('div')
    node.setAttribute('class', 'before_start')
    node.setAttribute('row', row)
    node.setAttribute('col', col)
    node.setAttribute('wall', 0)
    node.setAttribute('parent', null)
    node.setAttribute('cost', Number.POSITIVE_INFINITY)
    node.setAttribute('weight', weight)
    node.innerText = weight.toString()
    return node;
}

// to create complete grid
function createGrid(weight) {
    var grid = container;
    grid.innerHTML = '';
    if (weight == 'weighted') {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let weight = randomWeight();
                let temp = createNode(row, col, weight);
                grid.appendChild(temp);
            }
        }
    }
    else {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let weight = ''.toString();
                let temp = createNode(row, col, weight);
                grid.appendChild(temp);
            }
        }
    }
    sourceNode(startRow, startCol)
    destinationNode(endRow, endCol)
}

// To set source node
function sourceNode(x1, y1) {
    var source = document.querySelector(`div[row="${x1}"][col="${y1}"]`)
    source.setAttribute('cost', 0);
    source.setAttribute('class', 'special_nodes')
    source.innerHTML = 'S'
}

// To set destination node
function destinationNode(x2, y2) {
    var source = document.querySelector(`div[row="${x2}"][col="${y2}"]`)
    source.setAttribute('cost', 0);
    source.setAttribute('class', 'special_nodes')
    source.innerHTML = 'D'
}

// To set wall
function setWall(event) {
    if (mouseIsDown) {
        if (event.target.classList.contains('before_start')) {
            const row = event.target.getAttribute('row')
            const col = event.target.getAttribute('col')

            if ((row != startRow || col != startCol) && (row != endRow || col != endCol)) {
                event.target.classList.toggle('wall')
                if (event.target.classList.contains('wall')) {
                    event.target.setAttribute('wall', 1)
                }
                else {
                    event.target.setAttribute('wall', 0)
                }
            }
            else {
                console.log('not allowed');
            }
        }
    }
}

// to set up grid
function refreshBoard(weight) {
    container.addEventListener('mouseup', setWall)
    container.addEventListener('mousedown', setWall)
    container.addEventListener('mouseover', setWall)
    createGrid(weight)
}

// to generate random weight to nodes 
function randomWeight() {
    return Math.round(Math.random() * 5)
}

function start() {
    if (algorithm.value == 'dijkstra') {
        var time = speed.value
        var weight = edges.value
        var algo = algorithm.value
        dijkstra(algo, time, weight, startRow, startCol, endRow, endCol)
    }
    else if (algorithm.value == 'bfs') {
        console.log(speed.value);
        console.log('bfs');
    }
    else if (algorithm.value == 'dfs') {
        console.log(speed.value);
        console.log('dfs');
    }
}

// ******************** Dijkstra's Algorithm ********************
function checkNode(row, col, curr, checker, seen, counter, weight) {
    if (row >= 0 && col >= 0 && row < rows && col < cols) {
        var node = document.querySelector(`div[row="${row}"][col="${col}"]`)
        let wall = parseInt(node.getAttribute('wall'))
        if (wall == 1) {
            return;
        }

        let parentRow = parseInt(curr.getAttribute('row'))
        let parentCol = parseInt(curr.getAttribute('col'))
        var cost;
        if (weight == 'weighted') {
            cost = Math.min(parseInt(curr.getAttribute('cost')) + parseInt(node.getAttribute('weight')), node.getAttribute('cost'))
        }
        else {
            cost = Math.min(parseInt(curr.getAttribute('cost')) + Math.abs(Math.abs(parentRow - row) + Math.abs(parentCol - col)), node.getAttribute('cost'))
        }

        if (cost < node.getAttribute('cost')) {
            node.setAttribute('parent', curr.getAttribute('row') + '|' + curr.getAttribute('col'))
            node.setAttribute('cost', cost)
        }

        changeColor(curr, counter, curr.getAttribute('cost'));

        if (!seen.includes(node)) {
            checker.push(node);
        }
        seen.push(node);
        return node

    }
    else {
        return false;
    }
}

function changeColor(node, counter, cost) {
    setTimeout(() => {
        node.setAttribute('class', 'path_green')
        if (cost) {
            node.innerHTML = cost;
        }
    }, 1000);

    setTimeout(() => {
        node.setAttribute('class', 'path_red')
    }, 1000);
}

function dijkstra(algo, time, weight, startRow, startCol, endRow, endCol) {
    // console.log(algo);
    // console.log(time);
    // console.log(weight);
    // console.log(document.querySelector(`div[row="${startRow}"][col="${startCol}"]`).innerText);
    // console.log(document.querySelector(`div[row="${endRow}"][col="${endCol}"]`).innerText);

    container.removeEventListener('mouseup', setWall)
    container.removeEventListener('mousedown', setWall)
    container.removeEventListener('mouseover', setWall)

    var startNode = document.querySelector(`div[row="${startRow}"][col="${startCol}"]`)
    var endNode = document.querySelector(`div[row="${endRow}"][col="${endCol}"]`)

    // console.log(startNode.innerText);
    // console.log(endNode);

    // buttons are hided until algorithm is complete
    startBtn.style.visibility = 'hidden'
    // reload.style.visibility = 'hidden'

    var seen = [startNode]
    var checker = [startNode]
    var counter = 1;

    while (checker.length != 0) {
        checker.sort(function (a, b) {
            if (parseInt(a.getAttribute('cost')) < parseInt(b.getAttribute('cost'))) return 1;
            if (parseInt(a.getAttribute('cost')) > parseInt(b.getAttribute('cost'))) return -1;
            return 0;
        })

        let curr = checker.pop()

        let row = parseInt(curr.getAttribute('row'))
        let col = parseInt(curr.getAttribute('col'))

        if (weight == 'unweighted' && row == endRow && col == endCol) {
            console.log(endNode);
            break;
        }
        let wall = parseInt(curr.getAttribute('wall'))
        if (wall == 1) {
            continue;
        }


        let a = checkNode(row + 1, col, curr, checker, seen, counter, weight)
        let b = checkNode(row - 1, col, curr, checker, seen, counter, weight)
        let c = checkNode(row, col - 1, curr, checker, seen, counter, weight)
        let d = checkNode(row, col + 1, curr, checker, seen, counter, weight)
        counter++;
    }
    endNode.setAttribute('parent', '7|24')
    setTimeout(() => {
        // console.log('hello');   
        startNode.setAttribute('class', 'special_nodes')
        console.log(endNode);
        console.log(startNode);
        while (endNode.getAttribute('parent') != null) {
            endNode.setAttribute('class', 'path_green')
            var coor = endNode.getAttribute('parent').split('|')
            console.log(coor);
            var prow = parseInt(coor[0])
            // console.log('prow', prow);
            var pcol = parseInt(coor[1])
            // console.log('pcol', pcol);
            endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`)
            // console.log(endNode.getAttribute('cost'));
        }
        endNode = document.querySelector(`div[row="${endRow}"][col="${endCol}"]`)
        endNode.setAttribute('class', 'special_nodes')
    }, 1000);
    setTimeout(() => {
        reload.style.visibility = 'visible'
    }, 1000);
    // console.log('hello');
}

