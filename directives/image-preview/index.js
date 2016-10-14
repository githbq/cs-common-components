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
            imagePreviewService.show = (src) => {
                imagePreviewService.clearStyle();
                this.visible = true;
                this.src = src;
            }
        }
    }
}).service('imagePreviewService', function () {
    this.imgElement = null;
    this.deg = 0;
    this.clearStyle = function () {
        this.imgElement && ($(this.imgElement).removeAttr('style'));
        this.deg = 0;
    };
    this.show = function (src) {
    };
    this.styles = ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'];
    this.setRotate = function (element, $btns) {
        this.imgElement = element;
        var me = this;
        $btns.off('click').on("click", function (e) {
            var $btn = $(this);
            if ($(this).is('.right')) {
                me.deg += 90;
            }
            else {
                me.deg -= 90;
            }
            for (var i = 0; i < me.styles.length; i++) {
                element.style[me.styles[i]] = "translate(-50%,-50%) rotate(" + me.deg + "deg)";
            }
            return false;
        });
    };
});