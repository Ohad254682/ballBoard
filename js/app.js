var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';


var gGamerPos = { i: 2, j: 9 };
var gBoard
var gScore = 0;
var gisGlued = false;

const kickAudio = new Audio('audio/kick.mp3');

function initGame() {
	console.log('init game!')
	gBoard = buildBoard();
	renderBoard(gBoard);
	gRndBallInterval = setInterval(rndBall, 5000);
	gGnerGlueInterval = setInterval(gnerGlue, 5000);
}

function buildBoard() {
	var board = [];
	var rowsLength = 10;
	var columnLength = 12;
	for (var i = 0; i < rowsLength; i++) {
		board[i] = []
		for (var j = 0; j < columnLength; j++) {
			board[i][j] = { type: FLOOR, gameElement: null }
			if (i === 0 || i === rowsLength - 1) board[i][j].type = WALL
			if (j === 0 || j === columnLength - 1) board[i][j].type = WALL
		}

	}
	board[5][11].type = FLOOR;
	board[5][0].type = FLOOR;
	board[0][5].type = FLOOR;
	board[9][5].type = FLOOR;
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	board[3][2].gameElement = BALL
	board[4][5].gameElement = BALL
	// TODO: Create the Matrix 10 * 12 
	// TODO: Put FLOOR everywhere and WALL at edges
	// TODO: Place the gamer
	// TODO: Place two balls
	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })
			// debugger
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	console.log('strHTML is:');
	console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iDiff = (i - gGamerPos.i);
	var jDiff = (j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// debugger
	if (iDiff === 0 && (Math.abs(jDiff)) === 1 || Math.abs(iDiff) === 1 && jDiff === 0) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			kickAudio.play();
			gBoard[i][j].gameElement = null;
			gScore++;
			updateScore(gScore);
			if (gameOver()) {
				console.log('the game is over')
				resetGame();
			}
		}
		if (targetCell.gameElement === GLUE) {
			gisGlued = true;
			setTimeout(function () {
				gisGlued = false;
			}, 3000)
		}
		gBoard[i][j].gameElement = GAMER
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		renderCell(gGamerPos, '')
		gGamerPos.i = i
		gGamerPos.j = j
		renderCell(gGamerPos, GAMER_IMG)


	} else console.log('TOO FAR');
}
//checks if all the balls were collected
function gameOver() {
	for (var i = 1; i < gBoard.length - 1; i++) {
		for (var j = 1; j < gBoard[0].length - 1; j++) {
			if (gBoard[i][j].gameElement === BALL) return false;
		}
	}
	return true;
}
//creates a button that restarts the game and clears all intervals
function resetGame() {
	console.log('the game restarts');
	clearInterval(gRndBallInterval);
	clearInterval(gGnerGlueInterval);
	document.querySelector('.restart').classList.remove('hide');
}
//clears the game after restart
function clearGame() {
	updateScore(gScore = 0);
	renderCell(gGamerPos, '');
	gGamerPos = { i: 2, j: 9 };
	document.querySelector('.restart').classList.add('hide');
	initGame();
}
//generates a ball on an empty cell
function rndBall() {
	var locationRow = Math.floor((Math.random() * (gBoard.length - 1 - 1)) + 1);
	var locationCol = Math.floor((Math.random() * (gBoard[0].length - 1 - 1)) + 1);
	while (gBoard[locationRow][locationCol].gameElement) {
		locationRow = Math.floor((Math.random() * (gBoard.length - 1 - 1)) + 1);
		locationCol = Math.floor((Math.random() * (gBoard[0].length - 1 - 1)) + 1);
	}
	gBoard[locationRow][locationCol].gameElement = BALL;
	var location = { i: locationRow, j: locationCol };
	renderCell(location, BALL_IMG);
}
// generates glue on the board
function gnerGlue() {
	var locationRow = Math.floor((Math.random() * (gBoard.length - 1 - 1)) + 1);
	var locationCol = Math.floor((Math.random() * (gBoard[0].length - 1 - 1)) + 1);
	while (gBoard[locationRow][locationCol].gameElement) {
		locationRow = Math.floor((Math.random() * (gBoard.length - 1 - 1)) + 1);
		locationCol = Math.floor((Math.random() * (gBoard[0].length - 1 - 1)) + 1);
	}
	var location = { i: locationRow, j: locationCol };
	gBoard[locationRow][locationCol].gameElement = GLUE;
	document.querySelector(`.${getClassName(location)}`).classList.add('glue');
	setTimeout(function () {
		gBoard[locationRow][locationCol].gameElement = '';
		document.querySelector(`.${getClassName(location)}`).classList.remove('glue');
	}, 3000);
}
//updates the score
function updateScore(score) {
	var elScore = document.querySelector('#score');
	elScore.innerText = score;
}
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	// .cell-0-1
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	// var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);

	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	var key = event.key;

	switch (key) {
		case 'ArrowLeft':
			if (!gisGlued) {
				if (gGamerPos.i === 5 && gGamerPos.j === 0) {
					renderCell(gGamerPos, '');
					gGamerPos = { i: 5, j: 11 }
					renderCell(gGamerPos, GAMER_IMG);
				}
				else {
					moveTo(i, j - 1);
				}
			}
			break;
		case 'ArrowRight':
			if (!gisGlued) {
				if (gGamerPos.i === 5 && gGamerPos.j === 11) {
					renderCell(gGamerPos, '');
					gGamerPos = { i: 5, j: 0 }
					renderCell(gGamerPos, GAMER_IMG);
				}
				else {
					moveTo(i, j + 1);
				}
			}
			break;
		case 'ArrowUp':
			if (!gisGlued) {
				if (gGamerPos.i === 0 && gGamerPos.j === 5) {
					renderCell(gGamerPos, '');
					gGamerPos = { i: 9, j: 5 }
					renderCell(gGamerPos, GAMER_IMG);
				}
				else {
					moveTo(i - 1, j);
				}
			}
			break;
		case 'ArrowDown':
			if (!gisGlued) {
				if (gGamerPos.i === 9 && gGamerPos.j === 5) {
					renderCell(gGamerPos, '');
					gGamerPos = { i: 0, j: 5 }
					renderCell(gGamerPos, GAMER_IMG);
				}
				else {
					moveTo(i + 1, j);
				}
			}
			break;
	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	// var cellClass = 'cell-' + location.i + '-' + location.j;
	var cellClass = `cell-${location.i}-${location.j}`
	return cellClass;
}




function getRandomInt(min, max) {
  min = Math.ceil(min);
	max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}