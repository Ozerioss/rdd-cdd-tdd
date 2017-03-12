'use strict';

const YQL = require('yql');
const _ = require('lodash');

/** 
	@opts is the input of the user 
	@query the query sent to webservice
**/
module.exports = (opts, callback) => {
	opts = opts || [];
	let query;

/** This defines the default query **/
	if (_.isEmpty(opts)) {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Dhaka, Bangladesh")');
	} 
/** Here we parse the input of the user to make the correct request **/
	else {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + opts[0] + ', ' + opts[1] + '")');
	}

/** Execution of the query **/
	query.exec((err, response) => {
		if (err) {
			return callback(err);
		}

		callback(null, response);
	});
};
