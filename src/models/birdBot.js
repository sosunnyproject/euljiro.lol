import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl.js'
import glowGroundFragment from '../shaders/glowBottom.frag.js';

export function generateBirdBot () {
  const bird = new THREE.Object3D();

  const geom = new THREE.ConeGeometry(1.0, 1.33, 4);
  // const mat = new THREE.MeshPhongMaterial( {color: 0xf7d52b} );
  const mat = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_color: { value: new THREE.Vector3(247.0/255.0, 213.0/255.0, 43.0/255.0) }
    },
    vertexShader: vertexShader,  
    fragmentShader: glowGroundFragment
  } )

  const meshBody = new THREE.Mesh(geom, mat);
  meshBody.rotation.set(0.0, Math.PI/4, Math.PI);

  const meshEye1 = new THREE.Mesh(geom, mat);
  meshEye1.rotation.set(-Math.PI/2, 0.0, -Math.PI/2);
  meshEye1.scale.set(0.25, 0.25, 0.25)
  meshEye1.position.set(0.25, 1.25, -0.4);

  const meshEye2 = new THREE.Mesh(geom, mat);
  meshEye2.rotation.set(-Math.PI/2, 0.0, -Math.PI/2);
  meshEye2.scale.set(0.25, 0.25, 0.25)
  meshEye2.position.set(0.25, 1.25, 0.4);

  const meshHead = new THREE.Mesh(geom, mat);
  meshHead.rotation.set(0.0, Math.PI, -Math.PI/2.0);
  meshHead.scale.set(0.5, 0.5, 0.5);
  meshHead.position.set(-0.5, 1.8, 0.0);

  const wingUpperRight = new THREE.Mesh(geom, mat);
  wingUpperRight.position.set(0.0, 1.2, -1.2);
  wingUpperRight.rotation.set(-Math.PI/3, 0.0, 0.0);
  wingUpperRight.scale.set(0.5, 0.5, 0.5);

  const wingURsmall = new THREE.Mesh(geom, mat);
  wingURsmall.position.set(0.0, 1.4, -1.5);
  wingURsmall.scale.set(0.25, 0.25, 0.25);
  wingURsmall.rotation.set(THREE.Math.degToRad(-60.0), 0.0, 0.0);

  const wingLowerRight = new THREE.Mesh(geom, mat);
  wingLowerRight.position.set(0.0, -0.2, -1.0);
  wingLowerRight.rotation.set(THREE.Math.degToRad(-120.0), 0.0, 0.0);
  wingLowerRight.scale.set(0.5, 0.5, 0.5);

  const wingLRsmall = new THREE.Mesh(geom, mat);
  wingLRsmall.position.set(0.0, -0.4, -1.3);
  wingLRsmall.scale.set(0.25, 0.25, 0.25);
  wingLRsmall.rotation.set(THREE.Math.degToRad(-120.0), 0.0, 0.0);

  const wingUpperLeft = new THREE.Mesh(geom, mat);
  wingUpperLeft.position.set(0.0, 1.3, 1.2);
  wingUpperLeft.rotation.set(THREE.Math.degToRad(60.0), 0.0, 0.0);
  wingUpperLeft.scale.set(0.5, 0.5, 0.5);

  const wingULsmall = new THREE.Mesh(geom, mat);
  wingULsmall.position.set(0.0, 1.47, 1.5);
  wingULsmall.scale.set(0.25, 0.25, 0.25);
  wingULsmall.rotation.set(THREE.Math.degToRad(60.0), 0.0, 0.0);

  const wingLowerLeft = new THREE.Mesh(geom, mat);
  wingLowerLeft.position.set(0.0, -0.12, 1.0);
  wingLowerLeft.rotation.set(THREE.Math.degToRad(120.0), 0.0, 0.0);
  wingLowerLeft.scale.set(0.5, 0.5, 0.5);

  const wingLLsmall = new THREE.Mesh(geom, mat);
  wingLLsmall.position.set(0.0, -0.3, 1.3);
  wingLLsmall.scale.set(0.25, 0.25, 0.25);
  wingLLsmall.rotation.set(THREE.Math.degToRad(120.0), 0.0, 0.0);

  bird.add(meshBody);
  bird.add(meshEye1);
  bird.add(meshEye2)
  bird.add(meshHead);
  bird.add(wingUpperRight);
  bird.add(wingURsmall);
  bird.add(wingLowerRight);
  bird.add(wingLRsmall);
  bird.add(wingUpperLeft);
  bird.add(wingULsmall);
  bird.add(wingLowerLeft);
  bird.add(wingLLsmall);

  return bird;
  
 }
  