angular
  .controller('webviewCtrl', loadFunction);

loadFunction.$inject = ['$scope', 'structureService', 'storageService', '$location', '$document', '$filter'];

function loadFunction($scope, structureService, storageService, $location, $document, $filter) {
  //Register upper level modules
  structureService.registerModule($location, $scope, 'webview');

  if ($location.$$absUrl.indexOf('builder') !== -1) {
    showWarning();
  }

  $scope.showIframe = false;
  $scope.redirectIndex = redirectIndex;

  var escapeCondition = 'UmFuZG9tVXJsU2V2jcmV0';
  var toolbar = '';

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
      //Load regular webview
      $scope.webview.urlWebview = $scope.webview.modulescope.url;
      toolbar = "yes";
    }

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
      document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      loadIframe();
    }
  });

  function onDeviceReady() {
    var ref = cordova.InAppBrowser.open($scope.webview.urlWebview, '_blank', 'location=no,toolbar=' + toolbar + ',enableViewportScale=yes,closebuttoncaption='+$filter('translate')('webview.close'));

    // Android behaviour
    ref.addEventListener('loadstart',  function(event) {
      if(event.url.indexOf(escapeCondition) > -1){
        ref.close();
        redirectToLogin();
      }
    });
    ref.addEventListener('exit',  function(event) {
      if (toolbar == 'yes') {
        redirectIndex();
      }
    });

  }

  function redirectIndex () {
    $location.path(structureService.get().config.index);
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  };

  function loadIframe() {
    $document.find("#main paper-header-panel .paper-header").hide();
    $scope.showIframe = true;
    setTimeout(function () {
      structureService.launchSpinner('.transitionloader');
    }, 100);
  }
  function showWarning() {
    setTimeout(function () {
      $document.find("div.hiddenDiv").show();
    }, 1000);
  }

}
