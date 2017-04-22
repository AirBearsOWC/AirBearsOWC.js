'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')

const httpServer = express()
const baseServer = http.createServer(httpServer)

const DB = require('./db/_connection')

baseServer
	.listen('3000', () => {
		console.log(Date().toLocaleString())
		console.log('Running on port 3000')
	})

httpServer
	.use('/', express.static('./public'))
	.use(bodyParser.json())
	.use(cookieParser())

httpServer
	.get('/', (req, res) => {
		res.sendFile(__dirname + '/public/src.html')
	})

const API = express.Router()
httpServer.use('/api', API)
API.route = function(name){
	const router = express.Router()
	API[name] = router
	API.use('/' + name, router)
	return router
}
API
	.post(	'/Token', echo)
	.post(	'/payment-token', echo)
API
	.route('accounts')
		.post(	'/pilot-registration', echo)
		.post(	'/prepaid-pilot-registration', echo)
		.post(	'/authority-registration', echo)
		.post(	'/forgot-password', echo)
		.post(	'/reset-password', echo)
API
	.route('authority-users')
		.get(	'/', echo)
		.get(	'/:id', echo)
		.put(	'/:id/approve', echo)
API
	.route('messages')
		.post(	'/', echo)
API
	.route('pilots')
		.get(	'/', echo)
		.get(	'/:id', echo)
		.put(	'/:id/tee-shirt-mailed', echo)
		.post(	'/search', echo)
		.get(	'/me', echo)
API
	.route('posts')
		.get(	'/', echo)
		.get(	'/:id', echo)
		.get(	'/:slug', echo)
		.post(	'/', echo)
		.put(	'/', echo)
API
	.route('resources')
		.get(	'states', echo)
		.get(	'tee-shirt-sizes', echo)
		.get(	'payloads', echo)
		.get(	'flight-times', echo)
API
	.route('me')
		.get(	'/', echo)
		.get(	'/invite-users', echo)
		.post(	'/password', echo)
API
	.route('users')
		.get(	'/:id', echo)

function echo(req, res){
	res.json({
		success: true,
		headers: req.headers
	})
}
