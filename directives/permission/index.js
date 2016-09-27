angular.module('common.components').directive('permission', function ($rootScope) {
    return {
        priority: 0,
        controller:( $scope, $element, $attrs )=>{
             //$rootScope.permissions=['1','2','3'];
    
            var codes = $attrs['permission'] = '' || $attrs['permission'].split(',');
            var enabled = _.intersection($rootScope.modules, codes).length > 0;
            if(!enabled){
                $element.remove();
            }
        },
        link: ($scope, iElem, iAttr) => {
           
        }
    };
});