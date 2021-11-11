import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { getRandomArbitrary, getRandomInt } from './utils.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';
import { generateTrafficCone } from './models/TrafficCone.js';
import { generateTriangleCat, generateTriangleGround, generateFloorNeons } from './models/catRoads.js';
import { generateBirdBot } from './models/birdBot.js';

export function generateDistrictOneObjects() {

 let arr = []

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

  //  arr.push(cat, cat1, cat2, cat3, cat4, cat5)
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

  //  arr.push(cat1, cat2, cat3, cat4, cat5)
 }
 {
   // bottom edge
   const cat1 = generateTriangleCat(240, 30, 135);
   cat1.rotation.y = -Math.PI;

   const cat2 = generateTriangleCat(240, 30, 50);
   cat2.rotation.y = -Math.PI;

   const cat3 = generateTriangleCat(240, 30, -40);
   cat3.rotation.y = -Math.PI;

   const cat4 = generateTriangleCat(240, 30, -130);
   cat4.rotation.y = -Math.PI;

  //  arr.push(cat1, cat2, cat3, cat4)
 }

 {
   const ground = generateTriangleGround()

   arr.push(ground)
 }

 {
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1.5;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  
  arr.push(light)
}

 for(let x = -180; x < 200; x += 20) {
   const ball = generateFloorNeons(new THREE.Vector3(242/255, 227/255, 19/255), 1.5)
   ball.rotation.y = Math.PI/2.0;
   ball.position.set(x, 1.5, 0)
   
   arr.push(ball)
 }

 for(let z = -100; z < 110; z+= 10) {
  const ball = generateFloorNeons(new THREE.Vector3(100/255, 34/255, 242/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(0, 1.5, z)

  arr.push(ball)
}
let tempX = 200;
for(let z = -180; z < 65; z+= 5) {
  const ball = generateFloorNeons(new THREE.Vector3(0, 241/255, 255/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(tempX, 1, z)

  arr.push(ball)
  tempX -= 5.5;
}

let tempX1 = 200;
for(let z = 180; z > -65; z -= 5) {
  const ball = generateFloorNeons(new THREE.Vector3(239/255, 71/255, 111/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(tempX1, 1, z)

  arr.push(ball)
  tempX1 -= 5.5;
}

// cctv bird
{
  const bird = generateBirdBot();

  bird.scale.set(8.0, 8.0, 8.0);
  bird.position.y = 13.0;

  // arr.push(bird);
}

 const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.

 arr.push(axes)

 const cone = generateTrafficCone()
//  arr.push(cone);

 return arr;
}