var database_setUserData = function (user) {
    // console.log("database_setUserData");

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