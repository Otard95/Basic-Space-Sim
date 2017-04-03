/*
 * Game Class
 * Holds all the game data and functions to run the game
 */

var game = {

  players: {},
  newPlayer: function(id) {
    var p = {
      mass: 190000, // kg
      spd: 0, // m/s | m = px
      force: 19000000, // newtons of force
      deceleration: .5, // percent of force(desimal)
      translation: 5700000, // newtons of force (force * .3)
      turn: {
        lag: 0,     // Current lag behind the target angle
        maxLag: 360, // The maximum amount of lag the ship can have
        target: 0,  // The target angle of the ship
        rate: 60    // Targets rate of turn each second
      },
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
        angle: 0,
        v: {x: 0, y: 0},
        vel: {x: 0, y: 0},
        update: function(){
          // Update turning
          this.v.x = game.round( Math.cos( game.toRads( this.angle ) ), 15);
          this.v.y = game.round( Math.sin( game.toRads( this.angle ) ), 15);
        }
      },
      update: function(delta) {
        // update turning
        if( this.controls.left != this.controls.right ) { // Both false no movement | Both true cancel's each other out
          // Update target angle
          this.controls.right ? this.turn.target += this.turn.rate * delta : this.turn.target -= this.turn.rate * delta;
          if (this.turn.target < 0) this.turn.target = 360 + this.turn.target;
          this.turn.target = game.round(this.turn.target, 2);
        }
        if ( game.inDeadzone(this.vector.angle, this.turn.target, 3.5) ) {
          // Update turn rate
          this.turn.lag = this.turn.target - this.vector.angle;
          if (this.turn.lag > 180) this.turn.lag = -(360 - this.turn.lag);
          // update angle
          this.vector.angle += (this.turn.lag / this.turn.maxLag) * (Math.abs(this.turn.rate));
          if (this.vector.angle < 0) this.vector.angle = 360 - this.vector.angle;
          this.vector.angle = game.round(this.vector.angle, 2);

          this.vector.update();
        }
        // update speed
        if(this.controls.fwd != this.controls.bak) {
          this.vector.vel.y += this.controls.fwd ? this.vector.v.y * (this.force / this.mass) * delta :
                               -(this.vector.v.y * (this.force / this.mass) * delta) * this.deceleration;
          this.vector.vel.x += this.controls.fwd ? this.vector.v.x * (this.force / this.mass) * delta :
                               -(this.vector.v.x * (this.force / this.mass) * delta) * this.deceleration;
          this.spd = Math.sqrt( Math.pow(this.vector.vel.x, 2) + Math.pow(this.vector.vel.y, 2) );
        }
        if(game.inDeadzone(this.spd, 0, .2)) {
          this.pos.x += this.vector.vel.x * delta;
          this.pos.y += this.vector.vel.y * delta;
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
  },
  cap: function(x, cap) {
    return x >= cap ? cap : x <= -cap ? -cap : x;
  },
  inDeadzone: function(x, y, dz) {
    if( Math.abs(x - y) > dz ) return true;
    return false;
  }
};

module.exports = game;
