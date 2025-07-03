const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreDisplay = document.getElementById("score").querySelector("span");
const timerDisplay = document.getElementById("timer").querySelector("span");
const matchesDisplay = document.getElementById("matches").querySelector("span");
const highScoreDisplay = document.getElementById("high-score").querySelector("span");
const cardGrid = document.getElementById("card-grid");
const messageDisplay = document.getElementById("message");

let score = 0;
let highScore = 0;
let timeRemaining = 60;
let timerInterval;
let flippedCards = [];
let matchedPairs = 0;
let gameActive = false;

// Define matching pairs with unique IDs
const cardData = [
  // Water
  { id: 1, value: "H₂O", type: "formula", pairId: "water" },
  { id: 2, value: "Water", type: "name", pairId: "water" },
  
  // Carbon Dioxide
  { id: 3, value: "CO₂", type: "formula", pairId: "co2" },
  { id: 4, value: "Carbon Dioxide", type: "name", pairId: "co2" },
  
  // Sodium Chloride
  { id: 5, value: "NaCl", type: "formula", pairId: "nacl" },
  { id: 6, value: "Sodium Chloride", type: "name", pairId: "nacl" },
  
  // Oxygen
  { id: 7, value: "O₂", type: "formula", pairId: "oxygen" },
  { id: 8, value: "Oxygen", type: "name", pairId: "oxygen" },
  
  // Sodium
  { id: 9, value: "Na", type: "element", pairId: "sodium" },
  { id: 10, value: "Sodium", type: "elementName", pairId: "sodium" },
  
  // Chlorine
  { id: 11, value: "Cl", type: "element", pairId: "chlorine" },
  { id: 12, value: "Chlorine", type: "elementName", pairId: "chlorine" },
  
  // Hydrogen
  { id: 13, value: "H", type: "element", pairId: "hydrogen" },
  { id: 14, value: "Hydrogen", type: "elementName", pairId: "hydrogen" },
  
  // Calcium Carbonate
  { id: 15, value: "CaCO₃", type: "formula", pairId: "caco3" },
  { id: 16, value: "Calcium Carbonate", type: "name", pairId: "caco3" }
];

function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("data-pair", card.id);
  cardElement.setAttribute("data-pair-id", card.pairId);

  const front = document.createElement("div");
  front.classList.add("card-face", "card-front");
  front.textContent = "?";

  const back = document.createElement("div");
  back.classList.add("card-face", "card-back");
  back.textContent = card.value;

  cardElement.appendChild(form);
  cardElement.appendChild(back);
  cardElement.addEventListener("click", flipCard);
  
  return cardElement;
}

function shuffleCards() {
  cardGrid.innerHTML = "";
  const shuffledCards = [...cardData].sort(() => Math.random() - 0.5);
  
  shuffledCards.forEach(card => {
    const cardElement = createCardElement(card);
    cardGrid.appendChild(cardElement);
  });
}

function flipCard() {
  if (!gameActive || flippedCards.length === 2 || 
      this.classList.contains("flipped") || 
      this.classList.contains("correct")) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const pairId1 = card1.getAttribute("data-pair-id");
  const pairId2 = card2.getAttribute("data-pair-id");

  if (pairId1 === pairId2) {
    // Correct match
    card1.classList.add("correct");
    card2.classList.add("correct");
    score += 20;
    matchedPairs++;
    updateStats();
    showMessage("Match!", "#66bb6a");
    flippedCards = [];
    
    if (matchedPairs === 8) {
      endGame("You Win! Final Score: " + score, true);
    }
  } else {
    // Incorrect match
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 500);
  }
}

function updateStats() {
  scoreDisplay.textContent = score;
  matchesDisplay.textContent = matchedPairs;
}

function startTimer() {
  clearInterval(timerInterval);
  timeRemaining = 60;
  timerDisplay.textContent = timeRemaining;
  timerDisplay.style.color = "";
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = timeRemaining;

    if (timeRemaining <= 10) {
      timerDisplay.style.color = "#e53935";
    }

    if (timeRemaining <= 0) {
      endGame("Time's Up! Final Score: " + score, false);
    }
  }, 1000);
}

function showMessage(text, color) {
  messageDisplay.textContent = text;
  messageDisplay.style.backgroundColor = color;
  messageDisplay.classList.add("show");
  
  setTimeout(() => {
    messageDisplay.classList.remove("show");
  }, 1000);
}

function endGame(message, isWin) {
  gameActive = false;
  clearInterval(timerInterval);
  startButton.disabled = false;
  resetButton.disabled = false;

  if (score > highScore) {
    highScore = score;
    window.electronAPI.saveScore(highScore);
    highScoreDisplay.textContent = highScore;
    window.electronAPI.showNotification("New High Score!", `You set a new high score of ${highScore}`);
  } else {
    window.electronAPI.showNotification("Game Over", message);
  }
  
  setTimeout(() => {
    showMessage(message, isWin ? "#66bb6a" : "#ff7043");
  }, 500);
}

function startGame() {
  gameActive = true;
  score = 0;
  matchedPairs = 0;
  timeRemaining = 60;
  flippedCards = [];
  
  updateStats();
  shuffleCards();
  startTimer();
  
  startButton.disabled = true;
  resetButton.disabled = false;
}

function resetGame() {
  clearInterval(timerInterval);
  gameActive = false;
  score = 0;
  matchedPairs = 0;
  timeRemaining = 60;
  flippedCards = [];
  
  updateStats();
  shuffleCards();
  startButton.disabled = false;
  resetButton.disabled = true;
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// Initialize game
resetGame();
window.electronAPI.loadScore().then(savedScore => {
  highScore = savedScore;
  highScoreDisplay.textContent = highScore;
});
