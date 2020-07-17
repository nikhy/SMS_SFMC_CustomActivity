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
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};
	var steps = [
		{ 'key': 'eventdefinitionkey', 'label': 'Event Definition Key' }
	];
	var currentStep = steps[0].key;

	$(window).ready(function () {
		connection.trigger('ready');
		connection.trigger('requestInteraction');
	});

	function initialize(data) {
		if (data) {
			payload = data;
			var configInputs = JSON.parse(payload.arguments.execute.inArguments[0].inputs);
			$('#cusGrpId').val(configInputs.customerGroupID);
			$('#programType option[value="'+configInputs.programType+'"]').prop('selected', true)
			$('#programId').val(configInputs.programID);
			$('#ajustmentAmount').val(configInputs.ajustmentAmount);
		}
		console.dir(payload);
	}

	function onClickedNext() {
		save();
		connection.trigger('nextStep');
		connection.trigger('updateActivity', payload);
	}

	function onClickedBack() {
		connection.trigger('prevStep');
	}
	function requestedInteractionHandler(settings) {
		try {
			console.log(JSON.stringify(settings));
		} catch (e) {
			console.error(e);
		}
	}

	function save() {
		console.log('called updateActivity');
		var configInputs = JSON.parse(payload.arguments.execute.inArguments[0].inputs);
		configInputs.customerGroupID = $('#cusGrpId').val();
		configInputs.programType = $('#programType').children("option:selected").val();
		configInputs.programID = $('#programId').val();
		configInputs.ajustmentAmount = $('#ajustmentAmount').val();
		payload.arguments.execute.inArguments[0].inputs = JSON.stringify(configInputs);
		payload['metaData'].isConfigured = true;
		console.dir(payload);
	}
	
	connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('requestedInteraction', requestedInteractionHandler);
});
