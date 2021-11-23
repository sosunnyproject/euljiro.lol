import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt } from './utils.js';
import { ZONE_POS } from './globalConstants.js';
import { generateTree } from './models/trees.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { DoubleSide } from 'three';

export function renderEntranceTrees(scene, zonePos) {

    const treesPosition = [
        new THREE.Vector3(zonePos.x+ 1100, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 1100, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 1050, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 1050, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 1000, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 1000, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 950, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 950, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 900, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 900, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 850, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 850, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 800, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 800, 0, zonePos.z + 50),
        new THREE.Vector3(zonePos.x+ 700, 0, zonePos.z -50),
        new THREE.Vector3(zonePos.x+ 700, 0, zonePos.z + 50),
    ]

    for(let i = 0; i < treesPosition.length; i++) {
        const pos = treesPosition[i]
        console.log(pos, pos.x)
        const tree = generateTree(pos.x, pos.y, pos.z )
        scene.add(tree)
    }
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