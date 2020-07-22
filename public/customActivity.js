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
    }
    console.dir(settingsParam]);
  }

  function onClickedNext() {
    connection.trigger('requestInteraction');
  }

  function onClickedBack() {
    connection.trigger('prevStep');
  }
  function requestedInteractionHandler(config) {
    try {
      save();
    } catch (e) {
      console.error(e);
    }
  }

  function save() {
	let eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
    let configInputs = JSON.parse(
      settings.arguments.execute.inArguments[0].inputs
	);
	configInputs.phoneNumber  = '{{Event.' + eventDefinitionKey + '.PhoneNumber}}';
	configInputs.apikey = $('#apikey').val();
	settings.arguments.execute.inArguments[0].inputs = JSON.stringify(
		configInputs
	);  
    console.dir(settings);
	connection.trigger('updateActivity', settings);
    connection.trigger('nextStep');
  }

  connection.on('initActivity', initialize);
  connection.on('clickedNext', onClickedNext);
  connection.on('clickedBack', onClickedBack);
  connection.on('requestedInteraction', requestedInteractionHandler);
});
