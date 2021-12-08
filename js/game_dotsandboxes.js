var game_dotsandboxes = function(){

  console.log('game_dotsandboxes init');
  
  // VARIABLES //
  var player, boxMade, score1, score2, boardSize, $line;
  var p1Color = "#F60303";
  var p2Color = "#042AFF";
  var board = [];
  var hArray = [];
  var vArray = [];
  var $message = $('#message');
  var $score1 = $('div#s1');
  var $score2 = $('div#s2');
  var $player1 = $('div#p1');
  var $player2 = $('div#p2');
  var $table = $('#table');

  // CONSTANTS //
  var dotTd = '<td>•</td>';

  // EVENT LISTENERS //
  var registerListeners = function() {
    $line = $('div.line')
    $line.on('click', handleClick);
    $line.on('mouseenter', lineHover);
    $line.on('mouseleave', lineUnhover);
  }

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
      s += dotTd;
      s += tmp;
    }
    s += dotTd + '</tr>\n';
    return s;
  }

  var createBoard = function(x){
    player = 1;

    var html = '';
    for (var row = 0; row < x; row++) {
      html += buildRowPair(row, x);
    }
    html += buildLineRow(row, x);
    $table.html(html);

    render();
    updateTurnMessage();

    $message.html('');

  }

  var createBoardArrays = function(x) {
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

  var lineHover = function(evt){
    if($(this).data('clicked')){
        return;
    } else if (player === 1){
      $(this).css('background-color', p1Color);
    }else if (player === 2){
      $(this).css('background-color', p2Color);
    }
  }

  var lineUnhover = function(evt){
    if($(this).data('clicked')){
        return;
    } else {
      $(this).css('background-color', 'transparent');
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
    return cells;
  }

  var render = function(){
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
        $score1.html(score1.toString());
        $score2.html(score2.toString());
      };
    };
    console.log(board);
    
    boxMade = false;
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
    updateTurnMessage();
  }

  var switchPlayer = function(){
    if(!boxMade){
      player = (player === 1) ? 2 : 1;
    } else {
      player = player;
    }
  }

  var checkWinner = function(){
    if (!hArray.includes(false) && !vArray.includes(false)){
      if(score1 > score2){
        $message.html('PLAYER ONE WINS!');
      } else if(score1 < score2){
        $message.html('PLAYER TWO WINS!');
      } else if(score1===score2){
        $message.html(`It's a tie!`);
        console.log('aftering winning');
        console.log(score1);
        console.log(score2);
      } else return;
    }
  }

  var updateTurnMessage = function(){
    if(player === 1){
      $player1.css('text-decoration', 'underline');
      $player2.css('text-decoration', 'none');
    } else {
      $player2.css('text-decoration', 'underline');
      $player1.css('text-decoration', 'none');
    }
  }

  var handleClick = function(evt){
    if($(this).data('clicked')) return;
    var cells = getAdjCells($(this).attr('id'));
    cells.forEach(function(cell) {
      var lineVals = getLineValsForCell(cell);
      if (!lineVals.includes(false)) {
        board[cell.row][cell.col] = player;
        console.log(board);
        boxMade = true;
      }
    });
    switchPlayer();
    render();
    checkWinner();
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

  $('#board').show();
  hArray=[];
  vArray=[];
  boardSize = 8;
  createBoard(boardSize);
  createBoardArrays(boardSize);
  registerListeners();
  $line.data('clicked', false);
  
  //initial watch
  db.collection("games/"+gameId+"/moves")
  .orderBy("createDate", "asc")
  .onSnapshot(function(querySnapshot) {
    
    console.log('game_dotsandboxes loading moves');

    var count = 0;
    playerBeforeLastUid = '';
    lastPlayerUid = '';

    querySnapshot.forEach(function(doc) {

      //player data
      playerArray[count] = doc.data().uid;
      playerBeforeLastUid = lastPlayerUid;
      lastPlayerUid = doc.data().uid;

      //game data
      gameBoard[doc.data().move] = doc.data().game_unit;

      count++;
    });

    $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
    $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');


  });

}