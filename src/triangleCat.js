import * as THREE from 'three';

// earCone < faceCone < catMesh

export function generateTriangleCat () {
  const catMesh = new THREE.Object3D();
  const catFace = new THREE.Object3D();

  const faceGeom = new THREE.ConeGeometry( 5, 6, 8);
  const faceMat = new THREE.MeshPhongMaterial( {color: 0x5b917c} );
  const faceCone = new THREE.Mesh( faceGeom, faceMat );
  faceCone.name = "rotate";
  faceCone.rotation.y = Math.PI/2.0;

  {
    const geom = new THREE.ConeGeometry(3, 4, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0x11ffee });
    const earCone = new THREE.Mesh(geom, mat);
    faceCone.add(earCone)

    earCone.position.set(-5.25, -1.0, -3.5);
    earCone.rotation.y = -Math.PI/16.0;
    earCone.scale.set(0.8,0.8,0.8)
    earCone.name = "rotateY"
  }

  {
    const geom = new THREE.ConeGeometry(3, 4, 3);
    const mat = new THREE.MeshPhongMaterial( { color: 0x11ffee });
    const earCone = new THREE.Mesh(geom, mat);
    faceCone.add(earCone)

    earCone.position.set(5.25, -1.0, -3.5);
    earCone.scale.set(0.8,0.8,0.8);
    earCone.rotation.y = Math.PI/16.0;
    earCone.name = "rotateY"
  }

  { // eyes
    const geom = new THREE.ConeGeometry(1, 1, 3);
    const mat = new THREE.MeshToonMaterial( { color: 0x39ff14 } );
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
    const geom = new THREE.ConeGeometry(4, 8, 12);
    const mat = new THREE.MeshNormalMaterial( { color: 0x11ffee } );
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