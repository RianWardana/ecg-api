"use strict";

////////////////////////// require dependency yang dibutuhkan ////////////////////////////
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const firebaseAdmin = require("firebase-admin");


///////////////////////////////////// setup database /////////////////////////////////////
const serviceAccount = require('./hart-ecg.json');

firebaseAdmin.initializeApp({
  	credential: firebaseAdmin.credential.cert(serviceAccount),
  	databaseURL: "https://hart-ecg.firebaseio.com"
});

var database = firebaseAdmin.database();
var ecgRef = database.ref('ecg');
var bpmRef = database.ref('bpm');


/////////////////////////////////// setup webserver /////////////////////////////////////
const app = express();
const port = 7070;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.listen(port, () => { console.log(`Listening on port ${port}.`) });


////////////////////////////////////// promises ///////////////////////////////////////
var checkBody = function() {
	return new Promise((resolve, reject) => {
		for (var arg in arguments) {
			if (typeof arguments[arg] == 'undefined') reject('NO_BODY');
		}
		resolve('OK');
	});
}


/////////////////////////////////// handle request /////////////////////////////////////
app.post('/ecg/signals', (req, res) => {
	var {signals} = req.body;
	checkBody(signals).then(() => {
		var signalsArray = JSON.parse(signals);
		// console.log(signalsArray);
		ecgRef.child(Math.floor((new Date).getTime()/1000)).set(signalsArray);
		// signalsArray.forEach(signal => {
		// 	console.log(signal);
		// });
		res.send('OK');
	}).catch(msg => res.send(msg));
});

app.post('/ecg/bpm', (req, res) => {
	var {bpm} = req.body;
	checkBody(bpm).then(() => {
		bpmRef.child(Math.floor((new Date).getTime()/1000)).set(bpm);
		res.send('OK');
	}).catch(msg => res.send(msg));
});