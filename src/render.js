// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL';

import { generateDistrictGardenObjects } from './renderDistrictGarden.js';
import { generateDistrictOneObjects } from './renderDistrictOne.js';
import { generateDistrictTwoObjects } from './renderDistrictTwo.js';
import { generateDistrictThreeObjects } from './renderDistrictThree.js';
import coffeeRiverFragment from './shaders/coffee.frag.js';
import vertexShader from './shaders/vertex.glsl.js';
import { FlowerPetals } from './models/flowerPetals.js';
import { Loader } from 'three';
import { statSync } from 'fs';

const treeParams = {
  radius: 7,
  detail: 5,
  xpos: 20,
  ypos: 11,
  color: '#00ff00'
}

const params = {
  fov: 20,
  aspect: 2, 
  zNear: 5,
  zFar: 4000
}

let stats, camera, renderer, camControls, character, character1;
let currentScene, districtGarden, districtOne, districtTwo, districtThree;

let raycaster;

let gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let petalN = 4, petalD = 9;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
const gltfLoader = new GLTFLoader();
// provide dracoLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('three/examples/js/libs/draco');
gltfLoader.setDRACOLoader(dracoLoader);
let mixer = null;

// const gui = new GUI();
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
var clock = new THREE.Clock();

// create a camera, which defines where we're looking at.
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
camera = makeCamera();
// camera.position.set(-100, 100, 0) //.multiplyScalar(1);
// camera.lookAt(0, 0, 0);

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
camera.position.x = 1000;
camera.position.y = 3;
camera.position.z = 0;
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

  currentScene.add(camControls.getObject())

  render();

  requestAnimationFrame( animate );

  const time = performance.now();

  if ( camControls.isLocked === true ) {

    raycaster.ray.origin.copy( camControls.getObject().position );
    raycaster.ray.origin.y -= 10;

    // const intersections = raycaster.intersectObjects( objects, false );

    // const onObject = intersections.length > 0;

    // control speed of movement
    const delta = ( time - prevTime ) / 500;

    velocity.x -= velocity.x * 40.0 * delta;
    velocity.z -= velocity.z * 40.0 * delta;

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

};

// including animation loop
function render() {

  const time = performance.now();

  // send time data to shaders
  // const mushroomMesh = scene.children[ 1 ].children[0];
  // if(shaderTree !== undefined) {
  //   shaderTree.rotation.y = time * 0.00075;
  //   shaderTree.material.uniforms.u_time.value = time * 0.00075;  
  // }
  // mushroomMesh.rotation.y = time * 0.00075;
  // mushroomMesh.material.uniforms.u_time.value = time * 0.01;

  // districtGarden.children[0].material.uniforms.u_time.value = time * 0.005;
  // districtTwo.children[0].material.uniforms.u_time.value = time * 0.001;

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  let flowerObj;
  // district Garden
  if(currentScene.name === "D_GARDEN" ) {
    const lastItem = districtGarden.children.length - 2
    flowerObj = districtGarden.children[lastItem]
    flowerObj.clear()
    flowerObj = new FlowerPetals(petalN, petalD, 0.8)
  
    petalN = Math.abs(Math.cos(time/100000)*3) + 1
    petalD = Math.abs(Math.sin(time/100000)*9) + 1

    flowerObj.position.set(70, 20, -20)

    districtGarden.add(flowerObj)
  }

  var delta = clock.getDelta();
  if(currentScene.name === "D_TWO") {
    if(mixer) {
      mixer.update(delta);
    }  
  }
  renderer.autoClear = true;
  renderer.render( currentScene, camera );
  stats.update()
}

document.addEventListener('keypress', logKey);

function logKey(e) {
  // console.log("camera: ", camera.position)

  switch(e.code) {
    case 'Digit1':
      console.log("1 pressed")
      currentScene = districtOne;
      break;
    case 'Digit2':
      console.log("2 pressed")
      currentScene = districtTwo ;
      break;
    case 'Digit3':
      console.log("3 pressed")
      currentScene = districtThree;
      break;
    case 'Digit0':
      console.log("0 pressed")
      currentScene = districtGarden;
      break;
  }
}


if(!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
	 document.getElementById( 'container' ).appendChild( warning );
} else {
  initStats();
  createDistrictGarden();
  createDistrictOne();
  createDistrictTwo();
  createDistrictThree();
  currentScene = districtGarden;
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


function createDistrictGarden() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  districtGarden = new THREE.Scene();
  districtGarden.background = new THREE.Color().setHSL( 0.6, 0, 1 );
  districtGarden.fog = new THREE.Fog( districtGarden.background, 1, 5000 );
  districtGarden.fog.color.copy(new THREE.Color( 0xffffff ))
  districtGarden.name = "D_GARDEN"
  
  const objects = generateDistrictGardenObjects()
  
  for(let i = 0; i < objects.length; i++){
    districtGarden.add(objects[i])
  }

}

