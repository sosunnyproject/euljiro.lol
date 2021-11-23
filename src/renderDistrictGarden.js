// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';

import { getRandomArbitrary, getRandomInt } from './utils.js';
import { generateShaderTree, generateTree } from './models/trees.js';
import { generateMushroom } from './models/mushrooms.js';
import { generateGround } from './models/ground.js';
import cloudsFragment from './shaders/clouds.frag.js';
import vertexShader from './shaders/vertex.glsl.js';
import skyVertex from './shaders/skyVertex.glsl.js';
import skyFrag from './shaders/skyFrag.glsl.js';
import { FlowerPetals } from './models/flowerPetals.js';
import { generateLsystemTree } from './lsystem/wrapper.js';
import { floorPowerOfTwo } from 'three/src/math/mathutils';
import AnimatedFlower from './models/AnimatedFlower.js';
import { ZONE_POS } from './globalConstants.js';
import { Mesh } from 'three';

export function generateDistrictGardenObjects() {
  const arr = []

  // const shaderTree = generateShaderTree(10, -2, 0)

  // mushrooms
  const m = generateMushroom()
  arr.push(m)

  // ground plane
  const groundMesh = generateGround();
  
  // torus knot
  // const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  // const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });
  // const torusKnot = new THREE.Mesh( torusKnotGeom, torusKnotMat );
  // torusKnot.position.y = 90;
  // torusKnot.position.z = -40;
  // torusKnot.rotation.y = Math.PI/2;

  // for(let i = 0; i < 10; i++){
  //   const torusClone = torusKnot.clone();
  //   torusClone.position.set(getRandomInt(-2000, 2000), 400, getRandomInt(-2000, 2000))
  //   torusClone.scale.set(2, 2, 2)
  //   arr.push(torusClone)
  //  }

  const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  torusKnotGeom.scale(2, 2, 2)

   const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });

   const torusMesh = new THREE.InstancedMesh(torusKnotGeom, torusKnotMat, 30)
   
   for(let i = 0; i < 50; i++)
   {
       const position = new THREE.Vector3(getRandomInt(-800, 800), getRandomInt(500, 2000), getRandomInt(-800, 800))

       const quaternion = new THREE.Quaternion()
       quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

       const matrix = new THREE.Matrix4()
       matrix.makeRotationFromQuaternion(quaternion)
       matrix.setPosition(position)

       torusMesh.setMatrixAt(i, matrix)
   }

   arr.push(torusMesh)

  const axes = new THREE.AxesHelper(20);

  // arr.pus(m, groundMesh, torusKnot, torus2, axes)

  // env
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.35 );
  hemiLight.position.set( 0, 50, 0 );
  // arr.push( hemiLight );

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
    // arr.push( sky );
  }
  
  // tree object
  for(let i = 0; i < 50; i++){
    const position = {
      x: getRandomArbitrary(1000, -2000), 
      y: 0, 
      z: getRandomArbitrary(-3000, 3000)
    }
    const tree = generateTree(position)
    arr.push(tree);  
  }
  /*
  for(let i = 0; i < 100; i++){
    const x = getRandomArbitrary(2000, 3000)
    const tree = generateTree(x + ZONE_POS.ONE.x, 0, getRandomArbitrary(-5000, 50))
    arr.push(tree);  
  }
  */
  

 {
   const skyColor = 0xB1E1FF;  // light blue
   const groundColor = 0xB97A20;  // brownish orange
   const intensity = 1;
   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

   const spotlight = new THREE.SpotLight(0xffffff, 0.3)
   spotlight.position.set(-40, 100, -10);
  //  spotlight.castShadow = true;

  //  arr.push(light, spotlight)
 }

  {
    // lsystem trees
    
  const lsystemTree = generateLsystemTree("ffBAf>A", "^fB++fB<<fvB", "f<f>B>f--AvA", 5, 0.08, 2.0);
  lsystemTree.position.set(30, 0, -60)

  const lsystemTree1 = generateLsystemTree("ffAf>B", "^fB++fAvvB", "f<B+f--vA", 5, 0.05, 1.5);
  lsystemTree1.position.set(-60, 0, 60)

  // const lsystemTree2 = generateLsystemTree("ffBAf>A", "^ffAvvfB+fv--B", "f<A>B<f--A+B", 4, 0.1, 1.8);
  const CenterTree = generateLsystemTree("ffBAf>AB", "^ffA<<fB+fvB", "f<B>ff>++A", 7, 0.08, 2.5);
  CenterTree.position.set(0, 0, 0);
  CenterTree.scale.set(80, 80, 80);

  // for(let i = 0; i < 10; i++){
  //   const ltreeClone =lsystemTree.clone()
  
  //   ltreeClone.position.set(getRandomInt(-1000, 1000), 0, getRandomInt(-1000, 1000))
  //   arr.push(ltreeClone)
  //  }

  arr.push(CenterTree)
  }

  // math rose   
  const flower1 = new FlowerPetals(4, 12)
  flower1.position.set(70, 20, 20)
  // arr.push(flower1)

  
  const flower3 = new AnimatedFlower({
    numerator: 4, 
    denominator: 7
  })
  flower3.position.set(100, 100, -200)
  arr.push(flower3)

  let petalN = 4, petalD = 9;
  // const flower2 = new FlowerPetals(6.5, 7.4)
  const flower2 = new AnimatedFlower({
    numerator: 6.5, 
    denominator: 7.4,
    angleGap: 0.8
  })
  flower2.position.set(70, 20, -20)

  arr.push(flower2)


 return arr;
}