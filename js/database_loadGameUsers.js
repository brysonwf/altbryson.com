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

        var userArray = [];

        var classNames = '';
        let letter = '';
        var html = '';
        html += '';''
        querySnapshot.forEach(function(doc) {

            var uniqueUserString = (doc.data().name).charAt(0);
            var charAtCount = 1;
            while (userArray[uniqueUserString]){
                uniqueUserString = uniqueUserString + '' + (doc.data().name).charAt(charAtCount);
            }
            userArray[uniqueUserString] = true;

            var userTime = new Date(doc.data().createDate.toDate())
            classNames = 'user ';
            if (doc.data().uid == uid){
                classNames += 'uid ';
            }
            if (userTime <= elevenSecondsAgo){
                classNames += 'nothere ';
            }
            if(userTime <= oneMinuteAgo){
                // doc.ref.delete();
            }
            html += "<div class=\"" + classNames +"\" id=\"uid-" + doc.data().uid +"\">"+ uniqueUserString +"</div>";
            
        });
        html += '';

        $('.userbank').html(html);

    });

}