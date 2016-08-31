var templateStr = require('./grid.html');
require('./grid.less');
angular.module('app').directive('normalGrid', function ($timeout,$window) {
    return {
        restrict: 'CA',
        template: templateStr,
        scope: { normalGrid: '=', pageChange: '=' },
        link: function (scope, iElem, iAttr) {
            var $scope = scope;
            var defaultOptions = {
                enableSorting: false,
                showGridFooter: false,
                enableGridMenu: true,
                enableFiltering: false,
                paginationCurrentPage: 1,
                paginationPageSizes: [10, 50, 75, 100],
                paginationPageSize: 10,//分页默认数量
                useExternalPagination: true,//是否使用远程ajax的分页这时候就知道写事件了 而不是表格自己进行假分页
                useExternalSorting: false,//是否使用远程ajax的排序 
                enablePagination: true, //是否分页，默认为true
                enablePaginationControls: true,//使用默认的底部分页
                showCustomPagination: false//是否使用自定义的分页组件  默认不用
            };
            $scope.gridOptions = angular.extend({}, defaultOptions, $scope.gridOptions);
            if ($scope.gridOptions.showCustomPagination) {//如果使用自定义的分页则默认分页不启用
                $scope.gridOptions.enablePaginationControls = false;
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
                    debounceEvent = null;
                }, 50);
            }
            onResize();//在指令渲染时立即执行一次

            angular.element($window).bind('resize', onResize);

            scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', onResize);
            });
            //end 容器大小改变处理
        },
        controller: function ($scope, uiGridConstants) {
            $scope.gridOptions = $scope.normalGrid;
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
            //$scope.gridOptions.data = [
            //    {
            //        "name": "Ethel Price",
            //        "gender": "female",
            //        "company": "Enersol"
            //    },
            //    {
            //        "name": "Claudine Neal",
            //        "gender": "female",
            //        "company": "Sealoud"
            //    },
            //    {
            //        "name": "Beryl Rice",
            //        "gender": "female",
            //        "company": "Velity"
            //    },
            //    {
            //        "name": "Wilder Gonzales",
            //        "gender": "male",
            //        "company": "Geekko"
            //    },
            //    {
            //        "name": "Georgina Schultz",
            //        "gender": "female",
            //        "company": "Suretech"
            //    },
            //    {
            //        "name": "Carroll Buchanan",
            //        "gender": "male",
            //        "company": "Ecosys"
            //    },
            //    {
            //        "name": "Valarie Atkinson",
            //        "gender": "female",
            //        "company": "Hopeli"
            //    },
            //    {
            //        "name": "Schroeder Mathews",
            //        "gender": "male",
            //        "company": "Polarium"
            //    },
            //    {
            //        "name": "Lynda Mendoza",
            //        "gender": "female",
            //        "company": "Dogspa"
            //    },
            //    {
            //        "name": "Sarah Massey",
            //        "gender": "female",
            //        "company": "Bisba"
            //    },
            //    {
            //        "name": "Robles Boyle",
            //        "gender": "male",
            //        "company": "Comtract"
            //    },
            //    {
            //        "name": "Evans Hickman",
            //        "gender": "male",
            //        "company": "Parleynet"
            //    },
            //    {
            //        "name": "Dawson Barber",
            //        "gender": "male",
            //        "company": "Dymi"
            //    },
            //    {
            //        "name": "Bruce Strong",
            //        "gender": "male",
            //        "company": "Xyqag"
            //    },
            //    {
            //        "name": "Nellie Whitfield",
            //        "gender": "female",
            //        "company": "Exospace"
            //    },
            //    {
            //        "name": "Jackson Macias",
            //        "gender": "male",
            //        "company": "Aquamate"
            //    },
            //    {
            //        "name": "Pena Pena",
            //        "gender": "male",
            //        "company": "Quarx"
            //    },
            //    {
            //        "name": "Lelia Gates",
            //        "gender": "female",
            //        "company": "Proxsoft"
            //    },
            //    {
            //        "name": "Letitia Vasquez",
            //        "gender": "female",
            //        "company": "Slumberia"
            //    },
            //    {
            //        "name": "Trevino Moreno",
            //        "gender": "male",
            //        "company": "Conjurica"
            //    }
            //];
            //$scope.gridOptions.columnDefs = [
            //    {name: 'name', aggregationType: uiGridConstants.aggregationTypes.count},
            //    {
            //        name: 'gender', filter: {term: 'male'}, width: 150, enableCellEdit: false,
            //        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            //            if (grid.getCellValue(row, col) === 'male') {
            //                return 'blue';
            //            } else if (grid.getCellValue(row, col) === 'female') {
            //                return 'pink';
            //            }
            //        }
            //    },
            //    {name: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, width: 100},
            //    {name: 'company', enableFiltering: false, width: 200}
            //];
        }
    };
});