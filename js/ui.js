var ui = function(){
    console.log('ui');
    if (firebase.auth().currentUser != null){
        database_setLocation();
        button_signout();
        button_create_game();
    }else{
      $('#modalLogin').modal('show');
    }
}