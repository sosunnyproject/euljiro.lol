import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl.js'
import fragmentShader from '../shaders/fragment.glsl.js'
import glowFragment from '../shaders/glow.frag.js';
import glowGroundFragment from '../shaders/glowBottom.frag.js';
import Perlin from '../../libs/perlin.js';

export default class FloorNeons extends THREE.Object3D {

 constructor(params) {
   super()

 }

 render() {
  const cone = new THREE.ConeGeometry(size, size+0.25, 3 );
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_color: { value: colorVector }
    },
    vertexShader: vertexShader,  
    fragmentShader: glowGroundFragment
  } ) 

  const mesh = new THREE.Mesh(cone)
  const mergedGeometry = new THREE.BufferGeometry()

  for ( let i = 0 ; i < 25 ; i ++ ) {
   const nodeGeometry = cone.clone()
   nodeGeometry.translate(random(),random(),random())
   mergedGeometry.merge(nodeGeometry)
   }

   const coneCluster = new THREE.Mesh( mergedGeometry, material)
 }

}