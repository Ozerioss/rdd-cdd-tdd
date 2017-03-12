#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

/**  
	* Store in cli an object which is a string array that is the help
	* It is shown in the terminal using the flag --help
	* It shows us how to use the application and also what are the default arguments
  **/
const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

/** Method allowing us to convert from Fahrenheit to Celcius **/
function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

/** 
	* It will asynchronously check with npm in the background for available updates, then persist the result. 
	* The next time the notifier is initiated, the result will be loaded into the .update property
	* @pkg json package file
**/
updateNotifier({ pkg}).notify();


/**   
	* Create the weather method which takes the users input as argument
	* And displays in the terminal the weather
	* and converts the output to celcius if needed
    **/
weather(cli.input, (err, result) => {
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

	let condition = result.query.results.channel.item.condition.text;
	let temperature;

	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}
// We check if the value is defined, else we use the default one
	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';

// Logs all the relevant items for our query
	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
