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

  // plane with texture
  {
    var material = new THREE.MeshBasicMaterial();
    var loader = new THREE.TextureLoader();
    loader.load(gardenImg, 
      function ( texture ) {    
          // The texture has loaded, so assign it to your material object. In the 
          // next render cycle, this material update will be shown on the plane 
          // geometry
          material.map = texture;
          material.needsUpdate = true;
    })
    var geometry = new THREE.PlaneGeometry(900, 900, 32 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotateY(Math.PI/2)
    mesh.position.set(-1000, 500, 0)
    // arr.push(mesh)
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

  
  // cube
  {
    const loader = new THREE.CubeTextureLoader();
  
    const textureCube = loader.load( [
      gardenImg, gardenImg,
      gardenImg, gardenImg,
      gardenImg, gardenImg
    ] );

    const geometry = new THREE.BoxGeometry( 800, 800, 800);
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1600, 300, 0)
    cube.rotation.set(Math.PI/4, 0, Math.PI/6)
    arr.push(cube)
  }

 return arr;
}