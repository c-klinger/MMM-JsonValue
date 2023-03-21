# Magic Mirror Module: JSON Value

This extension module for the [Magic Mirror](https://github.com/MichMich/MagicMirror) allows you to show information from any JSON on your mirror using an HTTP Request to an REST API. The module supports multiple instances to e.g. display values from different sources.

## Screenshot
![json_values.png](https://github.com/c-klinger/MMM-JsonValue/raw/main/doc/json_values.png)

## Installation

- (1) Clone this repository in your `modules` folder, and install dependencies:
```bash
cd ~/MagicMirror/modules # adapt directory if you are using a different one
git clone https://github.com/c-klinger/MMM-JsonValue.git
cd MMM-JsonValue
npm install
```

- (2) Add the module to your `config/config.js` file. The default configuration displays a random quote using [quotable.io](http://quotable.io/).
```js
{
	module: "MMM-JsonValue",
	position: "top_left",
	config: {
		apiBase: 'https://api.quotable.io/random',
		method: "GET",

		title: "MM API TEST", // Widget Title, set to null if not needed
		icon: "fa-quote-right", // Font Awesome icon, displayed before any text, set to null if not needed
		prefix: "Quote: \"", // Text displayed before the value, can be a blank String ""
		suffix: "\" (from https://api.quotable.io/random)", // Text displayed after the value, can be a blank String ""
		jsonPath: "$.content", // value in the json to display, the module use https://github.com/dchester/jsonpath for parsing. Note: if $ is not the first character in your path, it will be added for backward-compatibility reason.

		refreshInterval: 1000 * 60, // refresh every minute
		//skipPadding: true, // yo can un-comment this line if you want to display a related value below; using a second instance.
	}
 },
```

## Additional Configuration

### Custom HTTP Headers
You can add custom HTTP Headers to the configuration of each widget, this might be useful for cache control or authentification:
```js
{
	module: "MMM-JsonValue",
	position: "top_left",
	config: {
		//...
		headers: {'Authorization': 'Bearer SecretToken'}
		//...
	}
 },
```

## Update

Update this module by navigating into its folder on the command line and using `git pull`:

```bash
cd ~/MagicMirror/modules/MMM-JsonValue # adapt directory if you are using a different one
git pull
npm install # install (new) dependencies
```
