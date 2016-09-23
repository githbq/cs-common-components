angular.module('common.components').directive('permission', function ($rootScope) {
    return {
        priority: 9999,
        link: ($scope, iElem, iAttr) => {
            //$rootScope.permissions=['1','2','3'];
            var codes = iAttr['permission'] = '' || iAttr['permission'].split(',');
            var enabled = _.intersection($rootScope.permissions, codes).length > 0;
            if(!enabled){
                iElem.remove();
            }
        }
    };
});