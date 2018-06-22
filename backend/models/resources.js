/**
 * @fileoverview Resource class
 * @module models/resource
 * @requires {@link external:kind-of}
 * @requires {@link external:express}
 * @requires helpers/logger
 * @requires helpers/security
 */

const kindOf = require('kind-of');
const express = require('express');
const logger = require('../helpers/logger');
const { requiresLogin, requiresRole } = require('../helpers/security');

/**
 * Creates a resource get endpoint function
 * @function get
 * @private
 * @param {Object} docuement - Resource document
 * @returns a function handling call of document find method
 */
const get = document => (req, res, next) => {
  document.find()
    .then(list => res.status(200).json({ list: document.listFilterProperties(list) }))
    .catch(err => next(err));
};

/**
 * Creates a resource getOne endpoint function
 * @function getOne
 * @private
 * @param {Object} docuement - Resource document
 * @returns a function handling call of document findOne method
 */
const getOne = document => (req, res, next) => {
  document.findOne({ _id: req.params.id })
    .then(element => res.status(200).json(document.filterProperties(element)))
    .catch(err => next(err));
};

/**
 * Add a configured endpoint to the given router
 * @function addRoute
 * @private
 * @param {string} name       - Resource name
 * @param {Object} config     - Enpoint configuration
 * @param {string} method     - Endpoint http method
 * @param {Object} router     - Express router
 * @param {string} route      - Endpoint route
 * @param {function} callback - Endpoint function
 */
const addRoute = (name, config, method, router, route, callback) => {
  if (config) {
    if (config.protected === true) {
      if (config.roles) {
        if (kindOf(config.roles) === 'array') {
          router[method](route, requiresLogin, requiresRole(config.roles), callback);
        } else throw new TypeError(`Resource config route role must an string[] instead got '${kindOf(config.roles)}'`);
      } else router[method](route, requiresLogin, callback);
    }
  } else router[method](route, callback);
  logger.info(`Resource '${name}': '${method.toUpperCase()} ${route}' route ${config.protected ? 'protected' : ''} ${config.roles ? `with roles[${config.roles}]` : ''} created`);
};

/**
 * Creates a new Resource
 * @class
 * @name Resource
 * @param {string} name     - Resource name
 * @param {Object} document - Resource associated document
 * @param {Object} [config] - Resource configuration
 */
class Resource {
  constructor(name, document, config) {
    if (!name) throw new TypeError('No Resource name found');
    if (kindOf(name) !== 'string') throw new TypeError('Resource name must be string');

    /**
     * Resource name
     * @member {string}
     */
    this.name = name;

    if (!document) throw new TypeError('No document associated to the new Resource');
    if (kindOf(document) !== 'function') throw new TypeError('Resource document must be a function');

    /**
     * Resource document
     * @member {function}
     */
    this.document = document;

    /**
     * Resource config
     * @member {Object}
     * @default {}
     */
    this.config = config || {};

    /**
     * Resource router
     * @member {Object}
     */
    this.router = express.Router();

    /** Add of possible routes based on service methods */
    addRoute(this.name, this.config.global ? this.config.global : this.config.get, 'get', this.router, '/', get(this.document));
    addRoute(this.name, this.config.global ? this.config.global : this.config.getOne, 'get', this.router, '/:id', getOne(this.document));

    logger.info(`Resource '${this.name}': created`);
  }
}

module.exports = Resource;
