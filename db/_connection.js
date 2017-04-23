'use strict';

const Sequelize = require('sequelize')
const db = new Sequelize('airbears', 'AIRBEARS_USERNAME', 'AIRBEARS_PASSWORD', {
	dialect: 'mysql'
})
db.Sequelize = Sequelize
module.exports = db

require('./user')
require('./drone')
const User = db.models.user
const Drone = db.models.drone
User.hasMany(Drone, {as: 'Drones'})
Drone.belongsTo(User)
