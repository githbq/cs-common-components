angular.module('common.components').directive('permission', function ($rootScope) {
    return {
        priority: 0,
        controller: ($scope, $element, $attrs) => {
            //$rootScope.permissions=['1','2','3'];

            $rootScope.$watch('modules', function (nv, ov) {
                console.log('=== Modules changed: ' + nv);
                $scope.onModulesChanged(nv, $element);
            });
            $scope.onModulesChanged = function (modules, $elem) {
                var codes = $attrs.permission && $attrs.permission.split(',');
                console.log('=== Scope permissons: ' + $attrs.permission);
                var enabled = _.intersection(modules, codes).length > 0;
                if (!enabled) {
                    $elem.remove();
                }
            }
        },
        link: ($scope, iElem, iAttr) => {

        }
    };
});