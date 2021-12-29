var EightBallGame = function()
{
  this.numbered_balls_on_table = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
   
  this.turn = 'player1';

  this.sides = {
    'player1': '?',
    'player2': '?'
  };

  this.pocketingOccurred = false;

  this.state = 'notstarted';

  this.ticker = undefined;

  gui.setupGameHud();
  setTimeout(this.startTurn, 2000);
}

EightBallGame.prototype.startTurn = function () {
  if (eightballgame.state == 'gameover') {
    return;
  }
  // enable movement
  eightballgame.timer = 300;
  eightballgame.state = 'turn';
  gui.updateTurn(eightballgame.turn);
  gui.updateBalls(eightballgame.numbered_balls_on_table, eightballgame.sides.player1, eightballgame.sides.player2);

  eightballgame.tickTimer();
}

EightBallGame.prototype.whiteBallEnteredHole = function () {
  gui.log("White ball pocketed by " + eightballgame.turn + "!");
}

EightBallGame.prototype.coloredBallEnteredHole = function (name) {
  if (typeof name === 'undefined') return;
  var ballno = 0;
  for (var i = 0; i < eightballgame.numbered_balls_on_table.length; i++) {
    if (name == eightballgame.numbered_balls_on_table[i] + 'ball') {
      ballno = eightballgame.numbered_balls_on_table[i];
      eightballgame.numbered_balls_on_table.splice(i, 1);
      break;
    }
  }
  if (ballno == 0) {
    return;
  }

  if (ballno == 8) {
    if (eightballgame.numbered_balls_on_table.length > 1) {
      gui.log("Game over! 8 ball pocketed too early by " + this.turn);
      eightballgame.turn = eightballgame.turn == 'player1' ? 'player2': 'player1';
    }

    eightballgame.pocketingOccurred = true;

    // Win!
    eightballgame.endGame();
  } else {
    if (eightballgame.sides.player1 == '?' || eightballgame.sides.player2 == '?') {
      eightballgame.sides[eightballgame.turn] = ballno < 8 ? 'solid' : 'striped';
      eightballgame.sides[eightballgame.turn == 'player1' ? 'player2' : 'player1'] = ballno > 8 ? 'solid' : 'striped';
      eightballgame.pocketingOccurred = true;
    } else {
      if ((eightballgame.sides[eightballgame.turn] == 'solid' && ballno < 8) || (eightballgame.sides[eightballgame.turn] == 'striped' && ballno > 8)) {
        // another turn
        eightballgame.pocketingOccurred = true;
      } else {
        eightballgame.pocketingOccurred = false;
        gui.log(eightballgame.turn + " pocketed opponent's ball!");
      }
    }
  }
}

EightBallGame.prototype.tickTimer = function () {
  gui.UpdateTimer(eightballgame.timer);
  // if (eightballgame.timer == 0) {
  //   gui.log(eightballgame.turn + " ran out of time");
  //   eightballgame.state = "outoftime";
  //   // eightballgame.switchSides();
  // } else {
  //   eightballgame.timer--;
  //   eightballgame.ticker = setTimeout(eightballgame.tickTimer, 1000);
  // }
}

EightBallGame.prototype.switchSides = function () {
  eightballgame.turn = eightballgame.turn == 'player1' ? 'player2': 'player1';

  setTimeout(eightballgame.startTurn, 1000);

  database_setMove('cords_'+moveCount, ballPositionArray, moveCount);
  moveCount++;
}

EightBallGame.prototype.endGame = function () {
  eightballgame.state = 'gameover';
  var winner = eightballgame.turn == 'player1' ? 'Player 1' : 'Player 2';
  clearTimageseout(eightballgame.ticker);
  gui.showEndGame(winner);
}

EightBallGame.prototype.hitButtonClicked = function (strength) {
  
  var isYourMove = false;

  db.collection("games")
    .doc(gameId)
    .get().then((doc) => {
      if (doc.exists) {

          playerUid[1] = doc.data().playerOne;
          playerUid[2] = doc.data().playerTwo;

          if (playerUid[1] == null){
            console.log('init database_setPlayerOne');
                    
            db.collection("games")
            .doc(gameId)
            .set(
                {
                  playerOne: uid
                },
                { merge: true }
            );
            playerUid[1] = uid;
            isYourMove = true;
          }else if (playerUid[1] != uid && playerUid[2] == null){
            console.log('init database_setPlayerTwo');
                    
            db.collection("games")
            .doc(gameId)
            .set(
                {
                  playerTwo: uid
                },
                { merge: true }
            );
            playerUid[2] = uid;
            isYourMove = true;
          }

          if (doc.data().currentPlayerUid == 'player1'){
            if (doc.data().playerOne == uid){
              isYourMove = true;
            }
          }else{
            if (doc.data().playerTwo == uid){
              isYourMove = true;
            }
          }
          

          if (isYourMove){
            if (poolgame.balls[0].rigidBody.sleepState == CANNON.Body.SLEEPING && eightballgame.state == 'turn') {
              poolgame.ballHit(strength);
              clearTimeout(eightballgame.ticker);
              eightballgame.state = 'turnwaiting';
              var x = setInterval(function() {
                if (poolgame.balls[0].rigidBody.sleepState != CANNON.Body.SLEEPING) return;
                for (var i=1;i<poolgame.balls.length;i++) {
                  if (poolgame.balls[i].rigidBody.sleepState != CANNON.Body.SLEEPING && eightballgame.numbered_balls_on_table.indexOf(Number(poolgame.balls[i].name.split('ball')[0])) > -1) {
                    return;
                  }
                }
    
                if (eightballgame.pocketingOccurred) {
                  setTimeout(eightballgame.startTurn, 1000);
                } else {
                  eightballgame.switchSides();
                }
    
                eightballgame.pocketingOccurred = false;
    
                clearInterval(x);
              }, 30);
            }

          }else{
            console.log('not your move');
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }

  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}
