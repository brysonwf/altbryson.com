var firebase_init = function() {
  // console.log('firebaseManager init')

  //config and init firebase
  firebase.initializeApp({
    apiKey: "AIzaSyB4qEo5GG4AtSeXFrZDyqBX38BVsRregzU",
    authDomain: "minigolf.altbryson.com",
    projectId: "minigolf-altbryson"
  });

  //setup db
  db = firebase.firestore();

  firebase_onAuthStateChanged(); //store user information when available

  // FirebaseUI config.
  var uiConfig = {
    signInSuccessUrl: "/",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
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
