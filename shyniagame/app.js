
let playerId = "p" + Math.floor(Math.random() * 10000);
let opponentId = null;
let gameRef, secretCode, gameCode;

// app.js

function joinGame() {
  const gameCode = document.getElementById("gameCodeInput").value;

  if (!gameCode) {
    alert("Please enter a game code.");
    return;
  }

  const gameRef = database.ref("games/" + gameCode);

  gameRef.once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("Joined game: " + gameCode);
        // Continue game logic here...
      } else {
        alert("Game not found.");
      }
    })
    .catch((error) => {
      console.error("Error joining game:", error);
    });
}


function listenForUpdates() {
  onValue(gameRef, snapshot => {
    const data = snapshot.val();
    if (!data) return;

    if (!opponentId) {
      const players = Object.keys(data).filter(k => k.startsWith("p") && k !== playerId);
      if (players.length > 0) opponentId = players[0];
    }

    if (data.turn === playerId) {
      document.getElementById("turnDisplay").innerText = "Your Turn";
      document.getElementById("guessInput").disabled = false;
    } else {
      document.getElementById("turnDisplay").innerText = "Opponent's Turn";
      document.getElementById("guessInput").disabled = true;
    }

    const guesses = data[playerId]?.guesses || [];
    const historyHTML = guesses.map(g => `<div>You guessed ${g.guess} → ${g.correct} correct</div>`).join("");
    document.getElementById("history").innerHTML = historyHTML;

    // Check for winner
    if (guesses.length > 0 && guesses[guesses.length - 1].correct === 4) {
      alert("🎉 You win!");
    }
  });
}

function submitGuess() {
  const guess = document.getElementById("guessInput").value;
  if (!/^\d{4}$/.test(guess)) return alert("Invalid guess!");

  get(gameRef).then(snapshot => {
    const data = snapshot.val();
    const opponentSecret = data[opponentId].secret;
    let correct = 0;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === opponentSecret[i]) correct++;
    }

    const playerData = data[playerId];
    playerData.guesses = [...(playerData.guesses || []), { guess, correct }];

    update(gameRef, {
      [playerId]: playerData,
      turn: opponentId
    });
  });
}
