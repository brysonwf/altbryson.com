var game_dotsandboxes = function(gameDoc){

  console.log('game_dotsandboxes init');
  
  // VARIABLES //
  var player, boxMade, score1, score2;
  var p1Color = "#F60303";
  var p2Color = "#042AFF";
  var board = [];
  var hArray = [];
  var vArray = [];
  var playerUid = [];
  
  var buildRowPair = function(row, size) {
    var sRowPair = '';
    sRowPair = buildLineRow(row, size);
    sRowPair += buildBoxRow(row, size);
    return sRowPair;
  }
  var buildBoxRow = function(row, size) {
    var s = '<tr>';
    for (var cellPair = 0; cellPair < size; cellPair++) {
      s += `<td><div id="v${row + (cellPair * size)}" class="line v"></div></td>`;
      s += `<td><div id="${row}-${cellPair}" class="box"></div></td>`;
    }
    s += `<td><div id="v${row + (cellPair * size)}" class="line v"></div></td>`;
    s += '</tr>\n';
    return s;
  }
  var buildLineRow = function(row, size) {
    var s = '<tr>';
    for (var cellPair = 0; cellPair < size; cellPair++) {
      var tmp = `<td><div id="h${row * size + cellPair}" class="line h"></div></td>`;
      s += '<td>•</td>';
      s += tmp;
    }
    s += '<td>•</td>' + '</tr>\n';
    return s;
  }

  var createBoard = function(x){

    player = 1;
    
    var html = '';
    for (var row = 0; row < x; row++) {
      html += buildRowPair(row, x);
    }
    html += buildLineRow(row, x);
    $('#table').html(html);
    
    var innerBrdArr = [];
    for(var i = 0; i < x; i++){
      innerBrdArr.push(0);
    }
    for(var i = 0; i < x; i++){
      board.push(innerBrdArr.slice());
    }
    for(var i = 0; i < (x*(x+1)); i++){
      hArray.push(false);
      vArray.push(false);
    }

  }

  var getAdjCells = function(lineId){

    var lineNum = parseInt(lineId.substr(1));
    var cells = [];
    var hasTwoCells;
    
    if(lineId[0] === 'h'){

      hArray[lineNum]=player;
      var row = Math.min((Math.floor(lineNum/board[0].length)), board[0].length);
      hasTwoCells = (row !== board.length && row !== 0);

      var col = Math.min((Math.floor(lineNum-board.length*row)), board[0].length-1);
      row -= row === board.length ? 1 : 0;

      cells.push({row: row, col: col});

      if (hasTwoCells) cells.push({row: row -1, col: col});

    } else {

      vArray[lineNum] = player;

      var col=Math.min((Math.floor(lineNum/board[0].length)), board[0].length);
      hasTwoCells = (col !== board.length && col !== 0);

      var row=Math.min((Math.floor(lineNum-board.length*col)), board[0].length-1);
      col -= col === board.length ? 1 : 0;

      cells.push({row: row, col: col});

      if (hasTwoCells) cells.push({row: row, col: col-1});
    }
    
    console.log('init database_setMove');
  
    db.collection("games/"+gameId+"/moves")
    .add({
      array: lineId[0],
      lineNum: lineNum,
      player: player,
      createDate: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log('move added');
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
    
    return cells;
  }

  var game_loop = function(){
    $('div.line').unbind( "click" ).on('click', handleClick);
    
    console.log('game_loop')
    boxMade = false;

    score1 = 0;
    score2 = 0;

    for(i = 0; i<board.length; i++){
      for(j = 0; j<board[i].length; j++){

        var $bx = $('#' + i + '-' + j);

        if(board[i][j] === 1){
          $($bx).css('background-color', p1Color);
          score1++;
        } else if(board[i][j] === 2){
          $($bx).css('background-color', p2Color);
          score2++;
        } else {
          $($bx).css('background-color', 'transparent');
        }

        $('div#s1 .score').html(score1.toString());
        $('div#s2 .score').html(score2.toString());

      };
    };

    console.log(board);

    function lineColor(lnArray, i, line){
      if(lnArray[i] === 1){
        $(line).css('background-color', p1Color).data('clicked', true);
      } else if(lnArray[i] === 2){
        $(line).css('background-color', p2Color).data('clicked', true);
      } else if (lnArray[i] === false){
        $(line).css('background-color', 'transparent');
      }
    }

    hArray.forEach(function(ln,idx){
      var $ln = $('#h' + idx);
      lineColor(hArray, idx, $ln);
    });
    vArray.forEach(function(ln,idx){
      var $ln = $('#v' + idx);
      lineColor(vArray, idx, $ln);
    });

  }

  var handleClick = function(evt){
    $('div.line').unbind( "click" );
    console.log('handleClick');
    console.log('player: ' + player);

    if($(this).data('clicked')) return;

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
            
            if (doc.data().currentPlayerUid == uid){
              isYourMove = true;
            }

            if (isYourMove){

              var cells = getAdjCells($(this).attr('id'));
              cells.forEach(function(cell) {
                var lineVals = getLineValsForCell(cell);
                if (!lineVals.includes(false)) {
                  boxMade = true;
                  console.log(board);
        
                  //set boardcell as used
                  board[cell.row][cell.col] = player;
        
                  db.collection("games/"+gameId+"/moves")
                  .add({
                    array: 'board',
                    row: cell.row,
                    col: cell.col,
                    player: player,
                    createDate: firebase.firestore.FieldValue.serverTimestamp()
                  })
                  .then((docRef) => {
                    console.log('boardcell move added');
                  }).catch((error) => {
                      console.error("Error adding document: " + error);
                  });
        
                }
              });
        
              console.log('boxMade: ' + boxMade);
        
              if(!boxMade){
                player = (player === 1) ? 2 : 1;

              } else {
                player = player;
              }

              var playerUidString = ''+playerUid[player];

              console.log('init database_setCurrentPlayer');
          
              db.collection("games")
              .doc(gameId)
              .set(
                  {
                    currentPlayer: player,
                    currentPlayerUid: playerUidString
                  },
                  { merge: true }
              );
              
              //check winner
              if (!hArray.includes(false) && !vArray.includes(false)){
                if(score1 > score2){
                  $('#message').html('PLAYER ONE WINS!');
                } else if(score1 < score2){
                  $('#message').html('PLAYER TWO WINS!');
                } else if(score1===score2){
                  $('#message').html(`It's a tie!`);
                  console.log('aftering winning');
                  console.log(score1);
                  console.log(score2);
                } else return;
              }
        
              game_loop();
              
            }else{
              console.log('not your move');
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    

  }

  var getLineValsForCell = function(cell) {
    var row = cell.row;
    var col = cell.col;
    var t = row * board[row].length + col;
    var b = t + board[row].length;
    var l = col * board[col].length + row;
    var r = l + board[col].length;
    return [hArray[t], vArray[r], hArray[b], vArray[l]];
  }

  hArray=[];
  vArray=[];

  createBoard(8);
  
  $('div.line').data('clicked', false);
  
  //initial watch
  db.collection("games/"+gameId+"/moves")
  .orderBy("createDate", "asc")
  .onSnapshot(function(querySnapshot) {
    console.log('game_dotsandboxes loading moves');

    //player data
    db.collection("games")
    .doc(gameId)
    .get().then((innerDoc) => {
      if (innerDoc.exists) {

        var count = 0;

        querySnapshot.forEach(function(doc) {

          console.log(doc);
          
          //game data
          switch(doc.data().array){
            case 'h':
              hArray[doc.data().lineNum] = doc.data().player;
              break;
            case 'v':
              vArray[doc.data().lineNum] = doc.data().player;
              break;
            case 'board':
              board[doc.data().row][doc.data().col] = doc.data().player;
              break;  
          }
          count++;
        });
        
        console.log('ui set for game player = ' + innerDoc.data().currentPlayer);
    
        if(innerDoc.data().currentPlayer == 2){
          player = 2;
          
          playerBeforeLastUid = playerUid[2];
          lastPlayerUid = playerUid[1];

        } else {
          player = 1;
          
          playerBeforeLastUid = playerUid[1];
          lastPlayerUid = playerUid[2];

        }

        $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
        $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');
        
        game_loop();

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  });

}