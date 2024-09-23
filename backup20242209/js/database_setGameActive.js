var database_setGameActive = function(){
    console.log('init database_setGameActive');

    db.collection("games")
    .doc("" + gameId)
    .set(
        {
            activeDate: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
    );
}