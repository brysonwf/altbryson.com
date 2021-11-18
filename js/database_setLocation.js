var database_setLocation = function () {
    console.log("database_setLocation");
    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            {
                path : path
            },
            { merge: true }
        );
}