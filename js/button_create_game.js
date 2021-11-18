var button_create_game = function(){
    $("#button_create_game").click(function () {
        var location = $("#form_create_game_name").val();
        if (location == "" || location == null) {
            if (firebase.auth().currentUser != null){
                location = firebase.auth().currentUser.uid;
            }else{
                location = "blank";
            }
        }
        window.location = "/g/" + location;
    });
}