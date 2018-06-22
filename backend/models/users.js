/* eslint no-param-reassign: 0 */
/**
 * @fileoverview User class module
 * @module models/users
 * @requires {@link external:camo}
 * @requires {@link external:kind-of}
 * @requires {@link external:bcrypt}
 * @requires config/app
 */

const { Document } = require('camo');
const kindOf = require('kind-of');
const bcrypt = require('bcrypt');
const config = require('../config/app');

/**
 * Creates a User
 * @class
 * @extends external:camo.Document
 * @name User
 */
class User extends Document {
  constructor() {
    super();

    /**
     * User login
     * @member {string}
     */
    this.login = {
      type: String,
      unique: true,
      required: true,
    };

    /**
     * User password
     * @member {string}
     */
    this.password = {
      type: String,
      required: true,
    };

    /**
     * User roles
     * @member {string[]}
     */
    this.roles = {
      type: [String],
      required: true,
      default: ['USER'],
    };

    /**
     * User refresh token
     * @member {string}
     * @default ''
     */
    this.refreshToken = {
      type: String,
      default: '',
    };
  }

  /**
   * Compares a candidate password with user password
   * @method comparePassword
   * @param  {string}           candidatePassword - Candidate password
   * @return {Promise<boolean>} true if candidate password match, false if not
   */
  comparePassword(candidatePassword) {
    return new Promise((resolve) => {
      bcrypt.compare(candidatePassword, this.password)
        .then(match => resolve(match));
    });
  }

  /**
   * Pre save hook, encrypts user password before persist
   * @method preSave
   * @private
   */
  preSave() {
    this.password = bcrypt.hashSync(this.password, config.app.saltFactor);
  }

  static filterProperties(user) {
    if (user instanceof User) throw new TypeError('user must be an instance of User');

    delete user._id;
    delete user.password;
    delete user.refreshToken;
  }

  static listFilterProperties(list) {
    const type = kindOf(list);
    if (type !== 'array') throw new TypeError(`list must be a User[] but got '${type}'`);
    list.forEach(user => User.filterProperties(user));
    return list;
  }
}

module.exports = User;
