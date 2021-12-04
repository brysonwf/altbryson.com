var database_setGameComplete = function(){
    console.log('init database_setGameComplete');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            complete : true
        },
        { merge: true }
    )
    .then((docRef) => {
        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}