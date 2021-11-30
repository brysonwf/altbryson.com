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
        var toISOString = new Date().toISOString();
        db.collection("games").add({
            type: type,
            dateCreated: toISOString,
            dateUpdated: toISOString,
            uid: firebase.auth().currentUser.uid,
            budgetItems: 0,
            budgetLines: 0,
            create: [],
            read: [],
            update: [],
            delete: []
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
    $(".button_logout").removeClass('hidden').click(function () {
        console.log('button_logout');
        firebase_signOut();
        location.reload();
    });
}
var database_addUserToGame = function(){
    console.log('add user');

    newUserData = userData;
    newUserData.createDate = new Date();

    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
    .doc("" + firebase.auth().currentUser.uid)
    .set(
        newUserData,
        { merge: true }
    );

    database_loadGameUsers();
}
var database_loadGame = function () {
    console.log("init database_loadGame for : " + gameId);
    var docRef = db.collection("games").doc("" + gameId);
    docRef
        .get()
        .then(function (doc) {
            if (doc.exists) {
                
                console.log("game exists");
                document.title = "altbryson.com/g/" + gameId;

                if (doc.data().type == "minigolf"){
                    game_minigolf();
                }else if (doc.data().type == 'tictactoe'){
                    game_tictactoe();
                }

                database_updateGameStats();
                database_addUserToGame();
                
                setInterval(function() {
                    database_updateGameStats();
                    database_addUserToGame();
                }, 10000);
                
                
            } else {
                console.log("else game does not exist");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}
var database_loadGamesList = function(){
    console.log("database_loadGamesList");

    var now = new Date();
    var durationInMinutes = 15;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - durationInMinutes * MS_PER_MINUTE);
    
    db
    .collection("games")
    .where("activeDate", ">=", oneMinuteAgo)
    .orderBy("activeDate", "desc")
    .limit(5)
    .onSnapshot(function(querySnapshot) {
        
        console.log("database_loadGamesList querySnapshot");
        var html = '';
        html += '<ol>';
        querySnapshot.forEach(function(doc) {
            html += '<li class="div_game">';
            html += '<a class="btn btn-default btn-lg btn-join" href="/g/' + doc.data().type + '/' + doc.id + '">';
            html += doc.data().type + '/' + doc.id;
            html += '</a>';
            html += '</li>';
        });
        html += '</ol>';
        $('#loadGamesHere').html(html);

    });
}
var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    var now = new Date();
    var durationInMinutes = 1;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - durationInMinutes * MS_PER_MINUTE);

    db.collection("games/"+gameId+"/gameUsers").onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");

        var classNames = '';
        let letter = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            var userTime = new Date(doc.data().createDate.toDate())
            
            classNames = 'user ';
            if (userTime <= oneMinuteAgo){
                classNames += 'nothere '
            }else{

            }
            letter = (doc.data().name).charAt(0);
            html += "<div class=\"" + classNames +"\">"+ letter +"</div>";
        });
        html += '';

        $('.userbank').html(html);

    });

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
var database_setUser = function (user) {
    console.log("database_setUser");

    // var gravatarImage = getGravatar(user.email);
    
    $('#username').html(user.email);

    // $('#userimage').html('<img src="' + gravatarImage + '" />');

    $('.ddmenu').removeClass('hidden');

    let createDate = new Date();

    userData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        // gravatar: gravatarImage,
        createDate: createDate
    }

    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            userData,
            { merge: true }
        );
}
var database_updateGameStats = function(){
    console.log('init database_updateGameStats');

    var activeDate = new Date();

    db.collection("games")
    .doc("" + gameId)
    .set(
        {
            activeDate: activeDate
        },
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
      database_setUser(user);
      database_setLocation();
      button_logout();
      button_create_game();

      //route
      switch (path[1]) {

        case "home":
          console.log("home");
          database_loadGamesList();
          break;
        case "g":
          gameId = path[3];
          database_loadGame();
          break;
        default:
          console.log("404");
          
      }

    } else {

      // User not logged in or has just logged out.
      uid = null;
      button_login();

      
      //route
      switch (path[1]) {
  
        case "games":
        case "g":
          gameId = path[3];
          $(".button_login").click();
          break;
        default:
          console.log("404 / home");
          
      }

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
            if (is_colliding($('#mgb_ball'), $('#mgb_hole'))){
                    winner = true;
                    ball.velocity.x = 0;
                    ball.velocity.y = 0;
            }
            else 
            if (is_colliding($('#mgb_ball'), $('#mgb_barrier'))){
                
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
var getGravatar = function(email) {
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

var path = window.location.pathname.split("/");
var userData = null;
var uid = null;
var gameId = null;
var is_colliding = function(div1, div2) {

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