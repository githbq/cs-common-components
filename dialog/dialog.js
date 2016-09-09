require('./dialog.less');
angular.module('common.components').factory('customDialog', function ($templateCache, $uibModal) {
    $templateCache.put('/dialog/customDialogWindowTemplate',require('./windowtemplate.html'));
    return {
        open: function (option) {
            var modalInstance = $uibModal.open(
                {
                    windowTemplateUrl:'/dialog/customDialogWindowTemplate',
                    backdrop: angular.isDefined(option.backdrop) ? option.backdrop : 'static',
                    windowClass: option.windowClass,//弹窗的样式
                    windowTopClass: option.windowTopClass,//弹窗最外层的样式
                    animation: angular.isDefined(option.animationsEnabled) ? option.animationsEnabled : false,
                    template: option.template || require('./template.html'),//字符串模板
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = option.title;
                        $scope.content = option.content;
                        $scope.enterText = '确定';
                        $scope.cancelText = '取消';
                        $scope.loadingText = "请稍等";
                        $scope.ok = function () {
                            if (option.okCallback && option.okCallback($scope) !== false) {
                                $uibModalInstance.close();
                            } else if (!option.okCallback) {
                                $uibModalInstance.close();
                            }
                        };
                        $scope.cancel = function () {
                            if (option.cancelCallback && option.cancelCallback($scope) !== false) {
                                $uibModalInstance.dismiss('cancel');
                            } else if (!option.cancelCallback) {
                                $uibModalInstance.dismiss('cancel');
                            }
                        };
                        option.ctrl && option.ctrl($scope, $uibModalInstance);
                    },
                    size: option.size,//type:string,一个类名 用来设置弹窗内容的样式,比如宽高    不写或者'sm'或者'lg'  最终样式会自动带上前缀比如:modal-sm
                    resolve: option.resolve,//弹窗前预处理任务 返回promise与ui-router上的resolve功能一样
                    appendTo: option.appendTo //弹窗的窗口 原生dom对象 默认为 document.body
                }
            )
                ;
            //modalInstance.result.then(option.onClose || angular.noop, option.onCancel || angular.noop);
            return modalInstance;
        }
    }
})
    ;