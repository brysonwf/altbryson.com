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

    } else {

      uid = null;
      //not logged in
      button_login();
      // User not logged in or has just logged out.
    
    }

    
    switch (path[1]) {
      case "games":
        database_loadGamesList();
        break;
      case "g":
        gameId = path[3];
        database_loadGame();
        break;
      default:
        console.log("404 / home");
    }

  });
};
