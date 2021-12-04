var database_loadYourGamesList = function(){
    console.log("database_loadYourGamesList");

    var now = new Date();
    var durationInMinutes = 15;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - durationInMinutes * MS_PER_MINUTE);
    
    db
    .collection("games")
    .where("uid", "==", uid)
    .orderBy("dateCreated", "desc")
    .onSnapshot(function(querySnapshot) {
        
        console.log("database_loadYourGamesList querySnapshot");
        var classString = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {
            classString = (doc.data().complete) ?  'game_complete' : '';
            html += '';
            html += '<a class="div_game ' + classString + '" href="/g/' + doc.data().type + '/' + doc.id + '">';
            html += '<div class="title">' + doc.data().type + '</div>';
            html += func_timeSince(doc.data().dateCreated);
            html += '</a>';
            html += '';
        });
        html += '';
        $('#loadYourGamesHere').html(html);

    });
}