var database_loadGamesList = function(){
    console.log("database_loadGamesList");

    var now = new Date();
    var durationInMinutes = 15;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - durationInMinutes * MS_PER_MINUTE);
    
    db
    .collection("games")
    .where("activeDate", ">=", oneMinuteAgo)
    .orderBy("activeDate", "desc")
    .limit(5)
    .onSnapshot(function(querySnapshot) {
        
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

    });
}