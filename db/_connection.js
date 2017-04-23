'use strict';

const ENV = require('../environment')
const Sequelize = require('sequelize')
const db = new Sequelize((process.env.DATABASE_URL || 'airbears'), null, null, {
	dialect: 'postgresql',
	protocol: 'postgres'
})
db.Sequelize = Sequelize
module.exports = db

require('./user')
require('./drone')
const User = db.models.user
const Drone = db.models.drone
User.hasMany(Drone, {as: 'Drones'})
Drone.belongsTo(User)
