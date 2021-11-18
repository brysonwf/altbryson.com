var router = function(){
  console.log("router");
  if (path[1] == "") {
    database_loadGamesList();
  } else {
    if (path[2] != "") {
      if (path[1] == "g") {
        gameId = path[2];
        database_loadGame();
      }
    }
  }
}