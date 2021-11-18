var button_signout = function(){
    $(".button_signout").click(function () {
        console.log('button_signout');
        firebase_signOut();
        location.reload();
    });
}