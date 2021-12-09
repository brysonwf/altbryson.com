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

                switch(doc.data().type){
                    case "minigolf":
                        game_minigolf();
                        break;
                    case "tictactoe":
                        game_tictactoe();
                        break;
                    case "dotsandboxes":
                        game_dotsandboxes(doc);
                        break;
                }
                
            } else {
                console.log("else game does not exist");
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}