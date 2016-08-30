
require('./dialog.less');
angular.module('common.services').factory('customDialog', function ($uibModal) {
    return {
        open: function (option) {
            var modalInstance = $uibModal.open({
                animation: angular.isDefined(option.animationsEnabled) ? option.animationsEnabled : true,
                template: option.templdate || require('./template.html'),
                controller: function ($scope, $uibModalInstance) {
                    $scope.title = option.title;
                    $scope.content = option.content;
                    $scope.enterText = '确定';
                    $scope.cancelText = '取消';
                    $scope.loadingText = "请稍等";
                    $scope.ok = function () {
                        if (option.okCallback && option.okCallback() !== false) {
                            $uibModalInstance.close();
                        }
                    };
                    $scope.cancel = function () {
                        if (option.okCallback && option.cancelCallback() !== false) {
                            $uibModalInstance.dismiss('cancel');
                        }
                    };
                    option.ctrl && option.ctrl($scope, $uibModalInstance);
                },
                size: option.size
            }
            )
                ;
            //modalInstance.result.then(option.onClose || angular.noop, option.onCancel || angular.noop);
            return modalInstance;
        }
    }
})
    ;