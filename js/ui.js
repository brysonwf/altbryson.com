var ui = function(){
    console.log('ui');

    if (firebase.auth().currentUser != null){

        //logged in

        database_setLocation();
        button_logout();
        button_create_game();

    }else{

        //not logged in
        button_login();

    }
}