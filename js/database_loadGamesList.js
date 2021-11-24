var database_loadGamesList = function(){
    console.log("database_loadGamesList");

    db
    .collection("games")
    .where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        console.log("database_loadGamesList querySnapshot");
        var html = '';
        html += '<ol>';
        querySnapshot.forEach(function(doc) {
            html += '<li class="div_game">';
            html += '<a class="btn btn-default btn-lg btn-join" href="/g/' + doc.data().type + '/' + doc.id + '">';
            html += doc.data().type + '/' + doc.id;
            html += '</a>';
            html += '</li>';
        });
        html += '</ol>';
        $('#loadGamesHere').html(html);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


}