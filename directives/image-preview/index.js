require('./index.less');
angular.module('common.components').directive('imagePreview', function (imagePreviewService) {
    return {
        scope: true,
        template: require('./index.html'),
        controllerAs: 'vm',
        link: function ($scope, iElem, iAttrs) {
            imagePreviewService.setRotate(iElem.find('img.preview')[0], iElem.find('.btn-rotate'));
        },
        controller: function () {
            this.visible = false;
            this.close = () => {
                this.visible = false;
            };
            this.hrefClick = ($event) => {
                $event.stopPropagation();
            };
            imagePreviewService.show = (src) => {
                this.visible = true;
                this.src = src;
            }
        }
    }
}).service('imagePreviewService', function () {
    this.show = function (src) {

    }
    this.setRotate = function (elem, $btn) {
        var deg = 0;
        $btn.off('click').on("click", function (e) {
            if ((deg + 90) > 360) {
                deg = 90;
            } else {
                deg += 90;
            }
            var element = elem;
            var styles = ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'];
            for (var i = 0; i < styles.length; i++) {
                element.style[styles[i]] = "rotate(" + deg + "deg)"
            }
            return false;
        });
    }
});