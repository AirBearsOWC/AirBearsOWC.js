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
