var database_setGameComplete = function(winnerUid){
    console.log('init database_setGameComplete');

    db.collection("games")
    .doc(gameId)
    .set(
        {
            winner: winnerUid,
            complete : true
        },
        { merge: true }
    )
    .then((docRef) => {
        $('#uid-'+winnerUid).addClass('winner');
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}