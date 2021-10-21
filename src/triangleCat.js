import * as THREE from 'three';

// earCone < faceCone < catMesh

export function generateTriangleCat () {
  const catMesh = new THREE.Object3D();

  const faceGeom = new THREE.ConeGeometry( 5, 6, 8);
  const faceMat = new THREE.MeshPhongMaterial( {color: 0x5b917c} );
  const faceCone = new THREE.Mesh( faceGeom, faceMat );
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

    earCone.position.set(5.24, -1.0, -3.5);
    earCone.scale.set(0.8,0.8,0.8);
    earCone.rotation.y = Math.PI/16.0;
    earCone.name = "rotateY"
  }

  faceCone.name = "rotate";
  catMesh.add(faceCone);
  catMesh.rotation.z = -Math.PI/2;
  catMesh.receiveShadow = true;
  catMesh.castShadow = true;
  catMesh.position.y = 10.0;
  catMesh.name = "rotate";
  
  console.log(catMesh)

  return catMesh;
}