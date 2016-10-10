angular.module('common.components').directive('fileChanged', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            fileChanged: '&',
            cleanup: '@'
        },
        link: function($scope, elem, attr, ctrl) {
            if( $scope.cleanup === undefined ) {
                $scope.cleanup = false;
            }
            elem.on('change', onChanged);

            $scope.$on('destroy', function () {
                elem.off('change', onChanged);
            });

            function onChanged() {
                $timeout(function() {
                    ctrl.$setViewValue(elem[0].files);
                    $scope.fileChanged();
                    if ( $scope.cleanup ) {
                        $(elem).val('');
                    }
                }, 10);
            }
        }
    };
}]);