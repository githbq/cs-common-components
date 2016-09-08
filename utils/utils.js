angular.module('common.components').factory('ibssUtils', function ($http) {
    var factory = {
        /**
           * html 转义
           */
        html_encode: function (str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },

        /**
        * html 反转义
        */
        html_decode: function (str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },

        /**
         * clone 一个对象
         * @param obj {object}
         */
        clone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        //////////////
        //
        // 应用内跳转MAP
        /////////////
        getInAppName: function (key) {
            var MAP = {
                'tyzh': '体验帐号',
                'bsxt': '报数系统',
                'yqts': '邀请同事',
                'grzl': '个人资料',
                'xtsz': '系统设置',
                'sccwrz': '立即上传'
            };

            if (key) {
                return MAP[key];
            } else {
                return MAP;
            }
        },

        /**
         *
         * 将以http开头的文字替换为超链接
         */
        replaceLink: function (content) {
            content = content || '';
            var HTTP_REG = new RegExp("((http[s]?|ftp)://|www\\.)[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi");
            return content.replace(HTTP_REG, function (c) {
                return '<a target="_blank" href="' + c + '">' + c + '</a>';
            });
        },
        ////////////////
        //
        //根据当前时间输出易读的时间
        ////////////////
        translateTime: function (time) {
            debugger
            if (!time) {
                throw ('time 不能为空');
            }
            var now = new Date();
            var datetime = new Date(time);

            var str,
                timeSpace;

            if (now.getFullYear() != datetime.getFullYear()) {

                str = "yyyy年MM月dd日 HH:mm";
            } else {

                if (now.getMonth() != datetime.getMonth()) {

                    str = "MM月dd日 HH:mm";
                } else {

                    if (now.getDate() != datetime.getDate()) {
                        now.setHours(0, 0, 0, 0);
                        datetime.setHours(0, 0, 0, 0);
                        timeSpace = now.getTime() - datetime.getTime();
                        if (timeSpace <= (1000 * 60 * 60 * 24)) {
                            return ("昨天 " + new Date(time)._format("HH:mm"));
                        } else if ((timeSpace <= (1000 * 60 * 60 * 42))) {
                            return ("前天 " + new Date(time)._format("HH:mm"));
                        } else {
                            str = "MM月dd日 HH:mm";
                        }
                    } else {

                        str = "HH:mm";
                    }
                }
            }

            return new Date(time)._format(str);
        },
        getFileSize: function (byteSize) {
            var v = 0, unit = "BYTE";
            if (byteSize > 1073741824) {   //1G=1073741824 BYTE
                v = (byteSize / 1073741824).toFixed(0);
                unit = "GB";
            } else if (byteSize > 1048576) {   //1M=1048576 BYTE
                v = (byteSize / 1048576).toFixed(0);
                unit = "MB";
            } else if (byteSize > 1024) {
                v = (byteSize / 1024).toFixed(0);
                unit = "KB";
            } else {
                v = byteSize;
                unit = "B";
            }
            return v + unit;
        }
    };
    factory.api = function (opt, mask) {
        //默认设置
        opt = _.extend({
            type: 'post',
            cache: false,
            timeout: opt.TIME_OUT,
            dataType: 'json'
        }, opt || {});
        return $http(opt).success(
            function (data, status, config, headers) {
                if (data.login == false) {
                    location.href = "/login?from=" + location.pathname;
                    return;
                }
                if (!data.success) {
                    console.warn('请求错误  ' + data.message);
                }

            }).error(function (data, status, config, headers) {
                console.warn('网络请求错误')
            });
    }
    factory.checkBlankSpace = function (str) {
        while (str.lastIndexOf(" ") >= 0) {
            str = str.replace(" ", "");
        }
        while (str.lastIndexOf("\n") >= 0) {
            str = str.replace('\n', '');
        }
        if (str.length == 0) {
            return false;
        }
        return true;
    }
    return factory;
});