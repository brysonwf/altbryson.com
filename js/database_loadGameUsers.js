var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    db.collection("games/"+gameId+"/gameUsers").onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {
            html += "<div class=\"user\"><img src=" + doc.data().gravatar + "/></div>";
        });
        html += '';
        $('.userbank').html(html);
      });
}