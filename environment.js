'use strict';

try{
	module.exports = require('./env.json')
}catch(e){
	module.exports = process.env
}
