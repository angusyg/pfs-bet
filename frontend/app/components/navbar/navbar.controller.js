/**
 * @fileoverview Navbar module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend.navbar')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = [
    '$rootScope',
    '$state',
    '$uibModal',
    'UI_EVENTS',
  ];

  function NavbarController($rootScope, $state, $uibModal, UI_EVENTS) {
    const vm = this;

    /** variables */
    vm.HOME_TAB = 'home';
    vm.PRONOS_TAB = 'pronos';
    vm.RANKING_TAB = 'ranking';
    vm.BONUS_TAB = 'bonus';
    vm.ADMIN_TAB = 'admin';
    vm.selectedTab = vm.HOME_TAB;

    /** functions */
    vm.selectTab = selectTab;

    function selectTab(tab) {
      vm.selectedTab = tab;

      switch (vm.selectedTab) {
        case vm.HOME_TAB:
          $state.go('app.home');
          break;
        case vm.PRONOS_TAB:
          $state.go('app.pronos');
          break;
        case vm.RANKING_TAB:
          $state.go('app.ranking');
          break;
        case vm.BONUS_TAB:
          $state.go('app.bonus');
          break;
        case vm.ADMIN_TAB:
          openAdmin();
          break;
      }
    }

    function openAdmin() {
      $uibModal.open({
        animation: true,
        templateUrl: '/partials/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        windowClass: '',
        size: 'dialog-centered modal-lg',
      });
    }
  }
}());
