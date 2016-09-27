angular.module('common.components').directive('permission', function ($rootScope) {
    return {
        priority: 0,
        link: ($scope, iElem, iAttr) => {
            //$rootScope.permissions=['1','2','3'];
            var codes = iAttr['permission'] = '' || iAttr['permission'].split(',');
            var enabled = _.intersection($rootScope.modules, codes).length > 0;
            if(!enabled){
                iElem.remove();
            }
        }
    };
});