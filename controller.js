angular
  .controller('webviewCtrl', loadFunction);

loadFunction.$inject = ['$scope', 'structureService', 'storageService', '$location', '$document'];

function loadFunction($scope, structureService, storageService, $location, $document) {

  if ($location.$$absUrl.indexOf('builder') !== -1) {
    showWarning();
  }


  var escapeCondition = "UmFuZG9tVXJsU2V2jcmV0";
  var toolbar = "";
  //Register upper level modules
  structureService.registerModule($location, $scope, 'webview');
  function redirectToLogin() {
    storageService.del('webviewLogin').then(function(data) {
      storageService.get('loginUrl').then(function(src) {
        if(src && src.value){
          $location.path(src.value);
        }
      });
    });
  }

  storageService.get('webviewLogin').then(function(data) {
    if (data && data.value && data.value.token) {
      //Construct url webview with token
      $scope.webview.urlWebview = $scope.webview.modulescope.url + '?' + data.value.tokenName + '=' + data.value.token;
      //Set escape condition
      escapeCondition = data.value.escapeCondition;
      toolbar = "no";
    }else{
      //Load normal webview
      $scope.webview.urlWebview = $scope.webview.modulescope.url;
      toolbar = "yes";
    }
    document.addEventListener("deviceready", onDeviceReady, false);
  });

  function onDeviceReady() {
    var ref = cordova.InAppBrowser.open($scope.webview.urlWebview, '_blank', 'location=no,toolbar=' + toolbar + ',enableViewportScale=yes,closebuttoncaption=Logout');

    // Android behaviour
    ref.addEventListener('loadstart',  function(event) {
      if(event.url.indexOf(escapeCondition) > -1){
        ref.close();
        redirectToLogin();
      }
    });

  }
  function showWarning() {
    setTimeout(function () {
      $document.find("div.hiddenDiv").show();
    }, 1000);
  }

}
