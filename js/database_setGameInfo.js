var database_setGameUser = function(){
    console.log('init database_setGameUser');


    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
    .doc("" + firebase.auth().currentUser.uid)
    .set(
        {
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
    );

    database_loadGameUsers();
}