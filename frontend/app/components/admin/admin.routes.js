/**
 * @fileoverview Admin module routing
 */
(function() {
  'use strict';

  angular
    .module('frontend.admin')
    .config(Routing);

  Routing.$inject = [
    '$stateProvider',
    'USER_ROLES',
  ];

  function Routing($stateProvider, USER_ROLES) {
    const adminState = {
      name: 'app.admin',
      views: {
        'players@': {
          templateUrl: '/partials/admin/players.html',
          controller: 'PlayersController',
          controllerAs: 'players'
        },
        'matchs@': {
          templateUrl: '/partials/admin/matchs.html',
          controller: 'PlayersController',
          controllerAs: 'players'
        }
      },
      data: {
        authorizedRoles: [USER_ROLES.ADMIN],
      },
    };

    $stateProvider.state(adminState);
  }
}());
