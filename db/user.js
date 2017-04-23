'use strict';

const db = require('./_connection')
module.exports = db.define('user', {
	id: {
		type: db.$.INTEGER,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	firstname: {	type: db.$.STRING, allowNull: false },
	lastname: {		type: db.$.STRING, allowNull: false },
	email: {		type: db.$.STRING, allowNull: false, unique: true},
	password: {		type: db.$.STRING, allowNull: false },
	country: {		type: db.$.STRING, allowNull: false },
	role: {			type: db.$.STRING, allowNull: false },
	is_active: {	type: db.$.BOOLEAN, allowNull: false },
	phone: {		type: db.$.STRING },
	address: {		type: db.$.STRING },
	address2: {		type: db.$.STRING },
	city: {			type: db.$.STRING },
	state: {		type: db.$.STRING },
	organization: {	type: db.$.STRING },
	title: {		type: db.$.STRING },
	dob: {			type: db.$.STRING },
	zip: {			type: db.$.STRING },
	admin_notes: {	type: db.$.TEXT }
})
