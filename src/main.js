// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL';

import { Loader } from 'three';
import { statSync } from 'fs';
import { getRandomArbitrary } from './utils.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// import model urls
import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, MONUMENTS_GLB } from './models/glbLoader.js';
import uhbeeFont from "../assets/fonts/uhbeeRiceRegular.json"
import euljiro10years from "../assets/fonts/bmEuljiro10years.json"
import euljiroRegular from "../assets/fonts/bmEuljiroRegular.json"
import { generateGround } from './models/ground.js';

let stats, camera, renderer, pointerControls, character, character1;

let accSteps = 0;
let prevDistrictIndex = 1;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const ZONE_NAMES = ["GARDEN", "ONE", "TWO", "THREE"]

window.ZONE = "ONE"
let dynamicLoaded = false, zoneChanged = false;

// Clock: autoStart, elapsedTime, oldTime, running, startTime
var clock = new THREE.Clock();

// Loading Manager for 3d models and animation
window.mixers = [];
const loadManager = new THREE.LoadingManager();
loadManager.onLoad = init;
const gltfLoader = new GLTFLoader(loadManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('three/examples/js/libs/draco');
gltfLoader.setDRACOLoader(dracoLoader);

const fontLoader = new FontLoader(loadManager)
loadAssets()

function loadAssets() {
  const loadNum = MONUMENTS_GLB.length + DISTRICT_TWO_GLB.length + DISTRICT_ONE_GLB.length;
  let count = 0
  
  MONUMENTS_GLB.forEach(model => {
   gltfLoader.load(model.url,
    (gltf) => {
     model.gltf = gltf;
     count++;
     console.log("loaded")
     let per = Math.floor((count / loadNum) * 100)
     loadProgress(per);
   })
  })

  DISTRICT_ONE_GLB.forEach(model => {
    gltfLoader.load(model.url, 
      (gltf) => {
      model.gltf = gltf;
      count++;
      console.log("loaded")
      let per = Math.floor((count / loadNum) * 100)
      loadProgress(per);
    })
  })

  DISTRICT_TWO_GLB.forEach(model => {
    gltfLoader.load(model.url, 
      (gltf) => {
      model.gltf = gltf;
      count++;
      console.log("loaded")
      let per = Math.floor((count / loadNum) * 100)
      loadProgress(per);
    })
  })

  // Load Font for TextGeometry
  fontLoader.load(
    uhbeeFont,
    (font) => {
      window.UHBEE_FONT = font;
      count++;
      console.log("loaded")
      let per = Math.floor((count / loadNum) * 100)
      loadProgress(per);
    }
  )
}

// Load Progress Bar
var leftBar = document.querySelector('.left .bar');
var rightBar = document.querySelector('.right .bar');
var per = document.querySelector('.value');
function loadProgress(value) {
  per.innerHTML=value +'%';
  if (value <= 50) {
    var degree = 18*value/5;
    rightBar.style.transform = "rotate("+degree+"deg)";
    leftBar.style.transform = "rotate(0deg)";
  } else {
    var degree = 18*(value-50)/5;
    rightBar.style.transform = "rotate(180deg)";
    leftBar.style.transform = "rotate("+degree+"deg)";
  }
}

// Step Counter Bar
var stepCounter = document.querySelector('#stepCounter')
var stepLeftBar = stepCounter.querySelector('.left .bar');
var stepRightBar = stepCounter.querySelector('.right .bar');
var stepPer = stepCounter.querySelector('.value');

function stepProgress(value) {
  stepPer.innerHTML=value +'%';
  if (value <= 50) {
    var degree = 18*value/5;
    stepRightBar.style.transform = "rotate("+degree+"deg)";
    stepLeftBar.style.transform = "rotate(0deg)";
  } else {
    var degree = 18*(value-50)/5;
    stepRightBar.style.transform = "rotate(180deg)";
    stepLeftBar.style.transform = "rotate("+degree+"deg)";
  }
}

// Canvas
const canvas = document.querySelector('#c');
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setSize(WIDTH, HEIGHT);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Camera
const params = {
  fov: 20,
  aspect: 0.5, 
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
camera.position.x = 1000;
camera.position.y = 1;
camera.position.z = -1000;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Camera GUI Input
// const gui = new GUI();
// const guiBox = gui.addFolder('guiBox');
// guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
// guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
// guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
// guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)

// Scene
const mainScene = new THREE.Scene()
mainScene.background = new THREE.Color(0xffffff);

// Light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
mainScene.add(light)

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

  // blocker.style.display = 'block';
  // instructions.style.display = '';

} );

// Key Controls
const onKeyDown = function ( event ) {
  accSteps++;
  
  let per = Math.floor((accSteps / 1000) * 100 )
  stepProgress(per)

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
window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad DISconnected")
  gamepadConnected = false;
})

raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

