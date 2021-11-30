var database_addUserToGame = function(){
    console.log('add user');

    //add my user to this game
    db.collection("games/"+gameId+"/gameUsers")
        .doc("" + firebase.auth().currentUser.uid)
        .set(
            userData,
            { merge: true }
        );

    database_loadGameUsers();
}