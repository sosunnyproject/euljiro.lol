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

 return arr;
}