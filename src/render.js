// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL';
import { io } from "socket.io-client";

import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { generateShaderTree, generateTree } from './trees.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';
import { generateTriangleCat, generateTriangleGround, generateFloorNeons } from './catRoads.js';
import turbulenceFragment from './shaders/turbulence.frag.js';


const treeParams = {
  radius: 7,
  detail: 5,
  xpos: 20,
  ypos: 11,
  color: '#00ff00'
}

const params = {
  fov: 40,
  aspect: 2, 
  zNear: 5,
  zFar: 1000
}

let stats, camera, renderer, camControls, character, character1;
let currentScene, sceneGarden, sceneOne, sceneTwo, sceneThree;
let headlight, headlightHelper;

let raycaster;

let gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

export let shaderTree;

// const gui = new GUI();
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
var clock = new THREE.Clock();

// create a camera, which defines where we're looking at.
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
camera = makeCamera();
camera.position.set(-100, 100, 0) //.multiplyScalar(1);
camera.lookAt(0, 0, 0);

// create a render and set the size
const canvas = document.querySelector('#c');
renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// orbit controls
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update();

// position and point the camera to the center of the scene
camera.position.x = 100;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

camControls = new PointerLockControls(camera, document.body);
const instructions = document.getElementById( 'c' );

instructions.addEventListener( 'click', function () {
  camControls.lock();
} );

const onKeyDown = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

    case 'Space':
      if ( canJump === true ) velocity.y += 350;
      canJump = false;
      break;

  }

};

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }

};

// orientation
// document.addEventListener('DOMContentLoaded', addListenMouse, false); 

// function addListenMouse() {
//   document.addEventListener('mousemove', e => {
//     console.log("move x: ", e.movementX, ", move y: ", e.movementY)
//     console.log("camera: ", camera.quaternion)
//   })
// }

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  gamepadConnected = true; 
});
raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

// camera gui
// const guiBox = gui.addFolder('guiBox');
// guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
// guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
// guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
// guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)

// socket test
async function testSocket() {
  const socket = await io(`https://gamepad-node.glitch.me`,  { transports : ['websocket'] })
  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on('UP BUTTON', (touch) => {
    console.log("UP: " + touch)
    if(touch === "touchstart") {
      moveForward = true;
    } else if (touch === "touchend") {
      moveForward = false;
    }
  });

  socket.on('LEFT BUTTON', (touch) => {
    console.log("LEFT: " + touch)
    if(touch === "touchstart") {
      moveLeft = true;
    } else if (touch === "touchend") {
      moveLeft = false;
    }
  });
  socket.on('RIGHT BUTTON', (touch) => {
    console.log("RIGHT: " + touch)
    if(touch === "touchstart") {
      moveRight = true;
    } else if (touch === "touchend") {
      moveRight = false;
    }
  });

  socket.on('DOWN BUTTON', (touch) => {
    console.log("DOWN: " + touch)
    if(touch === "touchstart") {
      moveBackward = true;
    } else if (touch === "touchend") {
      moveBackward = false;
    }
  });
}

testSocket()

// gamepad
function xboxKeyPressed (gamepad) {
  const buttons = gamepad.buttons;

  if(buttons[12].touched) {  // up
    moveForward = true;
  } 
  if(!buttons[12].touched) {
    moveForward = false;
  }
  if(buttons[15].touched) {
    moveRight = true;
  }
  if(!buttons[15].touched){
    moveRight = false;
  }
  if(buttons[13].touched) {
    moveBackward = true;
  }
  if(!buttons[13].touched){
    moveBackward = false;
  }
  if(buttons[14].touched) {
    moveLeft = true;
  }
  if(!buttons[14].touched){
    moveLeft = false;
  }
}

let prevAxisX = 0;
let prevAxisY = 0;
let staleX = 0;
let staleY = 0;

function xboxAxesPressed(gamepad) {
  const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
  const minPolarAngle = 0; // radians
  const maxPolarAngle = Math.PI; // radians 
  const _PI_2 = Math.PI / 2;

  const movementX = gamepad.axes[2]
  const movementY = gamepad.axes[3]

  prevAxisY === movementY ? staleY++ : staleY = 0;
  prevAxisX === movementX ? staleX++ : staleX = 0; 

  if(staleX > 10 && staleY > 10){  // prevent constant camera rotation
    return
  } else {
    _euler.setFromQuaternion( camera.quaternion );
  
    _euler.y -= movementX * 0.02;
    _euler.x -= movementY * 0.02;
  
    _euler.x = Math.max( _PI_2 - maxPolarAngle, Math.min( _PI_2 - minPolarAngle, _euler.x ) );
  
    camera.quaternion.setFromEuler( _euler );
  }

  prevAxisX = movementX;
  prevAxisY = movementY;
}

