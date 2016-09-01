var app = angular.module('common.services');
app.factory('$hash', function () {
    var factory = {};
    factory.getParams = function () {
        return location.hash.replace(/(^#\/?)|(\/?$)/g, '').split('/');
    }
    return factory;
});