'use strict';

const db = require('./_connection')
const User = require('./user')

User.sync({force: true}).then(() => {
	process.exit()
})
