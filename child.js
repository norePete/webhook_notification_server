require('dotenv').config()
const fetch = require('node-fetch');
let API_PUBLIC = process.env.API_PUBLIC
let API_PRIVATE = process.env.API_PRIVATE
let SENDER_EMAIL = process.env.SENDER_EMAIL
let SENDER_NAME = process.env.SENDER_NAME
let RECEIVER_EMAIL = process.env.RECEIVER_EMAIL
let RECEIVER_NAME = process.env.RECEIVER_NAME

//const client = require('twilio')(accountSid, authToken);
//const mainAccountCalls = client.api.v2010.account.calls.list; // SID not specified, so defaults to accountSid

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
					console.log("alert created!!! \ntransfer time has been delayed\n")
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
					      "Subject":"Your email flight plan!",
					      "Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",
					      "Html-part":"<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!",
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
