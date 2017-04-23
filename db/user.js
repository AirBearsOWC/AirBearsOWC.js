'use strict';

const db = require('./_connection')
const $ = db.Sequelize

module.exports = db.define('user', {
	id: {
		type: $.INTEGER,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	firstName: 					{ type: $.STRING },
	lastName: 					{ type: $.STRING },
	email: 						{ type: $.STRING },
	password: 					{ type: $.STRING },
	country: 					{ type: $.STRING },
	isActive: 					{ type: $.BOOLEAN },
	phone: 						{ type: $.STRING },
	street1: 					{ type: $.STRING },
	street2: 					{ type: $.STRING },
	addressLine1:				{ type: $.STRING },
	addressLine2:				{ type: $.STRING },
	addressLine3:				{ type: $.STRING },
	addressLine4:				{ type: $.STRING },
	city:						{ type: $.STRING },
	state:						{ type: $.STRING },
	zip:						{ type: $.STRING },
	bio:						{ type: $.TEXT },
	adminNotes:					{ type: $.TEXT },
	teeShirtSize:				{ type: $.STRING },
	teeShirtMailedDate:			{ type: $.STRING },
	allowsPilotSearch:			{ type: $.BOOLEAN },
	role:						{ type: $.STRING },
	subscribesToUpdates:		{ type: $.BOOLEAN },
	hasInternationalAddress:	{ type: $.BOOLEAN }
})
