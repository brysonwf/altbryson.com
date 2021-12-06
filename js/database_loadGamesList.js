var database_loadGamesList = function(){
    console.log("database_loadGamesList");


    db
    .collection("games")
    .orderBy("activeDate", "desc")
    .where("type", "==", 'tictactoe')
    .onSnapshot(function(querySnapshot) {
        console.log("database_loadGamesList querySnapshot");


        var userGameIdArray = [];
        var classString = '';
        
        var html = '';
        html += '<table>';
        html += '<thead>';
            html += '<tr>';
                html += '<td></td>';
                html += '<td>type</td>';
                html += '<td>name</td>';
                html += '<td>age</td>';
                html += '<td>moves</td>';
                html += '<td>fin</td>';
            html += '</tr>';
        html += '</<thead>';
            html += '<tbody>';
                querySnapshot.forEach(function(doc) {
                
                    var uniqueString = (doc.id).charAt(0);
                    var charAtCount = 1;
                    while (userGameIdArray[uniqueString]){
                        uniqueString = uniqueString + '' + (doc.id).charAt(charAtCount);
                    }
                    userGameIdArray[uniqueString] = true;

                    classString = (doc.data().complete) ?  ' game_complete' : '';
                    classString += (doc.data().uid == uid) ?  ' game_user' : '';

                    html += '<tr class="div_game ' + classString + '">';
                        html += '<td>';
                            html += '<img src="' + doc.data().photoUrl + '" />';
                        html += '</td>';
                        html += '<td>';
                            html += '<a href="/g/' + doc.data().type + '/' + doc.id + '">';
                                html += doc.data().type;
                            html += '</a>';
                        html += '</td>';
                        html += '<td>';
                            html += uniqueString;
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().activeDate)? func_timeSince(doc.data().activeDate.toDate()) : 'old';
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().moveCount)? doc.data().moveCount : '0';
                        html += '</td>';
                        html += '<td>';
                            html += (doc.data().complete)? doc.data().complete : 'false';
                        html += '</td>';
                    html += '</tr>';
                });
            html += '</tbody>';
        html += '</table>';
        $('#loadGamesHere').html(html).find('table').DataTable();

    });
}