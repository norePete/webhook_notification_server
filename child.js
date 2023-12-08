require('dotenv').config()
const fetch = require('node-fetch');
let API_PUBLIC = process.env.API_PUBLIC
let API_PRIVATE = process.env.API_PRIVATE
let SENDER_EMAIL = process.env.SENDER_EMAIL
let SENDER_NAME = process.env.SENDER_NAME
let RECEIVER_EMAIL = process.env.RECEIVER_EMAIL
let RECEIVER_NAME = process.env.RECEIVER_NAME

let global = {};
let wasSent = false;


process.on('message', (msg) => {
	if (msg['newCounter']) {
		let key = msg['key'];
		global[key] = new Date().getTime;
		console.log('starting transfer tracker', global);

		(async function() { 
			while (true) {
				await Promise.all([
					//() => { do something }, 
					new Promise((resolve) => {setTimeout(resolve, 500)}) 
				]);
				//check difference between date and currentTime
				let currentTime = new Date().getTime();
				let difference = currentTime - global[key];
				console.log('difference = ', difference);
				if (difference > 4000 && !wasSent) {
					console.log("alert created!! \nERROR: transfer time has been delayed\n")
					let user = `${API_PUBLIC}:${API_PRIVATE}`;
					let user_as_buff = new Buffer.from(user);
					let credentials = user_as_buff.toString('base64');
					const body = {
					      "FromEmail": SENDER_EMAIL,
					      "FromName": SENDER_NAME,
					      "Recipients":[
						{
						  "Email": RECEIVER_EMAIL,
						  "Name": RECEIVER_NAME,
						}
					      ],
					      "Subject":"CBW 2 delay",
					      "Text-part":"Hi, just letting you know CBW3 has been delayed",
					      "Html-part":"<h3>WARNING!! EVEN SHORT DELAYS TO PRODUCTION CAN GREATLY DECREASE PRODUCTIVITY</h3><br />Please address this as soon as possible",
					};
					console.log(body)
				//	const response = await fetch('https://api.mailjet.com/v3/send', {
				//		method: 'post',
				//		body: JSON.stringify(body),
				//		headers: {
				//			'Content-Type': 'application/json',
				//			'Authorization': 'Basic ' + credentials,
				//		}
				//	});
				//	const data = await response;
				//	console.log(data);
					wasSent = true;
				}
			}
		})() 
	} else {
		let key = msg['key'];
		let date_as_string = msg['data'];
		global[key] = new Date(date_as_string).getTime();
		wasSent = false;
		console.log('new global', global);
	}

});
