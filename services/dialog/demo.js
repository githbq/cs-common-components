require('./msgtalk2.less');
require('./refs/index');
angular.module('app').controller('homemsgtalk2Controller', function ($scope, customDialog) {
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;
    $scope.open = function (size) {
        customDialog.open({
            title: '1111AAAAB',
            animation: $scope.animationsEnabled,
            content: require('./template.html'),
            ctrl: function (dialogScope, $uibModalInstance) {
                $scope.items = ['item1', 'item2', 'item3'];
                dialogScope.openSub = function () {
                    customDialog.open({
                        content: '<div><button>我在子窗口里面</div></div>',
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

