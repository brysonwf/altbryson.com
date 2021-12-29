var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    
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
                html += '<div class="ddmenu dropdown pull-right">';
                    html += '<button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
                        html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'">';
                        html += '    <img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span>';
                        html += '</div>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">';
                    html += '    <li><a class="navbutton_home" href="/"><i class="fas fa-home"></i> Homepage</a></li>';
                    html += '    <li><a class="button_login hidden" href="#">Login for Games</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="tictactoe"><i class="fas fa-hashtag"></i> TicTacToe</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="minigolf"><i class="fas fa-golf-ball"></i> minigolf</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="dotsandboxes"><i class="fas fa-border"></i> dotsandboxes</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="chess"><i class="fas fa-chess"></i> Chess</a></li>';
                    html += '    <li><a class="button_create_game" href="#" data-type="pool"><i class="fas fa-pool"></i> pool</a></li>';
                    html += '    <li><a class="button_logout">Logout <span id="username"></span></a></li>';
                    html += '</ul>';
                html += '</div>';
            }else{
                if (userTime <= oneMinuteAgo){
                    classNames += ' oneMinuteAgo';
                }
                if (userTime <= elevenSecondsAgo){
                    classNames += ' elevenSecondsAgo';
                }
                html += '<div class="' + classNames +'" id="uid-' + doc.data().uid +'" data-userTime="' + userTime +'"><img src="' + doc.data().photoUrl + '" /><span class="score hidden"></span></div>';
            }
        });

        if (html == ''){
            html +='<p>No users</p>'
        }

        $('.userbank').html(html).removeClass('hidden');

        $('#uid-' + lastPlayerUid).removeClass('itsyourturn').addClass('lastPlayer');
        $('#uid-' + playerBeforeLastUid).removeClass('lastPlayer').addClass('itsyourturn');
        
        console.log('userbank added');
        button_logout();
        button_create_game();
    });

}