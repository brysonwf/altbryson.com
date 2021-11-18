var appManager = {
  // Application Constructor
  init: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    var isPhoneApp =
      document.URL.indexOf("http://") === -1 &&
      document.URL.indexOf("https://") === -1;
    if (isPhoneApp) {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    } else {
      appManager.onDeviceReady();
    }
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    $(document).ready(function (e) {
      // console.log('onDeviceReady init')
      firebase_init();
    });
  },
};