function xboxKeyPressed (gamepad) {
  if(!gamepad) {
    console.log("ERROR: XBOX CONNECTION LOST")
    return
  }

  
  let per = Math.floor((accSteps / 1000) * 100 )
  stepProgress(per)

  const buttons = gamepad.buttons;

  if(buttons[1].touched) {  // B button
    if(!pointerControls.isLocked) {
      pointerControls.lock();
    }
  }

  if(buttons[12].touched) {  // up
    moveForward = true;
    accSteps++;
  } 
  if(!buttons[12].touched) {
    moveForward = false;
  }
  if(buttons[15].touched) {
    moveRight = true;
    accSteps++;
  }
  if(!buttons[15].touched){
    moveRight = false;
  }
  if(buttons[13].touched) {
    moveBackward = true;
    accSteps++;
  }
  if(!buttons[13].touched){
    moveBackward = false;
  }
  if(buttons[14].touched) {
    moveLeft = true;
    accSteps++;
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

  // camera position check
  let currentPos = pointerControls.getObject().position  
  checkCameraPosition(currentPos)

  //gamepad
  if (gamepadConnected) {
    const gamepad = navigator.getGamepads()[0];
    
    if(!gamepad) {
      console.log("ERROR: XBOX CONNECTION LOST") 
      return;

    } else {
      try {
        xboxKeyPressed(gamepad);
        xboxAxesPressed(gamepad);
      } catch (err) {
        console.log("XBOX ERROR: ", err)
      }  
    }
  } 

  render();

  requestAnimationFrame( tick );

  checkPointerControls()
};

window.addEventListener('click', function () {
  console.log(mainScene.children)
})

function checkCameraPosition(currentPos)  {
 // console.log(currentPos)

 // zone 1
 if(currentPos.x > 600 && currentPos.x < 850) {
  if(currentPos.z < -600 && currentPos.z > -850) {
    window.ZONE = "ONE"
    loadZones()
  }
}

 // zone 2
 if(currentPos.x < -600 && currentPos.x > -850) {
   if(currentPos.z < -600 && currentPos.z > -850) {
     window.ZONE = "TWO"
     loadZones()
   }
 } 
}
function loadZones() {
  dynamicLoaded = false;

  switch(window.ZONE) {
    case "ONE":
      if(!dynamicLoaded) loadZoneOne()
      break;
    case "TWO":
      if(!dynamicLoaded) loadZoneTwo()
      break;
    // case "THREE":
    //   if(!dynamicLoaded) loadZoneTHREE()
    //   break;
  } 
}

// including animation loop
function render() {

  const time = performance.now();
  if(accSteps > 1000) {
    initSteps()
    // switchDistrictBySteps()
  }

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();     

  var delta = clock.getDelta();

  // if(currentScene.name === "D_TWO") {
    if(window.mixers.length > 0) {
      window.mixers.forEach(mixer => mixer.update(delta))
      // mixer.update(delta);
    }  
  // }

  renderer.autoClear = true;
  renderer.clear();
  renderer.render( mainScene, camera );
  stats.update()
}

function initSteps() {
  // Init Steps
  console.log("Init steps")
  accSteps = 0;
  stepProgress(0);
}

function init() {

  if(!WEBGL.isWebGLAvailable()) {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );
  } else {
    console.log("init")
    initStats();
    main()
    tick();
  }
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

function main() {
  // Object
 const geometry = new THREE.BoxGeometry(50, 50, 50)
 const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
 const mesh = new THREE.Mesh(geometry, material)

 mainScene.add(mesh)

 // grounds
 const ground1 = generateGround();
 ground1.position.set(750, -10, -750)
 mainScene.add(ground1);

 const ground2 = generateGround();
 ground2.position.set(-750, -10, -750)
 mainScene.add(ground2)

 const ground3 = generateGround();
 ground3.position.set(0, -10, 750)
 mainScene.add(ground3)

 for (let i = 0; i < MONUMENTS_GLB.length; i++) {
   const monuments = MONUMENTS_GLB[i]
   try {
     onLoadAnimation(monuments.gltf, monuments)
   } catch (err) {
     console.log(err)
   }
 }
}

async function loadZoneOne() {
  for (let i = 0; i < DISTRICT_ONE_GLB.length; i++) {
    const model = DISTRICT_ONE_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model)
    } catch (err) {
      console.log(err)
    }
  }
  try {
    mainScene.traverse(obj => {
      if (typeof obj.zone === 'number') {

       if(obj.zone !== 1) {
         console.log("TRAVERSE ONE: ", obj)
         mainScene.remove(obj)
       }
     } 
   });
  } catch (err) {
   console.log(err)
  }

  dynamicLoaded = true;  
}

async function loadZoneTwo() {
 
  for (let i = 0; i < DISTRICT_TWO_GLB.length; i++) {
    const model = DISTRICT_TWO_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model)
    } catch (err) {
      console.log(err)
    }
  }

  try {
    mainScene.traverse(obj => {
      if (typeof obj.zone === 'number') {

        if(obj.zone !== 2) {
          console.log("TRAVERSE TWO: ", obj)
           mainScene.remove(obj)
        }
      }
    })
  } catch (err) {
   console.log(err)
  }

  dynamicLoaded = true;  
}


function checkPointerControls() {
  const time = performance.now();

  if ( pointerControls.isLocked === true ) {

    raycaster.ray.origin.copy( pointerControls.getObject().position );
    raycaster.ray.origin.y -= 10;

    // const intersections = raycaster.intersectObjects( objects, false );

    // const onObject = intersections.length > 0;

    // control speed of movement
    const delta = ( time - prevTime ) / 300;  // larger dividend, slower

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

function onLoadAnimation(model, data) {
 // console.log("load animated models: ", data)
 const { posX, posY, posZ, rx, ry, rz } = data
 if(model){
   model.scene.position.set(posX, posY, posZ);
   model.scene.rotation.set(rx, ry, rz);
   model.scene.rotation.y = Math.PI/2.0; // face front  
 }

 if(data.scale) {
   const inputScale = data.scale
   model.scene.scale.set(inputScale, inputScale, inputScale)
 } else if(!data.type) {
   model.scene.scale.set(10, 10, 10);
 } else if(data.type === "monument"){
   model.scene.scale.set(25, 25, 25);
 }

 if(model.animations.length) {
   let mixer = new THREE.AnimationMixer(model.scene);
   window.mixers.push(mixer)

   var action = mixer.clipAction(model.animations[0])
   action.play();   
 }

 if(data.zone) {
   model.scene.zone = data.zone
 }

 mainScene.add(model.scene)

}