'use strict';

const db = require('./_connection')
const User = require('./user')

User.bulkCreate(require('./sample/users')).then(() => {
	process.exit()
})
