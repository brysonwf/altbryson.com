var router = function(){
  console.log("router");
  switch (path[1]) {
    case "games":
      database_loadGamesList();
      break;
    case "g":
      gameId = path[3];
      database_loadGame();
      break;
    default:
      console.log("404 / home");
  }
}