function createDistrictOne() {
  districtOne = new THREE.Scene();
  districtOne.background = new THREE.Color(0x70666f);
  districtOne.name = "D_ONE"

  const objects = generateDistrictOneObjects()

  for(let i = 0; i < objects.length; i++){
    districtOne.add(objects[i])
  }

  // https://sbcode.net/threejs/gltf-animation/
  const districtOneModels = [
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/purple_cone.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/blue_cone.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/pink_cone2.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/robot_face.glb",
  ]

  const modelsPosition = [
    {px: 30, py: 10, pz: -50},
    {px: -30, py: 10, pz: -80},
    {px: -30, py: 10, pz: 80},
    {px: 0, py: 12, pz: 0},
    {px: -80, py: 10, pz: 0}
  ]

  const modelsScale = [
    {sx: null, sy: null, sz: null},
    {sx: null, sy: null, sz: null},
    {sx: null, sy: null, sz: null},
    {sx: 8, sy: 8, sz: 4},
    {sx: null, sy: null, sz: null}
  ]
  
  for (let i = 0; i < districtOneModels.length; i++) {
    gltfLoader.load (
      districtOneModels[i],
      (gltf) => onLoad(gltf, modelsPosition[i], modelsScale[i]),
      function (xhr) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function (error) {
        console.log("error?", error)
      }
    )
  }

  function onLoad(gltf, position, scale, rotation ) {
    const {px, py, pz} = position;
    gltf.scene.position.set(px, py, pz);

    const {sx, sy, sz} = scale;
    gltf.scene.scale.set(sx || 4, sy || 4, sz || 2);

    if(rotation){
      const {rx, ry, rz} = rotation;
      gltf.scene.rotation.set(rx || 0, ry || 0, rz || 0);
    }
    gltf.scene.rotation.y = Math.PI/2;

    districtOne.add(gltf.scene);
  }

  districtOne.add(camControls.getObject() );
}

function createDistrictTwo() {
  districtTwo = new THREE.Scene();
  districtTwo.background = new THREE.Color(0xffffff);
  districtTwo.name = "D_TWO"

  {
    const geometry = new THREE.CircleGeometry( 1000, 50 );
    const material = new THREE.MeshPhongMaterial( {color: 0x879ead} );
    const coffeeMat = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2() }
      },
        vertexShader: vertexShader,
        fragmentShader: coffeeRiverFragment,
        side: THREE.DoubleSide
      } );
    const plane = new THREE.Mesh( geometry, coffeeMat );
    plane.rotation.x = -Math.PI/2;
  
    districtTwo.add(plane)
  }
  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    
    districtTwo.add(light)
   }


  const districtTwoModels = [
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/districtTwo/bear.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/districtTwo/fork.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/districtTwo/tape.glb",
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/wee.glb",
    // "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/purpleSung.glb",
  ]


  gltfLoader.load(
    "https://raw.githubusercontent.com/sosunnyproject/threejs-euljiro/main/models/purpleSung.glb",
    function (gltf) {
      gltf.scene.position.set(80, 0, -50);
      gltf.scene.scale.set(16, 16, 16);

      gltf.animations;
      mixer = new THREE.AnimationMixer(gltf.scene);
      var action = mixer.clipAction(gltf.animations[0])
      action.play(); 

      // gltf.animations.forEach( (clip) => {
      //   mixer.clipAction(clip).play()
      // })

      gltf.scene;
      gltf.scenes;
      gltf.cameras;
      gltf.aseet;

      districtTwo.add(gltf.scene);
    },
    function (xhr) {
      console.log( (xhr.loaded / xhr.total * 100) + '% purple sunglasses loaded' );
    },
    function (err) {
      console.log("err: ", err)
    }
  )

  const modelsPosition = [
    {px: 30, py: 10, pz: -50},
    {px: 30, py: 6, pz: -30},
    {px: -30, py: 10, pz: 80},
    {px: 0, py: 12, pz: 0},
  ]

  const modelsScale = [
    {sx: null, sx: null, sz: null},
    {sx: null, sx: null, sz: null},
    {sx: null, sx: null, sz: null},
    {sx: 8, sy: 8, sz: 4},
  ]
  

  for (let i = 0; i < districtTwoModels.length; i++) {
    gltfLoader.load (
      districtTwoModels[i],
      (gltf) => onLoad(gltf, modelsPosition[i], modelsScale[i]),
      function (xhr) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function (error) {
        console.log("error?", error)
      }
    )
  }

  function onLoad(gltf, position, scale, rotation ) {
    const {px, py, pz} = position;
    gltf.scene.position.set(px, py, pz);

    const {sx, sy, sz} = scale;
    gltf.scene.scale.set(sx || 4, sy || 4, sz || 2);

    if(rotation){
      const {rx, ry, rz} = rotation;
      gltf.scene.rotation.set(rx || 0, ry || 0, rz || 0);
    }
    gltf.scene.rotation.y = Math.PI/2;

    districtTwo.add(gltf.scene);
  }
}

function createDistrictThree() {
  districtThree = new THREE.Scene();
  districtThree.background = new THREE.Color(0xffffff);

  const objects = generateDistrictThreeObjects();

  for(let i = 0; i < objects.length; i++){
    districtThree.add(objects[i]);
  }
}