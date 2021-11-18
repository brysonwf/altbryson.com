var database_setUser = function (user) {
    console.log("database_setUser");
    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                emailVerified: user.emailVerified,
                uid: user.uid,
                gravatar: getGravatar(user.email),
            },
            { merge: true }
        );
}