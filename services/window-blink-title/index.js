angular.module('common.components').service('windowBlinkTitleService', function ($interval, $window) { 
    var originTitle = $window.document.title || '';
    var notifies = [];
    var timer = null;
    //尾部追加
    this.push = function (id, text) {
        this.stop(id);
        if (id && text) {
            notifies.push(createData(id, text));
        }
        initInterval();
    }
    //头部追加
    this.unshift = function (id, text) {
        this.stop(id);
        if (id && text) {
            notifies.unshift(createData(id, text));
        }
    }
    function createData(id, text) {
        var emptyText = _.map(new Array(text.length), function () { return '　'; }).join('');
        return { id, text, emptyText }
    }
    this.stop = function (id) {
        var findIndex = -1;
        _.each(notifies, function (item, index) {
            if (item.id === id) {
                findIndex = index;
                return false;
            }
        });
        if (findIndex !== -1) {
            notifies.splice(findIndex, 1);
        }
        initInterval();
    }
    var times = 0;
    function show() {
        var words = [];
        if (notifies.length > 0) {
            initInterval();
            words = _.map(notifies, function (item) {
                var text = item.text;
                if (times % 2 == 0) { 
                    text = item.emptyText;
                } 
                return `【${text}】`;
            });
            $window.document.title = words.join('') + originTitle;
        } else {
            clearInterval();
            $window.document.title = originTitle;
        }
    }

    function initInterval() {
        if (!timer) {
            times = 0;
            timer = $interval(() => {
                times++;

                show();
            }, 800);
        }
    }
    function clearInterval() {
        $interval.cancel(timer);
        timer = null;
    }
});
