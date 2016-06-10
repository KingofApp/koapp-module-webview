angular
  .controller('embedCtrl', loadFunction);

loadFunction.$inject = ['$scope', 'structureService', 'storageService', '$location'];

function loadFunction($scope, structureService, storageService, $location) {
  //Register upper level modules
  structureService.registerModule($location, $scope, 'embed');
  $scope.embed.showLogin = false;
  $scope.embed.showLoading = true;

  $scope.redirectToLogin = function() {
    storageService.del('embedLogin').then(function(data) {
      storageService.get('loginUrl').then(function(src) {
        if(src && src.value){
          $location.path(src.value);
        }
      });
    });
  }


  // var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    storageService.get('embedLogin').then(function(data) {
      if (data && data.value) {
        //Load con token
        var ref = cordova.InAppBrowser.open($scope.embed.modulescope.url, '_blank', 'location=no,toolbar=yes,enableViewportScale=yes,closebuttoncaption=Logout');
        //       var myCallback = function(event) { alert(event.url); }
        ref.addEventListener('exit', function() {
        alert("Redirect");
        });
            post($scope.embed.modulescope.url, data.value);
          $scope.embed.showLogin = true;
      }else{
        post($scope.embed.modulescope.url, {});
      }
    });

  }


  function post(path, params, method) {
    method = method || 'post';
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);
    form.setAttribute('target', 'embedtest');

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
      setTimeout(function () {
        form.submit();
      }, 10);
    }
}
