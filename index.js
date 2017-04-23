'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
const session = require('express-session')
const sessionFileStore = require('session-file-store')
const bcrypt = require('bcrypt')

const httpServer = express()
const baseServer = http.createServer(httpServer)

const db = require('./db/_connection')
const User = db.models.user
const Drone = db.models.drone

const ENV = require('./env.json')

const checkIf = {
	isLoggedIn: function(req, res, next){
		if(req.session && req.session.user && req.session.user.id){
			next()
		}else{
			req.session.destroy()
			res.json({success: false, error: 'You must be logged in to do that'})
		}
	},
	isAdmin: function(req, res, next){
		if(req.session && req.session.user && (req.session.user.role == "admin")){
			next()
		}else{
			res.json({success: false, error: 'You don\'t have access to do that'})
		}
	},
	isCurrentUser: function(req, res, next){
		if(req.session && req.session.user && (req.params.id == req.session.user.id)){
			next()
		}else{
			res.json({success: false, error: 'That isn\'t you'})
		}
	}
}

baseServer
	.listen('3000', () => {
		console.log(Date().toLocaleString())
		console.log('Running on port 3000')
	})

httpServer
	.use('/', express.static('./public'))
	.use(bodyParser.json())
	.use(cookieParser())
	.use(session({
		store: new (sessionFileStore(session)),
		secret: ENV.SECRET,
		resave: false,
		saveUninitialized: false
	}))

const API = express.Router()
API.route = function(name){
	const router = express.Router()
	API[name.replace('/', '')] = router
	API.use(name, router)
	return router
}

httpServer.use('/api', API)
API
	.route('/sessions')
		.get(	'/', checkIf.isLoggedIn, (req, res) => {
			res.json({success: true, user: req.session.user})
		})
		.post(	'/', (req, res) => {
			User.findOne({where: {email: (req.body.user || {}).email}}).then((user) => {
				if(user){
					bcrypt.compare(req.body.user.password, user.password).then((success) => {
						if(success){
							req.session.user = {
								email: user.email,
								id: user.id,
								role: user.role
							}
							res.json({ success: true })
						}else{
							failure()
						}
					})
				}else{
					failure()
				}
			})
			function failure(){
				req.session.destroy()
				res.json({ success: false })
			}
		})
		.delete('/', checkIf.isLoggedIn, (req, res) => {
			req.session.destroy()
			res.json({ success: true })
		})
API
	.route('/users')
		.get(	'/', checkIf.isAdmin, (req, res) => {
			User.findAll({where: req.query}).then((users) => {
				res.json({success: true, users})
			})
		})
		.get(	'/:id', (req, res) => {
			User.findById(req.params.id).then((user) => {
				if(user){
					res.json({success: true, user})
				}else{
					res.json({success: false})
				}
			})
		})
		.post(	'/', (req, res) => {
			bcrypt.hash(req.body.user.password, 10).then((hash) => {
				req.body.user.password = hash
				User.create(req.body.user).then((user) => {
					res.json({success: true, user})
				}).catch((error) => {
					res.json({success: false, error: error.message})
				})
			})
		})
		.put(	'/:id', checkIf.isLoggedIn, (req, res) => {
			User.findById(req.params.id).then((existingUser) => {
				existingUser.update(req.body.user).then((newUser) => {
					res.json({success: true, user: newUser})
				}).catch((error) => {
					res.json({success: false, error: error.message})
				})
			})
		})
		.delete('/:id', checkIf.isCurrentUser, (req, res) => {
			User.destroy({where: {id: req.params.id}}).then((user) => {
				res.json({ success: !!user })
			})
		})
API
	.route('/pilots')
		.get('/', (req, res) => {
			let query = req.query
			query.role = "pilot"
			User.findAll({where: query}).then((users) => {
				res.json({success: true, users})
			})
		})

API
	.route('/drones')
		.get('/', (req, res) => {
			Drone.findAll({where: req.query}).then((drones) => {
				res.json({success: true, drones})
			})
		})
		.get('/user/:id', (req, res) => {
			User.findById(req.params.id).then((user) => {
				return user.getDrones()
			}).then((drones) => {
				res.json({success: true, drones})
			})
		})
		.post('/user/:id', checkIf.isCurrentUser, (req, res) => {
			User.findById(req.params.id).then((user) => {
				return user.createDrone(req.body.drone)
			}).then((drone) => {
				res.json({success: true, drone})
			}).catch((error) => {
				res.json({success: false, error: error.message})
			})
		})
		.delete('/:id', (req, res) => {
			Drone.findById(req.params.id).then((drone) => {
				if(drone && drone.userId == req.session.user.id){
					drone.destroy().then((success) => {
						res.json({success: !!success})
					})
				}else{
					res.json({success: false})
				}
			})
		})
