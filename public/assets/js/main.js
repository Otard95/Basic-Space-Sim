var socket = io();

socket.on('welcome', function(data) {
  console.log(data);
});
