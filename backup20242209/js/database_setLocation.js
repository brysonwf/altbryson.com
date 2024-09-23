var database_setPath = function () {
    console.log("database_setPath");
    db.collection("users")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            {
                path : path
            },
            { merge: true }
        );
}