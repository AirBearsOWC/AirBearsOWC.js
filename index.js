'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
const session = require('express-session')
const sessionFileStore = require('session-file-store')

const httpServer = express()
const baseServer = http.createServer(httpServer)

const db = require('./db/_connection')
const User = db.models.user

const pilot_search_data = require('./mock_data/pilot_search.json');

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
		secret: 'ayy',
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
		.post(	'/', (req, res) => {
			User.findOne({where: {email: (req.body.user || {}).email}}).then((user) => {
				if(user && req.body.password == user.password){
					req.session.user = { email: user.email, id: user.id }
					res.json({ success: true, user })
				}else{
					req.session.destroy()
					res.json({ success: false })
				}
			})
		})
		.delete('/', (req, res) => {
			req.session.destroy()
			res.json({ success: true })
		})
API
	.route('/users')
		.get(	'/', (req, res) => {
			User.findAll().then((users) => {
				res.json({success: true, users})
			})
		})
		.get(	'/pilots', (req, res) => {
			User.findAll({where: {role: "pilot"}}).then((users) => {
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
			User.create(req.body.user).then((user) => {
				res.json({success: true, user})
			}).catch((error) => {
				res.json({success: false, error: error.message})
			})
		})
		.put(	'/:id', (req, res) => {
			User.findById(req.params.id).then((existingUser) => {
				existingUser.update(req.body.user).then((newUser) => {
					res.json({success: true, user: newUser})
				}).catch((error) => {
					res.json({success: false, error: error.message})
				})
			})
		})
		.delete('/:id', (req, res) => {
			User.destroy({where: {id: req.params.id}}).then((user) => {
				res.json({ success: true })
			})
		})

API
	.route('/token')
		.post('/', echo)
		.get('/',echo)
API
	.route('/me')
		.get('/', (req, res) => {
			res.json({
				roles: ['Admin', 'Authority']
			})
		})
API
	.route('/pilots')
		.post('/search', (req, res) => {
			res.json(pilot_search_data)
		})

function echo(req, res){
	res.json({
		success: true,
		headers: req.headers
	})
}
