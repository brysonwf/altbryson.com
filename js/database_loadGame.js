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
                
                switch(doc.data().type){
                    case "page":
                        database_loadGameUsers();
                        database_loadGamesList();
                        break;
                    case "minigolf":
                        game_minigolf();
                        break;
                    case "tictactoe":
                        game_tictactoe();
                        break;
                    case "dotsandboxes":
                        game_dotsandboxes(doc);
                        break;
                    case "chess":
                        game_chess(doc);
                        break;
                }
                
            } else {
                console.log("else game does not exist");
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}