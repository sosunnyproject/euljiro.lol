import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt } from './utils.js';
import { ZONE_POS, ZONE_RADIUS, ZONE_CENTER, ZONE_RESET_POS } from './globalConstants.js';
import { generateTree } from './models/trees.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import skyVertex from './shaders/skyVertex.glsl.js';
import skyFrag from './shaders/skyFrag.glsl.js';
import CircleGround from './models/CircleGround'
import vertexShader from './shaders/vertex.glsl.js';
import fogFragment from './shaders/fog.frag.js';
import coffeeRiverFragment from './shaders/coffee.frag.js';
import turbulenceFragment from './shaders/turbulence.frag.js';
import metallicFrag from './shaders/metallic.frag.js';
import newCoffeeFragment from './shaders/fog_coffee.frag.js';

export function renderInstanceTrees(num, range, translate, scale, matColor, scene) {
    const geometries = []
    const instanceNum = num
  
    const trunkGeom = new THREE.CylinderGeometry(10, 20, scale || 10, 12)
    const grassGeom = new THREE.SphereGeometry(scale || 20, 10, 12)
    trunkGeom.translate(0, scale/2, 0)
    grassGeom.translate(0, scale * 1.5, 0)
    // trunkGeom.scale(scale, scale, scale)
    // grassGeom.scale(scale, scale, scale)
  
    // const newBufferGeom = trunkGeom.merge(grassGeom)
    geometries.push(trunkGeom, grassGeom)
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
  
    const material = new THREE.MeshPhongMaterial({ color: matColor, side: THREE.DoubleSide })
  
    const mesh = new THREE.InstancedMesh(mergedGeometry, material, instanceNum)
  
    const r = ZONE_RADIUS.GARDEN

    for(let i = 0; i < instanceNum; i++)
    {
        const t = 2*Math.PI*Math.random()
        const u = getRandomArbitrary(0, r) + getRandomArbitrary(0, r)
        let radius;
        if(u > r) {
          radius = r*2 - u
        } else {
          radius = u 
        }
        
        const position = new THREE.Vector3(radius * Math.cos(t), 0, 0, radius * Math.sin(t))
        const matrix = new THREE.Matrix4()

        // const position = new THREE.Vector3(
        //   getRandomInt(range.x * -1, range.x),
        //   0, 
        //   getRandomInt(range.z * -1, range.z),
        // )
  
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))
  
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
  
        mesh.setMatrixAt(i, matrix)
  
        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    
    mesh.translateX(translate.x)
    mesh.translateY(translate.y)
    mesh.translateZ(translate.z)
  
    scene.add(mesh)
  }
  
export function renderSkyDome(scene) {
    
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1.0, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.35 );
    hemiLight.position.set( 0, 50, 0 );

    const uniforms = {
      "topColor": { value: new THREE.Color( 0xcccccc ) },
      "bottomColor": { value: new THREE.Color( 0xffffff ) },
      "offset": { value: 33 },
      "exponent": { value: 0.6 }
    }
    const skyGeo = new THREE.SphereGeometry( 10000, 12, 12 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFrag,
      side: THREE.BackSide
    } );
    // uniforms[ "topColor" ].value.copy( hemiLight.color );
    const sky = new THREE.Mesh( skyGeo, skyMat );
    sky.name = "sky"
    // sky.rotateY(Math.PI);
    scene.add( sky );
}

