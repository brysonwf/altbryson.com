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
        winner.innerText = 'Winner is:' + $('#uid-'+playerArray[2]).html());
      } else if (res == computer) {
        board_full = true
        winner.classList.remove("hidden");
        database_setGameComplete(playerArray[1]);
        winner.innerText = 'Winner is:' + $('#uid-'+playerArray[1]).html());
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
    
    database_setGameUser();
    database_setGameInfo();
    
    //initial render
    db.collection("games/"+gameId+"/moves")
    .orderBy("createDate", "asc")
    .onSnapshot(function(querySnapshot) {
      console.log('game_tictactoe loading moves');

      var count = 0;
      playerBeforeLastUid = '';
      lastPlayerUid = '';
      
      database_setGameActive();

      querySnapshot.forEach(function(doc) {
        console.log(doc.data().user + ' played by ' + doc.data().uid);

        play_board[doc.data().move] = doc.data().user;
        playerArray[count] = doc.data().uid;
        playerBeforeLastUid = lastPlayerUid;
        lastPlayerUid = doc.data().uid;

        count++;
      });

      console.log('playerBeforeLastUid: ' + playerBeforeLastUid);
      console.log('lastPlayerUid: ' + lastPlayerUid);

      turn = (count % 2) ? "X" : "O"; 
      
      database_loadGameUsers();
      game_loop();

    });
}