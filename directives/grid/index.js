var templateStr = require('./index.html');
require('./index.less');
angular.module('common.components').directive('normalGrid', function ($timeout, $window, $q) {
    return {
        restrict: 'CA',
        template: templateStr,
        scope: { gridOptions: '=normalGrid' },
        link: function ($scope, iElem, iAttr) {
            $scope.showGrid = false;
            var defaultOptions = {
                loading: false,//是否正处于加载状态 
                enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                enableRowHeaderSelection: false, //是否显示选中checkbox框 ,默认为true
                enableRowSelection: true, // 行选择是否可用，默认为true;
                multiSelect: false,// 是否可以选择多个,默认为true;
                enableSorting: false,
                showGridFooter: false,
                enableGridMenu: false,//是否显示表格最右上角的菜单
                enableSelectionBatchEvent: true,//默认开启批量选中事件 此时全选复选框才有效果  
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
                enableColumnMenu: false,//显示列的表头菜单
                enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
                enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示,
                autoPage: false,//是否启用默认封装的分页
                searchModel: {}//搜索使用的模型 重写 以赋默认值   无需pageSize pageIndex字段
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
            _.each($scope.gridOptions.columnDefs, function (item, i) {
                if (item.field === 'operation') {
                    item.cellClass = "ui-grid-cell-operation";
                }
            });
            $scope.gridOptions._onRegisterApi = $scope.gridOptions.onRegisterApi;
            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridOptions.gridApi = gridApi;
                if ($scope.gridOptions.showIndexHeader) {//显示索引列
                    gridApi.core.addRowHeaderColumn({ name: '__sequence', displayName: '#', width: 50, cellTemplate: 'ui-grid/uiGridCell' });
                    gridApi.grid.registerRowsProcessor($scope.addIndexColumn, 200);
                }
                if ($scope.gridOptions.autoPage) {//开启默认封装的分页
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.getPage({ pageIndex: newPage, pageSize: pageSize });
                    });
                    if ($scope.gridOptions.autoPage === 1) {//默认执行查询行为
                        $scope.gridOptions.search();
                    }
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
                    var parentContainer = iElem.parents('.ui-layout-container:first').length > 0 ? iElem.parents('.ui-layout-container:first') : iElem.parents('.ui-grid-dock-wrapper:first');
                    if (parentContainer.length > 0) {
                        var setHeight = parentContainer.height();
                        if (iElem.find('.pagination-wrapper').length > 0) {
                            setHeight = setHeight - iElem.find('.pagination-wrapper').height();
                        }
                        iElem.find('.table-uigrid:first').height(setHeight);
                    }
                    $scope.showGrid = true;
                    debounceEvent = null;
                }, 100);
            }
            onResize();//在指令渲染时立即执行一次

            angular.element($window).bind('resize', onResize);

            $scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', onResize);
            });
            //end 容器大小改变处理  

            //////////////////////分页
            $scope.gridOptions.searchModel = $scope.gridOptions.searchModel || {};
            //拉取数据的接口 使用时需要自行实现方法体
            $scope.gridOptions.onPullData = $scope.gridOptions.onPullData || function () {
                var q = $q.defer();
                q.resolve({});
                return q.promise;
            }
            $scope.gridOptions.afterPullData = $scope.gridOptions.afterPullData || function (result) {
                if (result.data && result.data.success) {
                    if (result.data.model.content.length == 0) {
                        toaster.pop('info', null, '暂无数据', 1000);
                    }
                    $scope.searching = false;
                    $scope.gridOptions.data = result.data.model.content;
                    $scope.gridOptions.totalItems = result.data.model.itemCount;
                }
            }
            //点击查询
            $scope.gridOptions.search = function ($event) {
                $scope.gridOptions.paginationCurrentPage = 1;
                getPage($scope.searchModel);
                $event && $event.stopPropagation();
            }
            var currentQueryData = _.extend({}, $scope.searchModel);//当前查询的数据   避免用户修改查询条件后未点击查询下 操作分页 数据查询异常BUG
            function getPage(queryData) {
                currentQueryData = angular.copy(queryData || currentQueryData);
                $scope.gridOptions.loading = true;
                $scope.searching = true;
                //这里进行从后端拿数据赋值给 $scope.gridOptions.data操作
                $scope.gridOptions.onPullData(_.extend({ pageSize: $scope.gridOptions.paginationPageSize, pageIndex: $scope.gridOptions.paginationCurrentPage }, currentQueryData))
                    .then((result) => {
                        $scope.gridOptions.afterPullData(result);
                    }, () => {
                        $scope.gridOptions.data = [];
                        $scope.gridOptions.totalItems = 0;
                    }).finally(() => {
                        $scope.gridOptions.loading = false;
                    });
            }
            //////////////////////end 分页
        },
        controller: function ($scope, uiGridConstants, $templateCache) {
            //////grid row 模板改造  支持双击事件
            $templateCache.put('ui-grid/ui-grid-row/custom',
                `<div ng-dblclick="grid.appScope.gridOptions.rowDoubleClick($event,row)"
                 ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" 
                 ui-grid-one-bind-id-grid="rowRenderIndex + '-' + col.uid + '-cell'" class="ui-grid-cell" 
                 ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader }" 
                 role="{{col.isRowHeader ? 'rowheader' : 'gridcell'}}" ui-grid-cell> 
                 </div>`
            );
            $scope.gridOptions.rowTemplate = $scope.gridOptions.rowTemplate || 'ui-grid/ui-grid-row/custom';
            $scope.gridOptions.rowDoubleClick = $scope.gridOptions.rowDoubleClick || function ($event, row) {
                $event.stopPropagation();
            }
            //////模板改造 
            //复选框全选事件   注意  对象为  gridApi
            //    gridApi.selection.on.rowSelectionChangedBatch($scope, function (allRows) {
            //                 console.log(allRows)
            //                 console.log(gridApi.grid.selection.selectAll);//为true说明本次是全取消操作   为false本次全选中操作
            //             });
            //选中checkbox事件

            // gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //     console.log(row.isSelected)
            //     console.log(row.entity)
            // }); 
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

            //uigrid表格內图标按钮案例
            //<button class="btn btn-default grid-operation-btn-edit" ><span class="glyphicon glyphicon-edit"></span>编辑</button>
            //<button class="btn btn-default grid-operation-btn-del" ><span class="glyphicon glyphicon-remove"></span>删除</button>
            //onRegisterApi: function (gridApi) {

            //     gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

            //         $scope.getQuestionsData({ pageIndex: newPage, pageSize: pageSize });

            //     }); 
            //}
        }
    };
});