var database_addMove = function(docName, docJson){
    console.log('init database_addMove');
    
    docJson.uid = uid;
    docJson.createDate = new Date();

    db.collection("games/"+gameId+"/moves")
    .doc(docName)
    .set(docJson)
    .then((docRef) => {
        
    }).catch((error) => {
        console.error("Error adding document: " + error);
    });
}