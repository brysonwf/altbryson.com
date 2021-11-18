var database_setUser = function (user) {
    console.log("database_setUser");

    var gravatarImage = getGravatar(user.email);
    
    $('#username').html(user.email);

    $('#userimage').html('<img src="' + gravatarImage + '" />');

    $('.ddmenu').removeClass('hidden');

    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                emailVerified: user.emailVerified,
                uid: user.uid,
                gravatar: gravatarImage,
            },
            { merge: true }
        );
}