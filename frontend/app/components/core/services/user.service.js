/**
 * @fileoverview User service
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.services')
    .factory('userService', UserService);

  UserService.$inject = [
    '$q',
    'authService',
    'helper',
    'APP',
    '$http'
  ];

  function UserService($q, authService, helper, APP, $http) {
    let payload = {};

    return {
      getTheme: getTheme,
      initialize: initialize,
      setTheme: setTheme,
    };

    function getTheme() {
      if (payload && helper.isNotBlank(payload.theme)) return payload.theme;
      return APP.DEFAULT_THEME;
    }

    function initialize() {
      payload = authService.getUserInfos();
      return $q.resolve();
    }

    function setTheme(theme) {
      payload.theme = theme;
    }
  }
})();