export function renderGrounds(scene) {
    
  // ZONE 1 GROUND
  const metallicShader = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2(0.0, 0.0) },
      u_alpha: { value: 0.9 }
    },
    vertexShader: vertexShader,
    fragmentShader: metallicFrag,
    side: THREE.DoubleSide,
    transparent: true
  })
  const ground1 = new CircleGround(ZONE_POS["ONE"], ZONE_RADIUS.ONE, metallicShader, "shader ground")

  scene.add(ground1);

  {
    const geom = new THREE.PlaneGeometry(500, 3000)
    const planeGround1 = new THREE.Mesh(geom, metallicShader)
    planeGround1.name = "shader ground"
    planeGround1.rotateY(Math.PI/2)
    planeGround1.rotateX(Math.PI/2)
    planeGround1.position.set(4500, 0, 0)
    scene.add(planeGround1) 
  }

  // ZONE 2 GROUND
  const coffeeShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
      vertexShader: vertexShader,
      fragmentShader: newCoffeeFragment,
      side: THREE.DoubleSide
  } );

  const ground2 = new CircleGround(ZONE_POS["TWO"], ZONE_RADIUS.TWO, coffeeShader, "shader ground");
  scene.add(ground2)

  // ZONE 3 GROUND
  const skyuniforms = {
    "topColor": { value: new THREE.Color( 0x0077ff ) },
    "bottomColor": { value: new THREE.Color( 0xffffff ) },
    "offset": { value: 33 },
    "exponent": { value: 0.6 }
  }
  // const skyGeo = new THREE.SphereGeometry( 1000, 32, 32 );
  const skyMat = new THREE.ShaderMaterial( {
    uniforms: skyuniforms,
    vertexShader: skyVertex,
    fragmentShader: skyFrag,
    side: THREE.DoubleSide
  } );
  // const ground3Mat = new THREE.MeshPhongMaterial({ color: 0x77777, side: THREE.DoubleSide });
  const ground3 = new CircleGround(ZONE_POS["THREE"], ZONE_RADIUS.THREE, skyMat, "ground");;
  scene.add(ground3)

  // BOTTOM ground
  const ground5Mat = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
  const ground5 = new CircleGround(ZONE_POS["BLANK"], ZONE_RADIUS.BLANK, ground5Mat, "BLANK");;
  scene.add(ground5)

  // ZONE PARK GROUND
  const parkShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
    vertexShader: vertexShader,  
    fragmentShader: turbulenceFragment, 
    side: THREE.DoubleSide
  } ); 

  // grass colors: 0x679436
  const ground4Mat = new THREE.MeshPhongMaterial({ color: 0x006400, side: THREE.DoubleSide });
  const ground4 = new CircleGround(ZONE_POS["GARDEN"], ZONE_RADIUS.GARDEN, ground4Mat, "garden")
  scene.add(ground4)

  window.GROUNDS = [ground1.geom, ground2.geom, ground3.geom, ground4.geom];

  // add grass shader
  // renderGrassShader2(scene, {x: 100, z: 0})
  // renderGrassShader2(scene, {x: 6500, z: 0})
  // renderGrassShader2(scene, {x: 5500, z: -1000})
  renderGrassShader2(scene, {x: 0, z: 0})

}


export function renderGrass(scene) {
    const geometries = []
    const geometry = new THREE.PlaneGeometry( 1, 10, 1, 4 );
    geometry.translate(0, 0.3, 0)
    geometry.rotateY(Math.PI/2)
    const g1 = geometry.clone();
    g1.translate(0, 0, 1.2)
    const g2 = geometry.clone();
    g2.translate(0, 0, -1.2)
    geometries.push(geometry, g1, g2)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    const instanceNumber = 500;
    const dummy = new THREE.Object3D();
    
    // geometry.translate(0, 0.5, 0 ); // move grass blade geometry lowest point at 0.
    const leavesMat = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide })

    const mesh = new THREE.InstancedMesh( mergedGeometry, leavesMat, instanceNumber );
    
    for(let i = 0; i < instanceNumber; i++)
    {
        const position = new THREE.Vector3(getRandomInt(-600, 600), 0, getRandomInt(-300, 300))

        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)

        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    mesh.translateX(ZONE_POS.ONE.x + 2000);

    scene.add( mesh );

}


// https://jsfiddle.net/felixmariotto/hvrg721n/

