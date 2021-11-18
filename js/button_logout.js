var button_logout = function(){
    $(".button_logout").removeClass('hidden').click(function () {
        console.log('button_logout');
        firebase_signOut();
        location.reload();
    });
}