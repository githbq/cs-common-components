/*
 * 传入 Scope ，
 * 绑定事件 closeOutside.bind(yourScope), 必须跟上 $event.stopPropagation();
 * 确保 Scope.closeByOutside(); 外部关闭方法存在
 * Scope.closeByOutside(ev); 方法接受一个原生event参数
 * Scope.closeByOutside = function(ev){
 *     ev.stopPropagation();
 *     Scope.close();  内部关闭事件
 * }
 */
angular.module('common.components').service('closeOutside', function($document, $rootScope) {
    var outsideScope = null;
    var closeOutsideScope = function(ev) {
      if(!outsideScope.closeByOutside){
        $document.off('click', closeOutsideScope);
        return;
      }
      outsideScope.closeByOutside(ev);
    }
    this.close = function(yourScope) {
        if (outsideScope === yourScope) {
            $document.off('click', closeOutsideScope);
            outsideScope = null;
        }
    };
    this.bind = function(yourScope) {
        if (!outsideScope) {
            $document.on('click', closeOutsideScope);
        }
        outsideScope = yourScope;
    };
});
