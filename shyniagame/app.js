function createGame() {
  const gameCode = document.getElementById("gameCodeCreate").value.trim();
  if (!gameCode) return alert("Enter a code to create a game.");

  const gameRef = database.ref("games/" + gameCode);
  gameRef.set({
    createdAt: Date.now(),
    players: { player1: "joined" }
  }).then(() => {
    document.getElementById("status").innerText = `Game "${gameCode}" created. Waiting for player 2...`;
  }).catch(err => {
    console.error("Create error:", err);
    document.getElementById("status").innerText = "Error creating game.";
  });
}

function joinGame() {
  const gameCode = document.getElementById("gameCodeInput").value.trim();
  if (!gameCode) return alert("Enter a game code.");

  const gameRef = database.ref("games/" + gameCode);

  gameRef.once("value").then(snapshot => {
    if (!snapshot.exists()) {
      document.getElementById("status").innerText = "Game not found.";
      return;
    }

    const data = snapshot.val();
    const players = data.players || {};

    if (!players.player2) {
      gameRef.child("players/player2").set("joined");
      document.getElementById("status").innerText = `Joined game "${gameCode}" as Player 2`;
    } else {
      document.getElementById("status").innerText = "Game already has 2 players.";
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createBtn").addEventListener("click", createGame);
  document.getElementById("joinBtn").addEventListener("click", joinGame);
});

