import * as THREE from 'three';

export default class FarBackground extends THREE.Mesh {
  constructor(texture, position) {

   const loader = new THREE.CubeTextureLoader();
 
   const textureCube = loader.load( [
    texture, texture,
    texture, texture,
    texture, texture
   ] );

   const geometry = new THREE.DodecahedronGeometry( 600 );
   const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )

   super(geometry, material)

   const {x, y, z} = position;

   this.x = x;
   this.y = y;
   this.z = z

   this.render()

  }

  render(){

   this.position.set(this.x, this.y, this.z)
   this.rotation.set(Math.PI/4, 0, Math.PI/6)
  }

  tick(time) {
   // this.clear()
   this.rotateY(time*0.0002) 
   this.rotateX(time*0.0003) 
   this.rotateZ(time*0.0002) 
  }

 }