/*
 * Export entire file
 */

module.exports = function(server){

var io = require('socket.io')(server);


var SOCKET_LIST = {};


io.on('connection', function(socket) {

  socket.id = newId();
  SOCKET_LIST[socket.id] = socket;
  console.log('Socket connected | New soccet: ' + socket.id);

  // Say hi to the socket
  socket.emit('welcome', {msg: 'Hi and welcome!'});


  socket.on('disconnect', function() {
    console.log('Socket disconnected | Socket: ' + socket.id);
    delete SOCKET_LIST[socket.id];
  });

});

var newId = function() {
  var r = Math.round(Math.random() * 100000000);
  while ( typeof(SOCKET_LIST[r]) == 'object' ) {
      var r = Math.round(Math.random() * 100000000);
  }
  return r;
}

} // ### END EXPORT
