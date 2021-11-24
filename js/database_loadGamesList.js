var database_loadGamesList = function(){
    console.log("database_loadGamesList");

    db.collection("games").onSnapshot(function(querySnapshot) {
        var html = '';
        querySnapshot.forEach(function(doc) {
            html += '<div class="div_game">';
            html += '<a class="btn btn-default btn-lg btn-join" href="/g/' + doc.data().type + '/' + doc.id + '">';
            html += doc.data().type + '/' + doc.id;
            html += '</a>';
            html += '</div>';
        });
        $('#loadGamesHere').html(html);
    });


}