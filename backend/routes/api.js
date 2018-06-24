/**
 * @fileoverview App API router
 * @module routes/api
 * @requires {@link external:express}
 * @requires config/api
 * @requires controllers/api
 * @requires helpers/security
 * @requires helpers/resources
 */

const express = require('express');
const { loginPath, logoutPath, loggerPath, refreshPath, roles } = require('../config/api');
const apiController = require('../controllers/api');
const { requiresLogin } = require('../helpers/security');
const resources = require('../helpers/resources');
const User = require('../models/users');

const router = express.Router();

/**
 * @path {POST} /log/:level
 * @params {string} :level      - level of the log to save
 * @body {Object} log
 * @body {string} log.url       - current page url of log
 * @body {string} log.message   - message to log
 * @code {204} if successful, no content
 * @name logger
 */
router.post(loggerPath, apiController.logger);

/**
 * @path {POST} /login
 * @body {Object} infos
 * @body {string} infos.login     - user login
 * @body {string} infos.password  - user password
 * @response {json} tokens
 * @response {String} tokens.refreshToken
 * @response {String} tokens.accessToken
 * @code {200} if successful
 * @code {401} if login is not found is database
 * @code {401} if password is not valid
 * @name login
 */
router.post(loginPath, apiController.login);

/**
 * @path {GET} /logout
 * @auth This route requires JWT bearer Authentication. If authentication fails it will return a 401 error.
 * @header {string} authorization - Header supporting JWT Token
 * @code {204} if successful, no content
 * @code {401} if login is not valid
 * @name logout
 */
router.get(logoutPath, requiresLogin, apiController.logout);

/**
 * @path {GET} /refresh
 * @auth This route requires JWT bearer Authentication. If authentication fails it will return a 401 error.
 * @header {string} authorization - Header supporting JWT Token
 * @header {string} refresh       - Header supporting refresh token
 * @code {200} if successful
 * @code {401} if refresh is not allowed
 * @code {500} if user in JWT token is not found
 * @code {500} if an unexpected error occurred
 * @name refresh
 */
router.get(refreshPath, requiresLogin, apiController.refreshToken);

/** User resource */
router.use('/users', resources.addResource('users', User, {
  global: {
    protected: true,
    roles: [
      roles.ADMIN,
      roles.USER,
    ],
  },
  filter: [
    'password',
    'refreshToken',
  ],
}).router);

module.exports = router;
