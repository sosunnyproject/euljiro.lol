import * as THREE from 'three';

export function generateDistrictThreeObjects() {
  let arr = []

  const geometry = new THREE.BoxGeometry( 800, 800, 1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x879ead} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2;

  arr.push(plane)

  {
   const skyColor = 0xB1E1FF;  // light blue
   const groundColor = 0xB97A20;  // brownish orange
   const intensity = 0.25;
   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
   
   arr.push(light)
  }

  {
   const geometry = new THREE.BoxGeometry( 50, 100, 1 );
   const material = new THREE.MeshBasicMaterial( {color: 0x3b6f9c} );
   const cube = new THREE.Mesh( geometry, material );
   cube.position.set(400, 0, 0)
   cube.rotation.y = Math.PI/2;
   arr.push( cube );
  }

  const axes = new THREE.AxesHelper(20);  // The X axis is red. The Y axis is green. The Z axis is blue.
  arr.push(axes)

 return arr
}