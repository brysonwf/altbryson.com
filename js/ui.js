var ui = function(){
    console.log('ui');
    if (firebase.auth().currentUser != null){
        database_setLocation();
        button_logout();
        button_create_game();
    }else{
    }
}