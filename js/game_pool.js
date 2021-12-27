
// Globals
var renderer, scene, camera, poolgame, controls, keyboard, lightsConfig, world, gui, eightballgame;
var ballPositionArray = {};
var debug = false; // if true then collision wireframes are drawn

var textureLoader = null;

var progressBar;

var moveCount = 0;
var playerUid = [];

var game_pool = function(gameDoc){

    console.log('game_pool init');

    
    if (playerUid[1] == null){
        playerUid[1] = gameDoc.data().playerOne;
    }
    if (playerUid[2] == null){
        playerUid[2] = gameDoc.data().playerTwo;
    }


    function createPhysicsWorld () {
        console.log('createPhysicsWorld init');
        w = new CANNON.World();
        w.gravity.set(0, 30 * -9.82, 0); // m/s²

        w.solver.iterations = 10;
        w.solver.tolerance = 0; // Force solver to use all iterations

        // Allow sleeping
        w.allowSleep = true;

        w.fixedTimeStep = 1.0 / 60.0; // seconds

        return w;
    }

    /** Here the interaction when two materials touch is defined. E.g. how much a ball
        loses energy when hitting a wall.
        !TODO figure out whether the definition of Contactmaterials should be defined in
        some other place. For example, perhaps each ball object should define it's contactmaterial
        with the walls itself?
    */
    function setCollisionBehaviour() {
        world.defaultContactMaterial.friction = 0.1;
        world.defaultContactMaterial.restitution = 0.85;

        var ball_floor = new CANNON.ContactMaterial(
            Ball.contactMaterial,
            game_pool_table.floorContactMaterial,
            {friction: 0.7, restitution: 0.1}
        );

        var ball_wall = new CANNON.ContactMaterial(
            Ball.contactMaterial,
            game_pool_table.wallContactMaterial,
            {friction: 0.5, restitution: 0.9}
        );

        world.addContactMaterial(ball_floor);
        world.addContactMaterial(ball_wall);
    }

    function draw() {
        stats.begin();
        
        // Controls
        controls.target.copy(poolgame.balls[0].mesh.position);
        controls.update();

        // Physics world
        world.step(w.fixedTimeStep);

        // THREE objects
        var dt = clock.getDelta();
        poolgame.tick(dt);

        stats.end();
        requestAnimationFrame(draw);
        renderer.render(scene, camera); // We render our scene with our camera
    }

    // Adds an ambient light and two spotlights above the table
    function addLights() {
        var light = new THREE.AmbientLight(0x0d0d0d); // soft white ambient light
        scene.add(light);
        var tableLight1 = new TableLight( game_pool_table.LEN_X / 4, 150, 0);
        var tableLight2 = new TableLight(-game_pool_table.LEN_X / 4, 150, 0);
    }
    
    var WIDTH  = 360,
    HEIGHT = 480;

    var stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    textureLoader = new THREE.TextureLoader();
    
    THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {

        console.log('DefaultLoadingManager.onProgress init ' + item + ' : ' + loaded + ' : ' + total);

        if (typeof progressBar !== 'undefined') {
            progressBar.style.width = (loaded / total * 100) + '%';
        }

        if (loaded == total && total > 7) {

            console.log('drawing pooltable');

            // hide progress bar
            var progBarDiv = document.getElementById('loading');
            progBarDiv.parentNode.removeChild(progBarDiv);

            gui.show(document.getElementById('mainMenu'));

            // attach the render-supplied DOM element
            var canvasContainer = document.getElementById('canvas');
            canvasContainer.appendChild(renderer.domElement);
            draw();

            
            database_setGameUser();
            database_setGameInfo();
            database_loadGameUsers();
            
            //initial render
            db.collection("games/"+gameId+"/moves")
            .orderBy("createDate", "asc")
            .onSnapshot(function(querySnapshot) {
                console.log('game_pool loading moves');

                var moveCount = 0;
                lastPlayerUid = '';
                
                database_setGameActive();

                var jsonBallData = {};

                querySnapshot.forEach(function(doc) {
                    console.log('game_pool loading moves on snapshot');

                    playerArray[moveCount] = doc.data().uid;
                    lastPlayerUid = doc.data().uid;

                    jsonBallData[0] = JSON.parse(doc.data().whiteball);
                    jsonBallData[1] = JSON.parse(doc.data().ball_1);
                    jsonBallData[2] = JSON.parse(doc.data().ball_2);
                    jsonBallData[3] = JSON.parse(doc.data().ball_3);
                    jsonBallData[4] = JSON.parse(doc.data().ball_4);
                    jsonBallData[5] = JSON.parse(doc.data().ball_5);
                    jsonBallData[6] = JSON.parse(doc.data().ball_6);
                    jsonBallData[7] = JSON.parse(doc.data().ball_7);
                    jsonBallData[8] = JSON.parse(doc.data().ball_8);
                    jsonBallData[9] = JSON.parse(doc.data().ball_9);
                    jsonBallData[10] = JSON.parse(doc.data().ball_10);
                    jsonBallData[11] = JSON.parse(doc.data().ball_11);
                    jsonBallData[12] = JSON.parse(doc.data().ball_12);
                    jsonBallData[13] = JSON.parse(doc.data().ball_13);
                    jsonBallData[14] = JSON.parse(doc.data().ball_14);
                    jsonBallData[15] = JSON.parse(doc.data().ball_15);

                    moveCount++;
                });

                if (moveCount > 0){                    
                    poolgame.balls[0].rigidBody.position.set(jsonBallData[0].x, jsonBallData[0].y, jsonBallData[0].z);
                    poolgame.balls[1].rigidBody.position.set(jsonBallData[4].x, jsonBallData[4].y, jsonBallData[4].z);
                    poolgame.balls[2].rigidBody.position.set(jsonBallData[3].x, jsonBallData[3].y, jsonBallData[3].z);
                    poolgame.balls[3].rigidBody.position.set(jsonBallData[14].x, jsonBallData[14].y, jsonBallData[14].z);
                    poolgame.balls[4].rigidBody.position.set(jsonBallData[2].x, jsonBallData[2].y, jsonBallData[2].z);
                    poolgame.balls[5].rigidBody.position.set(jsonBallData[15].x, jsonBallData[15].y, jsonBallData[15].z);
                    poolgame.balls[6].rigidBody.position.set(jsonBallData[13].x, jsonBallData[13].y, jsonBallData[13].z);
                    poolgame.balls[7].rigidBody.position.set(jsonBallData[5].x, jsonBallData[5].y, jsonBallData[5].z);
                    poolgame.balls[8].rigidBody.position.set(jsonBallData[12].x, jsonBallData[12].y, jsonBallData[12].z);
                    poolgame.balls[9].rigidBody.position.set(jsonBallData[7].x, jsonBallData[7].y, jsonBallData[7].z);
                    poolgame.balls[10].rigidBody.position.set(jsonBallData[6].x, jsonBallData[6].y, jsonBallData[6].z);
                    poolgame.balls[11].rigidBody.position.set(jsonBallData[8].x, jsonBallData[8].y, jsonBallData[8].z);
                    poolgame.balls[12].rigidBody.position.set(jsonBallData[9].x, jsonBallData[9].y, jsonBallData[9].z);
                    poolgame.balls[13].rigidBody.position.set(jsonBallData[10].x, jsonBallData[10].y, jsonBallData[10].z);
                    poolgame.balls[14].rigidBody.position.set(jsonBallData[11].x, jsonBallData[11].y, jsonBallData[11].z);
                    poolgame.balls[15].rigidBody.position.set(jsonBallData[1].x, jsonBallData[1].y, jsonBallData[1].z);
                }
                
                console.log('lastPlayerUid: ' + lastPlayerUid);
            });

        }
    };

    // Set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT     = WIDTH / HEIGHT,
        NEAR       = 1,
        FAR        = 1000;

    // We use the clock to measure time, an extension for the keyboard
    var clock = new THREE.Clock();

    gui = new GameGui();

    progressBar = document.getElementById('prog-bar');

    // create a WebGL renderer, camera
    // and a scene
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.up = new THREE.Vector3(0,1,0);

    scene = new THREE.Scene();
    scene.add(camera);

    // create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

    // Setup our cannon.js world for physics
    world = createPhysicsWorld();

    // Populate meshes and physics bodies:
    poolgame = new game_pool_constructor();

    // Define how different objects interect physics-wise:
    setCollisionBehaviour();
    
    // Configure lighting:
    addLights();

    // MOUSE controls
    controls = new THREE.OrbitControls(camera,renderer.domElement);

    controls.enableZoom = true;
    controls.enablePan = true;

    controls.minDistance = 35;
    controls.maxDistance = 165;
    // Don't let the camera go below the ground
    controls.maxPolarAngle = 0.49 * Math.PI;

    camera.position.set(-170, 70, 0);

    // make the background void a grey color instead of black.
    renderer.setClearColor(0x262626, 1);

}