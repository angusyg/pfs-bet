/**
 * @fileoverview Navbar module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend.navbar')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = [];

  function NavbarController() {
    const vm = this;

    /** variables */
    vm.HOME_TAB = 'home';
    vm.PRONOS_TAB = 'pronos';
    vm.RANKING_TAB = 'ranking';
    vm.BONUS_TAB = 'bonus';
    vm.selectedTab = vm.HOME_TAB;

    /** functions */
    vm.selectTab = selectTab;

    function selectTab(tab) {
      vm.selectedTab = tab;
    }
  }
}());
