// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL';

import { Loader } from 'three';
import { statSync } from 'fs';
import { getRandomArbitrary } from './utils.js';
import { ZONE_NAMES, ZONE_POS } from './globalConstants.js';

// import model urls
import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, MONUMENTS_GLB } from './models/glbLoader.js';

import { generateGround } from './models/ground.js';
import vertexShader from './shaders/vertex.glsl.js';
import fogFragment from './shaders/fog.frag.js';
import metallicFrag from './shaders/metallic.frag.js';
import { updateStepProgress, updateLoadingProgress } from './utils';
import { loadAssets } from './loadAssets.js';

let stats, camera, renderer, pointerControls;

let accSteps = 0;
let prevDistrictIndex = 1;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// raycaster
const rayOrigin = new THREE.Vector3()
const rayDirection = new THREE.Vector3( 10, 0, 10 )
rayDirection.normalize()
let raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, 10);
// raycaster.set(rayOrigin, rayDirection)
let rayObjects = []
let cubeRenderTarget2, cubeCamera2;

// Zones
window.ZONE = "ONE"
let dynamicLoaded = false;
let domeGeo;

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
const textureLoader = new THREE.TextureLoader(loadManager);

loadAssets(gltfLoader, fontLoader, textureLoader)

// Canvas
const canvas = document.querySelector('#c');
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setSize(WIDTH, HEIGHT);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Camera
const params = {
  fov: 20,
  aspect: 2.5, 
  zNear: 10,
  zFar: 4000
}
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
camera = makeCamera();
camera.position.x = 800;
camera.position.y = 1;
camera.position.z = -800;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf9f9f9);

// Light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light)

// const dirLight1 = new THREE.DirectionalLight( 0x0000ff );
// dirLight1.position.set( 1, 1, 1 );
// scene.add( dirLight1 );

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

  checkCameraPosition(currentPos)
    
})

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
  updateStepProgress(per)

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

// GamePad Interaction
let gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

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

function xboxKeyPressed (gamepad) {
  if(!gamepad) {
    console.log("ERROR: XBOX CONNECTION LOST")
    return
  }

  
  let per = Math.floor((accSteps / 1000) * 100 )
  updateStepProgress(per)

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
  const time = performance.now();

  // gamepad
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

  // update shader material
  scene.traverse(obj => {
    if(obj.name.includes("shader")) {
      obj.material.uniforms.u_time.value = time * 0.0002; 
    }
    if(!rayObjects.length && obj.name.includes("dome")){
      obj.material.uniforms.u_alpha.value -= time * 0.001;
    }
  })

  render();

  requestAnimationFrame( tick );

  checkPointerControls()
};

