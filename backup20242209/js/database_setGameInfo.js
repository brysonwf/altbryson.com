var database_setGameInfo = function(){
    console.log('init database_setGameInfo');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
    );
    
}