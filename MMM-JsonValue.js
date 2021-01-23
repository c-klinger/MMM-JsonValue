/* Magic Mirror
 * Module: MMM-JsonValue
 *
 * By Chris Klinger, http://chrisklinger.de
 * MIT Licensed.
 */

Module.register("MMM-JsonValue", {
	defaults: {
		apiBase: 'https://api.quotable.io/random',	
		method: "GET",

		title: "MM API TEST",
		icon: "fa-quote-right",
		prefix: "Quote: \"",
		suffix: "\" (from https://api.quotable.io/random)",
		jsonPath: "content",

		refreshInterval: 1000 * 60, // refresh every minute
	},

	getStyles: function () {
	  return ["font-awesome.css"];
	},

	start: function () {
		this.loaded = false;
		this.value = "";
		this.config.instanceID = this.identifier
		this.sendSocketNotification('CONFIG', this.config);
	},

	processValue: function (data) {

		var obj = data;
		Log.info(obj);
		var p = this.config.jsonPath.split('.');
  		for (var i = 0, len = p.length; i < len - 1; i++) {
	    	obj = obj[p[i]];
  		}

	  	this.value =  obj[p[len - 1]];
		this.updateDom();
	},

	getHeader: function () {
		return this.config.title ? this.config.title : "";
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

	  	wrapper.innerHTML = this.config.prefix + this.value + this.config.suffix;
	  	if(this.config.icon) {
	  		wrapper.innerHTML = "<span class=\"" + this.config.icon + "\"></span>" + wrapper.innerHTML;
	  	}

		if(this.config.skipPadding) {
			wrapper.style = "margin-block-end: -30px;";
		}
		return wrapper;
	},

	notificationReceived: function() {},

 	socketNotificationReceived: function(notification, payload) {
		if(payload.instanceID === this.config.instanceID) {
    		if (notification === "STARTED") {
				this.updateDom();
			}
			else if (notification === "DATA") {
				this.loaded = true;
				Log.info(payload);
				this.processValue(JSON.parse(payload.body));
    		}
    	}
	} 	
})
