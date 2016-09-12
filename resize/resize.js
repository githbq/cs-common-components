require('./resize.less');
angular.module('common.components').directive('customResize', function ($window, $timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var win = angular.element($window);
            function debounce() {
                var debounceEvent = null;
                if (debounceEvent) $timeout.cancel(debounceEvent);
                debounceEvent = $timeout(function () {
                    onResize();
                    debounceEvent = null;
                }, 100);
            }
            //容器大小改变处理
            function onResize() {
                !element.hasClass('visible') && element.addClass('visible');
                var windowWidth = $window.document.body.clientWidth;
                var windowHeight = $window.document.body.clientHeight;
                var dialogWidth = element.width();
                var dialogHeight = element.height();
                var offsetLeft = windowWidth > dialogWidth ? (windowWidth - dialogWidth) / 2 : 0;
                var offsetTop = windowHeight > dialogHeight ? (windowHeight - dialogHeight) / 2 : 0;
                element.css({ left: offsetLeft, top: offsetTop });
            }
            debounce();//在指令渲染时立即执行一次
            win.bind('resize', debounce);
            scope.$on('$destroy', function () {
                win.unbind('resize', debounce);
            });
        }
    }
}
);