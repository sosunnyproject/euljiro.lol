import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt } from './utils.js';
import { ZONE_POS, ZONE_RADIUS, ZONE_CENTER, ZONE_RESET_POS } from './globalConstants.js';
import { generateTree } from './models/trees.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { DoubleSide } from 'three';
import skyVertex from './shaders/skyVertex.glsl.js';
import skyFrag from './shaders/skyFrag.glsl.js';
import CircleGround from './models/CircleGround'
import vertexShader from './shaders/vertex.glsl.js';
import fogFragment from './shaders/fog.frag.js';
import coffeeRiverFragment from './shaders/coffee.frag.js';
import turbulenceFragment from './shaders/turbulence.frag.js';
import metallicFrag from './shaders/metallic.frag.js';
import cloudsFragment from './shaders/clouds.frag.js';

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
  
    for(let i = 0; i < instanceNum; i++)
    {
        const position = new THREE.Vector3(
          getRandomInt(range.x * -1, range.x),
          0, 
          getRandomInt(range.z * -1, range.z),
        )
  
        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))
  
        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
  
        mesh.setMatrixAt(i, matrix)
  
        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
  
    console.log(mesh)
  
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
    const skyGeo = new THREE.SphereGeometry( 6000, 32, 32 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFrag,
      side: THREE.BackSide
    } );
    // uniforms[ "topColor" ].value.copy( hemiLight.color );
    const sky = new THREE.Mesh( skyGeo, skyMat );
    sky.name = "sky"
    sky.rotateY(Math.PI);
    sky.position.x += 900
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
      fragmentShader: coffeeRiverFragment,
      side: THREE.DoubleSide
  } );

  const ground2 = new CircleGround(ZONE_POS["TWO"], ZONE_RADIUS.TWO, coffeeShader, "shader ground");
  scene.add(ground2)

  // ZONE 3 GROUND
  const ground3Mat = new THREE.MeshPhongMaterial({ color: 0x77777, side: THREE.DoubleSide });
  const ground3 = new CircleGround(ZONE_POS["THREE"], ZONE_RADIUS.THREE, ground3Mat, "ground");;
  scene.add(ground3)

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
  const ground4Mat = new THREE.MeshPhongMaterial({ color: 0x1dd3b0, side: THREE.DoubleSide });
  const ground4 = new CircleGround(ZONE_POS["GARDEN"], ZONE_RADIUS.GARDEN, ground4Mat, "garden")
  scene.add(ground4)

  window.GROUNDS = [ground1.geom, ground2.geom, ground3.geom, ground4.geom];

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
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0xe9f5db, side: THREE.DoubleSide })

    const mesh = new THREE.InstancedMesh( mergedGeometry, leavesMaterial, instanceNumber );
    
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
