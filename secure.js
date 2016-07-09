var https = require('https');
var fs = require('fs');

var serialport = require("serialport"),
    SerialPort = serialport.SerialPort;



//Serial Port to use.
var port = '/dev/tty.usbmodem1411';

// open the port
var serialPort = new SerialPort(port, {
    baudrate: 115200
});

// hook up open event
serialPort.on("open", function () {
    // port is open
    console.log('port ' + port + ' opened');
    // hook up data listener to echo out data as its received
    serialPort.on('data', function(data) {
        console.log('data received: ' + data);
    });
});

/*
Certificates for securely serving the app. SSL is a requirement for Echo services.
*/
var options = {
  ca: fs.readFileSync('certificates/fullchain.pem'),
  key: fs.readFileSync('certificates/rsaprivkey.pem'),
  cert: fs.readFileSync('certificates/cert.pem')
};

// A realtively generic response from Alexa. Oberon is my perferred skill keyword. You can use whatever.
var alexaResponse = {
  		"version": "0.1",
  		"sessionAttributes": {},
  		"response": {
		    "outputSpeech": {
		      "type": "PlainText",
		    },
		    "card": {
		      "type": "Simple",
		      "title": "Oberon",
		      "content": "Oberon will fulfill your command."
		    },
		    "reprompt": {
		      "outputSpeech": {
		        "type": "PlainText",
		        "text": "No!"
		      }
		    },
		"shouldEndSession": true
		}
	}

//An Arbitrary color map. Should be checked against W3C standard colors.
var colorMap = {
	"blue" : [0,0,255],
	"red" : [255,0,0],
	"green" : [0,255,0],
	"yellow" : [255, 255, 51],
	"orange" : [255,102,102],
	"purple" : [127,0,255],
	"white" : [255,255,255],
	"pink" : [255,153,255]
}


function intentColorHandler(color){
	console.log("setting the color to "+color);
	sendColorInfo(colorMap[color][0],colorMap[color][1],colorMap[color][2]);
	return true;
}

//This is just a simple helper function to ease updating the response object.
function changeAlexaResponse(currentResponse,newPhrase){
	currentResponse.response.outputSpeech.text = newPhrase;
	return currentResponse;
}

/*
handleResponse

Handles incoming requests and sends a response back to Amazon to be used for the Echo.
*/
function handleResponse(req,res){
	var result;

	if(req.method == "POST"){
		body ="";
		req.on('data', function (chunk) {
	    	body += chunk.toString();
	  	});

	  	req.on('end', function () {
	    	var jsonObj = JSON.parse(body);

	    	if(jsonObj.request.type == "IntentRequest"){

				var setColor = intentColorHandler(jsonObj.request.intent.slots.color.value);
  				if(setColor){
  					changeAlexaResponse(alexaResponse,"Oberon has updated your color to "+jsonObj.request.intent.slots.color.value);
  					console.log("updating response");

  				}else{
  					changeAlexaResponse(alexaResponse,"DID NOT WORK!");
  				}
	    	}else{
	    		console.log("nothing more than that");
	    	}

			res.writeHead(200);
		  	res.end(JSON.stringify(alexaResponse));
	  	});
	}
}


var a = https.createServer(options, handleResponse).listen(443);

/*
sendColorInfo(int red, int green, int blue)

Outputs serial data to the Arduino.
*/
function sendColorInfo(red,green,blue){
	if(serialPort.isOpen()){
		var LEDS = [];

	    // here's an array of LED color values, 3 bytes per LED, assuming 50 LEDs in the strand.
	    for(var c = 0; c < 50; c++){
	        LEDS.push(red);
	        LEDS.push(green);
	        LEDS.push(blue);
	    }

	    // create a Buffer object to hold the data
	    var buffer = new Buffer(LEDS);
	    // write it on the port
	    serialPort.write(buffer, function(err, results) {
	        if (err) {
	            console.log('err ' + err);
	        }
	        console.log('wrote bytes : ' + results);
	    });
	}
}
