import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';
import { generateTriangleCat, generateTriangleGround, generateFloorNeons } from './catRoads.js';

export function generateDistrictOneObjects() {

 let districtOneChildren = []

 // cats
 {
   const cat = generateTriangleCat(-200, 30, 0);

   // left edge
   const cat1 = generateTriangleCat(-120, 30, 60);
   cat1.rotation.y = Math.PI/4.0;

   const cat2 = generateTriangleCat(-40, 30, 110);
   cat2.rotation.y = Math.PI/3.0;

   const cat3 = generateTriangleCat(40, 30, 140);
   cat3.rotation.y = Math.PI/3.0;

   const cat4 = generateTriangleCat(120, 30, 170);
   cat4.rotation.y = Math.PI/2.5;

   // left corner
   const cat5 = generateTriangleCat(200, 30, 180);
   cat5.rotation.y = Math.PI/1.5;

   districtOneChildren.push(cat, cat1, cat2, cat3, cat4, cat5)
 }
 {
   // right edge
   const cat1 = generateTriangleCat(-120, 30, -60);
   cat1.rotation.y = -Math.PI/4.0;

   const cat2 = generateTriangleCat(-40, 30, -110);
   cat2.rotation.y = -Math.PI/3.0;

   const cat3 = generateTriangleCat(40, 30, -140);
   cat3.rotation.y = -Math.PI/3.0;

   const cat4 = generateTriangleCat(120, 30, -170);
   cat4.rotation.y = -Math.PI/3.0;

   // corner
   const cat5 = generateTriangleCat(200, 30, -180);
   cat5.rotation.y = -Math.PI/1.5

   districtOneChildren.push(cat1, cat2, cat3, cat4, cat5)
 }
 {
   // bottom edge
   const cat1 = generateTriangleCat(240, 30, 120);
   cat1.rotation.y = -Math.PI;

   const cat2 = generateTriangleCat(240, 30, 40);
   cat2.rotation.y = -Math.PI;

   const cat3 = generateTriangleCat(240, 30, -40);
   cat3.rotation.y = -Math.PI;

   const cat4 = generateTriangleCat(240, 30, -120);
   cat4.rotation.y = -Math.PI;

   districtOneChildren.push(cat1, cat2, cat3, cat4)
 }

 {
   const ground = generateTriangleGround()

   districtOneChildren.push(ground)
 }

 {
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 0.25;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  
  districtOneChildren.push(light)
}

 for(let i = -180; i < 200; i+= 50) {
   const ball = generateFloorNeons()
   ball.position.set(i, 6, 0)
   
   districtOneChildren.push(ball)
 }

 const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.

 districtOneChildren.push(axes)

 return districtOneChildren;
}