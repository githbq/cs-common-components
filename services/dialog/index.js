require('./index.less');
angular.module('common.components').factory('customDialog', function ($templateCache, $uibModal) {
    $templateCache.put('/dialog/customDialogWindowTemplate', require('./window-template.html'));
    return {
        open: function (option) {
            var $template = $(require('./index.html'));
            if (option.noResize) {
                $template.find('.resize-body:first').removeClass('resize-body');
            }
            var modalInstance = $uibModal.open(
                {
                    windowTemplateUrl: '/dialog/customDialogWindowTemplate',
                    backdrop: angular.isDefined(option.backdrop) ? option.backdrop : 'static',
                    windowClass: option.windowClass,//弹窗的样式
                    windowTopClass: option.windowTopClass,//弹窗最外层的样式
                    animation: angular.isDefined(option.animationsEnabled) ? option.animationsEnabled : false,
                    template: option.template || $template.get(0).outerHTML,//字符串模板
                    buttonTemplate: null,//增加的按钮
                    windowStyle: option.windowStyle || { width: '1000px' },//给窗体加样式
                    controller: function ($scope, $uibModalInstance) {
                        $scope.windowStyle =option.windowStyle;// option.windowStyle;
                        $scope.buttonTemplate = option.buttonTemplate;
                        $scope.title = option.title;
                        $scope.content = option.content;
                        $scope.enterText = '确定';
                        $scope.cancelText = '取消';
                        $scope.loadingText = "请稍等";
                        $scope.ok = function ($event) {
                            if (option.okCallback && option.okCallback($scope, closeDialog) !== false) {
                                $uibModalInstance.close();
                            } else if (!option.okCallback) {
                                $uibModalInstance.close();
                            }
                            $event.stopPropagation();
                        };
                        $scope.cancel = function ($event, force) {
                            if (force) {//右上角的强制关闭
                                $uibModalInstance.dismiss();
                            } else {
                                if (option.cancelCallback && option.cancelCallback($scope, dismissDialog) !== false) {
                                    $uibModalInstance.dismiss('cancel');
                                } else if (!option.cancelCallback) {
                                    $uibModalInstance.dismiss('cancel');
                                }
                            }
                            $event.stopPropagation();
                        };
                        function closeDialog() {
                            $uibModalInstance.close();
                        }
                        function dismissDialog() {
                            $uibModalInstance.dismiss('cancel');
                        }
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
}).directive('customDialog', function () {
    return {
        restrict:'C',
        scope: { windowStyle: '=' },
        link: function ($scope, iElem, iAttr) {
            if ($scope.windowStyle) {
                iElem.parents('.modal-dialog:first').css($scope.windowStyle);
            }
        }
    };
})
    ;