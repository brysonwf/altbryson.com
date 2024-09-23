var database_loadGameUsers = function(){
    console.log('database_loadGameUsers -- change this to not watch');

    
    db.collection("games/"+gameId+"/gameUsers")
    .onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");
    
        var now = new Date();
        var oneMinute = 15;
        var elevenSeconds = (1/60)*11;
        var MS_PER_MINUTE = 60000;
        var oneMinuteAgo = new Date(now - oneMinute * MS_PER_MINUTE);
        var elevenSecondsAgo = new Date(now - elevenSeconds * MS_PER_MINUTE);
        
        var html = '';
        var html_player1 = '';
        var html_player2 = '';

        querySnapshot.forEach(function(doc) {
            
            var classNames = ' user';

            var userLastActiveDate = new Date();
            if (doc.data().dateUpdated != null){
                userLastActiveDate = doc.data().dateUpdated.toDate();
            }
            var userTime = new Date(userLastActiveDate);

            // console.log('inserting ' + doc.data().uid + ' with ' + classNames);
            
            if (doc.data().uid == uid){
                classNames += ' me';
            }
            if (userTime <= oneMinuteAgo){
                classNames += ' oneMinuteAgo';
            }
            if (userTime <= elevenSecondsAgo){
                classNames += ' elevenSecondsAgo';
            }

            console.log('looking for ' + '.' + doc.data().uid);
            if ($('.' + doc.data().uid).length > 0){
                console.log('found ' + '.' + doc.data().uid);
                if ($('.' + doc.data().uid).hasClass('player1')){
                    html_player1 = '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span></div>';
                }else if ($('.' + doc.data().uid).hasClass('player2')){
                    html_player2 = '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span></div>';
                }
            }

            html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span></div>';
            
        });

        if (html == ''){
            html +='<p></p>'
        }

        $('.userbank').html(html).removeClass('hidden');
        $('.player1 .usericon').html(html_player1);
        $('.player2 .usericon').html(html_player2);

        $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
        $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');
        
        console.log('userbank added');
        button_logout();
        button_create_game();
    });

}