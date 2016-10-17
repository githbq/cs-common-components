Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

angular.module( 'common.components' ).filter( 'time', function () {
  return function ( time ) {
    if ( !angular.isDefined(time) ) {
      return '';
    }
    var now = new Date(),
      date = new Date( time ),
      ny = now.getFullYear(),
      dy = date.getFullYear(),
      nm = now.getMonth(),
      dm = date.getMonth(),
      nd = now.getDate(),
      dd = date.getDate(),
      formatter, prefix = '';
    if ( ny != dy ) {
      formatter = 'yyyy-MM-dd HH:mm';
    } else if ( nm != dm ) {
      formatter = 'MM-dd HH:mm';
    } else if ( nd != dd ) {
      if ( nd - dd == 1 ) {
        prefix = '昨天 ';
        formatter = 'HH:mm';
      } else if ( nd - dd == 2 ) {
        prefix = '前天 ';
        formatter = 'HH:mm';
      } else {
        formatter = 'MM-dd HH:mm';
      }
    } else {
      formatter = 'HH:mm';
    }
    return prefix + date.format( formatter );
  };
} );
