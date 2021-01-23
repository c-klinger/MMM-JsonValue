'use strict';

/* Magic Mirror
 * Module: MMM-JsonValue
 *
 * By Chris Klinger, http://chrisklinger.de
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

	start: function() {
		this.subscribers = {};
	},

	getData: function(instanceID) {
		//console.log("getData("+  instanceID + ")");
		var self = this;
		var requester = self.subscribers[instanceID]
		self.doCall(requester.config.apiBase, requester.config.method, function(response) {
			self.sendSocketNotification("DATA", {instanceID: instanceID, body: response});
		})
		
		setTimeout(function() { self.getData(instanceID); }, requester.config.refreshInterval);
	},

	doCall: function(urlToCall, httpMethod, callback) {
		request({
			url: urlToCall,
			method: httpMethod,
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				callback(body);
			}
		});
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
