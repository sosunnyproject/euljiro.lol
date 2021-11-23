import * as THREE from 'three';
import { ZONE_POS } from './globalConstants';
import ShutterPattern from '../assets/png/shutter.png'

export function renderShutter (scene, posZ) {
    
    new THREE.TextureLoader().load(
        ShutterPattern,
        function (texture) {
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                shininess: 100.0,
                flatShading: true
            })

            texture.matrixAutoUpdate = false;

            var aspect = 1;  // plane is 1 : 1 ratio
            var imageAspect = texture.image.width / texture.image.height;

            if ( aspect < imageAspect ) {

                texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 );

            } else {

                texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 );

            }

            renderShutterPlane(scene, posZ, material)
        },
        undefined,
        function(err) {
            console.error('cannot load texture shutter')
        }

    )
}

function renderShutterPlane(scene, posZ, material) {
    const size = 100;
    const height = 300;
    const shutter = new THREE.PlaneGeometry(size, size, size)

    // const material = new THREE.MeshPhongMaterial({ color: 0xffe5d9, side: THREE.DoubleSide })

    const mesh = new THREE.InstancedMesh(shutter, material, 50)

    for(let i = 1; i < 11; i++)
    {
        const position = new THREE.Vector3(
            ZONE_POS.ONE.x + 2750 + i*size + (1*i), 50, posZ       
        )
        const quaternion = new THREE.Quaternion()
 
        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)

    }

    scene.add(mesh)
}