window.addEventListener('click', function () {
  console.log("check position:", pointerControls.getObject().position) 
  console.log("check rotation:", pointerControls.getObject().rotation)
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

  if(accSteps > 500) {
    initSteps()
    disableRaycastIntersect()
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

  // cubeCamera2.update( renderer, scene );  // render target

  renderer.autoClear = true;
  renderer.clear();
  renderer.render( scene, camera );
  stats.update()
}

function initSteps() {
  // Init Steps
  console.log("Init steps")
  accSteps = 0;
  updateStepProgress(0);
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

function disableRaycastIntersect() {
  rayObjects = []
  console.log("raycast disabled")
}

function main() {
  // const pointLight1 = new THREE.PointLight( 0xffffff );
  // pointLight1.position.set(700, 10, -600 );
  // pointLight1.castShadow = false;

  // const spot2 = new THREE.SpotLight( 0x0000ff );
  // spot2.position.set(1500, 5, -900 );
  // spot2.intensity = 2.0;
  // spot2.castShadow = false;
  // scene.add( spot2 )

  // const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
  // scene.add(ambientLight)

  // Object
  const geometry = new THREE.BoxGeometry(50, 50, 50)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 200

  scene.add(mesh)

  // grounds
  const ground1geom = new THREE.CircleGeometry(600, 600);
  ground1geom.computeVertexNormals();

  // shader material
  const metallicShader = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2(0.0, 0.0) },
      u_alpha: { value: 0.9 }
    },
    vertexShader: vertexShader,
    fragmentShader: metallicFrag,
    side: THREE.DoubleSide,
    transparent: true
  })

  // rtt test
  cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget( 256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding
  } );

  cubeCamera2 = new THREE.CubeCamera( 1, 1000, cubeRenderTarget2 );
  cubeCamera2.position.set(1200, 0, -800)

  const rttMat = new THREE.MeshBasicMaterial( {
    envMap: cubeRenderTarget2.texture,
    combine: THREE.MultiplyOperation,
    reflectivity: 1,
    side: THREE.DoubleSide
  } );

  const reflectiveMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 100.0,
    emissive: 0x000000,
    specular: 0xffffff,
    side: THREE.DoubleSide,
    reflectivity: 1.0,
    envMap: cubeRenderTarget2.texture,
    combine: THREE.MultiplyOperation,
  })
  
  const ground1 = new THREE.Mesh(ground1geom, metallicShader);
  ground1.name = "shader ground";
  ground1.rotateX(Math.PI/2)

  //  const ground1 = generateGround();
  ground1.position.set(750, -20, -750)
  scene.add(ground1);

 const ground2 = generateGround();
 ground2.position.set(-750, -10, -750)
 ground2.name = "ground2"
 scene.add(ground2)

 const ground3 = generateGround();
 ground3.position.set(0, -10, 750)
 ground3.name = "ground3"
 scene.add(ground3)

 // walls
  {
    const geometry = new THREE.PlaneGeometry(600, 1000, 1000, 100 );
    const fogShader = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2(0.0, 0.0) },
        u_alpha: { value: 0.5 }
      },
      vertexShader: vertexShader,
      fragmentShader: fogFragment,
      side: THREE.BackSide,
      transparent: true
    } );  

    const materialBack = new THREE.MeshPhongMaterial({ 
      color: 0x808080, 
      side: THREE.BackSide,  
      opacity: 0.7,
      transparent: true
    });
    const wall = new THREE.Mesh( geometry, materialBack );
    wall.position.set(750, 300, -500)
    // cube.rotateX(Math.PI/2)
    wall.name = "shader"
    // scene.add( wall );

    domeGeo = new THREE.SphereGeometry( 600, 600, 600 );
    domeGeo.rotateY(-Math.PI/3)
    domeGeo.translate(750, 0, -750)
    domeGeo.computeBoundingSphere();

    const domeWall = new THREE.Mesh(domeGeo, fogShader)
    domeWall.name = "shader dome"
    scene.add( domeWall );

    // box helper
    
    const materialFront = new THREE.MeshPhongMaterial({ 
      color: 0x808080, 
      side: THREE.DoubleSide,  
      opacity: 0.7,
      transparent: true
    });
    const wall2 = new THREE.Mesh( geometry, materialFront );
    wall2.name = "wall2"
    wall2.position.set(500, 300, -750)
    wall2.rotateY(Math.PI/2)
    // scene.add( wall2 );

    rayObjects.push(domeWall)
  }

 // monument gltf
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
    scene.traverse(obj => {
      if (typeof obj.zone === 'number') {

       if(obj.zone !== 1) {
        //  console.log("TRAVERSE ONE: ", obj)
         scene.remove(obj)
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
    scene.traverse(obj => {
      if (typeof obj.zone === 'number') {

        if(obj.zone !== 2) {
          // console.log("TRAVERSE TWO: ", obj)
           scene.remove(obj)
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
    // raycaster.ray.origin.y += 1;
    // raycaster.ray.origin.x += 2;
    // raycaster.ray.origin.z += 2

    const intersections = raycaster.intersectObjects( rayObjects, false );

    const onObject = intersections.length > 0;

    if(onObject){
      for ( let i = 0; i < intersections.length; i ++ ) {
        // console.log("INTERSECT?? ", intersections[i].object.name)
        // intersections[ i ].object.material.wireframe = true;
        console.log('intersect')
        goBack()
      }
    } 
    else {
      let contains = domeGeo?.boundingSphere?.containsPoint(camera.position)
      if(rayObjects.length && !contains) {
        console.log("contains? ", contains)
        camera.position.x = 1300;
        camera.position.z = -800;
        camera.lookAt(750, 15, -750)
      }
    }

    function goBack() {
      console.log('jump')
      canJump = true;
      const jumpCode = {code: "Space"}
      onKeyDown(jumpCode)
      velocity.y += 500 

      setTimeout(function () {
        camera.position.x = 1300;
        camera.position.z = -800;
        camera.lookAt(750, 15, -750)
      }, 10)
    }

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

    if ( onObject === true ) {

      velocity.y = Math.max( 0, velocity.y * 2 );
      canJump = true;

    }

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

 scene.add(model.scene)

}

const physicalMat = new THREE.MeshPhysicalMaterial({
  color: 0xff00ff,
  emissive: 0x00ffff,
  clearcoat: 1.0,
  metalness: 1.0,
  roughness: 0.0,
  reflectivity: 1.0,
  // envMap: cubeRenderTarget2.texture,
  // alphaMap: cubeRenderTarget2.texture,
  // map: cubeRenderTarget2.texture,
  combine: THREE.MultiplyOperation,
  side: THREE.DoubleSide,
  opacity: 0.5,
  specularColor: 0xff0000
})


const testMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.9,
  roughness: 0.0,
  // alphaMap: texture,
  // envMap: texture,
  envMapIntensity: 1.0,
  transmission: 0.58, // use material.transmission for glass materials
  specularIntensity: 1.0,
  specularColor: 0xffff00,
  opacity: 0.6,
  side: THREE.DoubleSide,
  transparent: true
})