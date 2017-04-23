'use strict';

const db = require('./_connection')
const User = db.models.user
const Drone = db.models.drone

User.bulkCreate(require('./sample/users')).then(() => {
	return Drone.bulkCreate(require('./sample/drones'))
}).then(() => {
	process.exit()
})
