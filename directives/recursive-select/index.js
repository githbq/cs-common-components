require('./index.less');
angular.module('common.components').directive('recursiveSelect', function ($q) {
    return {
        scope: { onFillData: '=?', names: '=items', classes: '@', selectNgClass: '=?', onSelectValue: '=?' },
        template: require('./template.html'),
        controller: function ($scope) {
            var cache = {};
            var emptyOption = { id: '', text: '请选择' };
            $scope.selectChange = function (model, arrItems, index) {
                for (var i = index + 1; i < arrItems.length; i++) {
                    var nextArrItem = arrItems[i];
                    var parentSelectedValue = arrItems[i - 1].model.value;
                    (function (nextArrItem, i, parentSelectedValue) {
                        nextArrItem.model.value = '';
                        nextArrItem.arr = [emptyOption];
                        var key = i + '-' + parentSelectedValue;
                        if (!parentSelectedValue) { return };
                        if (cache[key]) {
                            nextArrItem.arr = cache[key];
                        } else {
                            $scope.onFillData(parentSelectedValue, nextArrItem, i - 1).then(function (result) {
                                result = result || [];
                                result.unshift(emptyOption);
                                nextArrItem.arr = cache[key] = result;
                            });
                        }
                    })(nextArrItem, i, parentSelectedValue);
                    $scope.onSelectValue && $scope.onSelectValue($scope.names);
                }
            }
            $scope.depArrs = [];
            var dataModel = $scope.dataModel = {};
            var parentValue = '';
            angular.forEach($scope.names, (item, index) => {
                (function (item, index) {
                    dataModel[item.key] = { value: item.value, key: item.key };
                    var arr = [emptyOption];
                    $scope.depArrs.push({ model: dataModel[item.key], arr: arr });
                    (parentValue || index == 0) && $scope.onFillData(parentValue, $scope.depArrs[$scope.depArrs.length - 1], index).then((result) => {
                        $scope.depArrs[index].arr = cache[index + '-' + item.value] = arr.concat(result);
                    });
                    parentValue = item.value;
                })(item, index);
            });
            $scope.onFillData = $scope.onFillData || function (parentValue, nextArrItem, index) {
                var q = $q.defer();
                q.resolve([]);
                return q.promise;
            }
        }
    }
});