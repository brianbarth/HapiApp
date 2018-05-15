'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');
const styles = require('./styles.json');
const dataFile = require('./data.json');

const server = Hapi.server({
  port: 4000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'static')
    }
  },
  debug: { request: '*' }
});

const viewOptions = {layout: 'layout'};
const start = async () => {

  await server.register(Inert);
  await server.register(Vision);

  server.views({
    engines: {
      handlebars: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates',
    layoutPath: 'templates/layout',
    helpersPath: 'templates/helpers'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      const data = { now: new Date().toString(), firstName: 'Bill', lastName: 'Bankes' };
      return h.view('index', data, viewOptions)
    }
  });

  server.route({
    method: 'GET',
    path: '/page2.html',
    handler: function (request, h) {
      const data = { now: new Date().toString(), firstName: 'Mary', lastName: 'James' };
      return h.view('page2', styles, viewOptions)
    }
  });

  server.route({
    method: 'GET',
    path: '/page3.html',
    handler: function (request, h) {
      const data = { fullName: 'Mary James' };
      return h.view('page3', data, viewOptions)
    }
  });

  server.route({
    method: 'GET',
    path: '/page4.html',
    handler: function (request, h) {
      return h.view('page4', dataFile, viewOptions)
    }
  });

  server.route({
    method: 'GET',
    path: '/page5.html',
    handler: function (request, h) {
      return h.view('page5', { firstName: null, lastName: null, vehicle: null, attire: null }, viewOptions)
    }
  });

  server.route({
    method: 'POST',
    path: '/page5.html',
    handler: function (request, h) {
      const {firstName, lastName, vehicle, attire} = request.payload;
      let badFirstName, badLastName, badVehicle;
      let attireTrue = true;
      if(!firstName || firstName.length === 0){
        badFirstName = 'bad';
      }

      if(!lastName || lastName.length === 0){
        badLastName = 'bad';
      }

      if(!vehicle || vehicle.length === 0){
        badVehicle = 'bad';
      }

      if(!attire) {
        attireTrue = false;
      }

      if(badFirstName || badLastName || badVehicle){
        return h.view('page5', { badFirstName, badLastName, badVehicle, firstName, lastName, vehicle, attire }, viewOptions)
      }

      return h.view('page5success', { firstName, lastName, vehicle, attire, attireTrue }, viewOptions)
      
    }
  });

  server.route({
    method: 'GET',
    path: '/page6.html',
    handler: function (request, reply) {
      return reply.view('page6', styles, viewOptions)
    }
  });

  server.route({
    method: 'POST',
    path: '/page6.html',
    handler: function(request, h) {

      const {story} = request.payload;

      return h.view('page6success', {story}, viewOptions);
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.'
      }
    }
  });

  await server.start();

  console.log('Server started listening on %s', server.info.uri);

};

start();
