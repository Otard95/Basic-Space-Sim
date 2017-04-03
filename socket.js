/*
 * Export entire file
 */

module.exports = function(server){

/*
 * Initilize socket.io
 */

var io = require('socket.io')(server);

var SOCKET_LIST = {};

/*
 * Initilize game class
 */

var game = require('./game.js');

io.on('connection', function(socket) {

  // Create socket id and save
  socket.id = newId();
  SOCKET_LIST[socket.id] = socket;
  console.log('Socket connected | New soccet: ' + socket.id);
  // Create player and update
  game.newPlayer(socket.id);
  game.update();

  // Initilize Client
  socket.emit('init', {
    objects: null,
    players: game.players,
    id: socket.id
  });

  // input
  socket.on('input', function(data) {
    switch( data.key ){
      case 65:
        game.players[socket.id].controls.left = data.value; // Turn Left
        break;
      case 68:
        game.players[socket.id].controls.right = data.value; // Turn Right
        break;
      case 87:
        game.players[socket.id].controls.fwd = data.value; // Forward
        break;
      case 83:
        game.players[socket.id].controls.bak = data.value; // Backwards
        break;
      default:
        //console.log('Invalid key');
    }
  })

  // disconnect client
  socket.on('disconnect', function() {
    console.log('Socket disconnected | Socket: ' + socket.id);
    delete SOCKET_LIST[socket.id];
    game.remove(socket.id);
    io.emit('playerLeave', {id: socket.id});
  });

});

var newId = function() {
  var r = Math.round(Math.random() * 100000000);
  while ( typeof(SOCKET_LIST[r]) == 'object' ) {
    var r = Math.round(Math.random() * 100000000);
  }
  return r;
}

/*
 * Game Clock
 */

var time  = {
  last: +new Date(),
  delta: function() { // Returns the time in seconds since last frame
    r = ((+new Date()) - this.last) / 1000;
    this.last = +new Date();
    return r;
  }
}

var gameClock = setInterval(function() {
  game.update(time.delta());
  var playerInfo = cloneObject(game.players);
  for (var p in playerInfo) {
    delete playerInfo[p].controls;
    delete playerInfo[p].update;
    delete playerInfo[p].vector.v;
    delete playerInfo[p].vector.update;
    delete playerInfo[p].turn;
    delete playerInfo[p].mass;
    delete playerInfo[p].spd;
    delete playerInfo[p].force;
    delete playerInfo[p].deceleration;
    delete playerInfo[p].translation;
  }
  io.emit('update', {
    objects: null,
    players: playerInfo
  });
}, 1000/30);



// recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}


} // ### END EXPORT
