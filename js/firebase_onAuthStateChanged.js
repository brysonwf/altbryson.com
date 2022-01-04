var firebase_onAuthStateChanged = function () {
  // console.log('firebaseManager.onAuthStateChanged init')
  firebase.auth().onAuthStateChanged(function (user) {
    
    if (user) {
      
      // User logged in already or has just logged in.
      uid = user.uid;
      console.log('loged in as ' + uid);
      if (user?.isAnonymous) {
        // Do something
        console.log('isAnonymous');
      }

      gameId = path[3];
      if (gameId == null){
        gameId = 'home';
      }
      database_setUserData(user);
      database_setPath();
      database_loadGame();

    } else {

      // User not logged in or has just logged out.
      uid = null;
      $(".firebaseui-auth-container").removeClass('hidden');

    }

  });
};
