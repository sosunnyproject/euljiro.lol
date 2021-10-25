import * as THREE from 'three';
import { Scene, Triangle } from 'three';
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl.js'
import glowFragment from './shaders/glow.frag.js';

// earCone < faceCone < catMesh

export function generateTriangleCat (posX, posY, posZ) {
  const catFace = new THREE.Object3D();

  const faceGeom = new THREE.ConeGeometry(5, 4, 8);
  const faceMat = new THREE.MeshPhongMaterial( {color: 0x9f8f82, transparent: true, opacity: 0.7, wireframe: false } );
  const faceCone = new THREE.Mesh( faceGeom, faceMat );
  faceCone.scale.set(0.5, 0.5, 0.5)
  faceCone.name = "rotate";
  faceCone.rotation.y = Math.PI/2.0;

  { 
    // ears
    const geom = new THREE.ConeGeometry(3, 2, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf5d49f, transparent: true, opacity: 0.7 });
    const earLeft = new THREE.Mesh(geom, mat);
    faceCone.add(earLeft)

    earLeft.position.set(-4.75, -1.0, -3.2);
    earLeft.rotation.y = -Math.PI/16.0;
    earLeft.scale.set(0.5, 0.65, 0.65)

    const earRight = new THREE.Mesh(geom, mat);
    faceCone.add(earRight)

    earRight.position.set(4.75, -1.0, -3.2);
    earRight.scale.set(0.5, 0.65, 0.65)
    earRight.rotation.y = Math.PI/16.0;
  }

  { // eyes
    const geom = new THREE.ConeGeometry(1, 1, 3);
    const mat = new THREE.MeshToonMaterial( { color: 0xffffff } );
    const material = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2() }
      },
      vertexShader: vertexShader,  
      fragmentShader: glowFragment
    } )

    const eye1 = new THREE.Mesh(geom, material)
    const eye1_1 = new THREE.Mesh(geom, material)
    const eye2 = new THREE.Mesh(geom, material)
    const eye2_1 = new THREE.Mesh(geom, material)
    eye1.add(eye1_1)
    eye2.add(eye2_1)
    faceCone.add(eye1)
    faceCone.add(eye2)

    eye1.position.set(-2.8, 0.7, -1.0);
    eye1.scale.set(0.8, 0.8, 0.8);
    eye1_1.position.set(0, 0, -1.0);
    eye1_1.rotation.y = Math.PI/3;

    eye2.position.set(2.8, 0.7, -1.0);
    eye2.scale.set(0.8, 0.8, 0.8);
    eye2_1.position.set(0, 0, -1.0);
    eye2_1.rotation.y = Math.PI/3;

    eye1.rotation.y = -Math.PI/2;
    eye2.rotation.y = Math.PI/2;

    // const point1 = new THREE.PointLight( 0xF2CF1D, 1, 12 );
    // const point2 = new THREE.PointLight( 0xF2CF1D, 1, 12 );
    // point1.intensity = 5.0;
    // point2.intensity = 5.0;

    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.angle = 0.1;
    spotLight.intensity = 0.2;
    spotLight.position.x = -Math.PI/4;

    // eye1.add(point1);
    // eye2.add(point2);
    // catFace.add(spotLight)
  }

  catFace.add(faceCone);
  catFace.rotation.z = -Math.PI/2;
  catFace.position.set(posX || 0, posY || 0, posZ || 0)

  catFace.scale.set(15, 15, 15)
  catFace.receiveShadow = true;
  catFace.castShadow = true;

  return catFace;
  ;
}

export function generateTriangleGround() {

  var coordinatesList = [
    new THREE.Vector3(200, 0, 0),
    new THREE.Vector3(0, 400, 0),
    new THREE.Vector3(-200, 0, 0)
  ];
  const triGeom = new THREE.ShapeBufferGeometry(new THREE.Shape(coordinatesList))
  const triMat = new THREE.MeshPhongMaterial({color: 0x3f3841 , side: THREE.DoubleSide})
  const triangle = new THREE.Mesh(triGeom, triMat)

  triangle.rotation.z = Math.PI/2;
  triangle.rotation.x = Math.PI/2;
  triangle.position.x = 200;

  triangle.receiveShadow = true;

  return triangle;
}

export function generateFloorNeons() {

    const point = new THREE.ConeGeometry(6, 6, 3 );
    const material = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2() }
      },
      vertexShader: vertexShader,  
      fragmentShader: glowFragment
    } )

    const ball = new THREE.Mesh(point, material)
    ball.position.y = 6.0
    return ball
  }