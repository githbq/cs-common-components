angular.module( 'common.components' ).filter( 'gender', function () {
    return function ( data ) {
        if ( data === 'MALE' ) {
            return '男';
        } else if ( data === 'FEMALE' ) {
            return '女';
        } else {
            return '未知';
        }
    };
} );
