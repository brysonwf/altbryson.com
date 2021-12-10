var game_tictactoe = function(){

    console.log('game_tictactoe init');

    let turn = "O";
    const player = "O";
    const computer = "X";
    
    let board_full = false;
    let play_board = ["", "", "", "", "", "", "", "", ""];
    
    const board_container = document.querySelector(".tictactoe-play-area");
    
    const winner = document.getElementById("tictactoe-winner");
    
    check_board_complete = () => {
      let flag = true;
      play_board.forEach(element => {
        if (element != player && element != computer) {
          flag = false;
        }
      });
      board_full = flag;
    };
    
    const check_line = (a, b, c) => {
      return (
        play_board[a] == play_board[b] &&
        play_board[b] == play_board[c] &&
        (play_board[a] == player || play_board[a] == computer)
      );
    };
    
    const check_match = () => {
      for (i = 0; i < 9; i += 3) {
        if (check_line(i, i + 1, i + 2)) {
          document.querySelector(`#tictactoe-block_${i}`).classList.add("tictactoe-win");
          document.querySelector(`#tictactoe-block_${i + 1}`).classList.add("tictactoe-win");
          document.querySelector(`#tictactoe-block_${i + 2}`).classList.add("tictactoe-win");
          return play_board[i];
        }
      }
      for (i = 0; i < 3; i++) {
        if (check_line(i, i + 3, i + 6)) {
          document.querySelector(`#tictactoe-block_${i}`).classList.add("tictactoe-win");
          document.querySelector(`#tictactoe-block_${i + 3}`).classList.add("tictactoe-win");
          document.querySelector(`#tictactoe-block_${i + 6}`).classList.add("tictactoe-win");
          return play_board[i];
        }
      }
      if (check_line(0, 4, 8)) {
        document.querySelector("#tictactoe-block_0").classList.add("tictactoe-win");
        document.querySelector("#tictactoe-block_4").classList.add("tictactoe-win");
        document.querySelector("#tictactoe-block_8").classList.add("tictactoe-win");
        return play_board[0];
      }
      if (check_line(2, 4, 6)) {
        document.querySelector("#tictactoe-block_2").classList.add("tictactoe-win");
        document.querySelector("#tictactoe-block_4").classList.add("tictactoe-win");
        document.querySelector("#tictactoe-block_6").classList.add("tictactoe-win");
        return play_board[2];
      }
      return "";
    };
    
    const check_for_winner = () => {
      let res = check_match()
      if (res == player) {
        board_full = true
        winner.classList.remove("hidden");
        database_setGameComplete(playerArray[0]);
        winner.innerText = 'Winner is:' + playerArray[0];
      } else if (res == computer) {
        board_full = true
        winner.classList.remove("hidden");
        database_setGameComplete(playerArray[1]);
        winner.innerText = 'Winner is:' + playerArray[1];
      } else if (board_full) {
        winner.classList.remove("hidden");
        database_setGameComplete('draw');
      }
    };
    
    const game_loop = () => {

      board_container.innerHTML = ""
      play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="tictactoe-block_${i}" class="tictactoe-block" data-move="${i}">${play_board[i]}</div>`;
        if (e == player || e == computer) {
          document.querySelector(`#tictactoe-block_${i}`).classList.add("tictactoe-occupied");
        }
      });

      $('.tictactoe-block').click(function(){
        console.log('click');
        var move = $(this).data( "move" );
        playerOneMove(move);
      });

      check_board_complete();
      check_for_winner();

    };
    
    const playerOneMove = e => {
      console.log('playerOneMove');
      if (!board_full && play_board[e] == "") {
          
          var docJson = {
            move : e,
            user : turn
          }
        
          var currentPlayerUid = [];
          var alreadyOnTheBoard = [];
      
          var count = 1;
          db.collection("games/"+gameId+"/moves")
          .orderBy("createDate", "desc")
          .limit(userLimit)
          .get()
          .then((querySnapshot) => {
              console.log("func_confirmMove querySnapshot");
              querySnapshot.forEach((doc) => {
                  console.log('count ' + count + ': ' + doc.data().uid + ' ' + doc.data().user + ' at ' + doc.data().createDate)
                  alreadyOnTheBoard[doc.data().uid] = true;
                  currentPlayerUid[count] = doc.data().uid;
                  count++;
              });
              //if we havn't had enough plays yet
              if (count <= userLimit){
                  console.log('not enough players allowing move');
                  if (alreadyOnTheBoard[uid]){
                      console.log('user on the board already: ' + uid);
                  }else{
                      database_setMove('move_'+e, docJson, count);
                  }
              }else if (currentPlayerUid[userLimit] == uid){
                  console.log('you are allowed to move');
                  database_setMove('move_'+e, docJson, count);
              }else{
                  console.log('not your turn player: ' + uid);
              }
          })
          .catch((error) => {
              console.log("Error getting documents: ", error);
          });
        
      }
    }
    
    const playerTwoMove = () => {
      console.log('playerTwoMove');

      if (!board_full) {

        do {
          selected = Math.floor(Math.random() * 9);
        } while (play_board[selected] != "");
        play_board[selected] = computer;

        db.collection("games/"+gameId+"/moves").doc('move_'+selected).set({
          move : selected,
          user : computer
        }).then((docRef) => {
            console.log("Document written with ID: " + 'move_'+selected);
            game_loop();
        }).catch((error) => {
            console.error("Error adding document: " + error);
        });

      }

    };
    
    const reset_board = () => {
      play_board = ["", "", "", "", "", "", "", "", ""];
      board_full = false;
      winner.classList.add("hidden");
      winner.classList.remove("tictactoe-playerWin");
      winner.classList.remove("tictactoe-computerWin");
      winner.classList.remove("tictactoe-draw");
      winner.innerText = "";
      game_loop();
    };
    
    //initial render
    db.collection("games/"+gameId+"/moves")
    .orderBy("createDate", "asc")
    .onSnapshot(function(querySnapshot) {
      console.log('game_tictactoe loading moves');

      var count = 0;
      playerBeforeLastUid = '';
      lastPlayerUid = '';

      querySnapshot.forEach(function(doc) {

        playerArray[count] = doc.data().uid;

        console.log(doc.data().user + ' played by ' + doc.data().uid);
        console.log('playerBeforeLastUid: ' + lastPlayerUid);

        playerBeforeLastUid = lastPlayerUid;
        count++;
        play_board[doc.data().move] = doc.data().user;
        lastPlayerUid = doc.data().uid;
        console.log('lastPlayerUid: ' + doc.data().uid);
      });

      $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
      $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');

      turn = (count % 2) ? "X" : "O"; 
      
      game_loop();

    });
}