// Bond Breaker Game Code
const bondZone = document.getElementById("bond-zone");
const bondResults = document.getElementById("bond-results");
const bondScoreDisplay = document.getElementById("bond-score");

let draggedElement = null;
let bondPair = [];
let bondScore = 0;

function updateBondScore(amount) {
  bondScore += amount;
  bondScoreDisplay.textContent = `Score: ${bondScore}`;
}

document.querySelectorAll(".element").forEach(el => {
  el.addEventListener("dragstart", e => {
    draggedElement = e.target;
  });
});

bondZone.addEventListener("dragover", e => {
  e.preventDefault();
});

bondZone.addEventListener("drop", e => {
  e.preventDefault();
  if (draggedElement && bondPair.length < 2) {
    const clone = draggedElement.cloneNode(true);
    clone.classList.add("bonded");
    bondZone.appendChild(clone);
    bondPair.push(clone.dataset.type);
  }

  if (bondPair.length === 2) {
    evaluateBond(bondPair);
    bondPair = [];
    setTimeout(() => {
      bondZone.innerHTML = "<p>Drop elements here to bond them!</p>";
    }, 2500);
  }
});

function evaluateBond(pair) {
  const [el1, el2] = pair;
  let resultText = "";
  let correct = false;

  if ((el1 === "Na" && el2 === "Cl") || (el1 === "Cl" && el2 === "Na")) {
    resultText = "✅ You formed NaCl (Ionic Bond)";
    correct = true;
  } else if (el1 === "He" && el2 === "He") {
    resultText = "❌ He is inert! No bond.";
  } else if ((el1 === "H" && el2 === "O") || (el1 === "O" && el2 === "H")) {
    resultText = "✅ H₂O formed! Polar Covalent Bond 💧\nIMF: Hydrogen Bonding 💞";
    correct = true;
  } else if ((el1 === "H" && el2 === "H")) {
    resultText = "✅ H₂ created. Non-polar Covalent Bond.\nIMF: London Dispersion Forces 🌀";
    correct = true;
  } else if ((el1 === "H" && el2 === "F") || (el1 === "F" && el2 === "H")) {
    resultText = "✅ HF created! Strong Hydrogen Bond 💓";
    correct = true;
  } else {
    resultText = "💥 Unstable combo. Reaction failed!";
  }

  bondResults.textContent = resultText;
  correct ? updateBondScore(10) : updateBondScore(-5);
}

// Game Toggle Functionality
const toggleGameBtn = document.getElementById("toggleGame");
const memoryGame = document.getElementById("memory-game");
const bondGame = document.getElementById("bond-game");

toggleGameBtn.addEventListener("click", () => {
  if (memoryGame.classList.contains("active")) {
    memoryGame.classList.remove("active");
    bondGame.classList.add("active");
    toggleGameBtn.textContent = "Switch to Memory Match";
  } else {
    bondGame.classList.remove("active");
    memoryGame.classList.add("active");
    toggleGameBtn.textContent = "Switch to Bond Breaker";
  }
});