function animate() {

  //gamepad
  if (gamepadConnected) {
    const gamepad = navigator.getGamepads()[0];
    xboxKeyPressed(gamepad);
    xboxAxesPressed(gamepad);
  }

  renderDynamicShader();

  requestAnimationFrame( animate );

  const time = performance.now();

  if ( camControls.isLocked === true ) {

    raycaster.ray.origin.copy( camControls.getObject().position );
    raycaster.ray.origin.y -= 10;

    // const intersections = raycaster.intersectObjects( objects, false );

    // const onObject = intersections.length > 0;

    // control speed of movement
    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 20.0 * delta;
    velocity.z -= velocity.z * 20.0 * delta;

    velocity.y -= 9.8 * 200.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {

    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;

    // }

    camControls.moveRight( - velocity.x * delta );
    camControls.moveForward( - velocity.z * delta );

    camControls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( camControls.getObject().position.y < 10 ) {

      velocity.y = 0;
      camControls.getObject().position.y = 5;

      canJump = true;

    }
  }

  prevTime = time;

  // fps character position
  switch(currentScene.name) {
    case "park":
      character.position.copy(camera.position);
      character.rotation.copy(camera.rotation);
      character.updateMatrix();
      character.translateZ(-6);
      character.translateY(-1);
      break;
    case "one":
      character1.position.copy(camera.position);
      // character1.rotation.copy(camera.rotation);
      // character1.updateMatrix();
      // character1.translateZ(-6);
      // character1.translateY(-1);
      break;
  }

  stats.update();
};

// including animation loop
function renderDynamicShader() {

  const time = performance.now();

  // send time data to shaders
  // const mushroomMesh = scene.children[ 1 ].children[0];
  // if(shaderTree !== undefined) {
  //   shaderTree.rotation.y = time * 0.00075;
  //   shaderTree.material.uniforms.u_time.value = time * 0.00075;  
  // }
  // mushroomMesh.rotation.y = time * 0.00075;
  // mushroomMesh.material.uniforms.u_time.value = time * 0.01;

  // animate rotation
  // sceneOne.children[2].children[0].rotation.y = time*0.0005
  renderer.render( currentScene, camera );
}

document.addEventListener('keypress', logKey);

function logKey(e) {
  console.log("camera: ", camera.position)

  currentScene.add(camControls.getObject())

  switch(e.code) {
    case 'Digit1':
      console.log("1 pressed")
      currentScene = sceneGarden
      break;
    case 'Digit2':
      console.log("2 pressed")
      currentScene = sceneOne
      break;
  }
}


if(!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
	 document.getElementById( 'container' ).appendChild( warning );
} else {
  initStats();
  createSceneGarden();
  createSceneOne()
  currentScene = sceneOne
  currentScene.add(camControls.getObject())
  animate();
}

function initStats() {
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.querySelector("#stats-output").append(stats.domElement);
  return stats;
}


function createSceneGarden() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  sceneGarden = new THREE.Scene();
  sceneGarden.background = new THREE.Color(0xAAAAAA);
  sceneGarden.name = "park"

  shaderTree = generateShaderTree(10, 15, 0)

  // mushrooms
  const m = generateMushroom()

  // ground plane
  const groundMesh = generateGround();
  
  // tree object
  for(let i = 0; i < 10; i++){
    const x = getRandomArbitrary(-200, 200)
    const tree = generateTree(x, 15, getRandomArbitrary(-100, 100))
    sceneGarden.add(tree);  
  }

  // torus knot
  const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });
  const torusKnot = new THREE.Mesh( torusKnotGeom, torusKnotMat );
  torusKnot.position.y = 60;
  torusKnot.position.x = -40;

  var axes = new THREE.AxesHelper(20);

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

    const spotlight = new THREE.SpotLight(0xffffff, 0.3)
    spotlight.position.set(-40, 100, -10);
    spotlight.castShadow = true;
    sceneGarden.add(light);
    sceneGarden.add(spotlight)
  }
 
  // 3d model loader
  // https://sbcode.net/threejs/gltf-animation/

  const gltfLoader = new GLTFLoader();
  gltfLoader.load (
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/cactus.glb",
    onLoad,
    function (xhr) {
      // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    function (error) {
      console.log("error?", error)
    }
  )
  
  gltfLoader.load (
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/wee.glb",
    (gltf) => onLoad(gltf, 50),
    function (xhr) {
      // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    function (error) {
      console.log("error?", error)
    }
  )

  function onLoad(gltf, x, y) {
    gltf.scene.position.y = y || 30;
    gltf.scene.position.x = x || -50;
    gltf.scene.scale.x = 4;
    gltf.scene.scale.y = 4;
    gltf.scene.scale.z = 4;
    sceneGarden.add(gltf.scene);
  }

  // fps control
  /** 
  let characterGeom = new THREE.BoxGeometry(1, 1, 1);
  let characterMat = new THREE.MeshPhongMaterial( {color: 0x001122} );
  character = new THREE.Mesh(characterGeom, characterMat);

  character.position.copy(camera.position);
  character.rotation.copy(camera.rotation);
  character.updateMatrix();
  character.translateZ(-5);
  character.translateY(-5);
  */

  sceneGarden.add(shaderTree)
  sceneGarden.add(m)
  sceneGarden.add(groundMesh)
  sceneGarden.add(axes);
  // sceneGarden.add(character);
  sceneGarden.add(torusKnot);
  sceneGarden.add( camControls.getObject() );
}

