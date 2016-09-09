require('angular-ui-grid');
require('angular-ui-grid/ui-grid.css');

angular.module('common.components', ['ui.grid', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.grid.pagination']);
require('./resize/resize');
require('./dialog/dialog');
require('./bindhtmlcompile/bindhtmlcompile');
require('./grid/grid');
require('./loading/loading');
require('./scroll/scrollservice');
require('./utils/utils');
