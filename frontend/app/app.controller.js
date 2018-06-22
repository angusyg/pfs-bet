/**
 * @fileoverview App module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('AppController', AppController);

  AppController.$inject = [
    '$scope',
    'userService',
    'authService',
  ];

  function AppController($scope, userService, authService) {
    const vm = this;

    /** variables */
    vm.theme = userService.getTheme();

    /** functions */
    vm.toto = () => userService.setTheme('theme-dark');
    vm.toto2 = () => authService.cleanStore();

    $scope.$watch(userService.getTheme, (newValue, oldValue) => {
      if (newValue !== oldValue) vm.theme = userService.getTheme();
    });

  }
}());
