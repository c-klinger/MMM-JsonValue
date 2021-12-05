'use strict';

/* Magic Mirror
 * Module: MMM-JsonValue
 *
 * By Chris Klinger, http://chrisklinger.de
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const fetch = require("node-fetch");
const jp = require('jsonpath');

module.exports = NodeHelper.create({

	start: function() {
		this.subscribers = {};
	},

	getData: function(instanceID) {
		//console.log("getData("+  instanceID + ")");
		var self = this;
		var requester = self.subscribers[instanceID]
		self.doCall(requester.config.apiBase, requester.config.method, function(response) {
			self.sendSocketNotification("DATA", {instanceID: instanceID, data: self.parseData(response, requester.config.jsonPath)});
		})

		setTimeout(function() { self.getData(instanceID); }, requester.config.refreshInterval);
	},

	parseData: function(data, jsonPath) {
		return jp.query(data, "$." + jsonPath);
	},

	doCall: function(urlToCall, httpMethod, callback) {
		var fetchOptions = { method: httpMethod };
		fetch(urlToCall)
		    .then(res => res.json())
		    .then(json => callback(json))
		    .catch(error => console.log(error));
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		var instanceID = payload.instanceID;
		//console.log(instanceID);
		//console.log(self.subscribers);
		if (notification === 'CONFIG' && !(instanceID in self.subscribers)) {
			self.subscribers[instanceID] = {};
			self.subscribers[instanceID].config = payload;
			self.sendSocketNotification("STARTED", {instanceID: instanceID, started: true});
			self.getData(instanceID);
			self.subscribers[instanceID].started = true;
		}
	}
});
