import * as THREE from 'three';
import { ZONE_POS } from './globalConstants';

export function renderShutter (scene, posZ) {
    
    const size = 100;
    const height = 300;
    const shutter = new THREE.PlaneGeometry(size, size, size)

    const material = new THREE.MeshPhongMaterial({ color: 0xffe5d9, side: THREE.DoubleSide })

    const mesh = new THREE.InstancedMesh(shutter, material, 50)

    for(let i = 1; i < 11; i++)
    {
        const position = new THREE.Vector3(
            ZONE_POS.ONE.x + 2750 + i*size + (1*i), 0, posZ       
        )
        const quaternion = new THREE.Quaternion()
 
        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)

    }

    scene.add(mesh)

}
