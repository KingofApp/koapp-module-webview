(function() {
  angular.directive('hideOnload', [function(){
  return {
      scope: {
          callBack: '&hideOnload'
      },
      link: function(scope, element, attrs){
          element.on('load', function(){
              element.parent().find("div.embedLoading").remove(); // Using remove to prevent spinner to overload
              iFrameResize({log:true, scrolling:true});
              return scope.callBack();
          })
      }
  }}]);
}());
