var database_setGameMoveCount = function(moveCount){
    console.log('init database_setGameMoveCount');

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