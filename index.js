require('angular-ui-grid');
require('angular-ui-grid/ui-grid.css');
require('angular-drag');
require('angular-bootstrap-confirm');
var deps = ['ui.grid', 'ui.grid.selection', 'angular-drag', 'ui.grid.moveColumns', 'ui.grid.autoResize', 
'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.grid.pagination', 'toaster','mwl.confirm'];
module.exports = angular.module('common.components', deps).name;
require('./directives');
require('./filters');
require('./services');

