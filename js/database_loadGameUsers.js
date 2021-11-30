var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    var now = new Date();
    var durationInMinutes = 1;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - durationInMinutes * MS_PER_MINUTE);

    db.collection("games/"+gameId+"/gameUsers").onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");

        var classNames = '';
        let letter = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            var userTime = new Date(doc.data().createDate.toDate())
            
            classNames = 'user ';
            if (userTime <= oneMinuteAgo){
                classNames += 'nothere '
            }else{

            }
            letter = (doc.data().name).charAt(0);
            html += "<div class=\"" + classNames +"\">"+ letter +"</div>";
        });
        html += '';

        $('.userbank').html(html);

    });

}