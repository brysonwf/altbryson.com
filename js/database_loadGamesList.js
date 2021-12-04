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
        var classString = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            classString = (doc.data().complete) ?  'game_complete' : '';

            html += '';
            html += '<a class="div_game ' + classString + '" href="/g/' + doc.data().type + '/' + doc.id + '">';
            if (doc.data().type == "page"){
                html += '<div class="title">' + doc.id + '</div>';
            }else{
                html += '<div class="title">' + doc.data().type + '</div>';
            }
            html += '</a>';
            html += '';
        });
        html += '';
        $('#loadGamesHere').html(html);

    });
}