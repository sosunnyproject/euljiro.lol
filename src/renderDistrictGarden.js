// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { generateShaderTree, generateTree } from './trees.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';
import cloudsFragment from './shaders/clouds.frag.js';
import vertexShader from './shaders/vertex.glsl.js';
import skyVertex from './shaders/skyVertex.glsl.js';
import skyFrag from './shaders/skyFrag.glsl.js';

export function generateDistrictGardenObjects() {
  const arr = []

  const shaderTree = generateShaderTree(10, -2, 0)

  // mushrooms
  const m = generateMushroom()

  // ground plane
  const groundMesh = generateGround();
  
  // torus knot
  const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });
  const torusKnot = new THREE.Mesh( torusKnotGeom, torusKnotMat );
  torusKnot.position.y = 90;
  torusKnot.position.z = -40;
  torusKnot.rotation.y = Math.PI/2;

  const torus2 = new THREE.Mesh( torusKnotGeom, torusKnotMat );
  torus2.position.y = 80;
  torus2.position.z = 60;
  torus2.rotation.y = Math.PI/2;
  torus2.scale.set(0.6, 0.6, 0.8)

  const axes = new THREE.AxesHelper(20);

  arr.push(shaderTree, m, groundMesh, torusKnot, torus2, axes)

  // env
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 50, 0 );
  arr.push( hemiLight );

  // SKYDOME
  {
    const uniforms = {
      "topColor": { value: new THREE.Color( 0x0077ff ) },
      "bottomColor": { value: new THREE.Color( 0xffffff ) },
      "offset": { value: 33 },
      "exponent": { value: 0.6 }
    }
    const skyGeo = new THREE.SphereGeometry( 1000, 32, 32 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFrag,
      side: THREE.BackSide
    } );
    uniforms[ "topColor" ].value.copy( hemiLight.color );
    const sky = new THREE.Mesh( skyGeo, skyMat );
    arr.push( sky );
  }
  
  // tree object
  for(let i = 0; i < 40; i++){
   const x = getRandomArbitrary(-200, 200)
   const tree = generateTree(x, 15, getRandomArbitrary(-100, 100))
   arr.push(tree);  
  }

 {
   const skyColor = 0xB1E1FF;  // light blue
   const groundColor = 0xB97A20;  // brownish orange
   const intensity = 1;
   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

   const spotlight = new THREE.SpotLight(0xffffff, 0.3)
   spotlight.position.set(-40, 100, -10);
   spotlight.castShadow = true;

   arr.push(light, spotlight)
 }

 // test math rose
{
  const collection = new THREE.Object3D()
  const n = 4;
  const d = 9;
  const k = n / d;
  const angle = 0.5;

  // lathe
  const points = [];
  for ( let i = 0; i < 10; i ++ ) {
    points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 5, ( i - 5 ) * 2 ) );
  }


  // heart shape
  const x = 0, y = 0;
  const heartShape = new THREE.Shape();

  heartShape.moveTo( x + 5, y + 5 );
  heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
  heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
  heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
  heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
  heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
  heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

  const heartGeom = new THREE.ShapeGeometry( heartShape );

  for(let i = 0; i < Math.PI * 2.0 * d; i += angle) {
    let r = 30 * Math.cos(k * i)
    let x = r * Math.cos(i)
    let y = r * Math.sin(i)


    // const lathe = new THREE.LatheGeometry( points );
    // var cubeGeom = new THREE.BoxGeometry(2, 2, 2);
    var cubeMat = new THREE.MeshPhongMaterial({ color: 0x7209b7 })
    var mesh = new THREE.Mesh(heartGeom, cubeMat);
    // mesh.rotation.x = -Math.PI/2
    mesh.position.set(x, y, 0)
    mesh.scale.set(0.5, 0.5, 0.5)
    collection.add(mesh)
  }
  console.log(collection)
  collection.position.set(70, 20, 20)
  collection.rotation.y = Math.PI/2.0

  arr.push(collection)
}

 return arr;
}