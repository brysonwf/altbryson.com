var database_loadGame = function () {
    console.log("init database_loadGame for : " + gameId);
    var docRef = db.collection("games").doc("" + gameId);
    docRef
        .get()
        .then(function (doc) {
            if (doc.exists) {
                
                console.log("game exists");
                document.title = "altbryson.com/g/" + gameId;

                if (doc.data().type == "minigolf"){
                    game_minigolf();
                }else if (doc.data().type == 'tictactoe'){
                    game_tictactoe();
                }

                database_updateGameStats();
                database_addUserToGame();
                
                setInterval(function() {
                    database_updateGameStats();
                    database_addUserToGame();
                }, 10000);
                
                
            } else {
                console.log("else game does not exist");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}