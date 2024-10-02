document.addEventListener("DOMContentLoaded", function game() {
  const gameArena = document.getElementById("game-arena");
  const areaSize = 600;
  const cellSize = 20;
  let score = 0;
  let gameStarted = false;
  let food = { x: 300, y: 200 };
  let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ];
  let gameSpeed = 200;
  let dx = cellSize;
  let dy = 0;

  function movefood() {
    let newX, newY;
    do {
      newX = Math.floor(Math.random() * 10) * 60;
      newY = Math.floor(Math.random() * 10) * 60;
    } while (snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY));

    food = { x: newX, y: newY };
  }

  function wallCollison() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        return true;
      }
    }
    let rightCollison = snake[0].x < 0;
    let leftCollison = snake[0].x >= 600 - 20;
    let upCollison = snake[0].y < 0;
    let downCollison = snake[0].y >= 600 - 20;

    return rightCollison || leftCollison || upCollison || downCollison;
  }

  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10;
      let scoreBoard = document.getElementById("score-board");
      scoreBoard.textContent = `Score is: ${score}`;
      if (gameSpeed > 50) {
        clearInterval(Interval);
        gameSpeed -= 10;
        gameLoop();
      }
      movefood();
    } else {
      snake.pop();
    }
  }

  function changeDirection(e) {
    let upSide = dy === -cellSize;
    let downSide = dy === cellSize;
    let leftSide = dx === -cellSize;
    let rightSide = dx === cellSize;
    if (e.key === "ArrowUp" && !downSide) {
      dx = 0;
      dy = -cellSize;
    }
    if (e.key === "ArrowDown" && !upSide) {
      dx = 0;
      dy = cellSize;
    }
    if (e.key === "ArrowLeft" && !rightSide) {
      dx = -cellSize;
      dy = 0;
    }
    if (e.key === "ArrowRight" && !leftSide) {
      dx = cellSize;
      dy = 0;
    }
  }

  function drawDiv(x, y, className) {
    const divElement = document.createElement("div");
    divElement.classList.add(className);
    divElement.style.top = `${y}px`;
    divElement.style.left = `${x}px`;
    return divElement;
  }

  function drawFoodAndSnake() {
    gameArena.innerHTML = "";
    snake.forEach((snakeCell) => {
      const snakeElement = drawDiv(snakeCell.x, snakeCell.y, "snake");
      gameArena.appendChild(snakeElement);
    });
    const foodElement = drawDiv(food.x, food.y, "food");
    gameArena.appendChild(foodElement);
  }

  function gameLoop() {
    Interval = setInterval(function interval() {
      if (wallCollison()) {
        clearInterval(Interval);
        gameStarted = false;
        let gameArena = document.getElementById("game-arena");
        gameArena.innerHTML = "";
        gameArena.style.display = "none";
        let scoreBoard = document.getElementById("score-board");
        scoreBoard.textContent = `Game over. Score is: ${score}`;
        let restartButton = document.createElement("button");
        restartButton.classList.add("start-button");
        restartButton.textContent = "Restart Game";
        document.body.insertBefore(restartButton, gameArena);
        restartButton.addEventListener("click", function restart() {
          location.reload();
        });
        return;
      }
      updateSnake();
      drawFoodAndSnake();
    }, gameSpeed);
  }

  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      document.addEventListener("keydown", changeDirection);
      gameLoop();
    }
  }

  function initiateGame() {
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    scoreBoard.textContent = `Score is: ${score}`;
    document.body.insertBefore(scoreBoard, gameArena);
    gameArena.style.display = "block";
    const startButton = document.createElement("button");
    startButton.classList.add("start-button");
    startButton.textContent = "Start Game";
    document.body.appendChild(startButton);
    startButton.addEventListener("click", function startGame() {
      startButton.style.display = "none";
      runGame();
    });
  }
  initiateGame();
});
