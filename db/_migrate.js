'use strict';

const db = require('./_connection')
const User = db.models.user
const Drone = db.models.drone

User.sync({force: true}).then(() => {
	return Drone.sync({force: true})
}).then(() => {
	process.exit()
})
