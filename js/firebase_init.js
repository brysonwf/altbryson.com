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
