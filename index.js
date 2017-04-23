'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')

const httpServer = express()
const baseServer = http.createServer(httpServer)

const DB = require('./db/_connection')

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

httpServer
	.get('/', (req, res) => {
		res.sendFile(__dirname + '/public/src.html')
	})
	.post('/api/accounts/pilot-registration', echo)
	.post('/api/accounts/prepaid-pilot-registration', echo)
	.post('/api/accounts/authority-registration', echo)
	.post('/api/accounts/forgot-password', echo)
	.post('/api/accounts/reset-password', echo)
	.get('/api/authority-users/:id', echo)
	.get('/api/authority-users', echo)
	.put('/api/authority-users/:id/approve', echo)
	.post('/api/messages', echo)
	.get('/api/pilots/:id', echo)
	.get('/api/pilots', echo)
	.post('/api/pilots/search', mockPilotSearchService)
	.put('/api/pilots/:id/tee-shirt-mailed', echo)
	.put('/api/pilots/me', echo)
	.delete('/api/posts/:id', echo)
	.get('/api/posts/:id', echo)
	.get('/api/posts/:slug', echo)
	.get('/api/posts', echo)
	.post('/api/posts', echo)
	.put('/api/posts', echo)
	.get('/api/resources/states', echo)
	.get('/api/resources/tee-shirt-sizes', echo)
	.get('/api/resources/payloads', echo)
	.get('/api/resources/flight-times', echo)
	.post('/api/Token', echo)
	.post('/api/payment-token', echo)
	.get('/api/me/invite-users', echo)
	.get('/api/me', mockAuth)
	.post('/api/me/password', echo)
	.get('/api/users/:id', echo)

function echo(req, res){
	res.json({
		success: true,
		headers: req.headers
	})
}

function mockAuth(req, res) {
	res.json({
        roles: ['Admin', 'Authority']
	})
}

function mockPilotSearchService(req, res) {
	res.json(pilot_search_data)
}