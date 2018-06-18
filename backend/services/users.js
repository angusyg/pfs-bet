/**
 * @fileoverview User service
 * @module services/users
 * @requires {@link external:uuid/v4}
 * @requires {@link external:jsonwebtoken}
 * @requires config/api
 * @requires models/users
 * @requires models/errors
 */

const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('../config/api');
const User = require('../models/users');
const { ApiError, UnauthorizedAccessError } = require('../models/errors');

const service = {};

/**
 * Generates an access token with user infos
 * @function generateAccessToken
 * @private
 * @param   {Object} user - user informations
 * @returns {string} JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign({
    login: user.login,
    roles: user.roles,
  }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
}

/**
 * Checks logins informations for user to connect
 * @method login
 * @param   {Object} infos - connection infos (login, password)
 * @returns {Promise<Object>} access and refresh tokens
 */
service.login = infos => new Promise((resolve, reject) => {
  User.findOne({ login: infos.login })
    .then((user) => {
      if (!user) reject(new UnauthorizedAccessError('BAD_LOGIN', 'Bad login'));
      else {
        user.comparePassword(infos.password)
          .then((match) => {
            if (!match) reject(new UnauthorizedAccessError('BAD_PASSWORD', 'Bad password'));
            else {
              User.findOneAndUpdate({ _id: user._id }, { refreshToken: uuidv4() })
                .then(u => resolve({
                  refreshToken: u.refreshToken,
                  accessToken: generateAccessToken(user),
                }));
            }
          });
      }
    });
});

/**
 * Refreshes user access token after validating refresh token
 * @method refreshToken
 * @param   {string} accessToken   - JWT token
 * @param   {string} refreshToken  - user refresh token
 * @returns {Promise<Object>} new access token
 */
service.refreshToken = (user, refreshToken) => new Promise((resolve, reject) => {
  if (refreshToken) {
    User.findOne({ login: user.login })
      .then((u) => {
        if (u) {
          if (refreshToken === u.refreshToken) resolve({ accessToken: generateAccessToken(u) });
          else reject(new UnauthorizedAccessError('REFRESH_NOT_ALLOWED', 'Refresh token has been revoked'));
        } else reject(new ApiError('USER_NOT_FOUND', 'No user found for login in JWT Token'));
      });
  } else reject(new UnauthorizedAccessError('MISSING_REFRESH_TOKEN', 'Refresh token\'s missing'));
});

module.exports = service;
