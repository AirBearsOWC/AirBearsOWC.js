'use strict';

const db = require('./_connection')
const User = db.models.user

User.sync({force: true}).then(() => {
	process.exit()
})
