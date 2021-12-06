var database_setGameUser = function(){
    console.log('init database_setGameUser');


    newUserData = userData;
    newUserData.createDate = firebase.firestore.FieldValue.serverTimestamp();
    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
    .doc("" + firebase.auth().currentUser.uid)
    .set(
        newUserData,
        { merge: true }
    );

    database_loadGameUsers();
}