var templateStr = require('./grid.html');
require('./grid.less');
angular.module('common.components').directive('normalGrid', function ($timeout, $window) {
    return {
        restrict: 'CA',
        template: templateStr,
        scope: { gridOptions: '=normalGrid', pageChange: '=' },
        link: function ($scope, iElem, iAttr) {
            $scope.showGrid = false;
            var defaultOptions = {
                enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                enableRowHeaderSelection: false, //是否显示选中checkbox框 ,默认为true
                enableRowSelection: true, // 行选择是否可用，默认为true;
                multiSelect: false,// 是否可以选择多个,默认为true;
                enableSorting: false,
                showGridFooter: false,
                enableGridMenu: true,//是否显示表格最右上角的菜单
                enableFiltering: false,
                paginationCurrentPage: 1,
                paginationPageSizes: [10, 50, 75, 100],
                paginationPageSize: 10,//分页默认数量
                useExternalPagination: true,//是否使用远程ajax的分页这时候就知道写事件了 而不是表格自己进行假分页
                useExternalSorting: false,//是否使用远程ajax的排序 
                enablePagination: true, //是否分页，默认为true
                enablePaginationControls: true,//使用默认的底部分页
                showCustomPagination: false,//是否使用自定义的分页组件  默认不用
                showIndexHeader: false,   //显示序列号
                enableColumnMenu: false//显示列的表头菜单
            };
            $scope.gridOptions = angular.extend({}, defaultOptions, $scope.gridOptions);
            if ($scope.gridOptions.showCustomPagination) {//如果使用自定义的分页则默认分页不启用
                $scope.gridOptions.enablePaginationControls = false;
            }
            if ($scope.gridOptions.enableColumnMenu === false) {
                angular.forEach($scope.gridOptions.columnDefs, function (item, i) {
                    item.enableColumnMenu = $scope.gridOptions.enableColumnMenu;
                });
            }
            $scope.gridOptions._onRegisterApi = $scope.gridOptions.onRegisterApi;
            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridOptions.gridApi = gridApi;
                if ($scope.gridOptions.showIndexHeader) {
                    gridApi.core.addRowHeaderColumn({ name: '__sequence', displayName: '#', width: 50, cellTemplate: 'ui-grid/uiGridCell' });
                    gridApi.grid.registerRowsProcessor($scope.addIndexColumn, 200);
                }
                $scope.gridOptions._onRegisterApi && $scope.gridOptions._onRegisterApi(gridApi);
            };
            $scope.addIndexColumn = function (renderableRows) {
                angular.forEach(renderableRows, function (row, i) {
                    row.entity.__sequence = i + 1;
                });
                return renderableRows;
            }
            //容器大小改变处理
            var debounceEvent = null;
            function onResize() {
                if (debounceEvent) $timeout.cancel(debounceEvent);
                debounceEvent = $timeout(function () {
                    var parentContainer = iElem.parents('.ui-layout-container:first');
                    if (parentContainer.length > 0) {
                        var setHeight = parentContainer.height();
                        if (iElem.find('.pagination-wrapper').length > 0) {
                            setHeight = setHeight - iElem.find('.pagination-wrapper').height();
                        }
                        iElem.find('.table-uigrid:first').height(setHeight);
                    }
                    $scope.showGrid = true;
                    debounceEvent = null;
                }, 50);
            }
            onResize();//在指令渲染时立即执行一次

            angular.element($window).bind('resize', onResize);

            $scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', onResize);
            });
            //end 容器大小改变处理  
        },
        controller: function ($scope, uiGridConstants) {
            $scope.$watch('gridOptions.paginationCurrentPage', function (newVal, oldVal) {
                if (angular.isDefined(newVal)) {
                    if ($scope.pageChange) {
                        $scope.pageChange(newVal, oldVal);
                    }
                }
            });

            //$scope.gridOptions = {
            //    totalItems: 60,
            //    enableSorting: false,
            //    showGridFooter: false,
            //    enableGridMenu: true,
            //    enableFiltering: false,
            //    paginationPageSizes: [3, 50, 75, 100],
            //    paginationPageSize: 5,
            //    useExternalPagination: false,
            //    useExternalSorting: false,
            //    paginationChanged: function () {
            //        alert('paginationChanged')
            //    }
            //};
            //$scope.gridOptions.onRegisterApi = function (gridApi) {
            //    $scope.gridOptions.gridApi = gridApi;
            //    //$interval( function() {
            //    //    $scope.gridApi.core.handleWindowResize();
            //    //}, 500, 10);
            //};
            //     $scope.clickMeParent = function () {
            //     alert('me3')
            // }
            //gridOptions.columnDefs[0].enableColumnMenu 是否显示列头的菜单 
            // $scope.gridOptions.columnDefs = [
            //     { field: 'type1', displayName: '咨询分类', width: 150 , enableColumnMenu: false},
            //     { field: 'type2', displayName: '二级分类', width: 150 },
            //     { field: 'description', displayName: '问题描述', width: 100 },
            //     { field: 'company', displayName: '接待客服', width: 200 },
            //     { field: 'time', displayName: '设置时间', cellFilter: 'date:"yyyy-MM-dd"', width: 200 },
            //     {
            //         field: 'control', displayName: '操作', width: '*',
            //         cellTemplate: '<button ng-click="grid.appScope.$parent.clickMeParent(row)">点我{{row.entity}}</button>'
            //     }
            // ];
        }
    };
});