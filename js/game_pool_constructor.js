// constructor function
var game_pool_constructor = function () {

    console.log('game_pool_constructor init');
    
    this.table = new game_pool_table();
    
    //TODO write a nice thing for automatically positioning the balls instead of this hardcoded crap?
    var X_offset = game_pool_table.LEN_X / 4;
    var X_offset_2 = 1.72; // this controls how tightly the balls are packed together on the x-axis
    

    this.balls = [
        new WhiteBall(),

        // First row
        new Ball(X_offset, Ball.RADIUS, 4 * Ball.RADIUS, 'ball_4'),
        new Ball(X_offset, Ball.RADIUS, 2 * Ball.RADIUS, 'ball_3'),
        new Ball(X_offset, Ball.RADIUS, 0, 'ball_14'),
        new Ball(X_offset, Ball.RADIUS, -2 * Ball.RADIUS, 'ball_2'),
        new Ball(X_offset, Ball.RADIUS, -4 * Ball.RADIUS, 'ball_15'),

        // 2nd row
        new Ball(X_offset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, 3 * Ball.RADIUS, 'ball_13'),
        new Ball(X_offset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, Ball.RADIUS, 'ball_5'),
        new Ball(X_offset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, -1 * Ball.RADIUS, 'ball_12'),
        new Ball(X_offset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, -3 * Ball.RADIUS, 'ball_7'),

        // 3rd row
        new Ball(X_offset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, 2 * Ball.RADIUS, 'ball_6'),
        new Ball(X_offset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, 0, 'ball_8'),
        new Ball(X_offset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, -2 * Ball.RADIUS, 'ball_9'),

        //4th row
        new Ball(X_offset - X_offset_2 * 3 * Ball.RADIUS, Ball.RADIUS, Ball.RADIUS, 'ball_10'),
        new Ball(X_offset - X_offset_2 * 3 * Ball.RADIUS, Ball.RADIUS, -1 * Ball.RADIUS, 'ball_11'),

        //5th row
        new Ball(X_offset - X_offset_2 * 4 * Ball.RADIUS, Ball.RADIUS, 0, 'ball_1')
    ];
}

game_pool_constructor.prototype.tick = function (dt) {
    for (var i in this.balls) {
        this.balls[i].tick(dt);
    }

};

/** Hit the ball with the given strength. This
 will make the ball move towards it's current "forward" direction, which
is determined by the camera position / angle */
game_pool_constructor.prototype.ballHit = function (strength) {
    console.log('ballhit init');
    if (this.balls[0].rigidBody.sleepState == CANNON.Body.SLEEPING) {
        this.balls[0].hitForward(strength);
    }
    
}; 