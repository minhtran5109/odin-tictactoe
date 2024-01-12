const displayController = (function() {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage,
    }
})();

const Gameboard = (function() {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square,index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard,
    }
})();

function createPlayer (name, mark) {
    return {name, mark};
}

const Game = (function() {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        // const squares = document.querySelectorAll(".square");
        // squares.forEach((square) => {
        //     square.addEventListener("click", handleClick);
        // })
    }

    const handleClick = (e) => {
        // console.log(e.target.id);
        if (gameOver) return;
        let index = parseInt(e.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "") return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        console.log(Gameboard.getGameboard());
        // const board = Gameboard.getGameboard();
        if (checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            // alert(`${players[currentPlayerIndex].name} won!`);
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            // alert(`It's a tie!`);
            displayController.renderMessage(`It's a tie!`);
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        let gameboard = Gameboard.getGameboard();
        for (let i = 0; i < gameboard.length; i++) {
            Gameboard.update(i, "");
        }
        document.querySelector("#message").innerHTML = "";
        gameOver = false;
    }
    return {
        start,
        handleClick,
        restart,
    }
})();

function checkForWin(board) {
    const winningCombination = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    for (let i = 0; i < winningCombination.length; i++) {
        const [a,b,c] = winningCombination[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            console.log(board);
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(square => square !== "");
}

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", () => {
    Game.restart();
})

const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", () => {
    Game.start();
})