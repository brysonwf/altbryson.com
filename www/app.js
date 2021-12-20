var appManager = {
  // Application Constructor
  init: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    var isPhoneApp =
      document.URL.indexOf("http://") === -1 &&
      document.URL.indexOf("https://") === -1;
    if (isPhoneApp) {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    } else {
      appManager.onDeviceReady();
    }
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    $(document).ready(function (e) {
      // console.log('onDeviceReady init')
      firebase_init();
    });
  },
};

var btn_hide = function(){
    $('.btn-hide').click(function(){
        $(this).parent().addClass('hidden');
    })
}
var button_create_game = function(){
    $(".button_create_game").click(function () {
        var type = $(this).data("type");
        db.collection("games").add({
            type: type,
            dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            uid: firebase.auth().currentUser.uid,
            moveCount : 0,
            create: [],
            read: [],
            update: [],
            delete: [],
            photoUrl: userData.photoUrl
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            window.location = "/g/" + type + "/" + docRef.id;
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });
}
var button_login = function(){
    console.log('button_login init');
    $(".button_login").removeClass('hidden').click(function () {
        $('#modalLogin').modal('show');
    });
}
var button_logout = function(){
    $(".button_logout").on('click', function () {
        console.log('button_logout');
        firebase_signOut();
        location.reload();
    });
}
/*
 * Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

var Chess = function (fen) {
    var BLACK = 'b'
    var WHITE = 'w'
  
    var EMPTY = -1
  
    var PAWN = 'p'
    var KNIGHT = 'n'
    var BISHOP = 'b'
    var ROOK = 'r'
    var QUEEN = 'q'
    var KING = 'k'
  
    var SYMBOLS = 'pnbrqkPNBRQK'
  
    var DEFAULT_POSITION =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  
    var TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*']
  
    var PAWN_OFFSETS = {
      b: [16, 32, 17, 15],
      w: [-16, -32, -17, -15],
    }
  
    var PIECE_OFFSETS = {
      n: [-18, -33, -31, -14, 18, 33, 31, 14],
      b: [-17, -15, 17, 15],
      r: [-16, 1, 16, -1],
      q: [-17, -16, -15, 1, 17, 16, 15, -1],
      k: [-17, -16, -15, 1, 17, 16, 15, -1],
    }
  
    // prettier-ignore
    var ATTACKS = [
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
      24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
    ];
  
    // prettier-ignore
    var RAYS = [
       17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
        0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
        0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
        0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
        0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
        1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
        0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
        0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
        0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
        0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
      -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
    ];
  
    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }
  
    var FLAGS = {
      NORMAL: 'n',
      CAPTURE: 'c',
      BIG_PAWN: 'b',
      EP_CAPTURE: 'e',
      PROMOTION: 'p',
      KSIDE_CASTLE: 'k',
      QSIDE_CASTLE: 'q',
    }
  
    var BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      BIG_PAWN: 4,
      EP_CAPTURE: 8,
      PROMOTION: 16,
      KSIDE_CASTLE: 32,
      QSIDE_CASTLE: 64,
    }
  
    var RANK_1 = 7
    var RANK_2 = 6
    var RANK_3 = 5
    var RANK_4 = 4
    var RANK_5 = 3
    var RANK_6 = 2
    var RANK_7 = 1
    var RANK_8 = 0
  
    // prettier-ignore
    var SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };
  
    var ROOKS = {
      w: [
        { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE },
      ],
      b: [
        { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE },
      ],
    }
  
    var board = new Array(128)
    var kings = { w: EMPTY, b: EMPTY }
    var turn = WHITE
    var castling = { w: 0, b: 0 }
    var ep_square = EMPTY
    var half_moves = 0
    var move_number = 1
    var history = []
    var header = {}
    var comments = {}
  
    /* if the user passes in a fen string, load it, else default to
     * starting position
     */
    if (typeof fen === 'undefined') {
      load(DEFAULT_POSITION)
    } else {
      load(fen)
    }
  
    function clear(keep_headers) {
      if (typeof keep_headers === 'undefined') {
        keep_headers = false
      }
  
      board = new Array(128)
      kings = { w: EMPTY, b: EMPTY }
      turn = WHITE
      castling = { w: 0, b: 0 }
      ep_square = EMPTY
      half_moves = 0
      move_number = 1
      history = []
      if (!keep_headers) header = {}
      comments = {}
      update_setup(generate_fen())
    }
  
    function prune_comments() {
      var reversed_history = []
      var current_comments = {}
      var copy_comment = function (fen) {
        if (fen in comments) {
          current_comments[fen] = comments[fen]
        }
      }
      while (history.length > 0) {
        reversed_history.push(undo_move())
      }
      copy_comment(generate_fen())
      while (reversed_history.length > 0) {
        make_move(reversed_history.pop())
        copy_comment(generate_fen())
      }
      comments = current_comments
    }
  
    function reset() {
      load(DEFAULT_POSITION)
    }
  
    function load(fen, keep_headers) {
      if (typeof keep_headers === 'undefined') {
        keep_headers = false
      }
  
      var tokens = fen.split(/\s+/)
      var position = tokens[0]
      var square = 0
  
      if (!validate_fen(fen).valid) {
        return false
      }
  
      clear(keep_headers)
  
      for (var i = 0; i < position.length; i++) {
        var piece = position.charAt(i)
  
        if (piece === '/') {
          square += 8
        } else if (is_digit(piece)) {
          square += parseInt(piece, 10)
        } else {
          var color = piece < 'a' ? WHITE : BLACK
          put({ type: piece.toLowerCase(), color: color }, algebraic(square))
          square++
        }
      }
  
      turn = tokens[1]
  
      if (tokens[2].indexOf('K') > -1) {
        castling.w |= BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('Q') > -1) {
        castling.w |= BITS.QSIDE_CASTLE
      }
      if (tokens[2].indexOf('k') > -1) {
        castling.b |= BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('q') > -1) {
        castling.b |= BITS.QSIDE_CASTLE
      }
  
      ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]]
      half_moves = parseInt(tokens[4], 10)
      move_number = parseInt(tokens[5], 10)
  
      update_setup(generate_fen())
  
      return true
    }
  
    /* TODO: this function is pretty much crap - it validates structure but
     * completely ignores content (e.g. doesn't verify that each side has a king)
     * ... we should rewrite this, and ditch the silly error_number field while
     * we're at it
     */
    function validate_fen(fen) {
      var errors = {
        0: 'No errors.',
        1: 'FEN string must contain six space-delimited fields.',
        2: '6th field (move number) must be a positive integer.',
        3: '5th field (half move counter) must be a non-negative integer.',
        4: '4th field (en-passant square) is invalid.',
        5: '3rd field (castling availability) is invalid.',
        6: '2nd field (side to move) is invalid.',
        7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
        8: '1st field (piece positions) is invalid [consecutive numbers].',
        9: '1st field (piece positions) is invalid [invalid piece].',
        10: '1st field (piece positions) is invalid [row too large].',
        11: 'Illegal en-passant square',
      }
  
      /* 1st criterion: 6 space-seperated fields? */
      var tokens = fen.split(/\s+/)
      if (tokens.length !== 6) {
        return { valid: false, error_number: 1, error: errors[1] }
      }
  
      /* 2nd criterion: move number field is a integer value > 0? */
      if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
        return { valid: false, error_number: 2, error: errors[2] }
      }
  
      /* 3rd criterion: half move counter is an integer >= 0? */
      if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
        return { valid: false, error_number: 3, error: errors[3] }
      }
  
      /* 4th criterion: 4th field is a valid e.p.-string? */
      if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { valid: false, error_number: 4, error: errors[4] }
      }
  
      /* 5th criterion: 3th field is a valid castle-string? */
      if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
        return { valid: false, error_number: 5, error: errors[5] }
      }
  
      /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
      if (!/^(w|b)$/.test(tokens[1])) {
        return { valid: false, error_number: 6, error: errors[6] }
      }
  
      /* 7th criterion: 1st field contains 8 rows? */
      var rows = tokens[0].split('/')
      if (rows.length !== 8) {
        return { valid: false, error_number: 7, error: errors[7] }
      }
  
      /* 8th criterion: every row is valid? */
      for (var i = 0; i < rows.length; i++) {
        /* check for right sum of fields AND not two numbers in succession */
        var sum_fields = 0
        var previous_was_number = false
  
        for (var k = 0; k < rows[i].length; k++) {
          if (!isNaN(rows[i][k])) {
            if (previous_was_number) {
              return { valid: false, error_number: 8, error: errors[8] }
            }
            sum_fields += parseInt(rows[i][k], 10)
            previous_was_number = true
          } else {
            if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
              return { valid: false, error_number: 9, error: errors[9] }
            }
            sum_fields += 1
            previous_was_number = false
          }
        }
        if (sum_fields !== 8) {
          return { valid: false, error_number: 10, error: errors[10] }
        }
      }
  
      if (
        (tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')
      ) {
        return { valid: false, error_number: 11, error: errors[11] }
      }
  
      /* everything's okay! */
      return { valid: true, error_number: 0, error: errors[0] }
    }
  
    function generate_fen() {
      var empty = 0
      var fen = ''
  
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          empty++
        } else {
          if (empty > 0) {
            fen += empty
            empty = 0
          }
          var color = board[i].color
          var piece = board[i].type
  
          fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
        }
  
        if ((i + 1) & 0x88) {
          if (empty > 0) {
            fen += empty
          }
  
          if (i !== SQUARES.h1) {
            fen += '/'
          }
  
          empty = 0
          i += 8
        }
      }
  
      var cflags = ''
      if (castling[WHITE] & BITS.KSIDE_CASTLE) {
        cflags += 'K'
      }
      if (castling[WHITE] & BITS.QSIDE_CASTLE) {
        cflags += 'Q'
      }
      if (castling[BLACK] & BITS.KSIDE_CASTLE) {
        cflags += 'k'
      }
      if (castling[BLACK] & BITS.QSIDE_CASTLE) {
        cflags += 'q'
      }
  
      /* do we have an empty castling flag? */
      cflags = cflags || '-'
      var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square)
  
      return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
    }
  
    function set_header(args) {
      for (var i = 0; i < args.length; i += 2) {
        if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
          header[args[i]] = args[i + 1]
        }
      }
      return header
    }
  
    /* called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object.  if the FEN is
     * equal to the default position, the SetUp and FEN are deleted
     * the setup is only updated if history.length is zero, ie moves haven't been
     * made.
     */
    function update_setup(fen) {
      if (history.length > 0) return
  
      if (fen !== DEFAULT_POSITION) {
        header['SetUp'] = '1'
        header['FEN'] = fen
      } else {
        delete header['SetUp']
        delete header['FEN']
      }
    }
  
    function get(square) {
      var piece = board[SQUARES[square]]
      return piece ? { type: piece.type, color: piece.color } : null
    }
  
    function put(piece, square) {
      /* check for valid piece object */
      if (!('type' in piece && 'color' in piece)) {
        return false
      }
  
      /* check for piece */
      if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
        return false
      }
  
      /* check for valid square */
      if (!(square in SQUARES)) {
        return false
      }
  
      var sq = SQUARES[square]
  
      /* don't let the user place more than one king */
      if (
        piece.type == KING &&
        !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
      ) {
        return false
      }
  
      board[sq] = { type: piece.type, color: piece.color }
      if (piece.type === KING) {
        kings[piece.color] = sq
      }
  
      update_setup(generate_fen())
  
      return true
    }
  
    function remove(square) {
      var piece = get(square)
      board[SQUARES[square]] = null
      if (piece && piece.type === KING) {
        kings[piece.color] = EMPTY
      }
  
      update_setup(generate_fen())
  
      return piece
    }
  
    function build_move(board, from, to, flags, promotion) {
      var move = {
        color: turn,
        from: from,
        to: to,
        flags: flags,
        piece: board[from].type,
      }
  
      if (promotion) {
        move.flags |= BITS.PROMOTION
        move.promotion = promotion
      }
  
      if (board[to]) {
        move.captured = board[to].type
      } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN
      }
      return move
    }
  
    function generate_moves(options) {
      function add_move(board, moves, from, to, flags) {
        /* if pawn promotion */
        if (
          board[from].type === PAWN &&
          (rank(to) === RANK_8 || rank(to) === RANK_1)
        ) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT]
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]))
          }
        } else {
          moves.push(build_move(board, from, to, flags))
        }
      }
  
      var moves = []
      var us = turn
      var them = swap_color(us)
      var second_rank = { b: RANK_7, w: RANK_2 }
  
      var first_sq = SQUARES.a8
      var last_sq = SQUARES.h1
      var single_square = false
  
      /* do we want legal moves? */
      var legal =
        typeof options !== 'undefined' && 'legal' in options
          ? options.legal
          : true
  
      var piece_type =
        typeof options !== 'undefined' &&
        'piece' in options &&
        typeof options.piece === 'string'
          ? options.piece.toLowerCase()
          : true
  
      /* are we generating moves for a single square? */
      if (typeof options !== 'undefined' && 'square' in options) {
        if (options.square in SQUARES) {
          first_sq = last_sq = SQUARES[options.square]
          single_square = true
        } else {
          /* invalid square */
          return []
        }
      }
  
      for (var i = first_sq; i <= last_sq; i++) {
        /* did we run off the end of the board */
        if (i & 0x88) {
          i += 7
          continue
        }
  
        var piece = board[i]
        if (piece == null || piece.color !== us) {
          continue
        }
  
        if (piece.type === PAWN && (piece_type === true || piece_type === PAWN)) {
          /* single square, non-capturing */
          var square = i + PAWN_OFFSETS[us][0]
          if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL)
  
            /* double square */
            var square = i + PAWN_OFFSETS[us][1]
            if (second_rank[us] === rank(i) && board[square] == null) {
              add_move(board, moves, i, square, BITS.BIG_PAWN)
            }
          }
  
          /* pawn captures */
          for (j = 2; j < 4; j++) {
            var square = i + PAWN_OFFSETS[us][j]
            if (square & 0x88) continue
  
            if (board[square] != null && board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE)
            } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE)
            }
          }
        } else if (piece_type === true || piece_type === piece.type) {
          for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
            var offset = PIECE_OFFSETS[piece.type][j]
            var square = i
  
            while (true) {
              square += offset
              if (square & 0x88) break
  
              if (board[square] == null) {
                add_move(board, moves, i, square, BITS.NORMAL)
              } else {
                if (board[square].color === us) break
                add_move(board, moves, i, square, BITS.CAPTURE)
                break
              }
  
              /* break, if knight or king */
              if (piece.type === 'n' || piece.type === 'k') break
            }
          }
        }
      }
  
      /* check for castling if: a) we're generating all moves, or b) we're doing
       * single square move generation on the king's square
       */
      if (piece_type === true || piece_type === KING) {
        if (!single_square || last_sq === kings[us]) {
          /* king-side castling */
          if (castling[us] & BITS.KSIDE_CASTLE) {
            var castling_from = kings[us]
            var castling_to = castling_from + 2
  
            if (
              board[castling_from + 1] == null &&
              board[castling_to] == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from + 1) &&
              !attacked(them, castling_to)
            ) {
              add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE)
            }
          }
  
          /* queen-side castling */
          if (castling[us] & BITS.QSIDE_CASTLE) {
            var castling_from = kings[us]
            var castling_to = castling_from - 2
  
            if (
              board[castling_from - 1] == null &&
              board[castling_from - 2] == null &&
              board[castling_from - 3] == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from - 1) &&
              !attacked(them, castling_to)
            ) {
              add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE)
            }
          }
        }
      }
  
      /* return all pseudo-legal moves (this includes moves that allow the king
       * to be captured)
       */
      if (!legal) {
        return moves
      }
  
      /* filter out illegal moves */
      var legal_moves = []
      for (var i = 0, len = moves.length; i < len; i++) {
        make_move(moves[i])
        if (!king_attacked(us)) {
          legal_moves.push(moves[i])
        }
        undo_move()
      }
  
      return legal_moves
    }
  
    /* convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} sloppy Use the sloppy SAN generator to work around over
     * disambiguation bugs in Fritz and Chessbase.  See below:
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    function move_to_san(move, moves) {
      var output = ''
  
      if (move.flags & BITS.KSIDE_CASTLE) {
        output = 'O-O'
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        output = 'O-O-O'
      } else {
        if (move.piece !== PAWN) {
          var disambiguator = get_disambiguator(move, moves)
          output += move.piece.toUpperCase() + disambiguator
        }
  
        if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          if (move.piece === PAWN) {
            output += algebraic(move.from)[0]
          }
          output += 'x'
        }
  
        output += algebraic(move.to)
  
        if (move.flags & BITS.PROMOTION) {
          output += '=' + move.promotion.toUpperCase()
        }
      }
  
      make_move(move)
      if (in_check()) {
        if (in_checkmate()) {
          output += '#'
        } else {
          output += '+'
        }
      }
      undo_move()
  
      return output
    }
    // parses all of the decorators out of a SAN string
    function stripped_san(move) {
      return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
    }
  
    function attacked(color, square) {
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        /* did we run off the end of the board */
        if (i & 0x88) {
          i += 7
          continue
        }
  
        /* if empty square or wrong color */
        if (board[i] == null || board[i].color !== color) continue
  
        var piece = board[i]
        var difference = i - square
        var index = difference + 119
  
        if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
          if (piece.type === PAWN) {
            if (difference > 0) {
              if (piece.color === WHITE) return true
            } else {
              if (piece.color === BLACK) return true
            }
            continue
          }
  
          /* if the piece is a knight or a king */
          if (piece.type === 'n' || piece.type === 'k') return true
  
          var offset = RAYS[index]
          var j = i + offset
  
          var blocked = false
          while (j !== square) {
            if (board[j] != null) {
              blocked = true
              break
            }
            j += offset
          }
  
          if (!blocked) return true
        }
      }
  
      return false
    }
  
    function king_attacked(color) {
      return attacked(swap_color(color), kings[color])
    }
  
    function in_check() {
      return king_attacked(turn)
    }
  
    function in_checkmate() {
      return in_check() && generate_moves().length === 0
    }
  
    function in_stalemate() {
      return !in_check() && generate_moves().length === 0
    }
  
    function insufficient_material() {
      var pieces = {}
      var bishops = []
      var num_pieces = 0
      var sq_color = 0
  
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        sq_color = (sq_color + 1) % 2
        if (i & 0x88) {
          i += 7
          continue
        }
  
        var piece = board[i]
        if (piece) {
          pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1
          if (piece.type === BISHOP) {
            bishops.push(sq_color)
          }
          num_pieces++
        }
      }
  
      /* k vs. k */
      if (num_pieces === 2) {
        return true
      } else if (
        /* k vs. kn .... or .... k vs. kb */
        num_pieces === 3 &&
        (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
      ) {
        return true
      } else if (num_pieces === pieces[BISHOP] + 2) {
        /* kb vs. kb where any number of bishops are all on the same color */
        var sum = 0
        var len = bishops.length
        for (var i = 0; i < len; i++) {
          sum += bishops[i]
        }
        if (sum === 0 || sum === len) {
          return true
        }
      }
  
      return false
    }
  
    function in_threefold_repetition() {
      /* TODO: while this function is fine for casual use, a better
       * implementation would use a Zobrist key (instead of FEN). the
       * Zobrist key would be maintained in the make_move/undo_move functions,
       * avoiding the costly that we do below.
       */
      var moves = []
      var positions = {}
      var repetition = false
  
      while (true) {
        var move = undo_move()
        if (!move) break
        moves.push(move)
      }
  
      while (true) {
        /* remove the last two fields in the FEN string, they're not needed
         * when checking for draw by rep */
        var fen = generate_fen().split(' ').slice(0, 4).join(' ')
  
        /* has the position occurred three or move times */
        positions[fen] = fen in positions ? positions[fen] + 1 : 1
        if (positions[fen] >= 3) {
          repetition = true
        }
  
        if (!moves.length) {
          break
        }
        make_move(moves.pop())
      }
  
      return repetition
    }
  
    function push(move) {
      history.push({
        move: move,
        kings: { b: kings.b, w: kings.w },
        turn: turn,
        castling: { b: castling.b, w: castling.w },
        ep_square: ep_square,
        half_moves: half_moves,
        move_number: move_number,
      })
    }
  
    function make_move(move) {
      var us = turn
      var them = swap_color(us)
      push(move)
  
      board[move.to] = board[move.from]
      board[move.from] = null
  
      /* if ep capture, remove the captured pawn */
      if (move.flags & BITS.EP_CAPTURE) {
        if (turn === BLACK) {
          board[move.to - 16] = null
        } else {
          board[move.to + 16] = null
        }
      }
  
      /* if pawn promotion, replace with new piece */
      if (move.flags & BITS.PROMOTION) {
        board[move.to] = { type: move.promotion, color: us }
      }
  
      /* if we moved the king */
      if (board[move.to].type === KING) {
        kings[board[move.to].color] = move.to
  
        /* if we castled, move the rook next to the king */
        if (move.flags & BITS.KSIDE_CASTLE) {
          var castling_to = move.to - 1
          var castling_from = move.to + 1
          board[castling_to] = board[castling_from]
          board[castling_from] = null
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          var castling_to = move.to + 1
          var castling_from = move.to - 2
          board[castling_to] = board[castling_from]
          board[castling_from] = null
        }
  
        /* turn off castling */
        castling[us] = ''
      }
  
      /* turn off castling if we move a rook */
      if (castling[us]) {
        for (var i = 0, len = ROOKS[us].length; i < len; i++) {
          if (
            move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag
          ) {
            castling[us] ^= ROOKS[us][i].flag
            break
          }
        }
      }
  
      /* turn off castling if we capture a rook */
      if (castling[them]) {
        for (var i = 0, len = ROOKS[them].length; i < len; i++) {
          if (
            move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag
          ) {
            castling[them] ^= ROOKS[them][i].flag
            break
          }
        }
      }
  
      /* if big pawn move, update the en passant square */
      if (move.flags & BITS.BIG_PAWN) {
        if (turn === 'b') {
          ep_square = move.to - 16
        } else {
          ep_square = move.to + 16
        }
      } else {
        ep_square = EMPTY
      }
  
      /* reset the 50 move counter if a pawn is moved or a piece is captured */
      if (move.piece === PAWN) {
        half_moves = 0
      } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        half_moves = 0
      } else {
        half_moves++
      }
  
      if (turn === BLACK) {
        move_number++
      }
      turn = swap_color(turn)
    }
  
    function undo_move() {
      var old = history.pop()
      if (old == null) {
        return null
      }
  
      var move = old.move
      kings = old.kings
      turn = old.turn
      castling = old.castling
      ep_square = old.ep_square
      half_moves = old.half_moves
      move_number = old.move_number
  
      var us = turn
      var them = swap_color(turn)
  
      board[move.from] = board[move.to]
      board[move.from].type = move.piece // to undo any promotions
      board[move.to] = null
  
      if (move.flags & BITS.CAPTURE) {
        board[move.to] = { type: move.captured, color: them }
      } else if (move.flags & BITS.EP_CAPTURE) {
        var index
        if (us === BLACK) {
          index = move.to - 16
        } else {
          index = move.to + 16
        }
        board[index] = { type: PAWN, color: them }
      }
  
      if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
        var castling_to, castling_from
        if (move.flags & BITS.KSIDE_CASTLE) {
          castling_to = move.to + 1
          castling_from = move.to - 1
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          castling_to = move.to - 2
          castling_from = move.to + 1
        }
  
        board[castling_to] = board[castling_from]
        board[castling_from] = null
      }
  
      return move
    }
  
    /* this function is used to uniquely identify ambiguous moves */
    function get_disambiguator(move, moves) {
      var from = move.from
      var to = move.to
      var piece = move.piece
  
      var ambiguities = 0
      var same_rank = 0
      var same_file = 0
  
      for (var i = 0, len = moves.length; i < len; i++) {
        var ambig_from = moves[i].from
        var ambig_to = moves[i].to
        var ambig_piece = moves[i].piece
  
        /* if a move of the same piece type ends on the same to square, we'll
         * need to add a disambiguator to the algebraic notation
         */
        if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
          ambiguities++
  
          if (rank(from) === rank(ambig_from)) {
            same_rank++
          }
  
          if (file(from) === file(ambig_from)) {
            same_file++
          }
        }
      }
  
      if (ambiguities > 0) {
        /* if there exists a similar moving piece on the same rank and file as
         * the move in question, use the square as the disambiguator
         */
        if (same_rank > 0 && same_file > 0) {
          return algebraic(from)
        } else if (same_file > 0) {
          /* if the moving piece rests on the same file, use the rank symbol as the
           * disambiguator
           */
          return algebraic(from).charAt(1)
        } else {
          /* else use the file symbol */
          return algebraic(from).charAt(0)
        }
      }
  
      return ''
    }
  
    function infer_piece_type(san) {
      var piece_type = san.charAt(0)
      if (piece_type >= 'a' && piece_type <= 'h') {
        var matches = san.match(/[a-h]\d.*[a-h]\d/)
        if (matches) {
          return undefined
        }
        return PAWN
      }
      piece_type = piece_type.toLowerCase()
      if (piece_type === 'o') {
        return KING
      }
      return piece_type
    }
    function ascii() {
      var s = '   +------------------------+\n'
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        /* display the rank */
        if (file(i) === 0) {
          s += ' ' + '87654321'[rank(i)] + ' |'
        }
  
        /* empty piece */
        if (board[i] == null) {
          s += ' . '
        } else {
          var piece = board[i].type
          var color = board[i].color
          var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
          s += ' ' + symbol + ' '
        }
  
        if ((i + 1) & 0x88) {
          s += '|\n'
          i += 8
        }
      }
      s += '   +------------------------+\n'
      s += '     a  b  c  d  e  f  g  h\n'
  
      return s
    }
  
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    function move_from_san(move, sloppy) {
      // strip off any move decorations: e.g Nf3+?! becomes Nf3
      var clean_move = stripped_san(move)
  
      var overly_disambiguated = false
  
      if (sloppy) {
        // The sloppy parser allows the user to parse non-standard chess
        // notations. This parser is opt-in (by specifying the
        // '{ sloppy: true }' setting) and is only run after the Standard
        // Algebraic Notation (SAN) parser has failed.
        //
        // When running the sloppy parser, we'll run a regex to grab the piece,
        // the to/from square, and an optional promotion piece. This regex will
        // parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7, f7f8q,
        // b1c3
  
        // NOTE: Some positions and moves may be ambiguous when using the sloppy
        // parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
        // the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated
        // bishop move). In these cases, the sloppy parser will default to the
        // most most basic interpretation - b1c3 parses to Nc3.
  
        var matches = clean_move.match(
          /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
        )
        if (matches) {
          var piece = matches[1]
          var from = matches[2]
          var to = matches[3]
          var promotion = matches[4]
  
          if (from.length == 1) {
            overly_disambiguated = true
          }
        } else {
          // The [a-h]?[1-8]? portion of the regex below handles moves that may
          // be overly disambiguated (e.g. Nge7 is unnecessary and non-standard
          // when there is one legal knight move to e7). In this case, the value
          // of 'from' variable will be a rank or file, not a square.
          var matches = clean_move.match(
            /([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
          )
  
          if (matches) {
            var piece = matches[1]
            var from = matches[2]
            var to = matches[3]
            var promotion = matches[4]
  
            if (from.length == 1) {
              var overly_disambiguated = true
            }
          }
        }
      }
  
      var piece_type = infer_piece_type(clean_move)
      var moves = generate_moves({
        legal: true,
        piece: piece ? piece : piece_type,
      })
  
      for (var i = 0, len = moves.length; i < len; i++) {
        // try the strict parser first, then the sloppy parser if requested
        // by the user
        if (clean_move === stripped_san(move_to_san(moves[i], moves))) {
          return moves[i]
        } else {
          if (sloppy && matches) {
            // hand-compare move properties with the results from our sloppy
            // regex
            if (
              (!piece || piece.toLowerCase() == moves[i].piece) &&
              SQUARES[from] == moves[i].from &&
              SQUARES[to] == moves[i].to &&
              (!promotion || promotion.toLowerCase() == moves[i].promotion)
            ) {
              return moves[i]
            } else if (overly_disambiguated) {
              // SPECIAL CASE: we parsed a move string that may have an unneeded
              // rank/file disambiguator (e.g. Nge7).  The 'from' variable will
              var square = algebraic(moves[i].from)
              if (
                (!piece || piece.toLowerCase() == moves[i].piece) &&
                SQUARES[to] == moves[i].to &&
                (from == square[0] || from == square[1]) &&
                (!promotion || promotion.toLowerCase() == moves[i].promotion)
              ) {
                return moves[i]
              }
            }
          }
        }
      }
  
      return null
    }
  
    /*****************************************************************************
     * UTILITY FUNCTIONS
     ****************************************************************************/
    function rank(i) {
      return i >> 4
    }
  
    function file(i) {
      return i & 15
    }
  
    function algebraic(i) {
      var f = file(i),
        r = rank(i)
      return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
    }
  
    function swap_color(c) {
      return c === WHITE ? BLACK : WHITE
    }
  
    function is_digit(c) {
      return '0123456789'.indexOf(c) !== -1
    }
  
    /* pretty = external move object */
    function make_pretty(ugly_move) {
      var move = clone(ugly_move)
      move.san = move_to_san(move, generate_moves({ legal: true }))
      move.to = algebraic(move.to)
      move.from = algebraic(move.from)
  
      var flags = ''
  
      for (var flag in BITS) {
        if (BITS[flag] & move.flags) {
          flags += FLAGS[flag]
        }
      }
      move.flags = flags
  
      return move
    }
  
    function clone(obj) {
      var dupe = obj instanceof Array ? [] : {}
  
      for (var property in obj) {
        if (typeof property === 'object') {
          dupe[property] = clone(obj[property])
        } else {
          dupe[property] = obj[property]
        }
      }
  
      return dupe
    }
  
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, '')
    }
  
    /*****************************************************************************
     * DEBUGGING UTILITIES
     ****************************************************************************/
    function perft(depth) {
      var moves = generate_moves({ legal: false })
      var nodes = 0
      var color = turn
  
      for (var i = 0, len = moves.length; i < len; i++) {
        make_move(moves[i])
        if (!king_attacked(color)) {
          if (depth - 1 > 0) {
            var child_nodes = perft(depth - 1)
            nodes += child_nodes
          } else {
            nodes++
          }
        }
        undo_move()
      }
  
      return nodes
    }
  
    return {
      /***************************************************************************
       * PUBLIC CONSTANTS (is there a better way to do this?)
       **************************************************************************/
      turn: function() {
        return turn;
      },
      setTurn: function(newTurn) {
        turn = newTurn;
      },
      WHITE: WHITE,
      BLACK: BLACK,
      PAWN: PAWN,
      KNIGHT: KNIGHT,
      BISHOP: BISHOP,
      ROOK: ROOK,
      QUEEN: QUEEN,
      KING: KING,
      SQUARES: (function () {
        /* from the ECMA-262 spec (section 12.6.4):
         * "The mechanics of enumerating the properties ... is
         * implementation dependent"
         * so: for (var sq in SQUARES) { keys.push(sq); } might not be
         * ordered correctly
         */
        var keys = []
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (i & 0x88) {
            i += 7
            continue
          }
          keys.push(algebraic(i))
        }
        return keys
      })(),
      FLAGS: FLAGS,
  
      /***************************************************************************
       * PUBLIC API
       **************************************************************************/
      load: function (fen) {
        return load(fen)
      },
  
      reset: function () {
        return reset()
      },
  
      moves: function (options) {
        /* The internal representation of a chess move is in 0x88 format, and
         * not meant to be human-readable.  The code below converts the 0x88
         * square coordinates to algebraic coordinates.  It also prunes an
         * unnecessary move keys resulting from a verbose call.
         */
  
        var ugly_moves = generate_moves(options)
        var moves = []
  
        for (var i = 0, len = ugly_moves.length; i < len; i++) {
          /* does the user want a full move object (most likely not), or just
           * SAN
           */
          if (
            typeof options !== 'undefined' &&
            'verbose' in options &&
            options.verbose
          ) {
            moves.push(make_pretty(ugly_moves[i]))
          } else {
            moves.push(
              move_to_san(ugly_moves[i], generate_moves({ legal: true }))
            )
          }
        }
  
        return moves
      },
  
      in_check: function () {
        return in_check()
      },
  
      in_checkmate: function () {
        return in_checkmate()
      },
  
      in_stalemate: function () {
        return in_stalemate()
      },
  
      in_draw: function () {
        return (
          half_moves >= 100 ||
          in_stalemate() ||
          insufficient_material() ||
          in_threefold_repetition()
        )
      },
  
      insufficient_material: function () {
        return insufficient_material()
      },
  
      in_threefold_repetition: function () {
        return in_threefold_repetition()
      },
  
      game_over: function () {
        return (
          half_moves >= 100 ||
          in_checkmate() ||
          in_stalemate() ||
          insufficient_material() ||
          in_threefold_repetition()
        )
      },
  
      validate_fen: function (fen) {
        return validate_fen(fen)
      },
  
      fen: function () {
        return generate_fen()
      },
  
      board: function () {
        var output = [],
          row = []
  
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (board[i] == null) {
            row.push(null)
          } else {
            row.push({ type: board[i].type, color: board[i].color })
          }
          if ((i + 1) & 0x88) {
            output.push(row)
            row = []
            i += 8
          }
        }
  
        return output
      },
  
      pgn: function (options) {
        /* using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        var newline =
          typeof options === 'object' && typeof options.newline_char === 'string'
            ? options.newline_char
            : '\n'
        var max_width =
          typeof options === 'object' && typeof options.max_width === 'number'
            ? options.max_width
            : 0
        var result = []
        var header_exists = false
  
        /* add the PGN header headerrmation */
        for (var i in header) {
          /* TODO: order of enumerated properties in header object is not
           * guaranteed, see ECMA-262 spec (section 12.6.4)
           */
          result.push('[' + i + ' "' + header[i] + '"]' + newline)
          header_exists = true
        }
  
        if (header_exists && history.length) {
          result.push(newline)
        }
  
        var append_comment = function (move_string) {
          var comment = comments[generate_fen()]
          if (typeof comment !== 'undefined') {
            var delimiter = move_string.length > 0 ? ' ' : ''
            move_string = `${move_string}${delimiter}{${comment}}`
          }
          return move_string
        }
  
        /* pop all of history onto reversed_history */
        var reversed_history = []
        while (history.length > 0) {
          reversed_history.push(undo_move())
        }
  
        var moves = []
        var move_string = ''
  
        /* special case of a commented starting position with no moves */
        if (reversed_history.length === 0) {
          moves.push(append_comment(''))
        }
  
        /* build the list of moves.  a move_string looks like: "3. e3 e6" */
        while (reversed_history.length > 0) {
          move_string = append_comment(move_string)
          var move = reversed_history.pop()
  
          /* if the position started with black to move, start PGN with 1. ... */
          if (!history.length && move.color === 'b') {
            move_string = move_number + '. ...'
          } else if (move.color === 'w') {
            /* store the previous generated move_string if we have one */
            if (move_string.length) {
              moves.push(move_string)
            }
            move_string = move_number + '.'
          }
  
          move_string =
            move_string +
            ' ' +
            move_to_san(move, generate_moves({ legal: true }))
          make_move(move)
        }
  
        /* are there any other leftover moves? */
        if (move_string.length) {
          moves.push(append_comment(move_string))
        }
  
        /* is there a result? */
        if (typeof header.Result !== 'undefined') {
          moves.push(header.Result)
        }
  
        /* history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (max_width === 0) {
          return result.join('') + moves.join(' ')
        }
  
        var strip = function () {
          if (result.length > 0 && result[result.length - 1] === ' ') {
            result.pop()
            return true
          }
          return false
        }
  
        /* NB: this does not preserve comment whitespace. */
        var wrap_comment = function (width, move) {
          for (var token of move.split(' ')) {
            if (!token) {
              continue
            }
            if (width + token.length > max_width) {
              while (strip()) {
                width--
              }
              result.push(newline)
              width = 0
            }
            result.push(token)
            width += token.length
            result.push(' ')
            width++
          }
          if (strip()) {
            width--
          }
          return width
        }
  
        /* wrap the PGN output at max_width */
        var current_width = 0
        for (var i = 0; i < moves.length; i++) {
          if (current_width + moves[i].length > max_width) {
            if (moves[i].includes('{')) {
              current_width = wrap_comment(current_width, moves[i])
              continue
            }
          }
          /* if the current move will push past max_width */
          if (current_width + moves[i].length > max_width && i !== 0) {
            /* don't end the line with whitespace */
            if (result[result.length - 1] === ' ') {
              result.pop()
            }
  
            result.push(newline)
            current_width = 0
          } else if (i !== 0) {
            result.push(' ')
            current_width++
          }
          result.push(moves[i])
          current_width += moves[i].length
        }
  
        return result.join('')
      },
  
      load_pgn: function (pgn, options) {
        // allow the user to specify the sloppy move parser to work around over
        // disambiguation bugs in Fritz and Chessbase
        var sloppy =
          typeof options !== 'undefined' && 'sloppy' in options
            ? options.sloppy
            : false
  
        function mask(str) {
          return str.replace(/\\/g, '\\')
        }
  
        function has_keys(object) {
          for (var key in object) {
            return true
          }
          return false
        }
  
        function parse_pgn_header(header, options) {
          var newline_char =
            typeof options === 'object' &&
            typeof options.newline_char === 'string'
              ? options.newline_char
              : '\r?\n'
          var header_obj = {}
          var headers = header.split(new RegExp(mask(newline_char)))
          var key = ''
          var value = ''
  
          for (var i = 0; i < headers.length; i++) {
            key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1')
            value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1')
            if (trim(key).length > 0) {
              header_obj[key] = value
            }
          }
  
          return header_obj
        }
  
        var newline_char =
          typeof options === 'object' && typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n'
  
        // RegExp to split header. Takes advantage of the fact that header and movetext
        // will always have a blank line between them (ie, two newline_char's).
        // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
        var header_regex = new RegExp(
          '^(\\[((?:' +
            mask(newline_char) +
            ')|.)*\\])' +
            '(?:' +
            mask(newline_char) +
            '){2}'
        )
  
        // If no header given, begin with moves.
        var header_string = header_regex.test(pgn)
          ? header_regex.exec(pgn)[1]
          : ''
  
        // Put the board in the starting position
        reset()
  
        /* parse PGN header */
        var headers = parse_pgn_header(header_string, options)
        for (var key in headers) {
          set_header([key, headers[key]])
        }
  
        /* load the starting position indicated by [Setup '1'] and
         * [FEN position] */
        if (headers['SetUp'] === '1') {
          if (!('FEN' in headers && load(headers['FEN'], true))) {
            // second argument to load: don't clear the headers
            return false
          }
        }
  
        /* NB: the regexes below that delete move numbers, recursive
         * annotations, and numeric annotation glyphs may also match
         * text in comments. To prevent this, we transform comments
         * by hex-encoding them in place and decoding them again after
         * the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded,
         * we use {en,de}codeURIComponent here to support arbitrary UTF8
         * as a convenience for modern users */
  
        var to_hex = function (string) {
          return Array.from(string)
            .map(function (c) {
              /* encodeURI doesn't transform most ASCII characters,
               * so we handle these ourselves */
              return c.charCodeAt(0) < 128
                ? c.charCodeAt(0).toString(16)
                : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
            })
            .join('')
        }
  
        var from_hex = function (string) {
          return string.length == 0
            ? ''
            : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
        }
  
        var encode_comment = function (string) {
          string = string.replace(new RegExp(mask(newline_char), 'g'), ' ')
          return `{${to_hex(string.slice(1, string.length - 1))}}`
        }
  
        var decode_comment = function (string) {
          if (string.startsWith('{') && string.endsWith('}')) {
            return from_hex(string.slice(1, string.length - 1))
          }
        }
  
        /* delete header to get the moves */
        var ms = pgn
          .replace(header_string, '')
          .replace(
            /* encode comments so they don't get deleted below */
            new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
            function (match, bracket, semicolon) {
              return bracket !== undefined
                ? encode_comment(bracket)
                : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
            }
          )
          .replace(new RegExp(mask(newline_char), 'g'), ' ')
  
        /* delete recursive annotation variations */
        var rav_regex = /(\([^\(\)]+\))+?/g
        while (rav_regex.test(ms)) {
          ms = ms.replace(rav_regex, '')
        }
  
        /* delete move numbers */
        ms = ms.replace(/\d+\.(\.\.)?/g, '')
  
        /* delete ... indicating black to move */
        ms = ms.replace(/\.\.\./g, '')
  
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '')
  
        /* trim and get array of moves */
        var moves = trim(ms).split(new RegExp(/\s+/))
  
        /* delete empty entries */
        moves = moves.join(',').replace(/,,+/g, ',').split(',')
        var move = ''
  
        var result = ''
  
        for (var half_move = 0; half_move < moves.length; half_move++) {
          var comment = decode_comment(moves[half_move])
          if (comment !== undefined) {
            comments[generate_fen()] = comment
            continue
          }
  
          move = move_from_san(moves[half_move], sloppy)
  
          /* invalid move */
          if (move == null) {
            /* was the move an end of game marker */
            if (TERMINATION_MARKERS.indexOf(moves[half_move]) > -1) {
              result = moves[half_move]
            } else {
              return false
            }
          } else {
            /* reset the end of game marker if making a valid move */
            result = ''
            make_move(move)
          }
        }
  
        /* Per section 8.2.6 of the PGN spec, the Result tag pair must match
         * match the termination marker. Only do this when headers are present,
         * but the result tag is missing
         */
        if (result && Object.keys(header).length && !header['Result']) {
          set_header(['Result', result])
        }
  
        return true
      },
  
      header: function () {
        return set_header(arguments)
      },
  
      ascii: function () {
        return ascii()
      },
  
      turn: function () {
        return turn
      },
  
      move: function (move, options) {
        /* The move function can be called with in the following parameters:
         *
         * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- where the 'move' is a move object (additional
         *         to :'h8',      fields are ignored)
         *         promotion: 'q',
         *      })
         */
  
        // allow the user to specify the sloppy move parser to work around over
        // disambiguation bugs in Fritz and Chessbase
        var sloppy =
          typeof options !== 'undefined' && 'sloppy' in options
            ? options.sloppy
            : false
  
        var move_obj = null
  
        if (typeof move === 'string') {
          move_obj = move_from_san(move, sloppy)
        } else if (typeof move === 'object') {
          var moves = generate_moves()
  
          /* convert the pretty move object to an ugly move object */
          for (var i = 0, len = moves.length; i < len; i++) {
            if (
              move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
                move.promotion === moves[i].promotion)
            ) {
              move_obj = moves[i]
              break
            }
          }
        }
  
        /* failed to find move */
        if (!move_obj) {
          return null
        }
  
        /* need to make a copy of move because we can't generate SAN after the
         * move is made
         */
        var pretty_move = make_pretty(move_obj)
  
        make_move(move_obj)
  
        return pretty_move
      },
  
      undo: function () {
        var move = undo_move()
        return move ? make_pretty(move) : null
      },
  
      clear: function () {
        return clear()
      },
  
      put: function (piece, square) {
        return put(piece, square)
      },
  
      get: function (square) {
        return get(square)
      },
  
      remove: function (square) {
        return remove(square)
      },
  
      perft: function (depth) {
        return perft(depth)
      },
  
      square_color: function (square) {
        if (square in SQUARES) {
          var sq_0x88 = SQUARES[square]
          return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
        }
  
        return null
      },
  
      history: function (options) {
        var reversed_history = []
        var move_history = []
        var verbose =
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
  
        while (history.length > 0) {
          reversed_history.push(undo_move())
        }
  
        while (reversed_history.length > 0) {
          var move = reversed_history.pop()
          if (verbose) {
            move_history.push(make_pretty(move))
          } else {
            move_history.push(move_to_san(move, generate_moves({ legal: true })))
          }
          make_move(move)
        }
  
        return move_history
      },
  
      get_comment: function () {
        return comments[generate_fen()]
      },
  
      set_comment: function (comment) {
        comments[generate_fen()] = comment.replace('{', '[').replace('}', ']')
      },
  
      delete_comment: function () {
        var comment = comments[generate_fen()]
        delete comments[generate_fen()]
        return comment
      },
  
      get_comments: function () {
        prune_comments()
        return Object.keys(comments).map(function (fen) {
          return { fen: fen, comment: comments[fen] }
        })
      },
  
      delete_comments: function () {
        prune_comments()
        return Object.keys(comments).map(function (fen) {
          var comment = comments[fen]
          delete comments[fen]
          return { fen: fen, comment: comment }
        })
      },
    }
  }
  
  /* export Chess object if using node or any other CommonJS compatible
   * environment */
  if (typeof exports !== 'undefined') exports.Chess = Chess
  /* export Chess object for any RequireJS compatible environment */
  if (typeof define !== 'undefined')
    define(function () {
      return Chess
    })
