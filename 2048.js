// 2015 Nov.1
// 2048 with no animation;

(function() {
	'use strict';

	var blankCol = 3;
	var blankRow = 3;
	var PUZZLE_SIZE = 4;
	var PIECE_SIZE = 100;
	var Hframe;
	var step;
	var score;
	var moved;
	var randomVal;
	var count;
	var color;
	var font;
	var win;

	window.onload = function() {
		$("#state").hide();
		initializeArray();
		initializeFrame();
		createRandom();
		$("#left").click(moveLeft);
		$("#right").click(moveRight);
		$("#up").click(moveUp);
		$("#down").click(moveDown);
		$("#reStart").click(reStart);
		$(document).keydown(function(event){
			event.preventDefault();   
		    var key = event.which;                
	            switch(key) {
					case 37:
						moveLeft();
						break;
					case 38:
					    moveUp();
					    break;
					case 39:
					    moveRight();
					    break;
					case 40:
					    moveDown();
					    break;
	        }   
	  	});
	  	//t();
		reLoadFrame();
	};

	function t() {
		Hframe[0] = [2, 4, 8, 16];
		Hframe[1] = [32, 64, 128, 256];
		Hframe[2] = [512, 1024, 2048, 4096];
		Hframe[3] = [8192, 16384, 32768, 65536];
	}
	function reStart() {
		initializeArray();
		moved = true;
		createRandom();
		reLoadFrame();
	}

	function initializeArray() {
		$("#state").hide(1000);
		Hframe = new Array(4);
		for (var i = 0; i < 4; i++) {
			Hframe[i] = new Array(4);
		}
		for (var i = 0; i < Math.pow(PUZZLE_SIZE, 2); i++) {
			var row = parseInt(i / PUZZLE_SIZE);
			var col = i % PUZZLE_SIZE;
			Hframe[row][col] = 0;		
		}
		score = 0;
		step = -1;
		moved = true;
		count = 1;
		win = true;
	}

	function initializeFrame() {
		color = ["#bbada0","#EEE4DA","#EDE0C8","#F2B179","#f59563",
		        "#F67C5F","#F65E3B","#EDCF72","#EDCC61","#EDC850",
		        "#edc22e","#edc22e","#3c3a32","#3c3a32","#3c3a32",
		        "#3c3a32","#3c3a32","#3c3a32","#3c3a32","#3c3a32"];
		font = ["40pt", "38pt", "32pt", "26pt", "22pt", "20pt", "18pt"];
		randomVal = [2, 2, 2, 2, 2, 4];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var piece = document.createElement("div");
				piece.className = "pieces";
				piece.style.backgroundPosition = i * -PIECE_SIZE + "px " + j * -PIECE_SIZE + "px";
				piece.style.left = i * PIECE_SIZE + "px";
				piece.style.top = j * PIECE_SIZE + "px";
				piece.setAttribute("id", i + "_" + j);
				document.getElementById("puzzlearea").appendChild(piece);
			}
		}
	}

	function createRandom() {
		do {
				var random1 = Math.round(Math.random() * 3);
				var random2 = Math.round(Math.random() * 3);
			}	while (Hframe[random1][random2] != 0)
		Hframe[random1][random2] = randomVal[Math.round(Math.random() * (randomVal.length - 1))];
		$("#" + random1 + "_" + random2).hide();
		$("#" + random1 + "_" + random2).fadeIn(150);
	}

	function reLoadFrame() {
		if (moved) {
			createRandom();
			if (fill() && win) {
				alert("You won this game! Continue to get higher score!");
				win = false;
			}
			step++;
			count++;
			if (count == 16) checkState();
			moved = false;
			document.getElementById("step").innerHTML = step;
			document.getElementById("score").innerHTML = score;
		}
	}

	function fill() {
		var isWin = false;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var piece = document.getElementById(i + "_" + j);
				piece.style.backgroundColor = "rgba(238, 228, 218, 0.35)";
				piece.style.color = "#776e65";				
				if (Hframe[i][j] != 0) {
					if (Hframe[i][j] == 2048) isWin = true;
					piece.innerHTML = Hframe[i][j];
					if (Hframe[i][j] >= 8) piece.style.color = "#f9f6f2";
					piece.style.backgroundColor = color[Math.log(Hframe[i][j]) / Math.log(2)];
					piece.style.fontSize = font[Math.floor(Math.log(Hframe[i][j]) / Math.log(10))];
				} else {
					piece.innerHTML = "";
				}
			}
		}
		return isWin;
	}

	function moveUp() {
		reArrayUp(Hframe);
		addUp(Hframe);
		reArrayUp(Hframe);
		reLoadFrame();
	}

	function moveDown() {
		var frame = turnDown(Hframe, true);
		frame = reArrayUp(frame);
		frame = addUp(frame);
		frame = reArrayUp(frame);
		Hframe = turnDown(frame, true);
		reLoadFrame();
	}

 	function moveLeft() {
 		reArrayLeft(Hframe);
 		Hframe = addLeft(Hframe);
 		reArrayLeft(Hframe);
		reLoadFrame();
		
	}

	function moveRight() {
		var frame = turnDown(Hframe, false);
		frame = reArrayLeft(frame);
		frame = addLeft(frame);
		frame = reArrayLeft(frame);
		Hframe = turnDown(frame, false);
		reLoadFrame();
		
	}

	function turnDown(frame, isVertical) {
		var newFrame = new Array(4);
		for (var i = 0; i < 4; i++) {
			newFrame[i] = new Array(4);
			for (var j = 0; j < 4; j++) {
				if (isVertical) {
					newFrame[i][j] = frame[i][3-j];
				} else {
					newFrame[i][j] = frame[3-i][j];
				}
			}
		}
		return newFrame;		
	}

	function reArrayUp(frame) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (frame[i][j] != 0) {
					var k = 0;
					while (k < j && frame[i][k] != 0) {
						k++;
					}
					if (k != j) {
						frame[i][k] = frame[i][j];
						frame[i][j] = 0;
						moved = true;
					}
				}
			}
		}
		return frame;
	}

	function reArrayLeft(frame) {
		for (var j = 0; j < 4 ; j++) {
			for (var i = 0; i < 4; i++) {
				if (frame[i][j] != 0) {
					var k = 0;
					while (k < i && frame[k][j] != 0) {
						k++;
					}
					if (k != i) {
						frame[k][j] = frame[i][j];
						frame[i][j] = 0;
						moved = true;
					}
				}
			}
		}
		return frame;
	}

	function addUp(frame) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 3; j++) {
				if (frame[i][j] == frame[i][j + 1] && frame[i][j] != 0) {
					score += frame[i][j];
					frame[i][j] *= 2;
					frame[i][j + 1] = 0;
					moved = true;
					count--;
					j++;
				}
			}
		}
		return frame;
	}

	function addLeft(frame) {
		for (var j = 0; j < 4; j++) {
			for (var i = 0; i < 3; i++) {
				if (frame[i][j] == frame[i + 1][j] && frame[i][j] != 0) {
					score += frame[i][j];
					frame[i][j] *= 2;
					frame[i + 1][j] = 0;
					moved = true;
					count--;
					i++;
				}
			}
		}
		return frame;
	}

	function checkState() {
		var isGameOver = true;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 4; j++) {
				if (Hframe[i][j] == Hframe[i + 1][j]) {
					isGameOver = false;
				}
			}
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 3; j++) {
				if (Hframe[i][j] == Hframe[i][j + 1]) {
					isGameOver = false;
				}
			}
		}
		if (isGameOver) {
			$("#state").show(1000);
		}
	}
}) ();