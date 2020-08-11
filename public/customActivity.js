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
  let settings = {};
  let eventDefinitionKey;
  $(window).ready(function () {
    connection.trigger('ready');
    connection.trigger('requestInteraction');
  });

  function initialize(settingsParam) {
    settings = settingsParam;
    if (settingsParam) {
      let configInputs = JSON.parse(
        settingsParam.arguments.execute.inArguments[0].inputs
      );
      $('#apikey').val(configInputs.apikey);
      $('#message').val(configInputs.message);
    }
    connection.trigger('requestInteraction');
    console.dir(settingsParam);
  }

  function onClickedNext() {
    connection.trigger('requestInteraction');
    save();
  }

  function onClickedBack() {
    connection.trigger('prevStep');
  }
  function requestedInteractionHandler(config) {
    try {
	  eventDefinitionKey = config.triggers[0].metaData.eventDefinitionKey;
    } catch (e) {
      console.error(e);
    }
  }

  function save() {
    let configInputs = JSON.parse(
      settings.arguments.execute.inArguments[0].inputs
	);
	configInputs.phoneNumber  = '{{Event.' + eventDefinitionKey + '.PhoneNumber}}';
  configInputs.apikey = $('#apikey').val();
  configInputs.message = $('#message').val();
	settings.arguments.execute.inArguments[0].inputs = JSON.stringify(
		configInputs
  );  
	settings['metaData'].isConfigured = true;
    console.dir(settings);
	connection.trigger('updateActivity', settings);
    connection.trigger('nextStep');
  }

  connection.on('initActivity', initialize);
  connection.on('clickedNext', onClickedNext);
  connection.on('clickedBack', onClickedBack);
  connection.on('requestedInteraction', requestedInteractionHandler);
});
