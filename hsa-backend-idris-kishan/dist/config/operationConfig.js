'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var config = {
	operationsAllowed: ['ADDED', 'REMOVED', 'UPDATED', 'PROMO_USED'],
	operations: {
		add: 'ADDED',
		remove: 'REMOVED',
		update: 'UPDATED',
		promo_used: 'PROMO_USED'
	}
};

exports.default = config;