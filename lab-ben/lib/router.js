'use strict';

const parseJson = require('./parse-json');
const parseUrl = require('./parse-url');
const debug = require('debug')('http:router');

const Router = module.exports = function() {
  debug('#Router');
  this.routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

//new GET route
Router.prototype.get = function(endpoint, callback) {
  debug('#GET');
  this.routes.GET[endpoint] = callback;
};

//new POST route
Router.prototype.post = function(endpoint, callback) {
  debug('#POST');
  this.routes.POST[endpoint] = callback;
};

//new PUT route
Router.prototype.put = function(endpoint, callback) {
  debug('#PUT');
  this.routes.PUT[endpoint] = callback;
};

//new DELETE route
Router.prototype.delete = function(endpoint, callback) {
  debug('#delete');
  this.routes.DELETE[endpoint] = callback;
};

Router.prototype.route = function() {
  debug('#route');

  return (req, res) => {
    Promise.all([
      parseUrl(req),
      parseJson(req),
    ])
    .then(() => {
      if(typeof this.routes[req.method][req.url.pathname] === 'function') {
        this.routes[req.method][req.url.pathname](req, res);
        return;
      }

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('route not found');
      res.end();
    })
    .catch(err => {
      console.error(err, 'route error');
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('bad request');
      res.end();
    });
  };
};
