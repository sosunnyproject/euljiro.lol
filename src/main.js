// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { NodePass } from 'three/examples/jsm/nodes/postprocessing/NodePass.js';
import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';

import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL';

import { getRandomArbitrary, getRandomInt, retrieveEnergy, showDescription, warnLowEnergy } from './utils.js';
import { ZONE_NAMES, ZONE_POS, ZONE_RADIUS, ZONE_RESET_POS } from './globalConstants.js';

// import model urls
import { MONUMENTS_GLB } from './models/glbLoader.js';

import { updateStepProgress, updateLoadingProgress, updateStepNum } from './utils';
import { loadAssets, loadZoneOneGLB, loadZoneThreeGLB, loadZoneTwoGLB, onLoadAnimation } from './loadAssets.js';
import { instantiateZone3 } from './renderZone3.js';
import { renderShutter } from './renderZone1.js';
import { renderSkyDome, renderGrounds, renderBackgroundTriangle, renderMountain } from './renderGlobal';
import { instantiateParkObj } from './renderZonePark.js';

let stats, camera, renderer, pointerControls;

// render pass
let composer, nodepass, screen, blurScreen;
const frame = new Nodes.NodeFrame();
// screen = new Nodes.ScreenNode();

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let popupOpen = false;
let myHeight = 50;

// raycaster
const rayOrigin = new THREE.Vector3()
const rayDirection = new THREE.Vector3( -1, 0, 0 )
const rayZ = new THREE.Vector3( 0, 0, 1 )
rayDirection.normalize()
let raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, 100); // rayOrigin, rayDirection, 0, 10
let raycaster2 = new THREE.Raycaster(rayOrigin, rayZ, 0, 100); // rayOrigin, rayDirection, 0, 10

// raycaster.set(rayOrigin, rayDirection)
let enableRaycast = false;

// Zones
window.STEP_LIMIT = 2000
window.ZONE = "ONE"
window.DYNAMIC_LOADED = false;
window.ACC_STEPS = window.STEP_LIMIT;
window.RAYOBJ = []

// Clock: autoStart, elapsedTime, oldTime, running, startTime
var clock = new THREE.Clock();

// Loading Manager for 3d models and animation
window.MIXERS = [];
const loadManager = new THREE.LoadingManager();
loadManager.onLoad = init;
const gltfLoader = new GLTFLoader(loadManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('three/examples/js/libs/draco');
gltfLoader.setDRACOLoader(dracoLoader);

const fontLoader = new FontLoader(loadManager)
const textureLoader = new THREE.TextureLoader(loadManager);

loadAssets(gltfLoader, fontLoader, textureLoader)

// Canvas
const canvas = document.querySelector('#c');
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Node Pass
nodepost = new Nodes.NodePostProcessing( renderer );

// Camera
const params = {
  fov: 60,
  aspect: 2.5, 
  zNear: 1,
  zFar: 20000
}
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
camera = makeCamera();
camera.position.x = 6550;
camera.position.y = 100;
camera.position.z = 0;  
camera.lookAt(new THREE.Vector3(750, 0, -750));

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbababa);
scene.fog = new THREE.FogExp2( 0xcdcdcd, 0.0008 );
//scene.overrideMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD580})
window.SCENE = scene;

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update();

// Pointer Lock Controls & Instructions
pointerControls = new PointerLockControls(camera, document.body);
const instructions = document.getElementById( 'instructions' );
const blocker = document.getElementById( 'blocker' );

pointerControls.addEventListener('change', function () {

  // camera position check
  let currentPos = pointerControls.getObject().position
  let currentRot = pointerControls.getObject().rotation  

  checkCameraLoadAssets(currentPos)
    
})

blocker.addEventListener( 'click', function () {
  pointerControls.lock();
} );

pointerControls.addEventListener( 'lock', function () {

  // instructions.style.display = 'none';
  blocker.style.display = 'none';

} );

