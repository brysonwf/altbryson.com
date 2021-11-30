var database_addUserToGame = function(){
    console.log('add user');

    newUserData = userData;
    newUserData.createDate = new Date();

    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
    .doc("" + firebase.auth().currentUser.uid)
    .set(
        newUserData,
        { merge: true }
    );

    database_loadGameUsers();
}