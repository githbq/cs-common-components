angular.module( 'common.components' ).factory( 'ibssUtils', function ( $http, $q, toaster ) {
    var factory = {
        /**
         * html 转义
         */
        html_encode: function ( str ) {
            var s = "";
            if ( str.length == 0 ) {
                return "";
            }
            s = str.replace( /</g, "&lt;" );
            s = s.replace( />/g, "&gt;" );
            s = s.replace( / /g, "&nbsp;" );
            s = s.replace( /\'/g, "&#39;" );
            s = s.replace( /\"/g, "&quot;" );
            s = s.replace( /\n/g, "<br>" );
            return s;
        },

        /**
         * html 反转义
         */
        html_decode: function ( str ) {
            var s = "";
            if ( str.length == 0 ) {
                return "";
            }
            s = str.replace( /&lt;/g, "<" );
            s = s.replace( /&gt;/g, ">" );
            s = s.replace( /&nbsp;/g, " " );
            s = s.replace( /&#39;/g, "\'" );
            s = s.replace( /&quot;/g, "\"" );
            s = s.replace( /<br>/g, "\n" );
            return s;
        },

        /**
         * clone 一个对象
         * @param obj {object}
         */
        clone: function ( obj ) {
            return JSON.parse( JSON.stringify( obj ) );
        },
        //////////////
        //
        // 应用内跳转MAP
        /////////////
        getInAppName: function ( key ) {
            var MAP = {
                'tyzh': '体验帐号',
                'bsxt': '报数系统',
                'yqts': '邀请同事',
                'grzl': '个人资料',
                'xtsz': '系统设置',
                'sccwrz': '立即上传'
            };

            if ( key ) {
                return MAP[ key ];
            } else {
                return MAP;
            }
        },

        /**
         *
         * 将以http开头的文字替换为超链接
         */
        replaceLink: function ( content ) {
            content = content || '';
            var HTTP_REG = new RegExp( "((http[s]?|ftp)://|www\\.)[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi" );
            return content.replace( HTTP_REG, function ( c ) {
                return '<a target="_blank" href="' + c + '">' + c + '</a>';
            } );
        },
        ////////////////
        //
        //根据当前时间输出易读的时间
        ////////////////
        translateTime: function ( time ) {
            if ( !time ) {
                throw ('time 不能为空');
            }
            var now = new Date();
            var datetime = new Date( time );

            var str,
                timeSpace;

            if ( now.getFullYear() != datetime.getFullYear() ) {

                str = "yyyy年MM月dd日 HH:mm";
            } else {

                if ( now.getMonth() != datetime.getMonth() ) {

                    str = "MM月dd日 HH:mm";
                } else {

                    if ( now.getDate() != datetime.getDate() ) {
                        now.setHours( 0, 0, 0, 0 );
                        datetime.setHours( 0, 0, 0, 0 );
                        timeSpace = now.getTime() - datetime.getTime();
                        if ( timeSpace <= (1000 * 60 * 60 * 24) ) {
                            return ("昨天 " + new Date( time )._format( "HH:mm" ));
                        } else if ( (timeSpace <= (1000 * 60 * 60 * 42)) ) {
                            return ("前天 " + new Date( time )._format( "HH:mm" ));
                        } else {
                            str = "MM月dd日 HH:mm";
                        }
                    } else {

                        str = "HH:mm";
                    }
                }
            }

            return new Date( time )._format( str );
        },
        getFileSize: function ( byteSize ) {
            var v = 0, unit = "BYTE";
            if ( byteSize > 1073741824 ) {   //1G=1073741824 BYTE
                v = (byteSize / 1073741824).toFixed( 0 );
                unit = "GB";
            } else if ( byteSize > 1048576 ) {   //1M=1048576 BYTE
                v = (byteSize / 1048576).toFixed( 0 );
                unit = "MB";
            } else if ( byteSize > 1024 ) {
                v = (byteSize / 1024).toFixed( 0 );
                unit = "KB";
            } else {
                v = byteSize;
                unit = "B";
            }
            return v + unit;
        },

        /**
         * 顺序序列做前后去重拼接
         * @param frontArray 前序列
         * @param endArray 后序列
         * @param property 对比对象属性（为空时直接对比队列项）
         * @returns {Array.<T>} 拼接后队列
         */
        distinctConcatSequence: function ( frontArray, endArray, property ) {
            var fa = frontArray || [];
            var ea = endArray || [];
            var faSize = fa.length, eaSize = ea.length, splitter = 0, connector = -1;
            // 根据长度判断遍历方向
            if ( faSize > eaSize ) {
                connector = property ? fa[ faSize - 1 ][ property ] : fa[ faSize - 1 ];
                for ( var i = 0; i <= eaSize - 1; ++i ) {
                    var ei = property ? ea[ i ][ property ] : ea[ i ];
                    if ( ei > connector ) {
                        splitter = i;
                        break;
                    }
                }
                console.log( '=== Concat front { splitter: ' + splitter + ', connector: ' + connector + ' }' );
                return fa.concat( ea.slice( splitter ) );
            } else {
                splitter = -1;
                connector = property ? ea[ 0 ][ property ] : ea[ 0 ];
                for ( var j = faSize - 1; j >= 0; --j ) {
                    var fj = property ? fa[ j ][ property ] : fa[ j ];
                    if ( fj < connector ) {
                        splitter = j + 1;
                        break;
                    }
                }
                console.log( '=== Concat end { splitter: ' + splitter + ', connector: ' + connector + ' }' );
                return fa.slice( 0, splitter ).concat( ea );
            }
        },

        distinctSelectSequence: function ( source, target, compare ) {
            var sa = source || [], ta = target || [], append = true, splitter = 0;
            if ( !compare ) {
                compare = function ( a, b ) {
                    return a - b;
                };
            }
            if ( ta.length == 0 || sa.length == 0 ) {
                return { append: append, items: ta };
            }
            if ( compare( ta[ 0 ], sa[ 0 ] ) >= 0 ) {
                for ( var i = 0; i < ta.length; ++i ) {
                    if ( compare( ta[ i ], sa[ sa.length - 1 ] ) > 0 ) {
                        splitter = i;
                        break;
                    }
                }
                return { append: append, items: ta.slice( splitter ) };
            } else {
                splitter = ta.length - 1;
                append = false;
                for ( var j = ta.length - 1; j >= 0; --j ) {
                    if ( compare( ta[ j ], sa[ 0 ] ) < 0 ) {
                        splitter = j + 1;
                        break;
                    }
                }
                return { append: append, items: ta.slice( 0, splitter ).reverse() };
            }
        },

        upload: function ( url, name, files, nameValues ) {
            var deferred = $q.defer();
            var data = new FormData();
            var fileList = [];
            if ( files instanceof Array ) {
                fileList = files;
            } else if (files instanceof FileList) {
                for (var i = 0; i < files.length; ++i) {
                    fileList.push(files[i]);
                }
            } else {
                fileList.push( files );
            }
            fileList.forEach( function ( file ) {
                data.append( name, file );
            } );
            if ( nameValues && nameValues instanceof Array ) {
                nameValues.forEach( function ( nameValue ) {
                    data.append( nameValue.name, nameValue.value );
                } );
            }
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', url, true );
            xhr.onreadystatechange = function () {
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                    var response = JSON.parse( xhr.responseText );
                    deferred.resolve( response );
                } else if ( xhr.readyState == 4 ) {
                    toaster.pop( 'error', '响应错误', xhr.statusText );
                    deferred.reject( xhr.status );
                }
            };
            xhr.onerror = function ( error ) {
                toaster.pop( 'error', '请求错误', error );
                deferred.reject( error );
            };
            xhr.send( data );
            return deferred.promise;
        }
    };
    factory.api = function ( opt ) {
        //默认设置
        opt = _.extend( {
            method: 'POST',
            cache: false,
            timeout: 30000,
            transformResponse: function ( response, headers, status ) {
                if ( status < 200 || status >= 300 ) {
                    return;
                }
                var data = {};
                try {
                    data = JSON.parse( response );
                } catch ( ex ) {
                    toaster.pop( 'error', '响应错误', '返回数据解析失败。' );
                    return;
                }
                if ( data.success != undefined && !data.success ) {
                    toaster.pop( 'error', '响应错误', data.message );
                    return;
                }
                return { success: data.success, model: data.value ? data.value.model : {} };
            }
        }, opt || {} );
        return $http( opt ).error( function ( data, status ) {
            toaster.pop( 'error', '请求错误', 'Status: ' + status );
        } );
    };
    factory.checkBlankSpace = function ( str ) {
        while ( str.lastIndexOf( " " ) >= 0 ) {
            str = str.replace( " ", "" );
        }
        while ( str.lastIndexOf( "\n" ) >= 0 ) {
            str = str.replace( '\n', '' );
        }
        if ( str.length == 0 ) {
            return false;
        }
        return true;
    };
    return factory;
} );
