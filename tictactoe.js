var subtitulo = document.getElementById("message");
var game = document.getElementById("gameStart");

var onePlayer = document.getElementById("onePlayer");
var twoPlayer = document.getElementById("twoPlayers");

const positions = document.querySelectorAll('td');

var numPlayers = 1;
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

var playerOne = true ;
var player;  

game.addEventListener('click',startGame); 
onePlayer.addEventListener('click',function (){
	twoPlayer.style.textDecoration = "none";
	this.style.textDecoration = "underline";
	numPlayers = 1; 
});

twoPlayer.addEventListener('click',function (){
	onePlayer.style.textDecoration = "none";
	this.style.textDecoration = "underline";
	numPlayers = 2; 
});

function startGame() {
	origBoard = Array.from(Array(9).keys());
	subtitulo.textContent = "";
	playerOne = true;
	for (var i = 0; i < positions.length; i++) {
		positions[i].textContent = "";
		positions[i].style.color = "#474A51";
		positions[i].addEventListener('click', turnClick);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number' && numPlayers == 1) {
		turn(square.target.id, huPlayer)
		if (!checaJogo(origBoard, huPlayer)) {
			turn(bestSpot(), aiPlayer);
		}
	}
	if (typeof origBoard[square.target.id] == 'number' && numPlayers == 2) {
		if (playerOne) {
			player = huPlayer;
			subtitulo.textContent = "Vez do Jogador " + aiPlayer;
		}
		else {
			player = aiPlayer;
			subtitulo.textContent = "Vez do Jogador " + huPlayer;
		}
		if (!checaJogo(origBoard,player)){	
			turn(square.target.id, player)
			playerOne = !playerOne;
		}
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	if (checaVitoria(origBoard,player)){
		gameOver(vitoria)
	}
	else checaEmpate();
}

function gameOver(gameWon) {
	v1 = winCombos[gameWon][0];
	v2 = winCombos[gameWon][1];
	v3 = winCombos[gameWon][2];
	won(positions[v1], positions[v2], positions[v3]);
	
	for (var i = 0; i < positions.length; i++) {
		positions[i].removeEventListener('click', turnClick, false);
	}
}

function emptySquares() {


	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {


	return minimax(origBoard, aiPlayer).index;
}

function checaEmpate () {
	if ( positions[0].textContent != "" && positions[1].textContent != "" && positions[2].textContent != "" && positions[3].textContent != "" && positions[4].textContent != "" && positions[5].textContent != "" && positions[6].textContent != "" && positions[7].textContent != "" && positions[8].textContent != "" ) {
		subtitulo.textContent = "Empate";
		return true;
	}
	else return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checaVitoria(newBoard, huPlayer)) {
		return {score: -10};
	} 
	else if (checaVitoria(newBoard, aiPlayer)) {
		return {score: 10};
	} 
	else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function checaVitoria (board,player) {
	//  Confere linhas 
	if( board[0] == player && board[1] == player && board[2] == player) {
		vitoria = 0;
		return true;
	}
	else if ( board[3] == player && board[4] == player && board[5] == player) {
		vitoria = 1;
		return true;
	}
	else if ( board[6] == player && board[7] == player && board[8] == player) {
		vitoria = 2;
		return true;
	}
	// Confere colunas 
	else if( board[0] == player && board[3] == player && board[6] == player) {
		vitoria = 3;
		return true;
	}
	else if ( board[1] == player && board[4] == player && board[7] == player) {
		vitoria = 4;
		return true;
	}
	else if ( board[2] == player && board[5] == player && board[8] == player) {
		vitoria = 5;
		return true;
	}
	// Confere transversal 
	else if( board[0] == player && board[4] == player && board[8] == player) {
		vitoria = 6;
		return true;
	}
	else if ( board[2] == player && board[4] == player && board[6] == player) {
		vitoria  = 7 ;
		return true;
	}
	else {
		return false; 
	}
}

function checaJogo (board, player) {

	return (checaVitoria(board,player) || checaEmpate());
};

function won (p1 , p2, p3) {
	p1.style.color = "#FF0000";
	p2.style.color = "#FF0000";
	p3.style.color = "#FF0000";
	if (p1.textContent == 'O') {
		if ( numPlayers == 1) subtitulo.textContent = "Vitoria Jogador!";
		if ( numPlayers == 2) subtitulo.textContent = "Vitoria Jogador 1!";
	}
	else {
		if ( numPlayers == 1) subtitulo.textContent = "Vitoria Computador!";
		if ( numPlayers == 2) subtitulo.textContent = "Vitoria Jogador 2!";
	}	
};