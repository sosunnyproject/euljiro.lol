// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
import { getRandomArbitrary } from './utils.js';

// import model urls
import { DISTRICT_TWO_GLB, DISTRICT_ONE_GLB } from './models/glbConstants.js';

let stats, camera, renderer, pointerControls, character, character1;
let currentScene, districtGarden, districtOne, districtTwo, districtThree;

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
let mixers = [];
const DISTRICT_NAMES = ["D_GARDEN", "D_ONE", "D_TWO", "D_THREE"]

var clock = new THREE.Clock();

// Canvas
const canvas = document.querySelector('#c');
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Camera
const params = {
  fov: 20,
  aspect: 2, 
  zNear: 5,
  zFar: 4000
}
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
camera = makeCamera();
// camera.position.set(-100, 100, 0) //.multiplyScalar(1);
// camera.lookAt(0, 0, 0);
camera.position.x = 300;
camera.position.y = 3;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Camera GUI Input
// const gui = new GUI();
// const guiBox = gui.addFolder('guiBox');
// guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
// guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
// guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
// guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)


// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update();

// Pointer Lock Controls & Instructions
pointerControls = new PointerLockControls(camera, document.body);
const instructions = document.getElementById( 'instructions' );
const blocker = document.getElementById( 'blocker' );

instructions.addEventListener( 'click', function () {
  pointerControls.lock();
} );
pointerControls.addEventListener( 'lock', function () {

  instructions.style.display = 'none';
  blocker.style.display = 'none';

} );

pointerControls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';

} );

// Key Controls
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

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

// orientation
// document.addEventListener('DOMContentLoaded', addListenMouse, false); 

// function addListenMouse() {
//   document.addEventListener('mousemove', e => {
//     console.log("move x: ", e.movementX, ", move y: ", e.movementY)
//     console.log("camera: ", camera.quaternion)
//   })
// }

// GamePad Interaction
let gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let raycaster;

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  gamepadConnected = true; 
});
raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

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

function tick() {

  //gamepad
  if (gamepadConnected) {
    const gamepad = navigator.getGamepads()[0];
    xboxKeyPressed(gamepad);
    xboxAxesPressed(gamepad);
  }

  render();

  requestAnimationFrame( tick );

  checkPointerControls()
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
  districtTwo.children[0].material.uniforms.u_time.value = time * 0.001;

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
  // if(currentScene.name === "D_TWO") {
    if(mixers.length > 0) {
      mixers.forEach(mixer => mixer.update(delta))
      // mixer.update(delta);
    }  
  // }

  renderer.autoClear = true;
  renderer.clear();
  renderer.render( currentScene, camera );
  stats.update()
}

document.addEventListener('keypress', switchScene);

function switchScene(e) {
  pointerControls.getObject().removeFromParent();

  switch(e.code) {

    case 'Digit1':
      console.log("1 pressed")
      districtOne.add(pointerControls.getObject());
      setTimeout(() => {
        currentScene = districtOne;
      }, 1000)
      break;

    case 'Digit2':
      console.log("2 pressed")
      districtTwo.add(pointerControls.getObject());
      setTimeout(() => {
        currentScene = districtTwo;
      }, 1000)
      console.log(districtTwo.children)
      break;

    case 'Digit3':
      console.log("3 pressed")
      currentScene = districtThree;
      break;
    case 'Digit0':
      console.log("0 pressed")
      districtGarden.add(pointerControls.getObject());
      setTimeout(() => {
        currentScene = districtGarden;
      }, 1000)
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
  currentScene = districtOne;
  currentScene.add(pointerControls.getObject())
  tick();
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

function onLoadAnimation(model, data, district) {
  // console.log("load animated models: ", data)
  const { posX, posY, posZ } = data
  model.scene.position.set(posX, posY, posZ);
  model.scene.rotation.y = Math.PI/2.0;

  if(data.scale) {
    const inputScale = data.scale
    model.scene.scale.set(inputScale, inputScale, inputScale)
  } else {
    model.scene.scale.set(25, 25, 25);
  }

  if(model.animations.length) {
    let mixer = new THREE.AnimationMixer(model.scene);
    mixers.push(mixer)

    var action = mixer.clipAction(model.animations[0])
    action.play();   
  }

  switch(district) {
    case DISTRICT_NAMES[0]:
      districtGarden.add(model.scene);
      break;
    case DISTRICT_NAMES[1]:
      districtOne.add(model.scene);
      break;
    case DISTRICT_NAMES[2]:
      districtTwo.add(model.scene);
      break;
    case DISTRICT_NAMES[3]:
      districtThree.add(model.scene);
      break;
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
  
  for (let i = 0; i < DISTRICT_ONE_GLB.length; i++) {
    const currentModel = DISTRICT_ONE_GLB[i]
    gltfLoader.load (
      currentModel.url,
      (gltf) => onLoadAnimation(gltf, currentModel, DISTRICT_NAMES[1]),
      function (xhr) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function (error) {
        console.log("error?", error)
      }
    )
  }

  // function onLoad(gltf, data) {
  //   const {px, py, pz, scale} = data;
  //   gltf.scene.position.set(px, py, pz);
  //   gltf.scene.scale.set(scale, scale, scale);
  //   gltf.scene.rotation.y = Math.PI/2;

  //   districtOne.add(gltf.scene);
  // }

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

  for (let i = 0; i < DISTRICT_TWO_GLB.length; i++) {
    const currentModel = DISTRICT_TWO_GLB[i]

    gltfLoader.load (
      currentModel.url,
      (gltf) => onLoadAnimation(gltf, currentModel, DISTRICT_NAMES[2]),

      function (xhr) {
        if( (xhr.loaded/xhr.total * 100) >= 100.0 ) {
          console.log(xhr.loaded/xhr.total * 100)
        }
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function (err) {
        console.log("err: ", err)
      }
    )
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

function checkPointerControls() {
  const time = performance.now();

  if ( pointerControls.isLocked === true ) {

    raycaster.ray.origin.copy( pointerControls.getObject().position );
    raycaster.ray.origin.y -= 10;

    // const intersections = raycaster.intersectObjects( objects, false );

    // const onObject = intersections.length > 0;

    // control speed of movement
    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {

    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;

    // }

    pointerControls.moveRight( - velocity.x * delta );
    pointerControls.moveForward( - velocity.z * delta );

    pointerControls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( pointerControls.getObject().position.y < 10 ) {

      velocity.y = 0;
      pointerControls.getObject().position.y = 5;

      canJump = true;

    }
  }

  prevTime = time;
}