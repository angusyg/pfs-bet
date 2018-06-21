/**
 * @fileoverview Admin module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend.admin')
    .controller('AdminController', AdminController);

  AdminController.$inject = [
    '$state',
  ];

  function AdminController($state) {
    const vm = this;

    /** variables */

    /** functions */

    $state.go('admin.players');
  }
}());
