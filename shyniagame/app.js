
let playerId = "p" + Math.floor(Math.random() * 10000);
let opponentId = null;
let gameRef, secretCode, gameCode;

function joinGame() {
  gameCode = document.getElementById("gameCode").value;
  secretCode = document.getElementById("secret").value;

  if (!/^\d{4}$/.test(secretCode)) return alert("Enter a valid 4-digit number.");

  gameRef = ref(db, "games/" + gameCode);

  get(gameRef).then(snapshot => {
    let data = snapshot.val();
    if (!data) {
      set(gameRef, {
        [playerId]: { secret: secretCode, guesses: [] },
        turn: playerId
      });
    } else {
      const players = Object.keys(data).filter(k => k.startsWith("p"));
      if (players.length >= 2) return alert("Game is full.");
      opponentId = players[0];
      update(gameRef, {
        [playerId]: { secret: secretCode, guesses: [] }
      });
    }

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    listenForUpdates();
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
