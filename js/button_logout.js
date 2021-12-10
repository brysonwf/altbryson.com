var button_logout = function(){
    $(".button_logout").on('click', function () {
        console.log('button_logout');
        firebase_signOut();
        location.reload();
    });
}