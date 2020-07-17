/* ************************************************************
Author(s): Niikhythan 
Sprint: Sprint 1
Created On: 6/2020
Modified by: 
Modified on:
====================
Description: This js file contains the  module that interacts with the custom
	activity FE and Journey builder.
************************************************************ */

'use strict';

define(function (require) {
  let Postmonger = require('postmonger');
  let connection = new Postmonger.Session();
  $(window).ready(function () {
    connection.trigger('ready');
    connection.trigger('requestInteraction');
  });

  function initialize(config) {
    if (config) {
      let configInputs = JSON.parse(
        config.arguments.execute.inArguments[0].inputs
      );
      $('#apikey').val(configInputs.apikey);
    }
    console.dir(config);
  }

  function onClickedNext() {
    connection.trigger('requestInteraction');
  }

  function onClickedBack() {
    connection.trigger('prevStep');
  }
  function requestedInteractionHandler(config) {
    try {
      save(config);
    } catch (e) {
      console.error(e);
    }
  }

  function save(config) {
	let eventDefinitionKey = config.triggers[0].metaData.eventDefinitionKey;
    let configInputs = JSON.parse(
      config.arguments.execute.inArguments[0].inputs
	);
	configInputs.phoneNumber  = '{{Event.' + eventDefinitionKey + '.PhoneNumber}}';
	configInputs.apikey = $('#apikey').val();
	config.arguments.execute.inArguments[0].inputs = JSON.stringify(
		configInputs
	);  
    console.dir(config);
	connection.trigger('updateActivity', config);
    connection.trigger('nextStep');
  }

  connection.on('initActivity', initialize);
  connection.on('clickedNext', onClickedNext);
  connection.on('clickedBack', onClickedBack);
  connection.on('requestedInteraction', requestedInteractionHandler);
});
