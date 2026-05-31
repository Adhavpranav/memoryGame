class Game {
    constructor(currentTime, newGame, moves, bestScoreElement, modalElements) {
        if (localStorage.getItem("bestScore") === null) {
            localStorage.setItem("bestScore", 0);
        }
        this.currentTime = currentTime;
        this.moves = moves;
        this.newGame = newGame;
        this.bestScoreElement = bestScoreElement;
        
        this.modalOverlay = modalElements.overlay;
        this.modalTitle = modalElements.title;
        this.modalMessage = modalElements.message;
        
        this.intervalId = null;
        this.isStarted = false;
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;

        this.updateBestScoreDisplay();
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            let remainingTime = parseInt(this.currentTime.innerHTML);
            if (remainingTime > 0) {
                remainingTime--;
                this.currentTime.innerHTML = remainingTime;
            } else {
                clearInterval(this.intervalId);
                this.showLose();
            }
        }, 1000);
    }

    startNewGame() {
        clearInterval(this.intervalId);
        
        this.modalOverlay.classList.add("hidden");

        this.currentTime.innerText = 60;
        this.moves.innerText = 0;
        this.isStarted = false;

        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;

        document.querySelectorAll(".card").forEach((card) => {
            card.classList.remove("flipped");
            card.classList.remove("matched");
        });

        gameImages.sort(() => Math.random() - 0.5);
        cards.forEach((card, index) => {
            card.querySelector("img").src = gameImages[index];
        });
    }

    calculateMove() {
        let totalMoves = parseInt(this.moves.innerText);
        this.moves.innerText = ++totalMoves;
    }

    winDetection() {
        const totalMatched = document.querySelectorAll(".card.matched").length;
        if (totalMatched === cards.length) {
            clearInterval(this.intervalId);
            
            setTimeout(() => {
            const finalScore = this.calculateScore();
            this.handleBestScore(finalScore);
            this.showWin(finalScore);
        }, 1500);
        }
    }

    cardFlip(card) {
        if (!this.isStarted) {
            this.isStarted = true;
            this.startTimer();
        }

        if (this.lockBoard) return;
        if (card.classList.contains("matched")) return;
        if (card === this.firstCard) return;

        card.classList.add("flipped");

        if (this.firstCard === null) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.checkMatch();
        }
    }

    calculateScore() {
        const time = parseInt(this.currentTime.innerText);
        const totalMoves = parseInt(this.moves.innerText);
        return Math.max(0, (time * 20) + 800 - (totalMoves * 5));
    }

    showWin(score) {
        this.modalTitle.innerText = "VICTORY!";
        this.modalTitle.style.color = "#4CAF50"; 
        this.modalMessage.innerHTML = `You completely dominated the board. Check out your final score below.<br><br><strong>Final Score:</strong> ${score}`;
        this.modalOverlay.classList.remove("hidden");
    }

    showLose() {
        this.modalTitle.innerText = "GAME OVER!";
        this.modalTitle.style.color = "#f44336"; 
        this.modalMessage.innerText = "The clock got you this time. Press below to try again and beat the board.";
        this.modalOverlay.classList.remove("hidden");
    }

    handleBestScore(currentScore) {
        const topScore = Number(localStorage.getItem("bestScore"));

        if (currentScore > topScore) {
            localStorage.setItem("bestScore", currentScore);
        }
        this.updateBestScoreDisplay();
    }

    updateBestScoreDisplay() {
        if (this.bestScoreElement) {
            this.bestScoreElement.innerText = localStorage.getItem("bestScore");
        }
    }

    checkMatch() {
        const firstImg = this.firstCard.querySelector("img").src;
        const secondImg = this.secondCard.querySelector("img").src;
        
        this.calculateMove();

        if (firstImg === secondImg) {
            this.firstCard.classList.add("matched");
            this.secondCard.classList.add("matched");

            this.firstCard = null;
            this.secondCard = null;

            this.winDetection();
        } else {
            this.lockBoard = true;

            setTimeout(() => {
                this.firstCard.classList.remove("flipped");
                this.secondCard.classList.remove("flipped");

                this.firstCard = null;
                this.secondCard = null;

                this.lockBoard = false;
            }, 1000);
        }
    }
}


const currentTime = document.querySelector("#remainingTime") ;
const cards = document.querySelectorAll(".card");
const newGame = document.querySelector("#newGame");
const bestScore = document.querySelector("#bestScore");
const moves = document.querySelector("#moves");

const modalElements = {
    overlay: document.querySelector("#gameModal"),
    title: document.querySelector("#modalTitle"),
    message: document.querySelector("#modalMessage"),
    button: document.querySelector("#modalButton")
};

const images = [
    "images/anya.jpg",
    "images/cat.jpg",
    "images/dianasour.jpg",
    "images/gojo.jpg",
    "images/cow.jpg",
    "images/girl.jpg",
    "images/kakashi.jpg",
    "images/panda.jpg"
];

const gameImages = [...images, ...images];

gameImages.sort(() => Math.random() - 0.5);
cards.forEach((card, index) => {
    const imgElement = card.querySelector("img");
    if (imgElement && gameImages[index]) {
        imgElement.src = gameImages[index];
    }
});

const game = new Game(currentTime, newGame, moves, bestScore, modalElements);

cards.forEach((card) => {
    card.addEventListener("click", () => {
        game.cardFlip(card);
    });
});

newGame.addEventListener("click", () => {
    game.startNewGame();
});

modalElements.button.addEventListener("click", () => {
    game.startNewGame();
});