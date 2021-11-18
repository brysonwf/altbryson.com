var router = function(){
  console.log("router");
  if (path[1] == "games") {
    database_loadGamesList();
  } else {
    if (path[3] != "") {
      gameId = path[3];
      if (path[2] == "minigolf") {
        database_loadMinigolf();
      }else if (path[2] == "tictactoe") {
        database_loadTictactoe();
      }
    }
  }
}