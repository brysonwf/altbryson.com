var ball_left = 0;
var ball_top = 0;
var ball = {};
var game_minigolf = function(){
    console.log('minigolf init');
    ball_left = $('#mgb_ball').css("left");
    ball_top = $('#mgb_ball').css("top");
    ball = {
        position: {x: parseInt(ball_left.substring(0, ball_left.length-2)), y: parseInt(ball_top.substring(0, ball_top.length-2))},
        velocity: {x: 0, y: 0},
        mass: 0.04593, //kg
        radius: 2.15, // 1px = 1cm
        restitution: -0.8
        };
    /*
    * Experiment with values of mass, radius, restitution,
    * gravity (ag), and density (rho)!
    * 
    * Changing the constants literally changes the environment
    * the ball is in. 
    * 
    * Some settings to try:
    * the moon: ag = 1.6
    * water: rho = 1000, mass 5
    * beach ball: mass 0.05, radius 30
    * lead ball: mass 10, restitution -0.05
    */
    var ballInMotion = false;
    var winner = false;
    var width = $('#mgb_map').width()-ball.radius-ball.radius;
    var height = $('#mgb_map').height()-ball.radius-ball.radius;
    var canvas = document.getElementById("ctx");
    var ctx = canvas.getContext("2d");
    var frameRate = 1/40; // Seconds
    var frameDelay = frameRate * 1000; // ms
    var loopTimer = false;

    var friction = 0.98;
    var Cd = 0.47;  // Dimensionless
    var rho = 1.22; // kg / m^3
    var A = Math.PI * ball.radius * ball.radius / (10000); // m^2
    var ag = 0;  // m / s^2
    var mouse = {x: 0, y: 0, isDown: false};
    var ax = 0;
    var ay = 0;
    var distance = 0;
    var power = 0;

    var updateDebug = function(){
        $('.mousex').html(Math.round(mouse.x));
        $('.mousey').html(Math.round(mouse.y));
        $('.ax').html(Math.round(ax));
        $('.ay').html(Math.round(ay));
        $('.ballx').html(Math.round(ball.position.x));
        $('.bally').html(Math.round(ball.position.y)); 
        $('#distance').html(Math.round(distance/2.54/12) + ' ft');
        $('#power').html(Math.round(power));
    }

    var getMousePosition = function (e) {
        mouse.x = e.pageX - $('#ctx').position().left - $('#mgb').position().left;
        mouse.y = e.pageY - $('#ctx').position().top - $('#mgb').position().top;

        if (mouse.x > 120){
            mouse.x = 120;
        }
        if (mouse.y > 120){
            mouse.y = 120;
        }

        ctx.clearRect(0,0,120,120);
        ctx.beginPath();
        ctx.moveTo(62.5, 62.5);
        ctx.strokeStyle = "#9ab396";
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.closePath();
        
        
        var oldX = 62.5;
        var oldY = 62.5;
        var newX = mouse.x;
        var newY = mouse.y;
        
        var a = Math.abs(oldX - newX);
        var b = Math.abs(oldY - newY);
        power = Math.sqrt((a*a) + (b*b));

        updateDebug();
    }
    var mouseDown = function(e) {
        mouse.isDown = true;
        //sets ball at mouse position
    }
    var mouseUp = function(e) {   
        if (!ballInMotion){
            distance = 0;
            mouse.isDown = false;
            ballInMotion = true;
            var ballvelocityx = (mouse.x-62.5) /-3;
            var ballvelocityy = (mouse.y-62.5) /-3;
            $('.velocityx').html(ballvelocityx);
            $('.velocityy').html(ballvelocityy);
            ball.velocity.x = ballvelocityx;
            ball.velocity.y = ballvelocityy;
        }
    }
    var touchmove = function(e){
        e.preventDefault();
        getMousePosition(e.changedTouches[0]);
    }
    var touchstart = function(e){
        e.preventDefault();
        mouseDown(e.changedTouches[0]);
        getMousePosition(e.changedTouches[0]);
    }
    var touchend = function(e){
        e.preventDefault();
        mouseUp(e.changedTouches[0]);
    }

    var setup = function() {
        
        canvas.onmousemove = getMousePosition;
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        canvas.addEventListener("touchstart", touchstart, false);
        canvas.addEventListener("touchmove", touchmove, false);
        canvas.addEventListener("touchend", touchend, false);
                
        loopTimer = setInterval(loop, frameDelay);
        $('#ctx').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        $('#distance').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        $('#power').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
        updateDebug();
    }
    var loop = function() {

        if (ballInMotion && !winner) {

            // Drag force: Fd = -1/2 * Cd * A * rho * v * v
            var Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
            var Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);
            
            Fx = (isNaN(Fx) ? 0 : Fx);
            Fy = (isNaN(Fy) ? 0 : Fy);
            
            // Calculate acceleration ( F = ma )
            ax = (Fx) / ball.mass;
            ay = ag + ((Fy) / ball.mass);

            // Integrate to get velocity
            ball.velocity.x += (ax*frameRate);
            if (Math.abs(ball.velocity.x) > .007){
                ball.velocity.x = ball.velocity.x*friction;
            }else{
                ball.velocity.x = 0;
            }
            ball.velocity.y += (ay*frameRate);
            if (Math.abs(ball.velocity.y) > .007){
                ball.velocity.y = ball.velocity.y*friction;
            }else{
                ball.velocity.y = 0;
            }

            var oldBallX = ball.position.x;
            var oldBallY = ball.position.y;

            // Integrate to get position
            ball.position.x += ball.velocity.x*frameRate*100;
            ball.position.y += ball.velocity.y*frameRate*100;
            
            var newBallX = ball.position.x;
            var newBallY = ball.position.y;

            var a = Math.abs(oldBallX - newBallX);
            var b = Math.abs(oldBallY - newBallY);
            var addDistance = Math.sqrt((a*a) + (b*b));
            distance += addDistance;
            
            // Handle collisions
            if (ball.position.y < ball.radius) {
                ball.velocity.y *= ball.restitution;
                ball.position.y = ball.radius;
            }
            if (ball.position.y > height - ball.radius) {
                ball.velocity.y *= ball.restitution;
                ball.position.y = height - ball.radius;
            }
            if (ball.position.x > width - ball.radius) {
                ball.velocity.x *= ball.restitution;
                ball.position.x = width - ball.radius;
            }
            if (ball.position.x < ball.radius) {
                ball.velocity.x *= ball.restitution;
                ball.position.x = ball.radius;
            }


            //todo: add test to make sure ball is moving slow enough to actually go into the hole
            if (is_colliding($('#mgb_ball'), $('#mgb_hole'))){
                    winner = true;
                    ball.velocity.x = 0;
                    ball.velocity.y = 0;
            }
            else 
            if (is_colliding($('#mgb_ball'), $('#mgb_barrier'))){
                
            }
            else 
            if (ball.velocity.x == 0 && ball.velocity.y == 0){
                ballInMotion = false;
                $('#ctx').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
                $('#distance').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
                $('#power').css('left', $('#mgb_ball').css("left")).css('top', $('#mgb_ball').css("top"));
            }
        
            

            // Draw the ball
            $('#mgb_ball').css('left', ball.position.x).css('top', ball.position.y);

            // ctx.translate(ball.position.x, ball.position.y);
            // ctx.beginPath();
            // ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true);
            // ctx.fill();
            // ctx.closePath();
            
            // ctx.restore();
            updateDebug();
        }
    }

    setup();
}