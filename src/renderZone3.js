import * as THREE from 'three';
import { ZONE_POS } from "./globalConstants"
import { getRandomArbitrary, getRandomInt } from './utils';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

export function renderBuildings (scene, randNum, posArr) {
    
    const geometries = []

    const size = 60;
    const height = 300;
    const g1 = new THREE.BoxGeometry(size, height, size)

    // left z
    const leftZ = new THREE.BoxGeometry(size, size, size)
    leftZ.translate(0, height/2, size)
    for(let i = 6; i > 0; i--) {
        const cloneBox = leftZ.clone()
        cloneBox.scale(i/6, i/6, i/6)

        cloneBox.translate(0, size*(6-i), size*(6-i)-15*(6-i))
        geometries.push(cloneBox)
    }

    const rightZ = new THREE.BoxGeometry(size, size, size)
    rightZ.translate(0, 0, -size)
    for(let i = 0; i < 5; i++) {
        const cloneBox = rightZ.clone()
        cloneBox.translate(0, size*i, -size*i)
        //geometries.push(cloneBox)
    }
    for(let i = 6; i > 0; i--) {
        const cloneBox = rightZ.clone()
        cloneBox.scale(i/6, i/6, i/6)
        
        cloneBox.translate(0, size*(6-i), -size*(6-i)+15*(6-i))
        geometries.push(cloneBox)

    }

    geometries.push(g1, leftZ, rightZ)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    mergedGeometry.randomNoise = getRandomArbitrary(100, 500)

    const material = new THREE.MeshPhongMaterial({ color: 0xffe5d9 })

    const mesh = new THREE.InstancedMesh(mergedGeometry, material, 10)

    for(let i = 0; i < 3; i++)
    {
        const position = posArr[i] 
        //new THREE.Vector3(getRandomInt(-300, 300), 100, getRandomInt(-300, 300))

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)
        // mesh.zone = 3;
        mesh.name = 'apt'
        mesh.needsUpdate = true;

        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        mesh.randomNoise = randNum
    }

    mesh.translateX(ZONE_POS.THREE.x)
    mesh.translateZ(ZONE_POS.THREE.z)

    window.RAYOBJ.push(mesh)
    scene.add(mesh)

}

export function makeSteps(scene) {

    const size = 60
    const height = 20
    const g1 = new THREE.BoxGeometry(size, height, size)
    const gmat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const boxTest = new THREE.Mesh(g1, gmat)
    boxTest.translateX(ZONE_POS.THREE.x - 600)
    boxTest.translateZ(ZONE_POS.THREE.z)
    window.RAYOBJ.push(boxTest)        
    scene.add(boxTest)

    for(let i = 1; i < 50; i++){
        const box2 = boxTest.clone();
        box2.position.x += size * i;
        box2.position.y += height * i;
        window.RAYOBJ.push(box2)
        scene.add(box2)
    }


}