var database_loadTictactoe = function () {
    console.log("init database_loadTictactoe for : " + gameId);
    document.title = "altbryson.com/g/tictactoe" + decodeURI(gameId);
    var docRef = db.collection("games").doc("" + gameId);
    docRef
        .get()
        .then(function (doc) {
            if (doc.exists) {
                console.log("game exists");
                minigolf();
            } else {
                console.log("else game does not exist");
                // doc.data() will be undefined in this case
                var toISOString = new Date().toISOString();
                docRef
                .set({
                    name: "" + gameId,
                    dateCreated: toISOString,
                    dateUpdated: toISOString,
                    uid: firebase.auth().currentUser.uid,
                    viewers: [],
                    writers: [],
                    budgetItems: 0,
                    budgetLines: 0,
                }).then(function () {
                    console.log("Adding a new game for " + firebase.auth().currentUser.uid);
                    minigolf();
                });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}