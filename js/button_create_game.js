var button_create_game = function(){
    $(".button_create_game").click(function () {
        var type = $(this).data("type");
        db.collection("games").add({
            type: type,
            dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            uid: firebase.auth().currentUser.uid,
            moveCount : 0,
            create: [],
            read: [],
            update: [],
            delete: []
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            window.location = "/g/" + type + "/" + docRef.id;
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });
}