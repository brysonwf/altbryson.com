var EightBallGame = function()
{
  this.numbered_balls_on_table = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  
  var playerSlug = null;

  db.collection("games")
  .doc(gameId)
  .get().then((doc) => {
    if (doc.exists) {

      console.log('duplicate data pull -- fix')

      playerSlug = doc.data().currentPlayerUid;

      if (playerSlug == null){
        console.log('EightBallGame init setting currentPlayerUid as player1');
      
        db.collection("games")
        .doc(gameId)
        .set(
            {
              currentPlayerUid: 'player1'
            },
            { merge: true }
        );
      }
    
      console.log('EightBallGame init playerslug : ' + playerSlug);
    
      this.turn = playerSlug;
    
      this.sides = {
        'player1': '?',
        'player2': '?'
      };
    
      this.pocketingOccurred = false;
    
      this.state = 'notstarted';
    
      this.ticker = undefined;
    
      gui.setupGameHud();
      setTimeout(this.startTurn, 2000);

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

EightBallGame.prototype.startTurn = function () {
  if (eightballgame.state == 'gameover') {
    return;
  }
  
  //initial render
  db.collection("games/"+gameId+"/moves")
  .orderBy("createDate", "asc")
  .onSnapshot(function(querySnapshot) {
      console.log('game_pool loading moves');

      moveCount = 0;
      
      database_setGameActive();

      var jsonBallData = {};

      querySnapshot.forEach(function(doc) {

          playerArray[moveCount] = doc.data().uid;

          jsonBallData[0] = JSON.parse(doc.data().whiteball);
          jsonBallData[1] = JSON.parse(doc.data().ball_1);
          jsonBallData[2] = JSON.parse(doc.data().ball_2);
          jsonBallData[3] = JSON.parse(doc.data().ball_3);
          jsonBallData[4] = JSON.parse(doc.data().ball_4);
          jsonBallData[5] = JSON.parse(doc.data().ball_5);
          jsonBallData[6] = JSON.parse(doc.data().ball_6);
          jsonBallData[7] = JSON.parse(doc.data().ball_7);
          jsonBallData[8] = JSON.parse(doc.data().ball_8);
          jsonBallData[9] = JSON.parse(doc.data().ball_9);
          jsonBallData[10] = JSON.parse(doc.data().ball_10);
          jsonBallData[11] = JSON.parse(doc.data().ball_11);
          jsonBallData[12] = JSON.parse(doc.data().ball_12);
          jsonBallData[13] = JSON.parse(doc.data().ball_13);
          jsonBallData[14] = JSON.parse(doc.data().ball_14);
          jsonBallData[15] = JSON.parse(doc.data().ball_15);

          moveCount++;
      });

      if (moveCount > 0){                    
          poolgame.balls[0].rigidBody.position.set(jsonBallData[0].x, jsonBallData[0].y, jsonBallData[0].z);
          poolgame.balls[1].rigidBody.position.set(jsonBallData[4].x, jsonBallData[4].y, jsonBallData[4].z);
          poolgame.balls[2].rigidBody.position.set(jsonBallData[3].x, jsonBallData[3].y, jsonBallData[3].z);
          poolgame.balls[3].rigidBody.position.set(jsonBallData[14].x, jsonBallData[14].y, jsonBallData[14].z);
          poolgame.balls[4].rigidBody.position.set(jsonBallData[2].x, jsonBallData[2].y, jsonBallData[2].z);
          poolgame.balls[5].rigidBody.position.set(jsonBallData[15].x, jsonBallData[15].y, jsonBallData[15].z);
          poolgame.balls[6].rigidBody.position.set(jsonBallData[13].x, jsonBallData[13].y, jsonBallData[13].z);
          poolgame.balls[7].rigidBody.position.set(jsonBallData[5].x, jsonBallData[5].y, jsonBallData[5].z);
          poolgame.balls[8].rigidBody.position.set(jsonBallData[12].x, jsonBallData[12].y, jsonBallData[12].z);
          poolgame.balls[9].rigidBody.position.set(jsonBallData[7].x, jsonBallData[7].y, jsonBallData[7].z);
          poolgame.balls[10].rigidBody.position.set(jsonBallData[6].x, jsonBallData[6].y, jsonBallData[6].z);
          poolgame.balls[11].rigidBody.position.set(jsonBallData[8].x, jsonBallData[8].y, jsonBallData[8].z);
          poolgame.balls[12].rigidBody.position.set(jsonBallData[9].x, jsonBallData[9].y, jsonBallData[9].z);
          poolgame.balls[13].rigidBody.position.set(jsonBallData[10].x, jsonBallData[10].y, jsonBallData[10].z);
          poolgame.balls[14].rigidBody.position.set(jsonBallData[11].x, jsonBallData[11].y, jsonBallData[11].z);
          poolgame.balls[15].rigidBody.position.set(jsonBallData[1].x, jsonBallData[1].y, jsonBallData[1].z);
      }

      // enable movement
      eightballgame.timer = 300;
      eightballgame.state = 'turn';

      $('.player1').removeClass('active');
      $('.player2').removeClass('active');

      console.log('eightballgame.turn: '+ eightballgame.turn);

      $('.'+eightballgame.turn).addClass('active');

      gui.updateBalls(eightballgame.numbered_balls_on_table, eightballgame.sides.player1, eightballgame.sides.player2);

      eightballgame.tickTimer();
  
  });
}

EightBallGame.prototype.whiteBallEnteredHole = function () {
  gui.log("White ball pocketed by " + eightballgame.turn + "!");
}

EightBallGame.prototype.coloredBallEnteredHole = function (name) {
  console.log('coloredBallEnteredHole');
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
  console.log('EightBallGame.prototype.switchSides init')

  //swap slug
  var playerSlug = null;

  db.collection("games")
  .doc(gameId)
  .get().then((doc) => {
    if (doc.exists) {

      console.log('doc.data().currentPlayerUid: ' + doc.data().currentPlayerUid);
      playerSlug = doc.data().currentPlayerUid;
      

      console.log('switchsides playerSlug: ' + playerSlug);
      
      eightballgame.turn = playerSlug == 'player1' ? 'player2': 'player1';

      database_setMove('cords_'+moveCount, ballPositionArray, moveCount);
      moveCount++;
      
      console.log('setting currentPlayerUid as ' + eightballgame.turn);
      
      db.collection("games")
      .doc(gameId)
      .set(
          {
            currentPlayerUid: eightballgame.turn
          },
          { merge: true }
      );

      setTimeout(eightballgame.startTurn, 1000);
      

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
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
          }else if (doc.data().currentPlayerUid == 'player2'){
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
                  console.log('calling switch sides');
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
