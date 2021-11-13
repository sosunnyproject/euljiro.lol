import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt } from './utils.js';
import { generateTrafficCone } from './models/TrafficCone.js';
import { generateTriangleCat, generateTriangleGround, generateFloorNeons } from './models/catRoads.js';
import { generateBirdBot } from './models/birdBot.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import HelveticaSample from 'three/examples/fonts/helvetiker_bold.typeface.json'

export function generateDistrictOneObjects() {

 let arr = []

 {
   const ground = generateTriangleGround()

   arr.push(ground)
 }

 {
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1.5;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  
  arr.push(light)
}

 for(let x = -180; x < 200; x += 20) {
   const ball = generateFloorNeons(new THREE.Vector3(242/255, 227/255, 19/255), 1.5)
   ball.rotation.y = Math.PI/2.0;
   ball.position.set(x, 1.5, 0)
   
   arr.push(ball)
 }

 for(let z = -100; z < 110; z+= 10) {
  const ball = generateFloorNeons(new THREE.Vector3(100/255, 34/255, 242/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(0, 1.5, z)

  arr.push(ball)
}
let tempX = 200;
for(let z = -180; z < 65; z+= 5) {
  const ball = generateFloorNeons(new THREE.Vector3(0, 241/255, 255/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(tempX, 1, z)

  arr.push(ball)
  tempX -= 5.5;
}

let tempX1 = 200;
for(let z = 180; z > -65; z -= 5) {
  const ball = generateFloorNeons(new THREE.Vector3(239/255, 71/255, 111/255), 1.5)
  ball.rotation.y += Math.PI;
  ball.position.set(tempX1, 1, z)

  arr.push(ball)
  tempX1 -= 5.5;
}

 const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.
 arr.push(axes)


  // Text Geometry
  const fontLoader = new FontLoader()
  const HelveticaSample = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json"

  fontLoader.load(
    HelveticaSample,
    (font) => {
      console.log("font loaded")
      const textGeometry = new TextGeometry(
        'HelloThreeJS',
        {
          font: font,
          size: 10,
          height: 1,
          curveSegments: 12, 
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0, 
          bevelSegments: 5
        }
      )
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff1100 })
      const text = new THREE.Mesh(textGeometry, textMaterial)
      text.position.set(10, 15, 0)
      text.scale.set(10, 10, 10)
      console.log(textGeometry, text)
      arr.push(text)
    },
    // onProgress callback
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    }
  )

  // Particles
  const particlesGeometry = new THREE.SphereGeometry(5, 32, 32)
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
  })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  arr.push(particles)

 return arr;
}