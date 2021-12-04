var func_confirmMove = function(docName, docJson){
    console.log("init func_confirmMove");

    var currentPlayerUid = [];
    var alreadyOnTheBoard = [];

    var count = 1;
    db.collection("games/"+gameId+"/moves")
    .orderBy("createDate", "desc")
    .limit(userLimit)
    .get()
    .then((querySnapshot) => {
        console.log("func_confirmMove querySnapshot");
        querySnapshot.forEach((doc) => {
            console.log('count ' + count + ': ' + doc.data().uid + ' ' + doc.data().user + ' at ' + doc.data().createDate)
            alreadyOnTheBoard[doc.data().uid] = true;
            currentPlayerUid[count] = doc.data().uid;
            count++;
        });
        //if we havn't had enough plays yet
        if (count <= userLimit){
            console.log('not enough players allowing move');
            if (alreadyOnTheBoard[uid]){
                console.log('user on the board already: ' + uid);
            }else{
                database_setMove(docName, docJson);
            }
        }else if (currentPlayerUid[userLimit] == uid){
            console.log('you are allowed to move');
            database_setMove(docName, docJson);
        }else{
            console.log('not your turen player: ' + uid);
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}