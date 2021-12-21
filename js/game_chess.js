

var chessgame = null;
var board = null;
var game_chess = function(gameDoc){
  console.log('init game_chess');
  
  // NOTE: this example uses the chess.js library:
  // https://github.com/jhlywa/chess.js
  // NOTE: this example uses the chess.js library:
  // https://github.com/jhlywa/chess.js

  board = null
  chessgame = new Chess()
  var $status = $('#status')
  var $fen = $('#fen')
  var $pgn = $('#pgn')
  var whiteSquareGrey = '#a9a9a9'
  var blackSquareGrey = '#696969'
  var moveCount = 0;
  var playerArray = [];

  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the chessgame is over
    if (chessgame.game_over()) return false

    // only pick up pieces for the side to move
    if ((chessgame.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chessgame.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd () {
    board.position(chessgame.fen())
  }

  function updateStatus () {
    var status = ''

    var moveColor = 'White'
    if (chessgame.turn() === 'b') {
      moveColor = 'Black'
    }

    // checkmate?
    if (chessgame.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (chessgame.in_draw()) {
      status = 'Game over, drawn position'
    }

    // chessgame still on
    else {
      status = moveColor + ' to move'

      // check?
      if (chessgame.in_check()) {
        status += ', ' + moveColor + ' is in check'
      }
    }
    
    $status.html(status)
    $fen.html(chessgame.fen())
    $pgn.html(chessgame.pgn())

    console.log('game_chess update');
  }

  function removeGreySquares () {
    $('#myBoard .square-55d63').css('background', '')
  }

  function greySquare (square) {
    var $square = $('#myBoard .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }

    $square.css('background', background)
  }

  function onDragStart (source, piece) {
    // do not pick up pieces if the chessgame is over
    if (chessgame.game_over()) return false

    // or if it's not that side's turn
    if ((chessgame.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chessgame.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  function onDrop (source, target) {

    // see if the move is legal
    var move = chessgame.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    removeGreySquares()
    updateStatus()
    
    
    var docJson = {
      status: $status.html(),
      fen: chessgame.fen(),
      pgn: chessgame.pgn()
    }

    database_setMove('count_'+moveCount, docJson, moveCount);
  }

  function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = chessgame.moves({
      square: square,
      verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
  }

  function onMouseoutSquare (square, piece) {
    removeGreySquares()
  }
  
  database_setGameUser();
  database_setGameInfo();
  
  //initial render
  db.collection("games/"+gameId+"/moves")
  .orderBy("createDate", "asc")
  .onSnapshot(function(querySnapshot) {
    console.log('game_chess loading moves');

    moveCount = 1;
    playerBeforeLastUid = '';
    lastPlayerUid = '';
    
    database_setGameActive();

    var current_fen = 'start';

    querySnapshot.forEach(function(doc) {
      console.log('game_chess forEach ' + doc.data().user + ' played by ' + doc.data().uid);

      playerArray[moveCount] = doc.data().uid;
      playerBeforeLastUid = lastPlayerUid;
      lastPlayerUid = doc.data().uid;

      current_fen = doc.data().fen;
      current_status = doc.data().status;
      current_pgn = doc.data().pgn;

      moveCount++;

    });

    chessgame.setTurn((moveCount % 2) ? "w" : "b")

    console.log('playerBeforeLastUid: ' + playerBeforeLastUid);
    console.log('lastPlayerUid: ' + lastPlayerUid);
    
    database_loadGameUsers();
  
    var config = {
      draggable: true,
      position: current_fen,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd
    }
    
    board = Chessboard('myBoard', config);
    chessgame.load_pgn(current_pgn);

    updateStatus();

  });
}
