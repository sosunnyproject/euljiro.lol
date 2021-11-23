import * as THREE from 'three';
import { ZONE_POS } from "./globalConstants"
import { getRandomInt } from './utils';

const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

export function renderBuildings (scene) {
    
    const geometry = new THREE.BoxGeometry(10, 10, 10)

    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.InstancedMesh(geometry, material, 50)

    
    for(let i = 0; i < 50; i++)
    {
        const position = new THREE.Vector3(
            getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX),
            (Math.random() - 0.5) * 10,
            getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
        )

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)
        mesh.zone = 3;
    }

    scene.add(mesh)


}