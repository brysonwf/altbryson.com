var database_loadGameUsers = function(){
    console.log('database_loadGameUsers');

    var now = new Date();
    var oneMinute = 15;
    var elevenSeconds = (1/60)*11;
    var MS_PER_MINUTE = 60000;
    var oneMinuteAgo = new Date(now - oneMinute * MS_PER_MINUTE);
    var elevenSecondsAgo = new Date(now - elevenSeconds * MS_PER_MINUTE);

    db.collection("games/"+gameId+"/gameUsers")
    // .get().then(function(querySnapshot) {
    .onSnapshot(function(querySnapshot) {
        console.log("database_loadGameUsers onSnapshot");

        var userArray = [];
        var count = 0 ;
        var classNames = '';
        var html = '';
        html += '';
        querySnapshot.forEach(function(doc) {

            var uniqueUserString = (doc.data().name).charAt(0);
            var charAtCount = 1;
            while (userArray[uniqueUserString]){
                uniqueUserString = uniqueUserString + '' + (doc.data().name).charAt(charAtCount);
                charAtCount++;
            }
            userArray[uniqueUserString] = true;

            var userLastActiveDate = new Date();
            if (doc.data().dateUpdated != null){
                userLastActiveDate = doc.data().dateUpdated.toDate();
            }
            var userTime = new Date(userLastActiveDate);
            
            if (uid == lastPlayerUid){
                classNames = ' lastPlayer';
            }else if(uid == playerBeforeLastUid){
                classNames = ' itsyourturn';
            }
            
            classNames = ' user';
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
            count++;
        });
        html += '';

        if (count == 0){
            html +='<p>No users</p>'
        }

        $('.userbank').html(html).removeClass('hidden');
        
        console.log('userbank added');
        button_logout();
        button_create_game();

    });

}