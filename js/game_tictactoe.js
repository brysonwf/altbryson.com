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
          document.querySelector(`#block_${i}`).classList.add("tictactoe-win");
          document.querySelector(`#block_${i + 1}`).classList.add("tictactoe-win");
          document.querySelector(`#block_${i + 2}`).classList.add("tictactoe-win");
          return play_board[i];
        }
      }
      for (i = 0; i < 3; i++) {
        if (check_line(i, i + 3, i + 6)) {
          document.querySelector(`#block_${i}`).classList.add("tictactoe-win");
          document.querySelector(`#block_${i + 3}`).classList.add("tictactoe-win");
          document.querySelector(`#block_${i + 6}`).classList.add("tictactoe-win");
          return play_board[i];
        }
      }
      if (check_line(0, 4, 8)) {
        document.querySelector("#block_0").classList.add("tictactoe-win");
        document.querySelector("#block_4").classList.add("tictactoe-win");
        document.querySelector("#block_8").classList.add("tictactoe-win");
        return play_board[0];
      }
      if (check_line(2, 4, 6)) {
        document.querySelector("#block_2").classList.add("tictactoe-win");
        document.querySelector("#block_4").classList.add("tictactoe-win");
        document.querySelector("#block_6").classList.add("tictactoe-win");
        return play_board[2];
      }
      return "";
    };
    
    const check_for_winner = () => {
      let res = check_match()
      if (res == player) {
        winner.innerText = "Winner is player!!";
        winner.classList.add("playerWin");
        winner.classList.remove("hidden");
        board_full = true
      } else if (res == computer) {
        winner.innerText = "Winner is computer";
        winner.classList.add("computerWin");
        winner.classList.remove("hidden");
        board_full = true
      } else if (board_full) {
        winner.innerText = "Draw!";
        winner.classList.add("draw");
        winner.classList.remove("hidden");
      }
    };

    console.log("database_loadGamesList");
    
    const game_loop = () => {

      board_container.innerHTML = ""
      play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="tictactoe-block" data-move="${i}">${play_board[i]}</div>`;
        if (e == player || e == computer) {
          document.querySelector(`#block_${i}`).classList.add("tictactoe-occupied");
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
        play_board[e] = player;
        
        db.collection("games/"+gameId+"/moves").doc('move_'+e).set({
          move : e,
          user : turn
        }).then((docRef) => {
            console.log("Document written with ID: " + 'move_'+e);
            game_loop();
            // playerTwoMove();
        }).catch((error) => {
            console.error("Error adding document: "+ error);
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
    db.collection("games/"+gameId+"/moves").onSnapshot(function(querySnapshot) {
      var count = 0;
      querySnapshot.forEach(function(doc) {
        count++;
        play_board[doc.data().move] = doc.data().user
      });
      turn = (count % 2) ? "O" : "X"; 
      game_loop();
    });
}