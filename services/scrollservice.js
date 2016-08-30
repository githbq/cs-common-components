var app = angular.module('common.services');
app.factory('scrollHelper', function () {
    return {
        scrollToBottom: function ($container, height, during, callback) {
            var heightSpace =  height-$container.outerHeight();
            if (heightSpace < 0) {
                heightSpace = 0;
            }
            var scrollHeight = parseFloat(heightSpace) + 'px';
            if (during === 0) {
                $container.scrollTop(parseFloat(scrollHeight));
                callback && callback();
                return;
            }
            during = during || 1000;
            $container.animate({scrollTop: scrollHeight}, 1000, callback);
            top.document.title = scrollHeight;
        }, scrollToTop: function ($container, height, during, callback) {
            height = height || 0;
            var heightSpace =  height-$container.outerHeight();
            if (heightSpace < 0) {
                heightSpace = 0;
            }
            var scrollHeight = parseFloat(heightSpace) + 'px';
            if (during === 0) {
                $container.scrollTop(parseFloat(scrollHeight));
                callback && callback();
                return;
            }
            during = during || 1000;
            $container.animate({scrollTop: scrollHeight}, 1000, callback);
            top.document.title = scrollHeight;
        }
    };
});