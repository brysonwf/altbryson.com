var button_create_game = function(){
    $("#button_create_game").click(function () {
        var type = $("#form_create_game_type").val();
        var toISOString = new Date().toISOString();
        db.collection("games").add({
            type: type,
            dateCreated: toISOString,
            dateUpdated: toISOString,
            uid: firebase.auth().currentUser.uid,
            budgetItems: 0,
            budgetLines: 0,
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