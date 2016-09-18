require('./index.less');
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
                }, 200);
            }
            //容器大小改变处理
            function onResize() {
                var windowWidth = win.outerWidth();// $window.document.body.clientWidth;
                var windowHeight = win.outerHeight();// $window.document.body.clientHeight;
                var offsetHeight =150;
                setSize(windowHeight, offsetHeight);
                setPosition(windowWidth, windowHeight);
            }
            function setPosition(windowWidth, windowHeight) {
                //设置绝对居中 
                !element.hasClass('visible') && element.addClass('visible');
                var dialogWidth = element.outerWidth();
                var dialogHeight = element.outerHeight();
                var offsetLeft = windowWidth > dialogWidth ? (windowWidth - dialogWidth) / 2 : 0;
                var offsetTop = windowHeight > dialogHeight ? (windowHeight - dialogHeight) / 2 : 0;
                element.css({ left: offsetLeft, top: offsetTop });
            }
            var bodyOriginHeight = null;
            function setSize(winH, offsetHeight) {
                var $resizeBody = $(element).find('.resize-body:first');
                if (!$resizeBody.length) { return; }
                //设置宽高匹配 
                console.log('winH' + winH);
                if (!bodyOriginHeight) {
                    bodyOriginHeight = $resizeBody.outerHeight();
                }
                var elemH = $resizeBody.height() + offsetHeight;
                var css = { height: 'auto', overflowY: 'hidden' };
                if (elemH <= bodyOriginHeight) {
                    elemH = bodyOriginHeight;
                } 
                css = {
                    'height': (winH - offsetHeight) > bodyOriginHeight ? bodyOriginHeight : (winH - offsetHeight) + 'px',
                    'overflow-y': 'auto'
                };
                $resizeBody.css(css);
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