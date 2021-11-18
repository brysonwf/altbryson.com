var firebase_onAuthStateChanged = function () {
  // console.log('firebaseManager.onAuthStateChanged init')
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      database_setUser(user);
    } else {
    }
    router();
    ui();
  });
};
