var database_updateGameStats = function(){
    console.log('init database_updateGameStats');

    var activeDate = new Date();

    db.collection("games")
    .doc("" + gameId)
    .set(
        {
            activeDate: activeDate
        },
        { merge: true }
    );
}