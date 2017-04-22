'use strict';

const db = require('./_connection')
const User = require('./user')

User.sync({force: true}).then(() => {
	User.bulkCreate(require('./sample/users')).then(() => {
		process.exit()
	})
})
