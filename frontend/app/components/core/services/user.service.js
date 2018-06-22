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
  ];

  function UserService($q, authService, helper, APP) {
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
      payload = helper.getUserInfosFromToken(authService.getToken());
      return $q.resolve();
    }

    function setTheme(theme) {
      payload.theme = theme;
    }

    function updatePayload(newValue, oldValue) {
      if (newValue !== oldValue) payload = helper.getUserInfosFromToken(newValue);
    }
  }
})();