// chessboard.js v1.0.0
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

// start anonymous scope
;(function () {
  'use strict'

  var $ = window['jQuery']

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  var COLUMNS = 'abcdefgh'.split('')
  var DEFAULT_DRAG_THROTTLE_RATE = 20
  var ELLIPSIS = '…'
  var MINIMUM_JQUERY_VERSION = '1.8.3'
  var RUN_ASSERTS = false
  var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
  var START_POSITION = fenToObj(START_FEN)

  // default animation speeds
  var DEFAULT_APPEAR_SPEED = 200
  var DEFAULT_MOVE_SPEED = 200
  var DEFAULT_SNAPBACK_SPEED = 60
  var DEFAULT_SNAP_SPEED = 30
  var DEFAULT_TRASH_SPEED = 100

  // use unique class names to prevent clashing with anything else on the page
  // and simplify selectors
  // NOTE: these should never change
  var CSS = {}
  CSS['alpha'] = 'alpha-d2270'
  CSS['black'] = 'black-3c85d'
  CSS['board'] = 'board-b72b1'
  CSS['chessboard'] = 'chessboard-63f37'
  CSS['clearfix'] = 'clearfix-7da63'
  CSS['highlight1'] = 'highlight1-32417'
  CSS['highlight2'] = 'highlight2-9c5d2'
  CSS['notation'] = 'notation-322f9'
  CSS['numeric'] = 'numeric-fc462'
  CSS['piece'] = 'piece-417db'
  CSS['row'] = 'row-5277c'
  CSS['sparePieces'] = 'spare-pieces-7492f'
  CSS['sparePiecesBottom'] = 'spare-pieces-bottom-ae20f'
  CSS['sparePiecesTop'] = 'spare-pieces-top-4028b'
  CSS['square'] = 'square-55d63'
  CSS['white'] = 'white-1e1d7'

  // ---------------------------------------------------------------------------
  // Misc Util Functions
  // ---------------------------------------------------------------------------

  function throttle (f, interval, scope) {
    var timeout = 0
    var shouldFire = false
    var args = []

    var handleTimeout = function () {
      timeout = 0
      if (shouldFire) {
        shouldFire = false
        fire()
      }
    }

    var fire = function () {
      timeout = window.setTimeout(handleTimeout, interval)
      f.apply(scope, args)
    }

    return function (_args) {
      args = arguments
      if (!timeout) {
        fire()
      } else {
        shouldFire = true
      }
    }
  }

  // function debounce (f, interval, scope) {
  //   var timeout = 0
  //   return function (_args) {
  //     window.clearTimeout(timeout)
  //     var args = arguments
  //     timeout = window.setTimeout(function () {
  //       f.apply(scope, args)
  //     }, interval)
  //   }
  // }

  function uuid () {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
      var r = (Math.random() * 16) | 0
      return r.toString(16)
    })
  }

  function deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
  }

  function parseSemVer (version) {
    var tmp = version.split('.')
    return {
      major: parseInt(tmp[0], 10),
      minor: parseInt(tmp[1], 10),
      patch: parseInt(tmp[2], 10)
    }
  }

  // returns true if version is >= minimum
  function validSemanticVersion (version, minimum) {
    version = parseSemVer(version)
    minimum = parseSemVer(minimum)

    var versionNum = (version.major * 100000 * 100000) +
                     (version.minor * 100000) +
                     version.patch
    var minimumNum = (minimum.major * 100000 * 100000) +
                     (minimum.minor * 100000) +
                     minimum.patch

    return versionNum >= minimumNum
  }

  function interpolateTemplate (str, obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      var keyTemplateStr = '{' + key + '}'
      var value = obj[key]
      while (str.indexOf(keyTemplateStr) !== -1) {
        str = str.replace(keyTemplateStr, value)
      }
    }
    return str
  }

  if (RUN_ASSERTS) {
    console.assert(interpolateTemplate('abc', {a: 'x'}) === 'abc')
    console.assert(interpolateTemplate('{a}bc', {}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {p: 'q'}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {a: 'x'}) === 'xbc')
    console.assert(interpolateTemplate('{a}bc{a}bc', {a: 'x'}) === 'xbcxbc')
    console.assert(interpolateTemplate('{a}{a}{b}', {a: 'x', b: 'y'}) === 'xxy')
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  function isString (s) {
    return typeof s === 'string'
  }

  function isFunction (f) {
    return typeof f === 'function'
  }

  function isInteger (n) {
    return typeof n === 'number' &&
           isFinite(n) &&
           Math.floor(n) === n
  }

  function validAnimationSpeed (speed) {
    if (speed === 'fast' || speed === 'slow') return true
    if (!isInteger(speed)) return false
    return speed >= 0
  }

  function validThrottleRate (rate) {
    return isInteger(rate) &&
           rate >= 1
  }

  function validMove (move) {
    // move should be a string
    if (!isString(move)) return false

    // move should be in the form of "e2-e4", "f6-d5"
    var squares = move.split('-')
    if (squares.length !== 2) return false

    return validSquare(squares[0]) && validSquare(squares[1])
  }

  function validSquare (square) {
    return isString(square) && square.search(/^[a-h][1-8]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validSquare('a1'))
    console.assert(validSquare('e2'))
    console.assert(!validSquare('D2'))
    console.assert(!validSquare('g9'))
    console.assert(!validSquare('a'))
    console.assert(!validSquare(true))
    console.assert(!validSquare(null))
    console.assert(!validSquare({}))
  }

  function validPieceCode (code) {
    return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validPieceCode('bP'))
    console.assert(validPieceCode('bK'))
    console.assert(validPieceCode('wK'))
    console.assert(validPieceCode('wR'))
    console.assert(!validPieceCode('WR'))
    console.assert(!validPieceCode('Wr'))
    console.assert(!validPieceCode('a'))
    console.assert(!validPieceCode(true))
    console.assert(!validPieceCode(null))
    console.assert(!validPieceCode({}))
  }

  function validFen (fen) {
    if (!isString(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    // expand the empty square numbers to just 1s
    fen = expandFenEmptySquares(fen)

    // FEN should be 8 sections separated by slashes
    var chunks = fen.split('/')
    if (chunks.length !== 8) return false

    // check each section
    for (var i = 0; i < 8; i++) {
      if (chunks[i].length !== 8 ||
          chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validFen(START_FEN))
    console.assert(validFen('8/8/8/8/8/8/8/8'))
    console.assert(validFen('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'))
    console.assert(validFen('3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('anbqkbnr/8/8/8/8/8/PPPPPPPP/8'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN'))
    console.assert(!validFen('888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen('888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen({}))
  }

  function validPositionObject (pos) {
    if (!$.isPlainObject(pos)) return false

    for (var i in pos) {
      if (!pos.hasOwnProperty(i)) continue

      if (!validSquare(i) || !validPieceCode(pos[i])) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validPositionObject(START_POSITION))
    console.assert(validPositionObject({}))
    console.assert(validPositionObject({e2: 'wP'}))
    console.assert(validPositionObject({e2: 'wP', d2: 'wP'}))
    console.assert(!validPositionObject({e2: 'BP'}))
    console.assert(!validPositionObject({y2: 'wP'}))
    console.assert(!validPositionObject(null))
    console.assert(!validPositionObject('start'))
    console.assert(!validPositionObject(START_FEN))
  }

  function isTouchDevice () {
    return 'ontouchstart' in document.documentElement
  }

  function validJQueryVersion () {
    return typeof window.$ &&
           $.fn &&
           $.fn.jquery &&
           validSemanticVersion($.fn.jquery, MINIMUM_JQUERY_VERSION)
  }

  // ---------------------------------------------------------------------------
  // Chess Util Functions
  // ---------------------------------------------------------------------------

  // convert FEN piece code to bP, wK, etc
  function fenToPieceCode (piece) {
    // black piece
    if (piece.toLowerCase() === piece) {
      return 'b' + piece.toUpperCase()
    }

    // white piece
    return 'w' + piece.toUpperCase()
  }

  // convert bP, wK, etc code to FEN structure
  function pieceCodeToFen (piece) {
    var pieceCodeLetters = piece.split('')

    // white piece
    if (pieceCodeLetters[0] === 'w') {
      return pieceCodeLetters[1].toUpperCase()
    }

    // black piece
    return pieceCodeLetters[1].toLowerCase()
  }

  // convert FEN string to position object
  // returns false if the FEN string is invalid
  function fenToObj (fen) {
    if (!validFen(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    var rows = fen.split('/')
    var position = {}

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      var row = rows[i].split('')
      var colIdx = 0

      // loop through each character in the FEN section
      for (var j = 0; j < row.length; j++) {
        // number / empty squares
        if (row[j].search(/[1-8]/) !== -1) {
          var numEmptySquares = parseInt(row[j], 10)
          colIdx = colIdx + numEmptySquares
        } else {
          // piece
          var square = COLUMNS[colIdx] + currentRow
          position[square] = fenToPieceCode(row[j])
          colIdx = colIdx + 1
        }
      }

      currentRow = currentRow - 1
    }

    return position
  }

  // position object to FEN string
  // returns false if the obj is not a valid position object
  function objToFen (obj) {
    if (!validPositionObject(obj)) return false

    var fen = ''

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var square = COLUMNS[j] + currentRow

        // piece exists
        if (obj.hasOwnProperty(square)) {
          fen = fen + pieceCodeToFen(obj[square])
        } else {
          // empty space
          fen = fen + '1'
        }
      }

      if (i !== 7) {
        fen = fen + '/'
      }

      currentRow = currentRow - 1
    }

    // squeeze the empty numbers together
    fen = squeezeFenEmptySquares(fen)

    return fen
  }

  if (RUN_ASSERTS) {
    console.assert(objToFen(START_POSITION) === START_FEN)
    console.assert(objToFen({}) === '8/8/8/8/8/8/8/8')
    console.assert(objToFen({a2: 'wP', 'b2': 'bP'}) === '8/8/8/8/8/8/Pp6/8')
  }

  function squeezeFenEmptySquares (fen) {
    return fen.replace(/11111111/g, '8')
      .replace(/1111111/g, '7')
      .replace(/111111/g, '6')
      .replace(/11111/g, '5')
      .replace(/1111/g, '4')
      .replace(/111/g, '3')
      .replace(/11/g, '2')
  }

  function expandFenEmptySquares (fen) {
    return fen.replace(/8/g, '11111111')
      .replace(/7/g, '1111111')
      .replace(/6/g, '111111')
      .replace(/5/g, '11111')
      .replace(/4/g, '1111')
      .replace(/3/g, '111')
      .replace(/2/g, '11')
  }

  // returns the distance between two squares
  function squareDistance (squareA, squareB) {
    var squareAArray = squareA.split('')
    var squareAx = COLUMNS.indexOf(squareAArray[0]) + 1
    var squareAy = parseInt(squareAArray[1], 10)

    var squareBArray = squareB.split('')
    var squareBx = COLUMNS.indexOf(squareBArray[0]) + 1
    var squareBy = parseInt(squareBArray[1], 10)

    var xDelta = Math.abs(squareAx - squareBx)
    var yDelta = Math.abs(squareAy - squareBy)

    if (xDelta >= yDelta) return xDelta
    return yDelta
  }

  // returns the square of the closest instance of piece
  // returns false if no instance of piece is found in position
  function findClosestPiece (position, piece, square) {
    // create array of closest squares from square
    var closestSquares = createRadius(square)

    // search through the position in order of distance for the piece
    for (var i = 0; i < closestSquares.length; i++) {
      var s = closestSquares[i]

      if (position.hasOwnProperty(s) && position[s] === piece) {
        return s
      }
    }

    return false
  }

  // returns an array of closest squares from square
  function createRadius (square) {
    var squares = []

    // calculate distance of all squares
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var s = COLUMNS[i] + (j + 1)

        // skip the square we're starting from
        if (square === s) continue

        squares.push({
          square: s,
          distance: squareDistance(square, s)
        })
      }
    }

    // sort by distance
    squares.sort(function (a, b) {
      return a.distance - b.distance
    })

    // just return the square code
    var surroundingSquares = []
    for (i = 0; i < squares.length; i++) {
      surroundingSquares.push(squares[i].square)
    }

    return surroundingSquares
  }

  // given a position and a set of moves, return a new position
  // with the moves executed
  function calculatePositionFromMoves (position, moves) {
    var newPosition = deepCopy(position)

    for (var i in moves) {
      if (!moves.hasOwnProperty(i)) continue

      // skip the move if the position doesn't have a piece on the source square
      if (!newPosition.hasOwnProperty(i)) continue

      var piece = newPosition[i]
      delete newPosition[i]
      newPosition[moves[i]] = piece
    }

    return newPosition
  }

  // TODO: add some asserts here for calculatePositionFromMoves

  // ---------------------------------------------------------------------------
  // HTML
  // ---------------------------------------------------------------------------

  function buildContainerHTML (hasSparePieces) {
    var html = '<div class="{chessboard}">'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesTop}"></div>'
    }

    html += '<div class="{board}"></div>'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesBottom}"></div>'
    }

    html += '</div>'

    return interpolateTemplate(html, CSS)
  }

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  function expandConfigArgumentShorthand (config) {
    if (config === 'start') {
      config = {position: deepCopy(START_POSITION)}
    } else if (validFen(config)) {
      config = {position: fenToObj(config)}
    } else if (validPositionObject(config)) {
      config = {position: deepCopy(config)}
    }

    // config must be an object
    if (!$.isPlainObject(config)) config = {}

    return config
  }

  // validate config / set default options
  function expandConfig (config) {
    // default for orientation is white
    if (config.orientation !== 'black') config.orientation = 'white'

    // default for showNotation is true
    if (config.showNotation !== false) config.showNotation = true

    // default for draggable is false
    if (config.draggable !== true) config.draggable = false

    // default for dropOffBoard is 'snapback'
    if (config.dropOffBoard !== 'trash') config.dropOffBoard = 'snapback'

    // default for sparePieces is false
    if (config.sparePieces !== true) config.sparePieces = false

    // draggable must be true if sparePieces is enabled
    if (config.sparePieces) config.draggable = true

    // default piece theme is wikipedia
    if (!config.hasOwnProperty('pieceTheme') ||
        (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))) {
      config.pieceTheme = '/img/chesspieces/wikipedia/{piece}.png'
    }

    // animation speeds
    if (!validAnimationSpeed(config.appearSpeed)) config.appearSpeed = DEFAULT_APPEAR_SPEED
    if (!validAnimationSpeed(config.moveSpeed)) config.moveSpeed = DEFAULT_MOVE_SPEED
    if (!validAnimationSpeed(config.snapbackSpeed)) config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED
    if (!validAnimationSpeed(config.snapSpeed)) config.snapSpeed = DEFAULT_SNAP_SPEED
    if (!validAnimationSpeed(config.trashSpeed)) config.trashSpeed = DEFAULT_TRASH_SPEED

    // throttle rate
    if (!validThrottleRate(config.dragThrottleRate)) config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE

    return config
  }

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  // check for a compatible version of jQuery
  function checkJQuery () {
    if (!validJQueryVersion()) {
      var errorMsg = 'Chessboard Error 1005: Unable to find a valid version of jQuery. ' +
        'Please include jQuery ' + MINIMUM_JQUERY_VERSION + ' or higher on the page' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg)
      return false
    }

    return true
  }

  // return either boolean false or the $container element
  function checkContainerArg (containerElOrString) {
    if (containerElOrString === '') {
      var errorMsg1 = 'Chessboard Error 1001: ' +
        'The first argument to Chessboard() cannot be an empty string.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg1)
      return false
    }

    // convert containerEl to query selector if it is a string
    if (isString(containerElOrString) &&
        containerElOrString.charAt(0) !== '#') {
      containerElOrString = '#' + containerElOrString
    }

    // containerEl must be something that becomes a jQuery collection of size 1
    var $container = $(containerElOrString)
    if ($container.length !== 1) {
      var errorMsg2 = 'Chessboard Error 1003: ' +
        'The first argument to Chessboard() must be the ID of a DOM node, ' +
        'an ID query selector, or a single DOM node.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg2)
      return false
    }

    return $container
  }

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  function constructor (containerElOrString, config) {
    // first things first: check basic dependencies
    if (!checkJQuery()) return null
    var $container = checkContainerArg(containerElOrString)
    if (!$container) return null

    // ensure the config object is what we expect
    config = expandConfigArgumentShorthand(config)
    config = expandConfig(config)

    // DOM elements
    var $board = null
    var $draggedPiece = null
    var $sparePiecesTop = null
    var $sparePiecesBottom = null

    // constructor return object
    var widget = {}

    // -------------------------------------------------------------------------
    // Stateful
    // -------------------------------------------------------------------------

    var boardBorderSize = 2
    var currentOrientation = 'white'
    var currentPosition = {}
    var draggedPiece = null
    var draggedPieceLocation = null
    var draggedPieceSource = null
    var isDragging = false
    var sparePiecesElsIds = {}
    var squareElsIds = {}
    var squareElsOffsets = {}
    var squareSize = 16

    // -------------------------------------------------------------------------
    // Validation / Errors
    // -------------------------------------------------------------------------

    function error (code, msg, obj) {
      // do nothing if showErrors is not set
      if (
        config.hasOwnProperty('showErrors') !== true ||
          config.showErrors === false
      ) {
        return
      }

      var errorText = 'Chessboard Error ' + code + ': ' + msg

      // print to console
      if (
        config.showErrors === 'console' &&
          typeof console === 'object' &&
          typeof console.log === 'function'
      ) {
        console.log(errorText)
        if (arguments.length >= 2) {
          console.log(obj)
        }
        return
      }

      // alert errors
      if (config.showErrors === 'alert') {
        if (obj) {
          errorText += '\n\n' + JSON.stringify(obj)
        }
        window.alert(errorText)
        return
      }

      // custom function
      if (isFunction(config.showErrors)) {
        config.showErrors(code, msg, obj)
      }
    }

    function setInitialState () {
      currentOrientation = config.orientation

      // make sure position is valid
      if (config.hasOwnProperty('position')) {
        if (config.position === 'start') {
          currentPosition = deepCopy(START_POSITION)
        } else if (validFen(config.position)) {
          currentPosition = fenToObj(config.position)
        } else if (validPositionObject(config.position)) {
          currentPosition = deepCopy(config.position)
        } else {
          error(
            7263,
            'Invalid value passed to config.position.',
            config.position
          )
        }
      }
    }

    // -------------------------------------------------------------------------
    // DOM Misc
    // -------------------------------------------------------------------------

    // calculates square size based on the width of the container
    // got a little CSS black magic here, so let me explain:
    // get the width of the container element (could be anything), reduce by 1 for
    // fudge factor, and then keep reducing until we find an exact mod 8 for
    // our square size
    function calculateSquareSize () {
      var containerWidth = parseInt($container.width(), 10)

      // defensive, prevent infinite loop
      if (!containerWidth || containerWidth <= 0) {
        return 0
      }

      // pad one pixel
      var boardWidth = containerWidth - 1

      while (boardWidth % 8 !== 0 && boardWidth > 0) {
        boardWidth = boardWidth - 1
      }

      return boardWidth / 8
    }

    // create random IDs for elements
    function createElIds () {
      // squares on the board
      for (var i = 0; i < COLUMNS.length; i++) {
        for (var j = 1; j <= 8; j++) {
          var square = COLUMNS[i] + j
          squareElsIds[square] = square + '-' + uuid()
        }
      }

      // spare pieces
      var pieces = 'KQRNBP'.split('')
      for (i = 0; i < pieces.length; i++) {
        var whitePiece = 'w' + pieces[i]
        var blackPiece = 'b' + pieces[i]
        sparePiecesElsIds[whitePiece] = whitePiece + '-' + uuid()
        sparePiecesElsIds[blackPiece] = blackPiece + '-' + uuid()
      }
    }

    // -------------------------------------------------------------------------
    // Markup Building
    // -------------------------------------------------------------------------

    function buildBoardHTML (orientation) {
      if (orientation !== 'black') {
        orientation = 'white'
      }

      var html = ''

      // algebraic notation / orientation
      var alpha = deepCopy(COLUMNS)
      var row = 8
      if (orientation === 'black') {
        alpha.reverse()
        row = 1
      }

      var squareColor = 'white'
      for (var i = 0; i < 8; i++) {
        html += '<div class="{row}">'
        for (var j = 0; j < 8; j++) {
          var square = alpha[j] + row

          html += '<div class="{square} ' + CSS[squareColor] + ' ' +
            'square-' + square + '" ' +
            'style="width:' + squareSize + 'px;height:' + squareSize + 'px;" ' +
            'id="' + squareElsIds[square] + '" ' +
            'data-square="' + square + '">'

          if (config.showNotation) {
            // alpha notation
            if ((orientation === 'white' && row === 1) ||
                (orientation === 'black' && row === 8)) {
              html += '<div class="{notation} {alpha}">' + alpha[j] + '</div>'
            }

            // numeric notation
            if (j === 0) {
              html += '<div class="{notation} {numeric}">' + row + '</div>'
            }
          }

          html += '</div>' // end .square

          squareColor = (squareColor === 'white') ? 'black' : 'white'
        }
        html += '<div class="{clearfix}"></div></div>'

        squareColor = (squareColor === 'white') ? 'black' : 'white'

        if (orientation === 'white') {
          row = row - 1
        } else {
          row = row + 1
        }
      }

      return interpolateTemplate(html, CSS)
    }

    function buildPieceImgSrc (piece) {
      if (isFunction(config.pieceTheme)) {
        return config.pieceTheme(piece)
      }

      if (isString(config.pieceTheme)) {
        return interpolateTemplate(config.pieceTheme, {piece: piece})
      }

      // NOTE: this should never happen
      error(8272, 'Unable to build image source for config.pieceTheme.')
      return ''
    }

    function buildPieceHTML (piece, hidden, id) {
      var html = '<img src="' + buildPieceImgSrc(piece) + '" '
      if (isString(id) && id !== '') {
        html += 'id="' + id + '" '
      }
      html += 'alt="" ' +
        'class="{piece}" ' +
        'data-piece="' + piece + '" ' +
        'style="width:' + squareSize + 'px;' + 'height:' + squareSize + 'px;'

      if (hidden) {
        html += 'display:none;'
      }

      html += '" />'

      return interpolateTemplate(html, CSS)
    }

    function buildSparePiecesHTML (color) {
      var pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP']
      if (color === 'black') {
        pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP']
      }

      var html = ''
      for (var i = 0; i < pieces.length; i++) {
        html += buildPieceHTML(pieces[i], false, sparePiecesElsIds[pieces[i]])
      }

      return html
    }

    // -------------------------------------------------------------------------
    // Animations
    // -------------------------------------------------------------------------

    function animateSquareToSquare (src, dest, piece, completeFn) {
      // get information about the source and destination squares
      var $srcSquare = $('#' + squareElsIds[src])
      var srcSquarePosition = $srcSquare.offset()
      var $destSquare = $('#' + squareElsIds[dest])
      var destSquarePosition = $destSquare.offset()

      // create the animated piece and absolutely position it
      // over the source square
      var animatedPieceId = uuid()
      $('body').append(buildPieceHTML(piece, true, animatedPieceId))
      var $animatedPiece = $('#' + animatedPieceId)
      $animatedPiece.css({
        display: '',
        position: 'absolute',
        top: srcSquarePosition.top,
        left: srcSquarePosition.left
      })

      // remove original piece from source square
      $srcSquare.find('.' + CSS.piece).remove()

      function onFinishAnimation1 () {
        // add the "real" piece to the destination square
        $destSquare.append(buildPieceHTML(piece))

        // remove the animated piece
        $animatedPiece.remove()

        // run complete function
        if (isFunction(completeFn)) {
          completeFn()
        }
      }

      // animate the piece to the destination square
      var opts = {
        duration: config.moveSpeed,
        complete: onFinishAnimation1
      }
      $animatedPiece.animate(destSquarePosition, opts)
    }

    function animateSparePieceToSquare (piece, dest, completeFn) {
      var srcOffset = $('#' + sparePiecesElsIds[piece]).offset()
      var $destSquare = $('#' + squareElsIds[dest])
      var destOffset = $destSquare.offset()

      // create the animate piece
      var pieceId = uuid()
      $('body').append(buildPieceHTML(piece, true, pieceId))
      var $animatedPiece = $('#' + pieceId)
      $animatedPiece.css({
        display: '',
        position: 'absolute',
        left: srcOffset.left,
        top: srcOffset.top
      })

      // on complete
      function onFinishAnimation2 () {
        // add the "real" piece to the destination square
        $destSquare.find('.' + CSS.piece).remove()
        $destSquare.append(buildPieceHTML(piece))

        // remove the animated piece
        $animatedPiece.remove()

        // run complete function
        if (isFunction(completeFn)) {
          completeFn()
        }
      }

      // animate the piece to the destination square
      var opts = {
        duration: config.moveSpeed,
        complete: onFinishAnimation2
      }
      $animatedPiece.animate(destOffset, opts)
    }

    // execute an array of animations
    function doAnimations (animations, oldPos, newPos) {
      if (animations.length === 0) return

      var numFinished = 0
      function onFinishAnimation3 () {
        // exit if all the animations aren't finished
        numFinished = numFinished + 1
        if (numFinished !== animations.length) return

        drawPositionInstant()

        // run their onMoveEnd function
        if (isFunction(config.onMoveEnd)) {
          config.onMoveEnd(deepCopy(oldPos), deepCopy(newPos))
        }
      }

      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i]

        // clear a piece
        if (animation.type === 'clear') {
          $('#' + squareElsIds[animation.square] + ' .' + CSS.piece)
            .fadeOut(config.trashSpeed, onFinishAnimation3)

        // add a piece with no spare pieces - fade the piece onto the square
        } else if (animation.type === 'add' && !config.sparePieces) {
          $('#' + squareElsIds[animation.square])
            .append(buildPieceHTML(animation.piece, true))
            .find('.' + CSS.piece)
            .fadeIn(config.appearSpeed, onFinishAnimation3)

        // add a piece with spare pieces - animate from the spares
        } else if (animation.type === 'add' && config.sparePieces) {
          animateSparePieceToSquare(animation.piece, animation.square, onFinishAnimation3)

        // move a piece from squareA to squareB
        } else if (animation.type === 'move') {
          animateSquareToSquare(animation.source, animation.destination, animation.piece, onFinishAnimation3)
        }
      }
    }

    // calculate an array of animations that need to happen in order to get
    // from pos1 to pos2
    function calculateAnimations (pos1, pos2) {
      // make copies of both
      pos1 = deepCopy(pos1)
      pos2 = deepCopy(pos2)

      var animations = []
      var squaresMovedTo = {}

      // remove pieces that are the same in both positions
      for (var i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        if (pos1.hasOwnProperty(i) && pos1[i] === pos2[i]) {
          delete pos1[i]
          delete pos2[i]
        }
      }

      // find all the "move" animations
      for (i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        var closestPiece = findClosestPiece(pos1, pos2[i], i)
        if (closestPiece) {
          animations.push({
            type: 'move',
            source: closestPiece,
            destination: i,
            piece: pos2[i]
          })

          delete pos1[closestPiece]
          delete pos2[i]
          squaresMovedTo[i] = true
        }
      }

      // "add" animations
      for (i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        animations.push({
          type: 'add',
          square: i,
          piece: pos2[i]
        })

        delete pos2[i]
      }

      // "clear" animations
      for (i in pos1) {
        if (!pos1.hasOwnProperty(i)) continue

        // do not clear a piece if it is on a square that is the result
        // of a "move", ie: a piece capture
        if (squaresMovedTo.hasOwnProperty(i)) continue

        animations.push({
          type: 'clear',
          square: i,
          piece: pos1[i]
        })

        delete pos1[i]
      }

      return animations
    }

    // -------------------------------------------------------------------------
    // Control Flow
    // -------------------------------------------------------------------------

    function drawPositionInstant () {
      // clear the board
      $board.find('.' + CSS.piece).remove()

      // add the pieces
      for (var i in currentPosition) {
        if (!currentPosition.hasOwnProperty(i)) continue

        $('#' + squareElsIds[i]).append(buildPieceHTML(currentPosition[i]))
      }
    }

    function drawBoard () {
      $board.html(buildBoardHTML(currentOrientation, squareSize, config.showNotation))
      drawPositionInstant()

      if (config.sparePieces) {
        if (currentOrientation === 'white') {
          $sparePiecesTop.html(buildSparePiecesHTML('black'))
          $sparePiecesBottom.html(buildSparePiecesHTML('white'))
        } else {
          $sparePiecesTop.html(buildSparePiecesHTML('white'))
          $sparePiecesBottom.html(buildSparePiecesHTML('black'))
        }
      }
    }

    function setCurrentPosition (position) {
      var oldPos = deepCopy(currentPosition)
      var newPos = deepCopy(position)
      var oldFen = objToFen(oldPos)
      var newFen = objToFen(newPos)

      // do nothing if no change in position
      if (oldFen === newFen) return

      // run their onChange function
      if (isFunction(config.onChange)) {
        config.onChange(oldPos, newPos)
      }

      // update state
      currentPosition = position
    }

    function isXYOnSquare (x, y) {
      for (var i in squareElsOffsets) {
        if (!squareElsOffsets.hasOwnProperty(i)) continue

        var s = squareElsOffsets[i]
        if (x >= s.left &&
            x < s.left + squareSize &&
            y >= s.top &&
            y < s.top + squareSize) {
          return i
        }
      }

      return 'offboard'
    }

    // records the XY coords of every square into memory
    function captureSquareOffsets () {
      squareElsOffsets = {}

      for (var i in squareElsIds) {
        if (!squareElsIds.hasOwnProperty(i)) continue

        squareElsOffsets[i] = $('#' + squareElsIds[i]).offset()
      }
    }

    function removeSquareHighlights () {
      $board
        .find('.' + CSS.square)
        .removeClass(CSS.highlight1 + ' ' + CSS.highlight2)
    }

    function snapbackDraggedPiece () {
      // there is no "snapback" for spare pieces
      if (draggedPieceSource === 'spare') {
        trashDraggedPiece()
        return
      }

      removeSquareHighlights()

      // animation complete
      function complete () {
        drawPositionInstant()
        $draggedPiece.css('display', 'none')

        // run their onSnapbackEnd function
        if (isFunction(config.onSnapbackEnd)) {
          config.onSnapbackEnd(
            draggedPiece,
            draggedPieceSource,
            deepCopy(currentPosition),
            currentOrientation
          )
        }
      }

      // get source square position
      var sourceSquarePosition = $('#' + squareElsIds[draggedPieceSource]).offset()

      // animate the piece to the target square
      var opts = {
        duration: config.snapbackSpeed,
        complete: complete
      }
      $draggedPiece.animate(sourceSquarePosition, opts)

      // set state
      isDragging = false
    }

    function trashDraggedPiece () {
      removeSquareHighlights()

      // remove the source piece
      var newPosition = deepCopy(currentPosition)
      delete newPosition[draggedPieceSource]
      setCurrentPosition(newPosition)

      // redraw the position
      drawPositionInstant()

      // hide the dragged piece
      $draggedPiece.fadeOut(config.trashSpeed)

      // set state
      isDragging = false
    }

    function dropDraggedPieceOnSquare (square) {
      removeSquareHighlights()

      // update position
      var newPosition = deepCopy(currentPosition)
      delete newPosition[draggedPieceSource]
      newPosition[square] = draggedPiece
      setCurrentPosition(newPosition)

      // get target square information
      var targetSquarePosition = $('#' + squareElsIds[square]).offset()

      // animation complete
      function onAnimationComplete () {
        drawPositionInstant()
        $draggedPiece.css('display', 'none')

        // execute their onSnapEnd function
        if (isFunction(config.onSnapEnd)) {
          config.onSnapEnd(draggedPieceSource, square, draggedPiece)
        }
      }

      // snap the piece to the target square
      var opts = {
        duration: config.snapSpeed,
        complete: onAnimationComplete
      }
      $draggedPiece.animate(targetSquarePosition, opts)

      // set state
      isDragging = false
    }

    function beginDraggingPiece (source, piece, x, y) {
      // run their custom onDragStart function
      // their custom onDragStart function can cancel drag start
      if (isFunction(config.onDragStart) &&
          config.onDragStart(source, piece, deepCopy(currentPosition), currentOrientation) === false) {
        return
      }

      // set state
      isDragging = true
      draggedPiece = piece
      draggedPieceSource = source

      // if the piece came from spare pieces, location is offboard
      if (source === 'spare') {
        draggedPieceLocation = 'offboard'
      } else {
        draggedPieceLocation = source
      }

      // capture the x, y coords of all squares in memory
      captureSquareOffsets()

      // create the dragged piece
      $draggedPiece.attr('src', buildPieceImgSrc(piece)).css({
        display: '',
        position: 'absolute',
        left: x - squareSize / 2,
        top: y - squareSize / 2
      })

      if (source !== 'spare') {
        // highlight the source square and hide the piece
        $('#' + squareElsIds[source])
          .addClass(CSS.highlight1)
          .find('.' + CSS.piece)
          .css('display', 'none')
      }
    }

    function updateDraggedPiece (x, y) {
      // put the dragged piece over the mouse cursor
      $draggedPiece.css({
        left: x - squareSize / 2,
        top: y - squareSize / 2
      })

      // get location
      var location = isXYOnSquare(x, y)

      // do nothing if the location has not changed
      if (location === draggedPieceLocation) return

      // remove highlight from previous square
      if (validSquare(draggedPieceLocation)) {
        $('#' + squareElsIds[draggedPieceLocation]).removeClass(CSS.highlight2)
      }

      // add highlight to new square
      if (validSquare(location)) {
        $('#' + squareElsIds[location]).addClass(CSS.highlight2)
      }

      // run onDragMove
      if (isFunction(config.onDragMove)) {
        config.onDragMove(
          location,
          draggedPieceLocation,
          draggedPieceSource,
          draggedPiece,
          deepCopy(currentPosition),
          currentOrientation
        )
      }

      // update state
      draggedPieceLocation = location
    }

    function stopDraggedPiece (location) {
      // determine what the action should be
      var action = 'drop'
      if (location === 'offboard' && config.dropOffBoard === 'snapback') {
        action = 'snapback'
      }
      if (location === 'offboard' && config.dropOffBoard === 'trash') {
        action = 'trash'
      }

      // run their onDrop function, which can potentially change the drop action
      if (isFunction(config.onDrop)) {
        var newPosition = deepCopy(currentPosition)

        // source piece is a spare piece and position is off the board
        // if (draggedPieceSource === 'spare' && location === 'offboard') {...}
        // position has not changed; do nothing

        // source piece is a spare piece and position is on the board
        if (draggedPieceSource === 'spare' && validSquare(location)) {
          // add the piece to the board
          newPosition[location] = draggedPiece
        }

        // source piece was on the board and position is off the board
        if (validSquare(draggedPieceSource) && location === 'offboard') {
          // remove the piece from the board
          delete newPosition[draggedPieceSource]
        }

        // source piece was on the board and position is on the board
        if (validSquare(draggedPieceSource) && validSquare(location)) {
          // move the piece
          delete newPosition[draggedPieceSource]
          newPosition[location] = draggedPiece
        }

        var oldPosition = deepCopy(currentPosition)

        var result = config.onDrop(
          draggedPieceSource,
          location,
          draggedPiece,
          newPosition,
          oldPosition,
          currentOrientation
        )
        if (result === 'snapback' || result === 'trash') {
          action = result
        }
      }

      // do it!
      if (action === 'snapback') {
        snapbackDraggedPiece()
      } else if (action === 'trash') {
        trashDraggedPiece()
      } else if (action === 'drop') {
        dropDraggedPieceOnSquare(location)
      }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    // clear the board
    widget.clear = function (useAnimation) {
      widget.position({}, useAnimation)
    }

    // remove the widget from the page
    widget.destroy = function () {
      // remove markup
      $container.html('')
      $draggedPiece.remove()

      // remove event handlers
      $container.unbind()
    }

    // shorthand method to get the current FEN
    widget.fen = function () {
      return widget.position('fen')
    }

    // flip orientation
    widget.flip = function () {
      return widget.orientation('flip')
    }

    // move pieces
    // TODO: this method should be variadic as well as accept an array of moves
    widget.move = function () {
      // no need to throw an error here; just do nothing
      // TODO: this should return the current position
      if (arguments.length === 0) return

      var useAnimation = true

      // collect the moves into an object
      var moves = {}
      for (var i = 0; i < arguments.length; i++) {
        // any "false" to this function means no animations
        if (arguments[i] === false) {
          useAnimation = false
          continue
        }

        // skip invalid arguments
        if (!validMove(arguments[i])) {
          error(2826, 'Invalid move passed to the move method.', arguments[i])
          continue
        }

        var tmp = arguments[i].split('-')
        moves[tmp[0]] = tmp[1]
      }

      // calculate position from moves
      var newPos = calculatePositionFromMoves(currentPosition, moves)

      // update the board
      widget.position(newPos, useAnimation)

      // return the new position object
      return newPos
    }

    widget.orientation = function (arg) {
      // no arguments, return the current orientation
      if (arguments.length === 0) {
        return currentOrientation
      }

      // set to white or black
      if (arg === 'white' || arg === 'black') {
        currentOrientation = arg
        drawBoard()
        return currentOrientation
      }

      // flip orientation
      if (arg === 'flip') {
        currentOrientation = currentOrientation === 'white' ? 'black' : 'white'
        drawBoard()
        return currentOrientation
      }

      error(5482, 'Invalid value passed to the orientation method.', arg)
    }

    widget.position = function (position, useAnimation) {
      // no arguments, return the current position
      if (arguments.length === 0) {
        return deepCopy(currentPosition)
      }

      // get position as FEN
      if (isString(position) && position.toLowerCase() === 'fen') {
        return objToFen(currentPosition)
      }

      // start position
      if (isString(position) && position.toLowerCase() === 'start') {
        position = deepCopy(START_POSITION)
      }

      // convert FEN to position object
      if (validFen(position)) {
        position = fenToObj(position)
      }

      // validate position object
      if (!validPositionObject(position)) {
        error(6482, 'Invalid value passed to the position method.', position)
        return
      }

      // default for useAnimations is true
      if (useAnimation !== false) useAnimation = true

      if (useAnimation) {
        // start the animations
        var animations = calculateAnimations(currentPosition, position)
        doAnimations(animations, currentPosition, position)

        // set the new position
        setCurrentPosition(position)
      } else {
        // instant update
        setCurrentPosition(position)
        drawPositionInstant()
      }
    }

    widget.resize = function () {
      // calulate the new square size
      squareSize = calculateSquareSize()

      // set board width
      $board.css('width', squareSize * 8 + 'px')

      // set drag piece size
      $draggedPiece.css({
        height: squareSize,
        width: squareSize
      })

      // spare pieces
      if (config.sparePieces) {
        $container
          .find('.' + CSS.sparePieces)
          .css('paddingLeft', squareSize + boardBorderSize + 'px')
      }

      // redraw the board
      drawBoard()
    }

    // set the starting position
    widget.start = function (useAnimation) {
      widget.position('start', useAnimation)
    }

    // -------------------------------------------------------------------------
    // Browser Events
    // -------------------------------------------------------------------------

    function stopDefault (evt) {
      evt.preventDefault()
    }

    function mousedownSquare (evt) {
      // do nothing if we're not draggable
      if (!config.draggable) return

      // do nothing if there is no piece on this square
      var square = $(this).attr('data-square')
      if (!validSquare(square)) return
      if (!currentPosition.hasOwnProperty(square)) return

      beginDraggingPiece(square, currentPosition[square], evt.pageX, evt.pageY)
    }

    function touchstartSquare (e) {
      // do nothing if we're not draggable
      if (!config.draggable) return

      // do nothing if there is no piece on this square
      var square = $(this).attr('data-square')
      if (!validSquare(square)) return
      if (!currentPosition.hasOwnProperty(square)) return

      e = e.originalEvent
      beginDraggingPiece(
        square,
        currentPosition[square],
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      )
    }

    function mousedownSparePiece (evt) {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return

      var piece = $(this).attr('data-piece')

      beginDraggingPiece('spare', piece, evt.pageX, evt.pageY)
    }

    function touchstartSparePiece (e) {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return

      var piece = $(this).attr('data-piece')

      e = e.originalEvent
      beginDraggingPiece(
        'spare',
        piece,
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      )
    }

    function mousemoveWindow (evt) {
      if (isDragging) {
        updateDraggedPiece(evt.pageX, evt.pageY)
      }
    }

    var throttledMousemoveWindow = throttle(mousemoveWindow, config.dragThrottleRate)

    function touchmoveWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // prevent screen from scrolling
      evt.preventDefault()

      updateDraggedPiece(evt.originalEvent.changedTouches[0].pageX,
        evt.originalEvent.changedTouches[0].pageY)
    }

    var throttledTouchmoveWindow = throttle(touchmoveWindow, config.dragThrottleRate)

    function mouseupWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // get the location
      var location = isXYOnSquare(evt.pageX, evt.pageY)

      stopDraggedPiece(location)
    }

    function touchendWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // get the location
      var location = isXYOnSquare(evt.originalEvent.changedTouches[0].pageX,
        evt.originalEvent.changedTouches[0].pageY)

      stopDraggedPiece(location)
    }

    function mouseenterSquare (evt) {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (isDragging) return

      // exit if they did not provide a onMouseoverSquare function
      if (!isFunction(config.onMouseoverSquare)) return

      // get the square
      var square = $(evt.currentTarget).attr('data-square')

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) return

      // get the piece on this square
      var piece = false
      if (currentPosition.hasOwnProperty(square)) {
        piece = currentPosition[square]
      }

      // execute their function
      config.onMouseoverSquare(square, piece, deepCopy(currentPosition), currentOrientation)
    }

    function mouseleaveSquare (evt) {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (isDragging) return

      // exit if they did not provide an onMouseoutSquare function
      if (!isFunction(config.onMouseoutSquare)) return

      // get the square
      var square = $(evt.currentTarget).attr('data-square')

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) return

      // get the piece on this square
      var piece = false
      if (currentPosition.hasOwnProperty(square)) {
        piece = currentPosition[square]
      }

      // execute their function
      config.onMouseoutSquare(square, piece, deepCopy(currentPosition), currentOrientation)
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    function addEvents () {
      // prevent "image drag"
      $('body').on('mousedown mousemove', '.' + CSS.piece, stopDefault)

      // mouse drag pieces
      $board.on('mousedown', '.' + CSS.square, mousedownSquare)
      $container.on('mousedown', '.' + CSS.sparePieces + ' .' + CSS.piece, mousedownSparePiece)

      // mouse enter / leave square
      $board
        .on('mouseenter', '.' + CSS.square, mouseenterSquare)
        .on('mouseleave', '.' + CSS.square, mouseleaveSquare)

      // piece drag
      var $window = $(window)
      $window
        .on('mousemove', throttledMousemoveWindow)
        .on('mouseup', mouseupWindow)

      // touch drag pieces
      if (isTouchDevice()) {
        $board.on('touchstart', '.' + CSS.square, touchstartSquare)
        $container.on('touchstart', '.' + CSS.sparePieces + ' .' + CSS.piece, touchstartSparePiece)
        $window
          .on('touchmove', throttledTouchmoveWindow)
          .on('touchend', touchendWindow)
      }
    }

    function initDOM () {
      // create unique IDs for all the elements we will create
      createElIds()

      // build board and save it in memory
      $container.html(buildContainerHTML(config.sparePieces))
      $board = $container.find('.' + CSS.board)

      if (config.sparePieces) {
        $sparePiecesTop = $container.find('.' + CSS.sparePiecesTop)
        $sparePiecesBottom = $container.find('.' + CSS.sparePiecesBottom)
      }

      // create the drag piece
      var draggedPieceId = uuid()
      $('body').append(buildPieceHTML('wP', true, draggedPieceId))
      $draggedPiece = $('#' + draggedPieceId)

      // TODO: need to remove this dragged piece element if the board is no
      // longer in the DOM

      // get the border size
      boardBorderSize = parseInt($board.css('borderLeftWidth'), 10)

      // set the size and draw the board
      widget.resize()
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    setInitialState()
    initDOM()
    addEvents()

    // return the widget object
    return widget
  } // end constructor

  // TODO: do module exports here
  window['Chessboard'] = constructor

  // support legacy ChessBoard name
  window['ChessBoard'] = window['Chessboard']

  // expose util functions
  window['Chessboard']['fenToObj'] = fenToObj
  window['Chessboard']['objToFen'] = objToFen
})() // end anonymous wrapper

