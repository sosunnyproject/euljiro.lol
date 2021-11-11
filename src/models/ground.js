// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import Perlin from '../../libs/perlin';
import vertexShader from '../shaders/vertex.glsl.js'
import cnFragment from '../shaders/cellularNoise.frag.js';
import turbulenceFragment from '../shaders/turbulence.frag.js';

let date = new Date();
let pn = new Perlin('rnd' + date.getTime());

export function generateGround() {
  var groundGeometry = new THREE.PlaneGeometry(4000, 4000, 60, 80);
  const position = groundGeometry.attributes.position;
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

  const shader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
    vertexShader: vertexShader,  
    fragmentShader: turbulenceFragment
  } );  

  // const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xccccc, side: THREE.DoubleSide });
  const groundMesh = new THREE.Mesh(groundGeometry, shader);

  groundMesh.rotation.x = -0.5*Math.PI;
  groundMesh.position.y = -5;
  groundMesh.receiveShadow = true;

  return groundMesh;
}
