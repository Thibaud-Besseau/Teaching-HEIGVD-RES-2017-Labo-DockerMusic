// Uses dram to work with UDP diagram
var dgram = require('dgram');

// Load protocols
var protocol = require('./protocol');

// Use RFC4122 UUIDS
var uuid = require('uuid');

// Create a datagram socket
var socket = dgram.createSocket('udp4');

// Save all instruments in a map
var instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

function Musician(instrument) {
    
    this.instrument = instrument;
    this.sound = instruments.get(instrument);
	this.uuid = uuid.v4();
    this.activeSince = new Date().toISOString();

    Musician.prototype.update = function () {
        var payload = JSON.stringify(this);

		//send a diagram to the multicast address
        message = new Buffer(payload);
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function (err, bytes) {
                console.log("Sending payload: " + payload + " via port " + socket.address().port);
            }
        );
    };

    // Sends a sound every seconds
    setInterval(this.update.bind(this), 1000);
}

// Defines the instrument and the corresponding sound
var map = {
    "piano": "ti-ta-ti",
    "trumpet": "pouet",
    "flute": "trulu",
    "violin": "gzi-gzi",
    "drum": "boum-boum"
};

if (process.argv.length !== 3) {
    throw new Error("You need to provide the instrument's name");
}

// Take the instruments argument
var instrument = process.argv[2];

if (instruments.has(instrument)) {
    // Add new musicians
    new Musician(instrument);
} else {
    throw new Error("You need to provide an existing instrument name");
}