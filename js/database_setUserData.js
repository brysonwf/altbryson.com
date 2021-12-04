var database_setUserData = function (user) {
    console.log("database_setUserData");

    // var gravatarImage = func_getGravatar(user.email);
    
    $('#username').html(user.email);

    // $('#userimage').html('<img src="' + gravatarImage + '" />');

    $('.ddmenu').removeClass('hidden');

    userData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        // gravatar: gravatarImage,
        createDate: firebase.firestore.FieldValue.serverTimestamp()
    }

    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            userData,
            { merge: true }
        );
}