var database_loadGame = function () {
    console.log("init database_loadGame for : " + gameId);
    var docRef = db.collection("games").doc("" + gameId);
    docRef
        .get()
        .then(function (doc) {
            
            if (doc.exists) {
                
                console.log("game exists");

                document.title = "altbryson.com/g/" + gameId;
                if (doc.data().userLimit){
                    userLimit = doc.data().userLimit;
                }
                
                switch(doc.data().type){
                    case "page":
                        database_loadGameUsers();
                        database_loadGamesList();
                        break;
                    case "minigolf":
                        game_minigolf();
                        break;
                    case "tictactoe":
                        game_tictactoe();
                        break;
                    case "dotsandboxes":
                        game_dotsandboxes(doc);
                        break;
                    case "chess":
                        game_chess(doc);
                        break;
                }
                
            } else {
                console.log("else game does not exist");
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}
var database_loadGamesList = function(){
    console.log("database_loadGamesList");


    db
    .collection("games")
    .orderBy("activeDate", "desc")
    // .where("type", "==", 'tictactoe')
    .onSnapshot(function(querySnapshot) {
        console.log("database_loadGamesList querySnapshot");

        var userGameIdArray = [];
        var classString = '';
        
        var html = '';
        html += '<table>';
        html += '<thead>';
            html += '<tr>';
                html += '<td></td>';
                html += '<td>type</td>';
                html += '<td>name</td>';
                html += '<td>age</td>';
                html += '<td>moves</td>';
                html += '<td>fin</td>';
            html += '</tr>';
        html += '</<thead>';
            html += '<tbody>';
                querySnapshot.forEach(function(doc) {
                
                    var uniqueString = (doc.id).charAt(0);
                    var charAtCount = 1;
                    while (userGameIdArray[uniqueString]){
                        uniqueString = uniqueString + '' + (doc.id).charAt(charAtCount);
                    }
                    userGameIdArray[uniqueString] = true;

                    classString = (doc.data().complete) ?  ' game_complete' : '';
                    classString += (doc.data().uid == uid) ?  ' game_user' : '';

                    html += '<tr class="div_game ' + classString + '">';
                        html += '<td>';
                            html += '<img src="' + doc.data().photoUrl + '" />';
                        html += '</td>';
                        html += '<td>';
                            html += '<a href="/g/' + doc.data().type + '/' + doc.id + '">';
                                html += doc.data().type;
                            html += '</a>';
                        html += '</td>';
                        html += '<td>';
                            html += uniqueString;
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().activeDate)? func_timeSince(doc.data().activeDate.toDate()) : 'old';
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().moveCount)? doc.data().moveCount : '0';
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().complete)? doc.data().complete : 'false';
                        html += '</td>';
                    html += '</tr>';
                });
            html += '</tbody>';
        html += '</table>';
        $('#loadGamesHere').html(html).removeClass('hidden').find('table').DataTable();

    });
}
var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    
    db.collection("games/"+gameId+"/gameUsers")
    .onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");
    
        var now = new Date();
        var oneMinute = 15;
        var elevenSeconds = (1/60)*11;
        var MS_PER_MINUTE = 60000;
        var oneMinuteAgo = new Date(now - oneMinute * MS_PER_MINUTE);
        var elevenSecondsAgo = new Date(now - elevenSeconds * MS_PER_MINUTE);
        
        var html = '';
        querySnapshot.forEach(function(doc) {
            
            var classNames = ' user';

            var userLastActiveDate = new Date();
            if (doc.data().dateUpdated != null){
                userLastActiveDate = doc.data().dateUpdated.toDate();
            }
            var userTime = new Date(userLastActiveDate);

            console.log('inserting ' + doc.data().uid + ' with ' + classNames);
            
            if (doc.data().uid == uid){
                classNames += ' me';
                html += '<div class="ddmenu dropdown pull-right">';
                    html += '<button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
                        html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'">';
                        html += '    <img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span>';
                        html += '</div>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">';
                    html += '    <li><a class="navbutton_home" href="/"><i class="fas fa-home"></i> Homepage</a></li>';
                    html += '    <li><a class="button_login hidden" href="#">Login for Games</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="tictactoe"><i class="fas fa-hashtag"></i> TicTacToe</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="minigolf"><i class="fas fa-golf-ball"></i> minigolf</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="dotsandboxes"><i class="fas fa-border"></i> dotsandboxes</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="chess"><i class="fas fa-chess"></i> Chess</a></li>';
                    html += '    <li><a class="button_logout">Logout <span id="username"></span></a></li>';
                    html += '</ul>';
                html += '</div>';
            }else{
                if (userTime <= oneMinuteAgo){
                    classNames += ' oneMinuteAgo';
                }
                if (userTime <= elevenSecondsAgo){
                    classNames += ' elevenSecondsAgo';
                }
                html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span></div>';
            }
        });

        if (html == ''){
            html +='<p>No users</p>'
        }

        $('.userbank').html(html).removeClass('hidden');

        $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
        $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');
        
        console.log('userbank added');
        button_logout();
        button_create_game();
    });

}
var database_setGameActive = function(){
    console.log('init database_setGameActive');

    db.collection("games")
    .doc("" + gameId)
    .set(
        {
            activeDate: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
    );
}
var database_setGameComplete = function(winnerUid){
    console.log('init database_setGameComplete');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            winner: winnerUid,
            complete : true
        },
        { merge: true }
    )
    .then((docRef) => {
        $('#uid-'+winnerUid).addClass('winner');
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}
var database_setGameInfo = function(){
    console.log('init database_setGameInfo');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
    );
    
}
var database_setGameMoveCount = function(moveCount){
    console.log('init database_setGameMoveCount');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            moveCount : moveCount
        },
        { merge: true }
    )
    .then((docRef) => {
        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}
var database_setGameUser = function(){
    console.log('init database_setGameUser');

    newUserData = userData;
    newUserData.dateCreated = firebase.firestore.FieldValue.serverTimestamp();
    
    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
    .doc("" + firebase.auth().currentUser.uid)
    .set(
        newUserData,
        { merge: true }
    );

}
var database_setLocation = function () {
    console.log("database_setLocation");
    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            {
                path : path
            },
            { merge: true }
        );
}
var database_setMove = function(docName, docJson, moveCount){
    console.log('init database_setMove');
    
    docJson.uid = uid;
    docJson.createDate = firebase.firestore.FieldValue.serverTimestamp();

    db.collection("games/"+gameId+"/moves")
    .doc(docName)
    .set(docJson)
    .then((docRef) => {
        database_setGameMoveCount(moveCount);        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}
var database_setUserData = function (user) {
    console.log("database_setUserData");

    // var gravatarImage = func_getGravatar(user.email);
    
    // $('#username').html(user.email);
    // $('#usernameShort').html((user.email).charAt(0) + (user.email).charAt(1) + (user.email).charAt(2));

    // $('#userimage').html('<img src="' + gravatarImage + '" />');

    userData = {
        name: user.displayName,
        // email: user.email,
        photoUrl: user.photoURL,
        // emailVerified: user.emailVerified,
        uid: user.uid,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }

    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            userData,
            { merge: true }
        );
}
var firebase_init = function() {
  // console.log('firebaseManager init')
  
  //config and init firebase
  firebase.initializeApp({
    apiKey: "AIzaSyBHgeDd8PHNCp1l8KFEx62ufMXOV9BE9jQ",
    authDomain: "altbryson-b17a8.firebaseapp.com",
    databaseURL: "https://altbryson-b17a8.firebaseio.com",
    projectId: "altbryson-b17a8",
    storageBucket: "altbryson-b17a8.appspot.com",
    messagingSenderId: "475959615157",
    appId: "1:475959615157:web:33646f3233edefb35e68fc"
  });

  //setup db
  db = firebase.firestore();

  firebase_onAuthStateChanged(); //store user information when available

  // FirebaseUI config.
  var uiConfig = {
    signInSuccessUrl: "/",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "/tos/",
    // Privacy policy url.
    privacyPolicyUrl: "/privacy/"
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  $("#firebaseui-auth-container").html("");
  ui.start("#firebaseui-auth-container", uiConfig);
};

var firebase_onAuthStateChanged = function () {
  // console.log('firebaseManager.onAuthStateChanged init')
  firebase.auth().onAuthStateChanged(function (user) {
    
    if (user) {

      // User logged in already or has just logged in.
      uid = user.uid;
      gameId = path[3];
      if (gameId == null){
        gameId = 'home';
      }
      database_setUserData(user);
      database_setLocation();
      database_loadGame();

    } else {

      // User not logged in or has just logged out.
      uid = null;
      button_login();

    }

  });
};

var firebase_signOut = function () {
  firebase.auth().signOut().then(function () {
    console.log('Signed Out')
  }, function (error) {
    console.error('Sign Out Error', error)
  })
}
var func_getGravatar = function(email) {
  var MD5 = function(s) {
    function L(k, d) {
      return (k << d) | (k >>> (32 - d));
    }
    function K(G, k) {
      var I, d, F, H, x;
      F = G & 2147483648;
      H = k & 2147483648;
      I = G & 1073741824;
      d = k & 1073741824;
      x = (G & 1073741823) + (k & 1073741823);
      if (I & d) {
        return x ^ 2147483648 ^ F ^ H;
      }
      if (I | d) {
        if (x & 1073741824) {
          return x ^ 3221225472 ^ F ^ H;
        } else {
          return x ^ 1073741824 ^ F ^ H;
        }
      } else {
        return x ^ F ^ H;
      }
    }
    function r(d, F, k) {
      return (d & F) | (~d & k);
    }
    function q(d, F, k) {
      return (d & k) | (F & ~k);
    }
    function p(d, F, k) {
      return d ^ F ^ k;
    }
    function n(d, F, k) {
      return F ^ (d | ~k);
    }
    function u(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(r(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function f(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(q(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function D(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(p(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function t(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(n(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function e(G) {
      var Z;
      var F = G.length;
      var x = F + 8;
      var k = (x - (x % 64)) / 64;
      var I = (k + 1) * 16;
      var aa = Array(I - 1);
      var d = 0;
      var H = 0;
      while (H < F) {
        Z = (H - (H % 4)) / 4;
        d = (H % 4) * 8;
        aa[Z] = aa[Z] | (G.charCodeAt(H) << d);
        H++;
      }
      Z = (H - (H % 4)) / 4;
      d = (H % 4) * 8;
      aa[Z] = aa[Z] | (128 << d);
      aa[I - 2] = F << 3;
      aa[I - 1] = F >>> 29;
      return aa;
    }
    function B(x) {
      var k = "",
        F = "",
        G,
        d;
      for (d = 0; d <= 3; d++) {
        G = (x >>> (d * 8)) & 255;
        F = "0" + G.toString(16);
        k = k + F.substr(F.length - 2, 2);
      }
      return k;
    }
    function J(k) {
      k = k.replace(/rn/g, "n");
      var d = "";
      for (var F = 0; F < k.length; F++) {
        var x = k.charCodeAt(F);
        if (x < 128) {
          d += String.fromCharCode(x);
        } else {
          if (x > 127 && x < 2048) {
            d += String.fromCharCode((x >> 6) | 192);
            d += String.fromCharCode((x & 63) | 128);
          } else {
            d += String.fromCharCode((x >> 12) | 224);
            d += String.fromCharCode(((x >> 6) & 63) | 128);
            d += String.fromCharCode((x & 63) | 128);
          }
        }
      }
      return d;
    }
    var C = Array();
    var P, h, E, v, g, Y, X, W, V;
    var S = 7,
      Q = 12,
      N = 17,
      M = 22;
    var A = 5,
      z = 9,
      y = 14,
      w = 20;
    var o = 4,
      m = 11,
      l = 16,
      j = 23;
    var U = 6,
      T = 10,
      R = 15,
      O = 21;
    s = J(s);
    C = e(s);
    Y = 1732584193;
    X = 4023233417;
    W = 2562383102;
    V = 271733878;
    for (P = 0; P < C.length; P += 16) {
      h = Y;
      E = X;
      v = W;
      g = V;
      Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
      V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
      W = u(W, V, Y, X, C[P + 2], N, 606105819);
      X = u(X, W, V, Y, C[P + 3], M, 3250441966);
      Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
      V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
      W = u(W, V, Y, X, C[P + 6], N, 2821735955);
      X = u(X, W, V, Y, C[P + 7], M, 4249261313);
      Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
      V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
      W = u(W, V, Y, X, C[P + 10], N, 4294925233);
      X = u(X, W, V, Y, C[P + 11], M, 2304563134);
      Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
      V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
      W = u(W, V, Y, X, C[P + 14], N, 2792965006);
      X = u(X, W, V, Y, C[P + 15], M, 1236535329);
      Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
      V = f(V, Y, X, W, C[P + 6], z, 3225465664);
      W = f(W, V, Y, X, C[P + 11], y, 643717713);
      X = f(X, W, V, Y, C[P + 0], w, 3921069994);
      Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
      V = f(V, Y, X, W, C[P + 10], z, 38016083);
      W = f(W, V, Y, X, C[P + 15], y, 3634488961);
      X = f(X, W, V, Y, C[P + 4], w, 3889429448);
      Y = f(Y, X, W, V, C[P + 9], A, 568446438);
      V = f(V, Y, X, W, C[P + 14], z, 3275163606);
      W = f(W, V, Y, X, C[P + 3], y, 4107603335);
      X = f(X, W, V, Y, C[P + 8], w, 1163531501);
      Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
      V = f(V, Y, X, W, C[P + 2], z, 4243563512);
      W = f(W, V, Y, X, C[P + 7], y, 1735328473);
      X = f(X, W, V, Y, C[P + 12], w, 2368359562);
      Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
      V = D(V, Y, X, W, C[P + 8], m, 2272392833);
      W = D(W, V, Y, X, C[P + 11], l, 1839030562);
      X = D(X, W, V, Y, C[P + 14], j, 4259657740);
      Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
      V = D(V, Y, X, W, C[P + 4], m, 1272893353);
      W = D(W, V, Y, X, C[P + 7], l, 4139469664);
      X = D(X, W, V, Y, C[P + 10], j, 3200236656);
      Y = D(Y, X, W, V, C[P + 13], o, 681279174);
      V = D(V, Y, X, W, C[P + 0], m, 3936430074);
      W = D(W, V, Y, X, C[P + 3], l, 3572445317);
      X = D(X, W, V, Y, C[P + 6], j, 76029189);
      Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
      V = D(V, Y, X, W, C[P + 12], m, 3873151461);
      W = D(W, V, Y, X, C[P + 15], l, 530742520);
      X = D(X, W, V, Y, C[P + 2], j, 3299628645);
      Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
      V = t(V, Y, X, W, C[P + 7], T, 1126891415);
      W = t(W, V, Y, X, C[P + 14], R, 2878612391);
      X = t(X, W, V, Y, C[P + 5], O, 4237533241);
      Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
      V = t(V, Y, X, W, C[P + 3], T, 2399980690);
      W = t(W, V, Y, X, C[P + 10], R, 4293915773);
      X = t(X, W, V, Y, C[P + 1], O, 2240044497);
      Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
      V = t(V, Y, X, W, C[P + 15], T, 4264355552);
      W = t(W, V, Y, X, C[P + 6], R, 2734768916);
      X = t(X, W, V, Y, C[P + 13], O, 1309151649);
      Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
      V = t(V, Y, X, W, C[P + 11], T, 3174756917);
      W = t(W, V, Y, X, C[P + 2], R, 718787259);
      X = t(X, W, V, Y, C[P + 9], O, 3951481745);
      Y = K(Y, h);
      X = K(X, E);
      W = K(W, v);
      V = K(V, g);
    }
    var i = B(Y) + B(X) + B(W) + B(V);
    return i.toLowerCase();
  };

  var size = 80;

  return "http://www.gravatar.com/avatar/" + MD5(email) + ".jpg?s=" + size;
};

var func_is_colliding = function(div1, div2) {

    var rect1 = {x: div1.position().left, y: div1.position().top, width: div1.width(), height: div1.height()}
    var rect2 = {x: div2.position().left, y: div2.position().top, width: div2.width(), height: div2.height()}
  
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
        return true;
   }
  
    return false;
  }; 
var func_timeSince = function(start){
    var startDate = new Date(start);
    var endDate = new Date();
    var diff = endDate.getTime() - startDate.getTime();
    var minutes = Math.floor(diff / 1000 / 60 );
    
    return  minutes;
}


var game = null;
var board = null;
var game_chess = function(gameDoc){
  console.log('init game_chess');
  
  // NOTE: this example uses the chess.js library:
  // https://github.com/jhlywa/chess.js
  // NOTE: this example uses the chess.js library:
  // https://github.com/jhlywa/chess.js

  board = null
  game = new Chess()
  var $status = $('#status')
  var $fen = $('#fen')
  var $pgn = $('#pgn')
  var whiteSquareGrey = '#a9a9a9'
  var blackSquareGrey = '#696969'
  var moveCount = 0;
  var playerArray = [];

  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd () {
    board.position(game.fen())
  }

  function updateStatus () {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
      moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
      status = 'Game over, drawn position'
    }

    // game still on
    else {
      status = moveColor + ' to move'

      // check?
      if (game.in_check()) {
        status += ', ' + moveColor + ' is in check'
      }
    }
    
    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())

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
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  function onDrop (source, target) {

    // see if the move is legal
    var move = game.move({
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
      fen: game.fen(),
      pgn: game.pgn()
    }

    database_setMove('count_'+moveCount, docJson, moveCount);
  }

  function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
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

    game.setTurn((moveCount % 2) ? "w" : "b")

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
    game.load_pgn(current_pgn);

    updateStatus();

  });
}

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
    
    if (playerUid[1] == null){
      playerUid[1] = gameDoc.data().playerOne;
    }
    if (playerUid[2] == null){
      playerUid[2] = gameDoc.data().playerTwo;
    }
    
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

      };
    };
        
    $('#uid-' + playerUid[1] +' .score').html(score1.toString()).removeClass('hidden');
    $('#uid-' + playerUid[2] +' .score').html(score2.toString()).removeClass('hidden');

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
  
  database_setGameUser();
  database_setGameInfo();

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
        console.log('loading game data on demand');

        var count = 0;

        querySnapshot.forEach(function(doc) {

          //game data
          switch(doc.data().array){
            case 'h':
              hArray[doc.data().lineNum] = doc.data().player;
              console.log('processing move ' + doc.data().array + '['+doc.data().lineNum+'] =' + doc.data().player);
              break;
            case 'v':
              vArray[doc.data().lineNum] = doc.data().player;
              console.log('processing move ' + doc.data().array + '['+doc.data().lineNum+'] =' + doc.data().player);
              break;
            case 'board':
              board[doc.data().row][doc.data().col] = doc.data().player;
              console.log('processing move ' + doc.data().array + '['+doc.data().row+']['+doc.data().col+'] =' + doc.data().player);
              break;  
          }
          count++;

        });
        
        game_loop();
        
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
        
        database_setGameActive();
        database_loadGameUsers();

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  });

}
var ball_left = 0;
var ball_top = 0;
var ball = {};
var game_minigolf = function(){
    console.log('minigolf init');
    ball_left = $('#mgb_ball').css("left");
    ball_top = $('#mgb_ball').css("top");
    ball = {
        position: {x: parseInt(ball_left.substring(0, ball_left.length-2)), y: parseInt(ball_top.substring(0, ball_top.length-2))},
        velocity: {x: 0, y: 0},
        mass: 0.04593, //kg
        radius: 2.15, // 1px = 1cm
        restitution: -0.8
        };
    /*
    * Experiment with values of mass, radius, restitution,
    * gravity (ag), and density (rho)!
    * 
    * Changing the constants literally changes the environment
    * the ball is in. 
    * 
    * Some settings to try:
    * the moon: ag = 1.6
    * water: rho = 1000, mass 5
    * beach ball: mass 0.05, radius 30
    * lead ball: mass 10, restitution -0.05
    */
    var ballInMotion = false;
    var winner = false;
    var width = $('#mgb_map').width()-ball.radius-ball.radius;
    var height = $('#mgb_map').height()-ball.radius-ball.radius;
    var canvas = document.getElementById("ctx");
    var ctx = canvas.getContext("2d");
    var frameRate = 1/40; // Seconds
    var frameDelay = frameRate * 1000; // ms
    var loopTimer = false;

    var friction = 0.98;
    var Cd = 0.47;  // Dimensionless
    var rho = 1.22; // kg / m^3
    var A = Math.PI * ball.radius * ball.radius / (10000); // m^2
    var ag = 0;  // m / s^2
    var mouse = {x: 0, y: 0, isDown: false};
    var ax = 0;
    var ay = 0;
    var distance = 0;
    var power = 0;

    var updateDebug = function(){
        $('.mousex').html(Math.round(mouse.x));
        $('.mousey').html(Math.round(mouse.y));
        $('.ax').html(Math.round(ax));
        $('.ay').html(Math.round(ay));
        $('.ballx').html(Math.round(ball.position.x));
        $('.bally').html(Math.round(ball.position.y)); 
        $('#distance').html(Math.round(distance/2.54/12) + ' ft');
        $('#power').html(Math.round(power));
    }

    var getMousePosition = function (e) {
        mouse.x = e.pageX - $('#ctx').position().left - $('#mgb').position().left;
        mouse.y = e.pageY - $('#ctx').position().top - $('#mgb').position().top;

        if (mouse.x > 120){
            mouse.x = 120;
        }
        if (mouse.y > 120){
            mouse.y = 120;
        }

        ctx.clearRect(0,0,120,120);
        ctx.beginPath();
        ctx.moveTo(62.5, 62.5);
        ctx.strokeStyle = "#9ab396";
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.closePath();
        
        
        var oldX = 62.5;
        var oldY = 62.5;
        var newX = mouse.x;
        var newY = mouse.y;
        
        var a = Math.abs(oldX - newX);
        var b = Math.abs(oldY - newY);
        power = Math.sqrt((a*a) + (b*b));

        updateDebug();
    }
    var mouseDown = function(e) {
        mouse.isDown = true;
        //sets ball at mouse position
    }
    var mouseUp = function(e) {   
        if (!ballInMotion){
            distance = 0;
            mouse.isDown = false;
            ballInMotion = true;
            var ballvelocityx = (mouse.x-62.5) /-3;
            var ballvelocityy = (mouse.y-62.5) /-3;
            $('.velocityx').html(ballvelocityx);
            $('.velocityy').html(ballvelocityy);
            ball.velocity.x = ballvelocityx;
            ball.velocity.y = ballvelocityy;
        }
    }
    var touchmove = function(e){
        e.preventDefault();
        getMousePosition(e.changedTouches[0]);
    }
    var touchstart = function(e){
        e.preventDefault();
        mouseDown(e.changedTouches[0]);
        getMousePosition(e.changedTouches[0]);
    }
    var touchend = function(e){
        e.preventDefault();
        mouseUp(e.changedTouches[0]);
    }

    var setup = function() {
        
        canvas.onmousemove = getMousePosition;
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        canvas.addEventListener("touchstart", touchstart, false);
        canvas.addEventListener("touchmove", touchmove, false);
        canvas.addEventListener("touchend", touchend, false);
                
        loopTimer = setInterval(loop, frameDelay);
        $('#ctx').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        $('#distance').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        $('#power').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        updateDebug();
    }
    var loop = function() {

        if (ballInMotion && !winner) {

            // Drag force: Fd = -1/2 * Cd * A * rho * v * v
            var Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
            var Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);
            
            Fx = (isNaN(Fx) ? 0 : Fx);
            Fy = (isNaN(Fy) ? 0 : Fy);
            
            // Calculate acceleration ( F = ma )
            ax = (Fx) / ball.mass;
            ay = ag + ((Fy) / ball.mass);

            // Integrate to get velocity
            ball.velocity.x += (ax*frameRate);
            if (Math.abs(ball.velocity.x) > .007){
                ball.velocity.x = ball.velocity.x*friction;
            }else{
                ball.velocity.x = 0;
            }
            ball.velocity.y += (ay*frameRate);
            if (Math.abs(ball.velocity.y) > .007){
                ball.velocity.y = ball.velocity.y*friction;
            }else{
                ball.velocity.y = 0;
            }

            var oldBallX = ball.position.x;
            var oldBallY = ball.position.y;

            // Integrate to get position
            ball.position.x += ball.velocity.x*frameRate*100;
            ball.position.y += ball.velocity.y*frameRate*100;
            
            var newBallX = ball.position.x;
            var newBallY = ball.position.y;

            var a = Math.abs(oldBallX - newBallX);
            var b = Math.abs(oldBallY - newBallY);
            var addDistance = Math.sqrt((a*a) + (b*b));
            distance += addDistance;
            
            // Handle collisions
            if (ball.position.y < ball.radius) {
                ball.velocity.y *= ball.restitution;
                ball.position.y = ball.radius;
            }
            if (ball.position.y > height - ball.radius) {
                ball.velocity.y *= ball.restitution;
                ball.position.y = height - ball.radius;
            }
            if (ball.position.x > width - ball.radius) {
                ball.velocity.x *= ball.restitution;
                ball.position.x = width - ball.radius;
            }
            if (ball.position.x < ball.radius) {
                ball.velocity.x *= ball.restitution;
                ball.position.x = ball.radius;
            }


            //todo: add test to make sure ball is moving slow enough to actually go into the hole
            if (func_is_colliding($('#mgb_ball'), $('#mgb_hole'))){
                    winner = true;
                    ball.velocity.x = 0;
                    ball.velocity.y = 0;
            }
            else 
            if (func_is_colliding($('#mgb_ball'), $('#mgb_barrier'))){
                
            }
            else 
            if (ball.velocity.x == 0 && ball.velocity.y == 0){
                ballInMotion = false;
                $('#ctx').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
                $('#distance').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
                $('#power').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
            }
        
            

            // Draw the ball
            $('#mgb_ball').css('left', ball.position.x).css('top', ball.position.y);

            // ctx.translate(ball.position.x, ball.position.y);
            // ctx.beginPath();
            // ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true);
            // ctx.fill();
            // ctx.closePath();
            
            // ctx.restore();
            updateDebug();
        }
    }

    setup();
}
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
var path = window.location.pathname.split("/");
var userData = null;
var uid = null;
var gameId = null;
var userLimit = 2;
var playerBeforeLastUid = '';
var lastPlayerUid = '';
var playerArray = []; 
var gameBoard = [];