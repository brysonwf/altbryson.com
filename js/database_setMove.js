var database_setMove = function(docName, docJson){
    console.log('init database_setMove');
    
    docJson.uid = uid;
    docJson.createDate = firebase.firestore.FieldValue.serverTimestamp();

    db.collection("games/"+gameId+"/moves")
    .doc(docName)
    .set(docJson)
    .then((docRef) => {
        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}