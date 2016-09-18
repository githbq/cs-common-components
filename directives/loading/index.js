require('./index.less');
angular.module('common.components').directive('customLoading', function ($timeout) {
    return {
        transclude: true,
        scope: {
            loading: '=customLoading',
            text: '@text',
            class: '@'
        },
        template: require('./index.html'),
        link: function (scope, iElem, iAttr) {
            iElem.addClass(scope.class);
            scope.$watch('loading', function (newVal, OldVal) {
                scope.show = newVal;
            });
        }
    };
});