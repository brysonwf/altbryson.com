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
    $(".button_logout").removeClass('hidden').click(function () {
        console.log('button_logout');
        firebase_signOut();
        location.reload();
    });
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
                if (doc.data().userLimit){
                    userLimit = doc.data().userLimit;
                }
                
                database_setGameActive();
                database_setGameUser();
                database_setGameInfo();
                database_loadGameUsers();
                
                // setInterval(function() {
                //     database_setGameActive();
                //     database_setGameUser();
                // }, 10000);

                switch(doc.data().type){
                    case "minigolf":
                        game_minigolf();
                        break;
                    case "tictactoe":
                        game_tictactoe();
                        break;
                    case "dotsandboxes":
                        game_dotsandboxes(doc);
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
        $('#loadGamesHere').html(html).find('table').DataTable();

    });
}
var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    var now = new Date();
    var oneMinute = 15;
    var elevenSeconds = (1/60)*11;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - oneMinute * MS_PER_MINUTE);
    var elevenSecondsAgo = new Date(now - elevenSeconds * MS_PER_MINUTE);

    db.collection("games/"+gameId+"/gameUsers").onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");

        var userArray = [];

        var classNames = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            var uniqueUserString = (doc.data().name).charAt(0);
            var charAtCount = 1;
            while (userArray[uniqueUserString]){
                uniqueUserString = uniqueUserString + '' + (doc.data().name).charAt(charAtCount);
                charAtCount++;
            }
            userArray[uniqueUserString] = true;

            var userLastActiveDate = new Date();
            if (doc.data().dateUpdated != null){
                userLastActiveDate = doc.data().dateUpdated.toDate();
            }
            var userTime = new Date(userLastActiveDate);
            classNames = ' user';
            if (doc.data().uid == uid){
                classNames += ' me';
            }
            if (userTime <= elevenSecondsAgo){
                classNames += ' nothere';
            }
            if(
                userTime <= oneMinuteAgo 
                && doc.data().uid != playerArray[0]
                && doc.data().uid != playerArray[1]
                && null != playerArray[0]
                && null != playerArray[1]
            ){
                console.log('want to delete ' + doc.id);
                // doc.ref.delete();
            }
            if (
                doc.data().type = 'page'
                && userTime <= oneMinuteAgo 
            ){
                doc.ref.delete();
            }
            html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /></div>';
            
        });
        html += '';

        $('.userbank').html(html);
        
        $('#uid-' + lastPlayerUid).addClass('lastPlayer');
        $('#uid-' + playerBeforeLastUid).addClass('itsyourturn');

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
    console.log('init database_setGameUser');

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
    
    $('#username').html(user.email);
    // $('#usernameShort').html((user.email).charAt(0) + (user.email).charAt(1) + (user.email).charAt(2));

    // $('#userimage').html('<img src="' + gravatarImage + '" />');

    userData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
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
      database_setUserData(user);
      database_setLocation();
      button_logout();
      button_create_game();

      //route
      switch (path[1]) {

        case "":
          console.log("home");
          gameId = path[3];
          gameId = "home";
          database_loadGame();
          database_loadGamesList();
          break;
        case "g":
          gameId = path[3];
          database_loadGame();
          switch (path[3]) {
            case "home":
              console.log("home");
              database_loadGamesList();
              break;
          }
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
var game_dotsandboxes = function(gameDoc){

  console.log('game_dotsandboxes init');
  
  // VARIABLES //
  var player, boxMade, score1, score2;
  var p1Color = "#F60303";
  var p2Color = "#042AFF";
  var board = [];
  var hArray = [];
  var vArray = [];
  
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
    
    if(player == 1){
      $('div#s1').addClass('player_active');
      $('div#s2').removeClass('player_active');
    } else {
      $('div#s1').removeClass('player_active');
      $('div#s2').addClass('player_active');
    }

  }

  var handleClick = function(evt){
    console.log('handleClick');
    console.log('player: ' + player);

    if($(this).data('clicked')) return;

    var isYourMove = false;

    db.collection("games")
      .doc(gameId)
      .get().then((doc) => {
        if (doc.exists) {
            var playerOneUid = doc.data().playerOne;
            var playerTwoUid = doc.data().playerTwo;

            if (playerOneUid == null){
              console.log('init database_setPlayerOne');
                      
              db.collection("games")
              .doc(gameId)
              .set(
                  {
                    playerOne: uid
                  },
                  { merge: true }
              );
              playerOneUid = uid;
              isYourMove = true;
            }else if (playerOneUid != uid && playerTwoUid == null){
              console.log('init database_setPlayerTwo');
                      
              db.collection("games")
              .doc(gameId)
              .set(
                  {
                    playerTwo: uid
                  },
                  { merge: true }
              );
              playerTwoUid = uid;
              isYourMove = true;
            }else if (doc.data().currentPlayer == null){
              isYourMove = true;
            }else if (doc.data().currentPlayer == 1 && doc.data().playerOne == uid){
              isYourMove = true;
            }else if (doc.data().currentPlayer == 2 && doc.data().playerTwo == uid){
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
                console.log('init database_setLastPlayer');
            
                db.collection("games")
                .doc(gameId)
                .set(
                    {
                      currentPlayer: player
                    },
                    { merge: true }
                );

              } else {
                player = player;
              }
              
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

  if (gameDoc.data().currentPlayer == 2){
    player = 2;
  }

  $('div.line').on('click', handleClick);
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
        console.log('confirming game player = ' + innerDoc.data().currentPlayer);
    
        if(innerDoc.data().currentPlayer == 1){
          $('div#s1').addClass('player_active');
          $('div#s2').removeClass('player_active');
          player = 1;
        } else {
          $('div#s1').removeClass('player_active');
          $('div#s2').addClass('player_active');
          player = 2;
        }
        
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
        database_setGameComplete(playerArray[0]);
      } else if (res == computer) {
        board_full = true
        database_setGameComplete(playerArray[1]);
      } else if (board_full) {
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
var path = window.location.pathname.split("/");
var userData = null;
var uid = null;
var gameId = null;
var userLimit = 2;
var playerBeforeLastUid = '';
var lastPlayerUid = '';
var playerArray = []; 
var gameBoard = [];