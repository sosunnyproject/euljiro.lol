// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';
import Perlin from '../../libs/perlin';
import vertexShader from '../shaders/vertex.glsl.js'
import cnFragment from '../shaders/cellularNoise.frag.js';
import turbulenceFragment from '../shaders/turbulence.frag.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import waterVertexShader from '../shaders/waterVertex.glsl'
import waterFragmentShader from '../shaders/waterFrag.glsl';

let date = new Date();
let pn = new Perlin('rnd' + date.getTime());


export function generateTerrain() {
 
  let depthColor = '#186691'
  let surfaceColor = '#9bd8ff'

  const waterMaterial = new THREE.ShaderMaterial({
   vertexShader: waterVertexShader,
   fragmentShader: waterFragmentShader,
   side: THREE.DoubleSide,
   uniforms:
    {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uTime: { value: 0.2 }, 
        uBigWavesSpeed: { value: 1.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(depthColor) },
        uSurfaceColor: { value: new THREE.Color(surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 2 },
    }
  })

  const planeGeometry = new THREE.PlaneGeometry(600, 600, 100, 100)

  const mesh = new THREE.Mesh(planeGeometry, waterMaterial)
  mesh.rotation.x = - Math.PI * 0.5;
  mesh.rotation.y = Math.PI/4;
  mesh.position.set(-500, 100, 0)

  return mesh;
}