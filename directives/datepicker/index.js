var templateStr = require('./index.html');
require('./index.less');
angular.module('common.components').directive('commonDatepicker', function ($timeout, $window) {
    return {
        restrict: 'CA',
        template: templateStr,
        replace:false,
        scope: { dateOptions: '=', attrOptions: '=',ngModel:'=' },
        link: function ($scope, iElem, iAttr) {
            
        },
        controller: function ($scope ) {
            $scope.innerModel=$scope.ngModel;
            $scope.newDateOptions = $scope.dateOptions||{};
            $scope.newAttrOptions= $scope.attrOptions||{}; 

            var defaultDate = {
                customClass :function(){},              //一个可选的函数，设置日期面板中每个日期的样式。传入参数为一个json对象{date: obj1, mode: obj2}，返回值为类的名字
                dateDisabled: function(){},             //一个可选的函数，设置日期面板中每个日期是否可选。传入参数为一个json对象{date: obj1, mode: obj2}，返回值为bool类型
                datepickerMode:'day',                     // 可设置为day,month,year。表示控件的选择模式
                formatDay: 'dd',                        // 天数的格式化形式
                formatMonth:'MMMM',                     //月份的格式化形式
                formatYear:'yyyy',                      //年份的格式化形式
                formatDayHeader: 'EEE',                 //星期的格式化形式
                formatDayTitle: 'MMMM yyyy',            //按天数选择日期时，面板中当前月份和年份的格式化形式（显示为：六月 2016 的地方）
                formatMonthTitle:'yyyy',                //按月份选择日期时，面板中当前年份的格式化形式
                initDate: null,                         //初始化日期
                maxDate: null,                          //可选择的最大日期（必须是Javascript日期类型）
                maxMode: 'year',                        //可选择的最大日期模式
                minDate: null,                          //可选择的最小日期（必须是Javascript日期类型）
                minMode: 'day',                         //可选择的最小日期模式
                shortcutPropagation: false,             //是否禁用键盘事件传播 
                showWeeks: false,                        //是否显示面板中的日期是当年的第几周
                startingDay: 1,                         //一个星期从周几开始。可设置为0到6的数字，0表示周日，6表示周六
                yearRows: 4,                            //选择年份时显示多少行
                //checkDate:$scope.currentDate,
                yearColumns: 5                         //选择年份时显示多少列
            };
            var defaultAttr = {
                altInputFormats:['yyyy/MM/dd'],                 //手动输入日期时可接受的格式
                clearText:'清空',                               //清空按钮的文本
                required:false,                                  //是否必填
                closeOnDateSelection:true,                      //选择一个日期后是否关闭日期面板
                closeText:'关闭',                               //关闭按钮的文本
                currentText:'今天',                             //今天按钮的文本
                datepickerAppendToBody:true,                    //是否将日期面板放在body元素中
                isOpen: false,                                  //是否显示日期面板
                onOpenFocus:true,                               //打开日期面板时是否获取焦点
                showButtonBar:true,                             //是否在日期面板下方显示”今天”,”关闭”等按钮
                type:'text',                                      //可以改为date|datetime-local|month，这样会改变日期面板的日期格式化。
                popupPlacement:'auto bottom-left',              // 在位置前加一个auto,表示日期面板会定位在它最近一个可以滚动的父元素中.可以设置的位置有:top top-left      top-right          bottom                                                       //bottom-left      bottom-right         left       left-top       left-bottom      right          right-top          right-bottom 
                uibDatepickerPopup:'yyyy/MM/dd'                 //显示日期的格式。可使用的格式见上面的列表。
            }
            
             $scope.newDateOptions = angular.extend({}, defaultDate, $scope.newDateOptions);
             $scope.newAttrOptions = angular.extend({}, defaultAttr, $scope.newAttrOptions);
             if( $scope.newAttrOptions.required && !$scope.ngModel ){
                $scope.innerModel = new Date();
             }
             $scope.open = function(){
                 $scope.newAttrOptions.isOpen = true;
             }

            //时间转化为秒
            $scope.$watch('innerModel', () => {
                debugger
                
                if(_.isDate( $scope.innerModel ) ){
                     console.log($scope.innerModel)
                      $scope.ngModel =  $scope.innerModel ?  $scope.innerModel.getTime():'';
                    console.log($scope.ngModel)
                }else if( _.isUndefined($scope.innerModel) ){
                     $scope.ngModel ='';
                }
            }); 
           
             //<input type="" name="" value="" common-datepicker check-date="dat" date-options="dateOptions">例子
        }
    };
});