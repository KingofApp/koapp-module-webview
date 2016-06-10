angular.directive('hideOnload', [function(){
return {
    scope: {
        callBack: '&hideOnload'
    },
    link: function(scope, element, attrs){
        element.on('load', function(){
            console.log("HIDE");
            scope.$parent.embed.showLoading=false;
            element.parent().find("div.iframeLoading").hide();
            return scope.callBack();
        })
    }
}}]);
