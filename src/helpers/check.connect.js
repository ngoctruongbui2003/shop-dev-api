'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count connect
const countConnect = () => {
	const numConnections = mongoose.connections.length
	console.log(`Number of connections::${numConnections}`)
}

// check overload connect
const checkOverloadConnect = () => {
	setInterval(() => {
		const numConnections = mongoose.connections.length
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss

		// Example maximum number of connections based on number of cores
		const maxConnections = numCores * 5

		console.log(`Active connections: ${numConnections}`)
		console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

		if (numConnections > maxConnections) {
			console.log(`Connection overload detected!`);
			//notify.send(...)
		}
	}, _SECONDS); // Montitor every 5 seconds
}

module.exports = {
	countConnect,
	checkOverloadConnect
}