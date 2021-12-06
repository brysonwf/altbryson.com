var database_setGameComplete = function(moveCount){
    console.log('init database_setGameComplete');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            moveCount : moveCount
        },
        { merge: true }
    )
    .then((docRef) => {
        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}