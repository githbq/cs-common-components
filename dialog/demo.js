/**
 * demo页面是单独页面不要完全copy只是示范代码
 * 
 */ 
angular.module('app').controller('homemsgtalk2Controller', function ($scope, customDialog) {
    $scope.items = ['item1', 'item2', 'item3']; 
    $scope.open = function (size) {
        customDialog.open({
            title: '标题', 
            content: '<div></div>',
            ctrl: function (dialogScope, $uibModalInstance) {
                dialogScope.items = ['item1', 'item2', 'item3'];
                dialogScope.openSub = function () {
                    customDialog.open({
                        content: '<div><button>我在子窗口里面</button></div>',
                        ctrl: function (subDialogScope, sub$uibModalInstance) {
                        }
                    })
                }
            },
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    }; 
});

