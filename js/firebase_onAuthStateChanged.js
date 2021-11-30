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

        case "":
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
