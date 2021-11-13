// https://jsfiddle.net/f2Lommf5/12523/
import * as THREE from 'three';

export default class AnimatedFlower extends THREE.Object3D {

 constructor(params) {
   super()
   
   const { numerator, denominator, angleGap } = params;
   this.n = numerator;
   this.d = denominator;
   this.k = this.n/this.d;
   this.angle = angleGap || 0.5;
   this.amplitude = 30;
   this.rotationY = Math.PI/2.0;
   this.scaleNum = 1;

   this.renderPetal()

   if(this.scaleNum !== 1) {
     this.scale.set(this.scaleNum, this.scaleNum, this.scaleNum);
   }
   this.rotateY(this.rotationY);
 }

  // Flower Leaf
  renderPetal() {
    const radius = 6;
    let petalMat = new THREE.MeshPhongMaterial({color: 0xeaeaea, side: THREE.DoubleSide});
    let petalGeom = new THREE.SphereBufferGeometry(radius, 20, 20, Math.PI / 3.0, Math.PI / 3.0);
    petalGeom.translate(0, -radius, 0);
    petalGeom.rotateX(-Math.PI);

    for(let i = 0; i < Math.PI * 2.0 * this.d; i += this.angle) {
      let radial = this.amplitude * Math.cos(this.k * i)
      let x = radial * Math.cos(i)
      let y = radial * Math.sin(i)

      // const lathe = new THREE.LatheGeometry( points );
      // var cubeGeom = new THREE.BoxGeometry(2, 2, 2);
      // var cubeMat = new THREE.MeshPhongMaterial({ color: 0x7209b7 })
      var mesh = new THREE.Mesh(petalGeom, petalMat);
      mesh.rotateZ(i * Math.PI/4.0)
      mesh.position.set(x, y, 0)
      this.add(mesh)
    }
  }

  tick(time) {
    // let time = performance.now();

    this.clear()
    let petalN = Math.abs(Math.cos(time/3000)*4) + 1
    let petalD = Math.abs(Math.sin(time/3000)*9) + 1
    this.n = petalN
    this.d = petalD

    this.renderPetal()
  }
}