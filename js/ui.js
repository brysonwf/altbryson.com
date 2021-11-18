var ui = function(user){
    console.log('ui');

    if (user){

        //logged in
        database_setUser(user);
        database_setLocation();
        button_logout();
        button_create_game();

    }else{

        //not logged in
        button_login();

    }
}