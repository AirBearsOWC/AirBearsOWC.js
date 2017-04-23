'use strict';

const Sequelize = require('sequelize')
const db = new Sequelize('airbears', 'AIRBEARS_USERNAME', 'AIRBEARS_PASSWORD', {
	dialect: 'mysql'
})
db.$ = Sequelize
module.exports = db

require('./user')
