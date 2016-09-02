var deps = ['mwl.confirm','ngSanitize'];
deps = deps.concat(['ui.router', 'ui.layout', 'ui.bootstrap']);
deps = deps.concat(['ui.grid', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.grid.pagination']);

angular.module('common.directives', deps);
angular.module('common.services', deps);
angular.module('common.filters', deps); 

require('./directives/index');
require('./services/index');
require('./filters/index');
