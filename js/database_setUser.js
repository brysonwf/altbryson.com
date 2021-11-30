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