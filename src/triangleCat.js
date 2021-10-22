import * as THREE from 'three';
import { Scene } from 'three';

// earCone < faceCone < catMesh

export function generateTriangleCat () {
  const catMesh = new THREE.Object3D();
  const catFace = new THREE.Object3D();

  const faceGeom = new THREE.ConeGeometry( 5, 6, 8);
  const faceMat = new THREE.MeshPhongMaterial( {color: 0xbfbcba} );
  const faceCone = new THREE.Mesh( faceGeom, faceMat );
  faceCone.scale.set(0.6, 0.6, 0.6)
  faceCone.name = "rotate";
  faceCone.rotation.y = Math.PI/2.0;

  { 
    // ears
    const geom = new THREE.ConeGeometry(3, 4, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf28c0f });
    const earLeft = new THREE.Mesh(geom, mat);
    faceCone.add(earLeft)

    earLeft.position.set(-5.25, -1.0, -3.5);
    earLeft.rotation.y = -Math.PI/16.0;
    earLeft.scale.set(0.8,0.8,0.8)
  }

  {
    const geom = new THREE.ConeGeometry(3, 4, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0xf28c0f });
    const earRight = new THREE.Mesh(geom, mat);
    faceCone.add(earRight)

    earRight.position.set(5.25, -1.0, -3.5);
    earRight.scale.set(0.8,0.8,0.8);
    earRight.rotation.y = Math.PI/16.0;
  }

  { // eyes
    const geom = new THREE.ConeGeometry(1, 1, 3);
    const mat = new THREE.MeshToonMaterial( { color: 0xF2CF1D } );
    const eye1 = new THREE.Mesh(geom, mat)
    const eye1_1 = new THREE.Mesh(geom, mat)
    const eye2 = new THREE.Mesh(geom, mat)
    const eye2_1 = new THREE.Mesh(geom, mat)
    eye1.add(eye1_1)
    eye2.add(eye2_1)
    faceCone.add(eye1)
    faceCone.add(eye2)

    eye1.position.set(-2.8, 1.0, -1.0);
    eye1.scale.set(0.8, 0.8, 0.8);
    eye1_1.position.set(0, 0, -1.0);
    eye1_1.rotation.y = Math.PI/3;

    eye2.position.set(2.8, 1.0, -1.0);
    eye2.scale.set(0.8, 0.8, 0.8);
    eye2_1.position.set(0, 0, -1.0);
    eye2_1.rotation.y = Math.PI/3;
  }

  {
    // body
    const geom = new THREE.ConeGeometry(4, 8, 6);
    const mat = new THREE.MeshNormalMaterial({color: 0xF2CF1D , side: THREE.DoubleSide, shininess: 50, flatShading: true } );
    const body = new THREE.Mesh(geom, mat);
    catMesh.add(body)
    
    body.position.y = 6.0;
    body.position.x = -0.5;
  }

  catFace.add(faceCone);
  catFace.rotation.z = -Math.PI/2;
  catFace.position.y = 10.0;
  catMesh.receiveShadow = true;
  catMesh.castShadow = true;

  catMesh.add(catFace)

  return catMesh;
}