'use strict';

const db = require('./_connection')
const $ = db.Sequelize

module.exports = db.define('drone', {
	id: {
		type: $.INTEGER,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	make:					{ type: $.STRING, allowNull: false },
	model:					{ type: $.STRING, allowNull: false },
	maxFlightTime:			{ type: $.INTEGER },
	nightVisionCapable:		{ type: $.BOOLEAN },
	thermalVisionCapable:	{ type: $.BOOLEAN }
})
