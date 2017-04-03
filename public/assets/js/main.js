/*
 * Socket.io Section
 */

var socket = io();

socket.on('init', function(data) {
  console.log('INIT');
  game.init(data);
});

socket.on('update', function(data) {
  game.update(data);
});

socket.on('playerLeave', function(data){
  game.elements[data.id].remove();
  delete game.elements[data.id];
  delete game.players[data.id];
});

/*
 * INIT
 */

var game = {
  scene: null,
  objects: null,
  players: null,
  me: null,
  elements: {},
  init: function(data) {
    this.scene.append('<player class="ship" id="' + data.id + '"></player>');
    this.me = { dom: $('#' + data.id), id: data.id };

    $(window).keydown(function(event){game.keyEvent(event)});
    $(window).keyup(function(event){game.keyEvent(event)});

    this.paint();
  },
  keyEvent: function(event) {
    switch (event.type) {
      case 'keydown':
        socket.emit('input', {key: event.which, value: true});
        break;
      case 'keyup':
        socket.emit('input', {key: event.which, value: false});
        break;
      default:
        console.log('unknown event type');
        // handle other key presses
    }
  },
  update: function(data) {
    this.players = data.players;
    this.paint();
  },
  paint: function() { // Updates the dom
    for (var p in this.players) {
      if(this.elements[p] == null && p != this.me.id) {
        this.scene.append('<player class="ship" id="' + p + '"></player>');
        this.elements[p] = $('#' + p);
        this.elements[p].css({
          'left': this.players[p].pos.x + 'px',
          'top': this.players[p].pos.y + 'px',
          'transform': 'rotate(' + this.players[p].vector.angle + 'deg)'
        });
      } else if(p != this.me.id) {
        this.elements[p].css({
          'left': this.players[p].pos.x + 'px',
          'top': this.players[p].pos.y + 'px',
          'transform': 'rotate(' + this.players[p].vector.angle + 'deg)'
        });
      } else if(p == this.me.id) { // Update Self
        this.me.dom.css({
          'left': this.players[p].pos.x + 'px',
          'top': this.players[p].pos.y + 'px',
          'transform': 'rotate(' + this.players[p].vector.angle + 'deg)'
        });
      } else {
        console.log('Unknown object');
      }
    } // END for
  } // END Paint()
};

$(document).ready(function() {
  game.scene = $('universe');
});
