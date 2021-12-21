var game_pool_table = function () {
  
  console.log('game_pool_table init');

  var mesh_x = -game_pool_table.LEN_X / 2;
  var mesh_y = 0;
  var mesh_z = game_pool_table.LEN_Z / 2;

  var loader = new THREE.JSONLoader();
  loader.load('https://altbryson.com/json/table/base.json', function (geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x000000),
      specular: 0x404040,
      shininess: 20,
      shading: THREE.SmoothShading
    }));

    mesh.position.x = mesh_x;
    mesh.position.y = mesh_y;
    mesh.position.z = mesh_z;
    mesh.scale.set(100, 100, 100);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });

  loader.load('https://altbryson.com/json/table/felt.json', function (geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: new THREE.Color(TABLE_COLORS.cloth),
      specular: 0x404040,
      shininess: 10,
      shading: THREE.SmoothShading
    }));

    mesh.position.x = mesh_x;
    mesh.position.y = mesh_y;
    mesh.position.z = mesh_z;
    mesh.scale.set(100, 100, 100);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });

  loader.load('https://altbryson.com/json/table/edges.json', function (geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x7a5230),
      specular: 0x404040,
      shininess: 100,
      shading: THREE.SmoothShading
    }));

    mesh.position.x = mesh_x;
    mesh.position.y = mesh_y;
    mesh.position.z = mesh_z;
    mesh.scale.set(100, 100, 100);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });

  loader.load('https://altbryson.com/json/table/pockets.json', function (geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x7a5230),
      specular: 0x3D3D3D,
      shininess: 20,
      shading: THREE.SmoothShading
    }));

    mesh.position.x = mesh_x;
    mesh.position.y = mesh_y;
    mesh.position.z = mesh_z;
    mesh.scale.set(100, 100, 100);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });

  loader.load('https://altbryson.com/json/table/pocket_bottoms.json', function (geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x000),
      specular: 0x000,
      shininess: 0,
      shading: THREE.SmoothShading
    }));

    mesh.position.x = mesh_x;
    mesh.position.y = mesh_y;
    mesh.position.z = mesh_z;
    mesh.scale.set(100, 100, 100);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });

  this.rigidBody = this.createFloor(); //floor

  //corners of -x table side
  this.hole1 = new Hole( game_pool_table.LEN_X / 2 + 1.5, 0, -game_pool_table.LEN_Z / 2 - 1.5,  Math.PI / 4);
  this.hole2 = new Hole(-game_pool_table.LEN_X / 2 - 1.5, 0, -game_pool_table.LEN_Z / 2 - 1.5, -Math.PI / 4);
  //middle holes
  this.hole3 = new Hole(0, 0, -game_pool_table.LEN_Z / 2 - 4.8, 0);
  this.hole4 = new Hole(0, 0,  game_pool_table.LEN_Z / 2 + 4.8, Math.PI);
  //corners of +x table side
  this.hole5 = new Hole( game_pool_table.LEN_X / 2 + 1.5, 0, game_pool_table.LEN_Z / 2 + 1.5,  3 * Math.PI / 4);
  this.hole6 = new Hole(-game_pool_table.LEN_X / 2 - 1.5, 0, game_pool_table.LEN_Z / 2 + 1.5, -3 * Math.PI / 4);

  this.walls = this.createWallBodies();
};

var TABLE_COLORS = {
  cloth: 0x4d9900
};

game_pool_table.LEN_Z = 137.16;
game_pool_table.LEN_X = 274.32;
game_pool_table.WALL_HEIGHT = 6;
game_pool_table.floorContactMaterial = new CANNON.Material('floorMaterial');
game_pool_table.wallContactMaterial = new CANNON.Material('wallMaterial');

/** Creates cannon js walls
This method is 3am spaghetti, you've been warned..*/
game_pool_table.prototype.createWallBodies = function () {
  //walls of -z
  var wall1 = new LongWall( game_pool_table.LEN_X / 4 - 0.8, 2, -game_pool_table.LEN_Z / 2, 61);
  var wall2 = new LongWall(-game_pool_table.LEN_X / 4 + 0.8, 2, -game_pool_table.LEN_Z / 2, 61);
  wall2.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI);

  //walls of -z
  var wall3 = new LongWall( game_pool_table.LEN_X / 4 - 0.8, 2, game_pool_table.LEN_Z / 2, 61);
  var wall4 = new LongWall(-game_pool_table.LEN_X / 4 + 0.8, 2, game_pool_table.LEN_Z / 2, 61);
  wall3.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0),  Math.PI);
  wall4.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI);

  //wall of +x
  var wall5 = new ShortWall(game_pool_table.LEN_X / 2, 2, 0, 60.5);

  //wall of -x
  var wall6 = new ShortWall(-game_pool_table.LEN_X / 2, 2, 0, 60.5);
  wall6.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -1.5 * Math.PI);

  var walls = [wall1, wall2, wall3, wall4, wall5, wall6];
  for (var i in walls) {
    world.addBody(walls[i].body);
    if (debug) {
      addCannonVisual(walls[i].body);
    }
  }

  return walls;
};

game_pool_table.prototype.createFloor = function () {
  var narrowStripWidth = 2;
  var narrowStripLength = game_pool_table.LEN_Z / 2 - 5;
  var floorThickness = 1;
  var mainAreaX = game_pool_table.LEN_X / 2 - 2 * narrowStripWidth;

  var floorBox = new CANNON.Box(new CANNON.Vec3(mainAreaX, floorThickness, game_pool_table.LEN_Z / 2));
  var floorBoxSmall = new CANNON.Box(new CANNON.Vec3(narrowStripWidth, floorThickness, narrowStripLength));

  this.body = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    material: game_pool_table.floorContactMaterial
  });
  this.body.addShape(floorBox,      new CANNON.Vec3(0, -floorThickness, 0));
  this.body.addShape(floorBoxSmall, new CANNON.Vec3(-mainAreaX - narrowStripWidth, -floorThickness, 0));
  this.body.addShape(floorBoxSmall, new CANNON.Vec3( mainAreaX + narrowStripWidth, -floorThickness, 0));

  if (debug) {
    addCannonVisual(this.body, 0xff0000);
  }
  world.add(this.body);
};