function renderGrassShader2(scene, position) {
  
////////////
// MATERIAL
////////////

const vertexShader = `
varying vec2 vUv;
uniform float u_time;

void main() {

  vUv = uv;
  
  // VERTEX POSITION
  
  vec4 mvPosition = vec4( position, 1.0 );
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif
  
  // DISPLACEMENT
  
  // here the displacement is made stronger on the blades tips.
  float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
  
  float displacement = sin( mvPosition.z + u_time * 0.5 ) * ( 0.4 * dispPower );
  mvPosition.z += displacement;
  
  //
  
  vec4 modelViewPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;

}
`;

const fragmentShader = `
varying vec2 vUv;

void main() {
  vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
  float clarity = ( vUv.y * 0.8 ) + 0.5;
  gl_FragColor = vec4( baseColor * clarity, 1 );
}
`;

const uniforms = {
u_time: {
  value: 0
}
}

const leavesMaterial = new THREE.ShaderMaterial({
vertexShader,
fragmentShader,
uniforms,
side: THREE.DoubleSide
});

/////////
// MESH
/////////

const instanceNumber = 5000000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry( 0.5, 5, 1, 4 );
geometry.translate( 0, 1, 0 ); // move grass blade geometry lowest point at 0.

const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
instancedMesh.name = "shader grass"
scene.add( instancedMesh );

// Position and scale the grass blade instances randomly.
const r = ZONE_RADIUS.GARDEN
const rMaxSqr = getRandomArbitrary(0, r*r)

for ( let i=0 ; i<instanceNumber ; i++ ) {

  // https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
  const t = 2*Math.PI*Math.random()
  const u = getRandomArbitrary(0, r) + getRandomArbitrary(0, r)
  let radius;
  if(u > r) {
    radius = r*2 - u
  } else {
    radius = u 
  }
  
  dummy.position.set(radius * Math.cos(t), 0, radius * Math.sin(t))
// dummy.position.set(
//   ( Math.random() - 0.5 ) * 3000,
//   0,
//   ( Math.random() - 0.5 ) * 3000
// );

dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );

dummy.rotation.y = Math.random() * Math.PI;

dummy.updateMatrix();
instancedMesh.setMatrixAt( i, dummy.matrix );

} 

instancedMesh.translateX(position.x)
instancedMesh.translateZ(position.z)

}
export function renderMountain(scene) {
  // theta: 0, 30, 60, 90
  const r = ZONE_RADIUS.BLANK
  const triMesh = renderBackgroundTriangle() 

  for(let i = 30; i < 330; i+= 30) {
    const theta = THREE.MathUtils.degToRad(i)
    const tx = r * Math.cos(theta)
    const ty = r * Math.sin(theta)
    const ry =  THREE.MathUtils.degToRad(90-i)
    const triClone = triMesh.clone()
    triClone.rotateY(ry)
    triClone.position.set(tx, 0, ty)
    scene.add(triClone)
  }

}

export function renderBackgroundTriangle(scene, pos) {

  // test shape geom
const shape = new THREE.Shape();

const x = 0;
const y = 0;

shape.moveTo(x + 180, y +180)
shape.lineTo(x + 300, y +340)
shape.lineTo(x + 400, y +290)
shape.lineTo(x + 570, y +250)
shape.lineTo(x + 750, y +110)
shape.lineTo(x + 970, y +270)
shape.lineTo(x + 1050 , y +220)
shape.lineTo(x + 1140 , y +250)
shape.lineTo(x + 1280 , y +380)
shape.lineTo(x + 1460 , y +300)
shape.lineTo( x + 1500, y + 320 )
shape.lineTo( x + 1800, y + 150 )
shape.lineTo( x + 2220, y + 60 )
shape.lineTo( x + 2250, y + 260 )
shape.lineTo( x + 2370, y + 220 )
shape.lineTo( x + 2560, y + 340 )
shape.lineTo( x + 2760, y + 230 )
shape.lineTo( x + 2860, y + 280 )
shape.lineTo( x + 2960, y + 130 )
shape.lineTo( x + 3180, y + 100 )
shape.lineTo( x + 3380, y + 140 )
shape.lineTo( x + 3450, y + 240 )
shape.lineTo( x + 3620, y + 330 )
shape.lineTo( x + 3730, y + 220 )
shape.lineTo( x + 3870, y + 260 )
shape.lineTo( x + 3900, y + 180 )
shape.lineTo( x + 4440, y + 80 )
shape.lineTo( x + 4500, y + 10 )
shape.lineTo( x + 4600, y + 0 )
shape.lineTo( x + 0, y + 0 )

const TriangleGeometry = new THREE.ShapeGeometry(shape);
TriangleGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( -2300, 0, 0 ) );

const mat = new THREE.MeshPhongMaterial({ color: 0x006400, side: THREE.DoubleSide });
const triMesh = new THREE.Mesh(TriangleGeometry, mat)
triMesh.scale.set(1, 1.25, 1)

return triMesh

}