
// Load npm module to work with UDP
var dgram = require('dgram');

// Load protocol specifications
var protocol = require('./protocol');

// Load npm module to work with TCP
var net = require('net');

//create UDP socket
var s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function () {
    console.log("Connecting to the multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// List of musicians
var musicians = [];

// This call back is invoked when a new datagram has arrived.
s.on('message', function (msg, source) {
    console.log("New Datas have arrived: " + msg +
        ". Source IP: " + source.address +
        ". Source port: " + source.port);

    var musician = JSON.parse(msg);
    var musicianIsAlreadyInTheList = false;


    musicians.forEach(function (currentMusician) {
        if (currentMusician.uuid === musician.uuid) {
            currentMusician.lastUpdate = new Date();
            musicianIsAlreadyInTheList = true;
        }
    });

    //add the missing musicians in the list
    if (musicianIsAlreadyInTheList === false) {
        musician.lastUpdate = new Date();
        musicians.push(musician);
    }
});


function checkMusicians() {
    musicians = musicians.filter(function (musician) {
        var diffTime = new Date().getTime() - musician.lastUpdate.getTime();
        return diffTime <= 5000;
    });
}


var tcpServer = net.createServer(function (socket) {
    // Delete the musicians that didn't play for more than 10 seconds
    checkMusicians();

    // Writes the musicians array to the socket
    socket.write(JSON.stringify(musicians.map(function (musician) {
            return {
                "uuid": musician.uuid,
                "instrument": musician.instrument,
                "activeSince": musician.activeSince
            };
        }))
        + "\r\n"
    );

    socket.pipe(socket);
    socket.end();
});

// The server listens on the port 2205 for incoming TCP connections
tcpServer.listen(2205, '0.0.0.0');