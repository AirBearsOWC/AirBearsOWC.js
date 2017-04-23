'use strict';

const db = require('./_connection')
const User = db.models.user
const Drone = db.models.drone

// MySQL
// db.query('SET FOREIGN_KEY_CHECKS = 0').then(() => {
// 	return User.sync({force: true})
// }).then(() => {
// 	return Drone.sync({force: true})
// }).then(() => {
// 	process.exit()
// })

User.sync({force: true}).then(() => {
	return Drone.sync({force: true})
}).then(() => {
	process.exit()
})
