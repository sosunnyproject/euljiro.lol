import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt } from './utils.js';
import { generateTriangleCat, generateTriangleGround, generateFloorNeons } from './models/catRoads.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import HelveticaSample from 'three/examples/fonts/helvetiker_bold.typeface.json'
import gardenImg from '../assets/png/gardenSquare.png'

export function generateDistrictOneObjects() {

 let arr = []

 
 {
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1.5;
  const light = new THREE.AmbientLight(skyColor, intensity);
  
  arr.push(light)
}

 {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 60, 80);
  const material = new THREE.MeshPhongMaterial( {color: 0x112211 });
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -Math.PI/2;

  arr.push(plane)
 }

 for(let x = -2000; x < 2000; x += 50) {
   const ball = generateFloorNeons(new THREE.Vector3(242/255, 227/255, 19/255), 10.5)
   ball.rotation.y = Math.PI/2.0;
   ball.position.set(x, 1.5, 0)
   
   arr.push(ball)
 }

 for(let z = -2000; z < 2000; z+= 50) {
  const ball = generateFloorNeons(new THREE.Vector3(100/255, 34/255, 242/255), 10.5)
  ball.rotation.y += Math.PI;
  ball.position.set(0, 1.5, z)

  arr.push(ball)
}

for(let z = -2000; z < 2000; z+= 50) {
  const ball = generateFloorNeons(new THREE.Vector3(0, 241/255, 255/255), 10.5)
  ball.rotation.y += Math.PI;
  ball.position.set(z, 1, z)

  arr.push(ball)
}

for(let z = -2000; z < 2000; z+= 30) {
  const ball = generateFloorNeons(new THREE.Vector3(100/255, 21/255, 25/255), 10.5)
  ball.rotation.y += Math.PI;
  ball.position.set(-1*z, 1, z)

  arr.push(ball)
}

for(let z = -1000; z < 1000; z+= 30) {
  const ball = generateFloorNeons(new THREE.Vector3(10/255, 221/255, 25/255), 10.5)
  ball.rotation.y += Math.PI;
  ball.position.set(-2*z, 1, z)

  arr.push(ball)
}


for(let z = -1000; z < 1000; z+= 30) {
  const ball = generateFloorNeons(new THREE.Vector3(10/255, 221/255, 25/255), 10.5)
  ball.rotation.y += Math.PI;
  ball.position.set(2*z, 1, z)

  arr.push(ball)
}

 const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.
 arr.push(axes)

  // Particles
  const particlesGeometry = new THREE.SphereGeometry(5, 32, 32)
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
  })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  arr.push(particles)

  // cube
  {
    const loader = new THREE.CubeTextureLoader();

    const textureCube = loader.load( [
      gardenImg, gardenImg,
      gardenImg, gardenImg,
      gardenImg, gardenImg
    ] );

    const geometry = new THREE.BoxGeometry( 100, 100, 100);
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x -= 1000
    arr.push(cube)

  }

  {
    // Text
    const textGeometry = new TextGeometry(
      '영아크릴',
      {
        font: window.UHBEE_FONT,
        size: 2,
        height: 1,
        curveSegments: 12, 
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0, 
        bevelSegments: 5
      }
    )
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x89BBFE })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.position.set(100, 55, 50)
    text.scale.set(5, 5, 5)
    text.rotateY(Math.PI/2)
    text.rotateX(Math.PI/4.0)

    arr.push(text)
  }

 return arr;
}