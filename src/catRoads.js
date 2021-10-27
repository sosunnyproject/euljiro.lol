import * as THREE from 'three';
import { Scene, Triangle } from 'three';
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl.js'
import glowFragment from './shaders/glow.frag.js';
import glowGroundFragment from './shaders/glowBottom.frag.js';

// earCone < faceCone < catMesh

export function generateTriangleCat (posX, posY, posZ) {
  const catFace = new THREE.Object3D();

  const faceGeom = new THREE.ConeGeometry(5, 4, 12, 15);
  const faceTorusGeom = new THREE.TorusGeometry(2.5, 1.5, 20, 12);
  const faceMat = new THREE.MeshPhongMaterial( {color: 0x9f8f82, transparent: true, opacity: 0.2 , wireframe: false } );
  const face = new THREE.Mesh( faceGeom, faceMat );
  // face.rotation.x = Math.PI/2.;

  {
    const position = faceGeom.attributes.position;
    const vec = new THREE.Vector3();
    const newVectors = []
    for(let i = 0, n = position.count; i < n; i++){
      vec.fromBufferAttribute(position, i);
      let value = pn.noise(vec.x / 2, vec.y / 2, 0);
      vec.z = value * 10;
  
      newVectors.push(vec.x)
      newVectors.push(vec.y)
      newVectors.push(vec.z)
    }
    groundGeometry.setAttribute('position',  new THREE.Float32BufferAttribute( newVectors, 3 ) );
  
  }

  const faceCone = new THREE.Object3D();
  faceCone.scale.set(0.5, 0.5, 0.5)
  faceCone.name = "rotate";
  faceCone.rotation.y = Math.PI/2.0;

  faceCone.add(face);

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
  
  {
    // bevel ears
    const length = 12, width = 8;
    const x = -5, y = 0;
    const shape = new THREE.Shape();
    shape.moveTo( -5, 0);
    shape.lineTo( 0, 10);
    shape.lineTo( 5, 0 );
    shape.lineTo( -5, 0 );

    const extrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 6,
      bevelOffset: -4,
      bevelSegments: 6
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshBasicMaterial( { color: 0xf5d49f, transparent: true, opacity: 0.25 } );
    const earRight = new THREE.Mesh( geometry, material ) ;
    earRight.rotation.x = Math.PI/2.0;
    earRight.rotation.z = -Math.PI/10.0;
    earRight.scale.set(0.2, 0.2, 0.2)
    earRight.position.set(4.25, -1.4, -4.5);

    const earLeft = new THREE.Mesh( geometry, material ) ;
    earLeft.rotation.x = Math.PI/2.0;
    earLeft.rotation.z = Math.PI/10.0;
    earLeft.scale.set(0.2, 0.2, 0.2)
    earLeft.position.set(-4.25, -1.4, -4.5);

    // faceCone.add(earRight)
    // faceCone.add(earLeft)
  }

  // cone ears
  {
    const geom = new THREE.TorusGeometry(1,0.8, 40, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf5d49f, transparent: true, opacity: 0.75 } );
    const earRight = new THREE.Mesh(geom, mat);
    earRight.rotation.set(Math.PI/2, 0.0, -Math.PI/3.5);
    earRight.position.set(4.25, -1.4, -4.5)

    const earLeft = new THREE.Mesh(geom, mat);
    earLeft.rotation.set(Math.PI/2, 0.0, Math.PI/1.5);
    earLeft.position.set(-4.25, -1.4, -4.5)

    faceCone.add(earRight)
    faceCone.add(earLeft)
  }
  /*
  { 
    // ears
    const geom = new THREE.ConeGeometry(3, 2, 3, 6);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf5d49f, transparent: true, opacity: 0.7, wireframe: false });
    const earLeft = new THREE.Mesh(geom, mat);
    faceCone.add(earLeft)

    earLeft.position.set(-4.75, -1.0, -3.2);
    earLeft.rotation.y = -Math.PI/16.0;
    earLeft.scale.set(0.53, 0.65, 0.65)

    const earRight = new THREE.Mesh(geom, mat);
    faceCone.add(earRight)

    earRight.position.set(4.75, -1.0, -3.2);
    earRight.scale.set(0.53, 0.65, 0.65)
    earRight.rotation.y = Math.PI/16.0;
  }
  */

  /*
  {
    // nose
    const geom = new THREE.ConeGeometry(1, 2, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf5d49f, transparent: true, opacity: 0.7, wireframe: false });
    const nose = new THREE.Mesh(geom, mat);
    nose.rotation.y = Math.PI;
    nose.scale.set(0.5, 0.5, 0.5)
    
    faceCone.add(nose)

    nose.position.y = 3.0;
  }
  */

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

export function generateFloorNeons(colorVector, size) {

    const point = new THREE.ConeGeometry(size, size+0.25, 3 );
    const material = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2() },
        u_color: { value: colorVector }
      },
      vertexShader: vertexShader,  
      fragmentShader: glowGroundFragment
    } )

    const ball = new THREE.Mesh(point, material)
    ball.position.y = 6.0
    return ball
  }