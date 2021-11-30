var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    var now = new Date();
    var oneMinute = 1;
    var elevenSeconds = (1/60)*11;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - oneMinute * MS_PER_MINUTE);
    var elevenSecondsAgo = new Date(now - elevenSeconds * MS_PER_MINUTE);

    db.collection("games/"+gameId+"/gameUsers").onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");

        var classNames = '';
        let letter = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            var userTime = new Date(doc.data().createDate.toDate())
            
            classNames = 'user ';
            if (userTime <= elevenSecondsAgo){
                classNames += 'nothere ';
            }else if(userTime <= oneMinuteAgo){
                doc.ref.delete();
            }else{

            }
            letter = (doc.data().name).charAt(0);
            html += "<div class=\"" + classNames +"\">"+ letter +"</div>";
        });
        html += '';

        $('.userbank').html(html);

    });

}