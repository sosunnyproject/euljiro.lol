/**
import * as THREE from 'three';
import coffeeRiverFragment from './shaders/coffee.frag.js';
import vertexShader from './shaders/vertex.glsl.js';

export function generateDistrictTwoObjects() {
 let arr = []

 {
  const geometry = new THREE.CircleGeometry( 1000, 50 );
  const material = new THREE.MeshPhongMaterial( {color: 0x879ead} );
  const coffeeMat = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
      vertexShader: vertexShader,
      fragmentShader: coffeeRiverFragment,
      side: THREE.DoubleSide
    } );
  const plane = new THREE.Mesh( geometry, coffeeMat );
  plane.rotation.x = -Math.PI/2;

  arr.push(plane)
}
{
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  
  arr.push(light)
 }

 return arr
}
 */