const express = require('express');
const async = require('async');
const fs = require('fs');
const { fork } = require('child_process');
const app = express();
const port = 3000;

const conf = Object.freeze({port: 7003});
let lastTransfer = [];
let i = []

const parentProcess = fork('child.js');
parentProcess.on('message', (msg) => {
	console.log('message from child', msg);
});

parentProcess.send({
	data: new Date(),
	newCounter: true,
	key: 'cbw1',
});
app.post('/', (req, res) => {
	console.log(req)
});
app.get('/', (req, res) => {
	parentProcess.send({
		data: new Date(),
		newCounter: false,
		key: 'cbw1',
	});
	res.status(200).send()
})

app.listen(port, () => {
	console.log(`listening on port ${port}`);
})

