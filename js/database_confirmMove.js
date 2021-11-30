var database_confirmMove = function(docName, docJson){
    console.log("init database_confirmMove");

    var playersOnTheBoard = [];
    var alreadyOnTheBoard = [];

    var count = 1;
    db.collection("games/"+gameId+"/moves")
    .orderBy("createDate", "desc")
    .limit(userLimit)
    .get()
    .then((querySnapshot) => {
        console.log("database_confirmMove querySnapshot");
        querySnapshot.forEach((doc) => {
            if (alreadyOnTheBoard[doc.data().uid] != true){
                alreadyOnTheBoard[doc.data().uid] = true;
                playersOnTheBoard[count] = doc.data().uid;
                count++;
            }
        });
        console.log('count: ' + count);
        //if we havn't had enough plays yet
        if (count <= userLimit){
            console.log('not enough players allowing move');
            if (alreadyOnTheBoard[uid]){
                console.log('user on the board already: ' + uid);
            }else{
                database_addMove(docName, docJson);
            }
        }else if (playersOnTheBoard[userLimit] == uid){
            console.log('you are allowed to move');
            database_addMove(docName, docJson);
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}