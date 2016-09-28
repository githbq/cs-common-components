angular.module('common.components').directive('permission', function ($rootScope) {
    return {
        priority: 0,
        controller: ($scope, $element, $attrs) => {
            //$rootScope.permissions=['1','2','3'];

            $rootScope.$watch('modules', function (nv, ov) {
                console.log('=== Modules changed: ' + nv);
                if(_.isUndefined(nv) ){
                    
                }else if( _.isArray(nv) ){
                    $scope.onModulesChanged(nv, $element,$attrs);
                }
                
            });
            $scope.onModulesChanged = function (modules, $elem,$attrs) {
                debugger
                var codes = $attrs.permission && $attrs.permission.split(',');
                console.log('=== Scope permissons: ' + $attrs.permission);
                var enabled = _.intersection(modules, codes).length > 0;
                alert(enabled)
                if (!enabled) {
                    $elem.hide();
                }else{
                     $elem.show();
                }
            }
        },
        link: ($scope, iElem, iAttr) => {

        }
    };
});