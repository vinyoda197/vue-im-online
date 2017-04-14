var express = require('express')
var app = express()
var cors = require('cors')
var Socket = require('./socket')

app.use(express.static('public'))
app.use(cors())

var http = require('http').Server(app)
var io = require('socket.io')(http)

var clients = new Map();

io.on('connection', function(socket){
	var 
		uid = socket.handshake.query.uid,
		pid = socket.handshake.query.pid,
		nick = socket.handshake.query.nick,
		usocket = null,
		psocket = null
	;

	// update or create this client
	if (clients.has(uid)) {
		clients.get(uid).setSocket(socket)
	} else {
		clients.set(uid, new Socket(uid, nick, socket))
	}
	usocket = clients.get(uid)

	// get or create partner client
	if (!clients.has(pid)) {
		clients.set(pid, new Socket(pid, null, null))
	}
	psocket = clients.get(pid)

	// watch each other
	psocket.addViewer(usocket.sid(), usocket)
	usocket.addViewer(psocket.sid(), psocket)

	psocket.notifyViewers('user-online', {id: psocket.sid(), status: psocket.status()})
	usocket.notifyViewers('user-online', {id: usocket.sid(), status: usocket.status()})
	
	socket.on('disconnect', function(){
		usocket.destroyThis()	
	})

	socket.on('message', function(message) {
		socket.emit('message', message)
		psocket.socket_().emit('message', {pid: uid, message: message.message, nick: message.nick})
	})

});


http.listen(3001, function(){
  console.log('listening on *:3001');
});