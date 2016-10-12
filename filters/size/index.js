angular.module( 'common.components' ).filter( 'size', function () {
  return function ( data ) {
    if ( data > 1000000 ) {
      return (data / 1024 / 1024).toFixed( 1 ) + ' MB';
    } else if ( data > 1000 ) {
      return (data / 1024).toFixed( 1 ) + ' KB';
    } else {
      return data.toFixed( 1 ) + ' B';
    }
  };
} );
