/**
 * @fileoverview Admin module
 */
(function() {
  'use strict';

  angular
    .module('frontend.admin', [
      'frontend.core.constants',
      'frontend.admin.players',
      'ui.bootstrap',
    ]);
})();

//https://github.com/angular-ui/ui-router/issues/944
