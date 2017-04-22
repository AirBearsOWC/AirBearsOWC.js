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
API.route = function(name){
	const router = express.Router()
	API[name.replace('/', '')] = router
	API.use(name, router)
	return router
}
API.RESTful = function(name){
	const router = API.route(name)
	router
		.get(	'/', echo)
		.get(	'/:id', echo)
		.post(	'/', echo)
		.put(	'/:id', echo)
		.delete('/:id', echo)
	return router
}

httpServer.use('/api', API)
API
	.route('/sessions')
		.get(	'/', echo)
		.post(	'/', echo)
		.delete('/', echo)
API
	.RESTful('/users')
API
	.RESTful('/orgs')
API
	.RESTful('/drones')
API
	.RESTful('/missions')

function echo(req, res){
	res.json({
		success: true,
		headers: req.headers
	})
}
