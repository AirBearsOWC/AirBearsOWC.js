'use strict';

const db = require('./_connection')
const User = db.models.user

User.bulkCreate(require('./sample/users')).then(() => {
	process.exit()
})