pointerControls.addEventListener( 'unlock', function () {

  // blocker.style.display = 'block';
  // instructions.style.display = '';

} );

// GamePad Interaction
window.gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

// Key Controls
const onKeyDown = function ( event ) {
  updateStepNum()
  if(window.ACC_STEPS <= 0) resetPosition()

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
      if ( canJump === true ) velocity.y += 650;
      canJump = false;
      break;
    
    case 'KeyI':
      popupOpen = !popupOpen;
      console.log(popupOpen)
      togglePopup()
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

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    window.gamepadConnected = true; 
});
window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad DISconnected")
  window.gamepadConnected = false;
})

function togglePopup () {
  var popup = document.querySelector(".popup");
  if(popupOpen) {
    popup.classList.add("show");
  } else {
    popup.classList.remove("show")
  }
}

function resetPosition() {
  camera.position.x = 6550;
  camera.position.y = 100;
  camera.position.z = 0;

  if(window.ACC_STEPS <= 5) {
    console.log("체력소모")
    showDescription("체력이 소모되었습니다. 처음 위치로 돌아갑니다. 공원으로 이동해서 에너지를 채워주세요.")
    window.ACC_STEPS = window.STEP_LIMIT
  }
}

function xboxKeyPressed (gamepad) {
  if(!gamepad) {
    console.log("ERROR: XBOX CONNECTION LOST")
    return
  }

  if(window.ACC_STEPS <= 0) resetPosition()


  let currentPos = pointerControls.getObject().position
  checkCameraLoadAssets(currentPos);
  // let per = Math.floor((window.ACC_STEPS / stepLimit) * 100 )
  // updateStepProgress(per)

  const buttons = gamepad.buttons;

  if(buttons[1].touched) {  // B button
    if(!pointerControls?.isLocked) {
      console.log(pointerControls)
      console.log(pointerControls.isLocked)
      try {
        pointerControls?.lock();
      } catch (err) {
        console.log(err)
      }
    }
  }

  if(buttons[12].touched) {  // up
    moveForward = true;
    updateStepNum()
  } 
  if(!buttons[12].touched) {
    moveForward = false;
  }
  if(buttons[15].touched) {
    moveRight = true;
    updateStepNum()
  }
  if(!buttons[15].touched){
    moveRight = false;
  }
  if(buttons[13].touched) {
    moveBackward = true;
    updateStepNum()
  }
  if(!buttons[13].touched){
    moveBackward = false;
  }
  if(buttons[14].touched) {
    moveLeft = true;
    updateStepNum()
  }
  if(!buttons[14].touched){
    moveLeft = false;
  }
  if(buttons[3].pressed) {
    if ( canJump === true ) velocity.y += 650;
    canJump = false;
    return;
  }
  if(buttons[0].pressed) {
    if(buttons[0].value) {
      popupOpen = true;
      togglePopup()
    }
    return;
  }
  if(buttons[2].pressed) {
    popupOpen = false;
    console.log(popupOpen)
    togglePopup()
    return;
  }
  if(buttons[8].pressed) {
    console.log("reset")
    location.reload()
    return;
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

  // control for instruction popup slide
  if(popupOpen){
    console.log("popup? ", popupOpen)
    const btnVal = gamepad.axes[0];
    console.log(btnVal)
    const contentWindow = document.querySelector("#howtoContent")
    if(btnVal === -1) {
      contentWindow.innerText = "hello prev"
      console.log(contentWindow)
      return;
    } else if (btnVal === 1) {
      contentWindow.innerText = "hello next"
      console.log(contentWindow)
    
      return;
    }
  }
}

function tick() {
  const time = performance.now();

  // check energy progress
  let energyPercent = ((window.ACC_STEPS/window.STEP_LIMIT)*100) 
  if( energyPercent < 50 ) {
    warnLowEnergy(scene)
    gradientBlurScreen(0.005)
  } else if ( energyPercent > 50 ) {
    retrieveEnergy(scene)
    gradientBlurScreen(-0.005)

  }

  
  // gamepad
  if (window.gamepadConnected) {
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

  // update shader material
  scene.traverse(obj => {
    if(!obj.name) return;

    if(obj?.name?.includes("shader")) {
      obj.material.uniforms.u_time.value = time * 0.002; 
    }
    if(obj.name === "robotFace") {
      obj.position.y += Math.sin(time*0.001)*0.5
    }
    if(obj.name === "trees") {  // animate tree's scale
      obj.scale.x = Math.cos(time*0.0001) * 15
      obj.scale.y = Math.cos(time*0.0001) * 15
      obj.scale.z = Math.cos(time*0.0001) * 15
    }
    if (typeof obj.tick === 'function') {   // tick AnimatedFlower
      obj.tick(time);
    }
    if(obj.name.includes('apt')) { 
      const rand = obj.randomNoise;
      obj.position.y += Math.sin(time*0.0005)*rand
      // for(let i = 0; i < 10; i++) {
      //   const matrix = new THREE.Matrix4()
      //   const position = new THREE.Vector3(getRandomInt(-300, 300), 100, getRandomInt(-300, 300))
      //   matrix.setPosition(position)

      //   matrix.makeScale(getRandomInt(1, 3), 1, getRandomInt(1, 3))
      //   obj.setMatrixAt(i, matrix)
      // }

    }
  })

  render();

  requestAnimationFrame( tick );

  checkPointerControls()
};

window.addEventListener('click', function () {
  console.log(scene.children)
  console.log("check position:", pointerControls.getObject().position) 
  // console.log("check rotation:", pointerControls.getObject().rotation)
})

function checkCameraLoadAssets(currentPos)  {

 // zone 1
//  if(currentPos.x > ZONE_POS && currentPos.x < 850) {
//     if(currentPos.z < -600 && currentPos.z > -850) {
//       window.ZONE = "ONE"
//       loadZones()
//     }
//   }

  // circle zone
  const centerX1 = ZONE_POS.ONE.x
  const centerZ1 = ZONE_POS.ONE.z
  const radius1 = ZONE_RADIUS.ONE

  const dx1 = Math.abs(currentPos.x - centerX1)
  const dz1 = Math.abs(currentPos.z - centerZ1)

  let inZone1 = dx1*dx1 + dz1*dz1 <= radius1*radius1

  // rectangle zone 500(z) x 3000(x), x: 4500
  if(4500-1500 <= currentPos.x && 4500+1500 >= currentPos.x) {
    if(currentPos.z <= 250 && currentPos.z >= -250 ) {
        inZone1 = true;
    }
  }

  // zone 1
  // let inZone1 = window.GROUNDS[0]?.boundingSphere?.containsPoint(currentPos)
  if(inZone1) {
    window.ZONE = "ONE"
    console.log("inside : ", window.ZONE)

    loadZones(window.ZONE)
    return;
  }

 // zone 2
//  if(currentPos.x < -600 && currentPos.x > -850) {
//    if(currentPos.z < -600 && currentPos.z > -850) {
//      window.ZONE = "TWO"
//      loadZones()
//    }
//  }

  const centerX2 = ZONE_POS.TWO.x
  const centerZ2 = ZONE_POS.TWO.z
  const radius2 = ZONE_RADIUS.TWO

  const dx2 = Math.abs(currentPos.x - centerX2)
  const dz2 = Math.abs(currentPos.z - centerZ2)

  let inZone2 = dx2*dx2 + dz2*dz2 <= radius2*radius2
  if(inZone2) {
    window.ZONE = "TWO"
    console.log("inside : ", window.ZONE)

    loadZones(window.ZONE)
    return;
  }

  const centerX3 = ZONE_POS.THREE.x
  const centerZ3 = ZONE_POS.THREE.z
  const radius3 = ZONE_RADIUS.THREE

  const dx3 = Math.abs(currentPos.x - centerX3)
  const dz3 = Math.abs(currentPos.z - centerZ3)

  let inZone3 = dx3*dx3 + dz3*dz3 <= radius3*radius3
  if(inZone3) {
    window.ZONE = "THREE"
    console.log("inside : ", window.ZONE)

    loadZones(window.ZONE)
    return;
  }

  // PARK
  const centerX4 = ZONE_POS.GARDEN.x
  const centerZ4 = ZONE_POS.GARDEN.z
  const radius4 = ZONE_RADIUS.GARDEN

  const dx4 = Math.abs(currentPos.x - centerX4)
  const dz4 = Math.abs(currentPos.z - centerZ4)
  let inZonePark = dx4*dx4 + dz4*dz4 <= radius4*radius4
  if(inZonePark) {
    window.DYNAMIC_LOADED = false;
    window.ZONE = "GARDEN"
    console.log("inside : ", window.ZONE)
  
    // unload all gltf
    try {
      scene.traverse(obj => {
        if (typeof obj.zone === 'number') {
            scene.remove(obj)
          }
      })
    } catch (err) {
      console.log(err)
    }
  }

  
  // OUTSIDE
  if(inZonePark + inZone1 + inZone2 + inZone3 == 0) {
    window.DYNAMIC_LOADED = false;
    console.log("outside zone")

    // unload all gltf
    try {
      scene?.traverse(obj => {
        if (typeof obj?.zone === 'number') {
            scene.remove(obj)
          }
      })
    } catch (err) {
     console.log(err)
    }
  } 

}

function loadZones(zone) {

  if(window.DYNAMIC_LOADED) return;
  console.log("loadZones called, DYNAMIC_LOADED? ", window.DYNAMIC_LOADED)

  switch(zone) {
    case "ONE":
      loadZoneOneGLB(scene)
      enableRaycast = true;
      // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      break;

    case "TWO":
      loadZoneTwoGLB(scene)
      enableRaycast = true;
      // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      break;

    case "THREE":
      loadZoneThreeGLB(scene)
      instantiateZone3(scene)
      enableRaycast = true;
      // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      break;
  }
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

    const energyHtml = document.querySelector( '.energyContainer' );
    energyHtml.style.visibility = 'visible';
  }

  window.addEventListener( 'resize', onWindowResize );

}

function disableRaycastIntersect() {
  console.log("raycast disabled")

  // rayObjects = []
  enableRaycast = false;

  window.DYNAMIC_LOADED = false;
}

function main() {
  renderer.autoClear = true;

  // Light
  const dirLight2 = new THREE.DirectionalLight( 0xB97A20 );  //0x002288
  dirLight2.position.set( -3000, 2000, -800 );
  dirLight2.intensity = 2.0
  const target2 = new THREE.Object3D()
  target2.position.set(ZONE_POS.ONE.x, ZONE_POS.ONE.y, ZONE_POS.ONE.z)
  dirLight2.target = target2
  dirLight2.name = "light"
  scene.add( dirLight2 );
  scene.add(target2)
  scene.add(dirLight2.target)
  const helper2 = new THREE.DirectionalLightHelper( dirLight2, 50 );
  scene.add( helper2 );

  const dirLight3 = new THREE.DirectionalLight( 0xB97A20 );
  dirLight3.position.set( 2000, 2000, 1000 );
  dirLight3.name = "light"
  scene.add( dirLight3 );
  const helper3 = new THREE.DirectionalLightHelper( dirLight3, 50 );
  scene.add( helper3 );

  const ambientLight = new THREE.AmbientLight( 0x777777 );
  ambientLight.intensity = 0.5;
  ambientLight.name = "light"
  scene.add( ambientLight );

  loadDefaultEnvironment()
  // initPostprocessing()  // use nodes, pass
  updateBlurMaterial() // use nodes
}

function initPostprocessing() {
  // Blur Pass
  // postprocessing
  composer = new EffectComposer( renderer );
  composer.addPass( new RenderPass( scene, camera ) );
  nodepass = new NodePass();
  composer.addPass( nodepass );
  updateBlurMaterial()
}

function updateBlurMaterial() {
  // Blur Nodes
  let size = renderer.getDrawingBufferSize( new THREE.Vector2() );

  blurScreen = new Nodes.BlurNode( new Nodes.ScreenNode() );
  blurScreen.size = new THREE.Vector2( size.width, size.height );

  nodepost.output = blurScreen;
  blurScreen.radius.x = 0;
  blurScreen.radius.y = 0;
  console.log("init -------------- ", blurScreen)
  // const bufferSize = renderer.getDrawingBufferSize( new THREE.Vector2() );
  // console.log("updateBlurMaterial buffersize? ", bufferSize)
  // const blurScreen = new Nodes.BlurNode( new Nodes.ScreenNode() );
  // blurScreen.size = new THREE.Vector2( bufferSize.width, bufferSize.height );
  // nodepass.input = blurScreen;
  // blurScreen.radius.x = -10;
  // blurScreen.radius.y = -10;
  nodepost.needsUpdate = true;
}

function gradientBlurScreen(delta) {
  if(delta < 0) {  // to CLEAR
    while(blurScreen.radius.x >= 0) {
      blurScreen.radius.x += delta
      blurScreen.radius.y += delta
    }
    return;
  }
  if(delta > 0) {  // to BLUR
    while(blurScreen.radius.x <= 5) {
      blurScreen.radius.x += delta
      blurScreen.radius.y += delta 
    }
  }
  console.log("blur nodes", blurScreen, blurScreen.radius.x)
}

function loadDefaultEnvironment() {
  
  renderGrounds(scene)
  renderShutter(scene, 50);
  renderShutter(scene, -50);

  renderMountain(scene)

  instantiateParkObj(scene)

  // renderSkyDome(scene)
  
  // monument gltf
  for (let i = 0; i < MONUMENTS_GLB.length; i++) {
    const monuments = MONUMENTS_GLB[i]
    try {
      onLoadAnimation(monuments.gltf, monuments, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // loadZoneTwoGLB(scene)
  // loadZoneThreeGLB(scene)
}

function checkPointerControls() {
  const time = performance.now();
  const currentPosition = pointerControls.getObject().position

  if ( pointerControls.isLocked === true ) {

    // jump on raycaster objects
    raycaster.ray.origin.copy(currentPosition);
    raycaster.ray.origin.x += 10;

    raycaster2.ray.origin.copy(currentPosition);
    raycaster2.ray.origin.z += 10;

    const interX = raycaster.intersectObjects( window.RAYOBJ , false )
    const interZ = raycaster2.intersectObjects(window.RAYOBJ, false)
    const intersections = interX.concat(interZ)
    // console.log("x or z ray: ",  intersections)
    const onObject = intersections.length > 0;
    // console.log(window.RAYOBJ)
    if(onObject) {
      showDescription( intersections[0].object?.name )
    }

    // control speed of movement
    const delta = ( time - prevTime ) / 250;  // larger dividend, slower

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    if ( onObject === true ) {
      console.log("JUMP YES")
      velocity.y = Math.max( 0, velocity.y);
      canJump = true;

    }

    pointerControls.moveRight( - velocity.x * delta );
    pointerControls.moveForward( - velocity.z * delta );

    pointerControls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( pointerControls.getObject().position.y < myHeight ) {

      velocity.y = 0;
      pointerControls.getObject().position.y = myHeight;

      canJump = true;

    }
  }

  prevTime = time;
}

// part of animation loop
function render() {

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();     

  var delta = clock.getDelta();

  if(window.MIXERS.length > 0) {
    window.MIXERS.forEach(mixer => {
      mixer.update(delta)
    })
  }  

  frame.update(delta)
  nodepost.render( scene, camera, frame );

  stats.update()
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

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // renderer.setSize( window.innerWidth, window.innerHeight );
  nodepost.setSize( window.innerWidth, window.innerHeight );

  // composer.setSize( window.innerWidth, window.innerHeight );

}