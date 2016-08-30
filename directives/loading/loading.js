require('./loading.less');
angular.module('common.directives').directive('customLoading', function ($timeout) {
    return {
        transclude: true,
        scope: {
            loading: '=customLoading',
            text: '@text',
            class: '@'
        },
        template: require('./template.html'),
        link: function (scope, iElem, iAttr) {
            iElem.addClass(scope.class);
            scope.$watch('loading', function (newVal, OldVal) {
                scope.show = newVal;
            });
        }
    };
});