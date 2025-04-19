const _ = require('lodash');

// All handler functions related to request params module

const requestParamsHandler = {};
const errorMessages = require('../config/errorMessages.json');

// Validate missing params in a request from client (iOS or Android)
requestParamsHandler.validate = (actual, target) => {
	sails.log.silly('Passing from the requestparams handler: validate function');

	if (!target) {
		return false;
	}
	// console.log('validate: Missing params: ', _.difference(target, actual));
	return target.every((element) => actual.includes(element));
};

requestParamsHandler.validatePartially = (actual, target) => {
	sails.log.silly('Passing from the requestparams handler: validatePartially function');

	if (!target) {
		return false;
	}
	// console.log('validatePartially: Missing params: ', _.difference(target, actual));
	return actual.every((element) => target.includes(element));
};
// validation function for promisess methods
requestParamsHandler.validateNew = (actual, target) => new Promise(((resolve, reject) => {
	// console.log('Passing from the requestparams handler: validateNew function');
	if (!target) {
		return reject(errorMessages.noParamsRequired);
	}

	if (target.every((element) => actual.includes(element))) {
		return resolve();
	}
	console.log('validateNew: Missing params: ', _.difference(target, actual));
	return reject(errorMessages.missingParams);
}));

// Validate missing params in a request from server internal functions
requestParamsHandler.validateInternal = (functionName = null, actual = null, target = null) => {
	// console.log('Passing from the requestparams handler: validateInternal function \nactual: ', actual, '\ntarget: ', target, '\n');
	return new Promise(((resolve, reject) => {
		if (!actual || (!!actual && actual.length < 1)) {
			return reject('Internal: The actual parameter (array of values) is missing.');
		}

		if (!target || (!!target && target.length < 1)) {
			return reject('Internal: The target parameter (array of values) is missing.');
		}

		if (target.every((element) => actual.includes(element))) {
			return resolve(true);
		}
		console.log('validateInternal: Missing params: ', _.difference(target, actual));
		return reject(`Internal: The parameter passed are not sufficient to process function: ${functionName || 'Name not passed.'}`);
	}));
};

module.exports = requestParamsHandler;
