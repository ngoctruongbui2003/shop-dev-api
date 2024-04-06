'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://localhost:27017/shopDEV`

class Database {
	constructor() {
		this.connect()
	}

	// connect
	connect(type = "mongodb") {
		if (1 === 1) {
			mongoose.set('debug', true)
			mongoose.set('debug', { color: true })
		}

		mongoose.connect(connectString)
						.then(_ => console.log(`Connect Mongodb Success`))
						.catch(err => console.log(`Err connect: ${err}`))
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database()
		}

		return Database.instance
	}
}

const instanceMongoDb = Database.getInstance()

module.exports = instanceMongoDb