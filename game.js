/*
 * Game Class
 * Holds all the game data and functions to run the game
 */

var game = {

  players: {},
  newPlayer: function(id) {
    var p = {
      spd: 0,
      turnRate: 30,
      acceleration: 50,
      deceleration: .5,
      translation: 3,
      controls: {
        fwd: false,
        bak: false,
        left: false,
        right: false,
        tanslations: {
          fwd: false,
          bak: false,
          left: false,
          right: false
        }
      },
      pos: {
        x: Math.round( Math.random() * 800 ),
        y: Math.round( Math.random() * 800 )
      },
      vector: {
        angle: game.round( Math.random() * 360, 2 ),
        v: {x: 0, y: 0},
        update: function(){
          // Update turning
          this.v.x = game.round( Math.cos( game.toRads( this.angle ) ), 15);
          this.v.y = game.round( Math.sin( game.toRads( this.angle ) ), 15);
        }
      },
      update: function(delta) {
        // update turning
        if(this.controls.left != this.controls.right) { // Both false no movement | Both true cancel's each other out
          this.vector.angle += (this.controls.left ? -this.turnRate : this.turnRate) * delta;
          this.vector.update();
        }
        // update speed
        if(this.controls.fwd != this.controls.bak) {
          this.pos.x += this.controls.fwd ? (this.vector.v.x * this.acceleration * delta) : -(this.vector.v.x * this.acceleration * delta);
          this.pos.y += this.controls.fwd ? (this.vector.v.y * this.acceleration * delta) : -(this.vector.v.y * this.acceleration * delta);
        }
      }
    };
    this.players[id] = p;
  },
  toRads: function(a) { // Get radians from an angle
    return a * (Math.PI / 180);
  },
  round: function(x, d) { // Round x to d desimals
    return Math.round(x * (10 * d)) / (10 * d);
  },
  update: function(delta) {
    for(var p in this.players) {
      this.players[p].update(delta);
    }
  },
  remove: function(id) {
    delete this.players[id];
  }
};




module.exports = game;
