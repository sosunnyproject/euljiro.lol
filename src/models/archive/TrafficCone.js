import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl.js'
import fragmentShader from '../shaders/fragment.glsl.js'
import glowFragment from '../shaders/glow.frag.js';
import glowGroundFragment from '../shaders/glowBottom.frag.js';

export function generateTrafficCone() {

  const trafficCone = new THREE.Object3D();

  const coneGeom = new THREE.ConeGeometry(10, 25, 50);
  const coneMat = new THREE.MeshPhongMaterial({color: 0xAE10F9});
  const cone = new THREE.Mesh(coneGeom, coneMat);

  const ringGeom1 = new THREE.TorusGeometry(4, 1.25, 20, 4);
  const ringMat = new THREE.MeshPhongMaterial( { color: 0xfffbaf } );
  const ring1 = new THREE.Mesh(ringGeom1, ringMat);
  ring1.rotation.set(-Math.PI/2, 0.0, Math.PI/2);
  cone.add(ring1);
  ring1.position.y = 6.0;
  
  const ringGeom2 = new THREE.TorusGeometry(8., 1.5, 20, 4);
  const ring2 = new THREE.Mesh(ringGeom2, ringMat);
  ring2.rotation.set(-Math.PI/2, 0.0, Math.PI/2);
  cone.add(ring2);
  ring2.position.y = 0.0;

  const ringGeom3 = new THREE.TorusGeometry(11., 1.5, 20, 4);
  const ring3 = new THREE.Mesh(ringGeom3, ringMat);
  ring3.rotation.set(-Math.PI/2, 0.0, Math.PI/2);
  cone.add(ring3);
  ring3.position.y = -6.0;

  const ringGeom4 = new THREE.TorusGeometry(14., 1.5, 20, 4);
  const ring4 = new THREE.Mesh(ringGeom4, ringMat);
  ring4.rotation.set(-Math.PI/2, 0.0, Math.PI/2);
  cone.add(ring4);
  ring4.position.y = -12.0;

  trafficCone.add(cone);
  trafficCone.scale.set(0.75, 0.75, 0.75);
  trafficCone.position.y = 12;

  return trafficCone;
}