function createSceneOne() {
  sceneOne = new THREE.Scene();
  sceneOne.background = new THREE.Color(0x000000);
  sceneOne.name = "one"

  // sceneOneLightings = 
  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.25;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    sceneOne.add(light);
  }



  // fps control
  const characterGeom = new THREE.BoxGeometry(1, 1, 1);
  const characterMat = new THREE.MeshPhongMaterial( {color: 0x001122} );
  character1 = new THREE.Mesh(characterGeom, characterMat);

  character1.position.copy(camera.position);
  character1.receiveShadow = true;
  character1.castShadow = true;
  character1.rotation.copy(camera.rotation);
  character1.updateMatrix();
  character1.translateZ(-5);
  character1.translateY(-5);

  // cats
  {
    const cat = generateTriangleCat(-200, 30, 0);
    sceneOne.add(cat)

    // left edge
    const cat1 = generateTriangleCat(-120, 30, 60);
    cat1.rotation.y = Math.PI/4.0;
    sceneOne.add(cat1)

    const cat2 = generateTriangleCat(-40, 30, 110);
    cat2.rotation.y = Math.PI/3.0;
    sceneOne.add(cat2)

    const cat3 = generateTriangleCat(40, 30, 140);
    cat3.rotation.y = Math.PI/3.0;
    sceneOne.add(cat3)

    const cat4 = generateTriangleCat(120, 30, 170);
    cat4.rotation.y = Math.PI/2.5;
    sceneOne.add(cat4)

    // left corner
    const cat5 = generateTriangleCat(200, 30, 180);
    cat5.rotation.y = Math.PI/1.5;
    sceneOne.add(cat5)
  }
  {
    // right edge
    const cat1 = generateTriangleCat(-120, 30, -60);
    cat1.rotation.y = -Math.PI/4.0;
    sceneOne.add(cat1)

    const cat2 = generateTriangleCat(-40, 30, -110);
    cat2.rotation.y = -Math.PI/3.0;
    sceneOne.add(cat2)

    const cat3 = generateTriangleCat(40, 30, -140);
    cat3.rotation.y = -Math.PI/3.0;
    sceneOne.add(cat3)

    const cat4 = generateTriangleCat(120, 30, -170);
    cat4.rotation.y = -Math.PI/3.0;
    sceneOne.add(cat4)

    // corner
    const cat5 = generateTriangleCat(200, 30, -180);
    cat5.rotation.y = -Math.PI/1.5
    sceneOne.add(cat5)
  }
  {
    // bottom edge
    const cat1 = generateTriangleCat(240, 30, 120);
    cat1.rotation.y = -Math.PI;
    sceneOne.add(cat1)

    const cat2 = generateTriangleCat(240, 30, 40);
    cat2.rotation.y = -Math.PI;
    sceneOne.add(cat2)

    const cat3 = generateTriangleCat(240, 30, -40);
    cat3.rotation.y = -Math.PI;
    sceneOne.add(cat3)

    const cat4 = generateTriangleCat(240, 30, -120);
    cat4.rotation.y = -Math.PI;
    sceneOne.add(cat4)
  }

  {
    const ground = generateTriangleGround()
    sceneOne.add(ground)
  }

  for(let i = -180; i < 200; i+= 50) {
    const ball = generateFloorNeons()
    ball.position.set(i, 6, 0)
    sceneOne.add(ball)
  }


  const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.

  sceneOne.add(axes)
  // sceneOne.add(character1)
  sceneOne.add(camControls.getObject() );

}