var database_loadGame = function () {
    console.log("init database_loadGame for : " + gameId);
    var docRef = db.collection("games").doc("" + gameId);
    docRef
        .get()
        .then(function (doc) {
            if (doc.exists) {
                
                console.log("game exists");
                document.title = "altbryson.com/g/" + gameId;
                if (doc.data().userLimit){
                    userLimit = doc.data().userLimit;
                }
                
                database_setGameActive();
                database_setGameUser();
                database_setGameInfo();
                database_loadGameUsers();
                
                // setInterval(function() {
                //     database_setGameActive();
                //     database_setGameUser();
                // }, 10000);

                console.log('testing type: ' + doc.data().type);
                if (doc.data().type == "minigolf"){
                    game_minigolf();
                }else if (doc.data().type == 'tictactoe'){
                    game_tictactoe();
                }
                
            } else {
                console.log("else game does not exist");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}