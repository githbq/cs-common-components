require('./index.less');
angular.module('common.components').directive('recursiveSelect', function ($q) {
    return {
        scope: {
            onFillData: '=?',
            names: '=items',
            classes: '@',
            selectNgClass: '=?',
            onSelect: '=?',
            readonly: '=?',
            source: '=?',
            hideEmptySelect: '=?'//隐藏空下拉列表
        },
        template: require('./template.html'),
        controller: function ($scope) {
            if (!angular.isDefined($scope.hideEmptySelect)) {
                $scope.hideEmptySelect = true;
            }
            var cache = {};
            var emptyOption = { id: '', text: '请选择' };
            $scope.$watch('names', function () {
                cache = {};
                init();
            });
            $scope.selectChange = function (model, arrItems, index) {
                var lastModel = model;
                if (index == arrItems.length - 1) {//控件是最后一项 
                    $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                    return;
                }
                for (var i = index + 1; i < arrItems.length; i++) {
                    var nextArrItem = arrItems[i];
                    var parentSelectedValue = arrItems[i - 1].model.value;
                    (function (nextArrItem, i, parentSelectedValue) {
                        nextArrItem.model.value = '';
                        nextArrItem.arr = [emptyOption];
                        var key = i + '-' + parentSelectedValue;
                        if (!parentSelectedValue) {
                            $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                            return;
                        };
                        if (cache[key]) {
                            nextArrItem.arr = cache[key];
                            if (nextArrItem.arr.length > 1) {
                                lastModel = nextArrItem.model;
                            }
                            $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                        } else {
                            $scope.onFillData(parentSelectedValue, nextArrItem, i - 1).then(function (result) {
                                result = result || [];
                                result.unshift(emptyOption);
                                nextArrItem.arr = cache[key] = result;
                                if (nextArrItem.arr.length > 1) {
                                    lastModel = nextArrItem.model;
                                }
                                $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                            });
                        }
                    })(nextArrItem, i, parentSelectedValue);
                }


            }
            function init() {
                var parentValue = '';
                $scope.depArrs = [];
                $scope.dataModel = {};
                angular.forEach($scope.names, (item, index) => {
                    (function (item, index) {
                        $scope.dataModel[item.key] = item;
                        var arr = [emptyOption];
                        $scope.depArrs.push({ model: $scope.dataModel[item.key], arr: arr });
                        var lastModel = $scope.depArrs[index];
                        if (parentValue || index == 0) {
                            $scope.onFillData(parentValue, $scope.depArrs[$scope.depArrs.length - 1], index).then((result) => {
                                $scope.depArrs[index].arr = cache[index + '-' + item.value] = arr.concat(result);
                                if ($scope.depArrs[index].arr.length > 1) {
                                    lastModel = $scope.depArrs[index].model;
                                }
                                $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                            });
                        } else {
                            $scope.onSelect && $scope.onSelect($scope.names, $scope.depArrs, $scope.source, lastModel);
                        }
                        parentValue = item.value;

                    })(item, index);
                });
            }
            $scope.onFillData = $scope.onFillData || function (parentValue, nextArrItem, index) {
                var q = $q.defer();
                q.resolve([]);
                return q.promise;
            }
        }
    }
});