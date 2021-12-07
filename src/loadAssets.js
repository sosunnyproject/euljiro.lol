import * as THREE from 'three';
import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, DISTRICT_THREE_GLB, MONUMENTS_GLB, DISTRICT_PARK_GLB } from './models/glbLoader.js';
import { showDescription, updateLoadingProgress } from './utils.js';
// import uhbeeFont from "../assets/fonts/uhbeeRiceRegular.json"
import { ZONE_POS } from './globalConstants.js';

const box = new THREE.BoxGeometry(5, 40, 5, 10, 10)
const cylinderRay = new THREE.CylinderGeometry(2, 2, 60, 8)
const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, opacity: 0.0, transparent: true })
 //  opacity: 0.0, transparent: true

export async function loadAssets(gltfLoader, fontLoader, textureLoader) {

 const loadNum = MONUMENTS_GLB.length + DISTRICT_TWO_GLB.length + DISTRICT_ONE_GLB.length + DISTRICT_THREE_GLB.length + DISTRICT_PARK_GLB.length;
 let count = 0
 
 MONUMENTS_GLB.forEach(model => {
  gltfLoader.load(model.url,
   (gltf) => {
    model.gltf = gltf;
    count++;
    console.log("loaded")
    let per = Math.floor((count / loadNum) * 100)
    updateLoadingProgress(per);
  })
 })

 DISTRICT_ONE_GLB.forEach(model => {
   gltfLoader.load(model.url, 
     (gltf) => {
     model.gltf = gltf;
     count++;
     console.log("loaded")
     let per = Math.floor((count / loadNum) * 100)
     updateLoadingProgress(per);
   })
 })

 DISTRICT_TWO_GLB.forEach(model => {
   gltfLoader.load(model.url, 
     (gltf) => {
     model.gltf = gltf;
     count++;
     console.log("loaded")
     let per = Math.floor((count / loadNum) * 100)
     updateLoadingProgress(per);
   })
 })

 DISTRICT_THREE_GLB.forEach(model => {
  gltfLoader.load(model.url, 
    (gltf) => {
    model.gltf = gltf;
    count++;
    console.log("loaded 3", model.gltf)
    let per = Math.floor((count / loadNum) * 100)
    updateLoadingProgress(per);
  })
})


DISTRICT_PARK_GLB.forEach(model => {
  gltfLoader.load(model.url, 
    (gltf) => {
    model.gltf = gltf;
    count++;
    console.log("loaded 4", model.gltf)
    let per = Math.floor((count / loadNum) * 100)
    updateLoadingProgress(per);
  })
})

}

export async function loadZoneParkGLB(scene) {
  console.log("loadZoneParkGLB")
  
  for (let i = 0; i < DISTRICT_PARK_GLB.length; i++) {
    const model = DISTRICT_PARK_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // window.DYNAMIC_LOADED = true;  
}


export async function loadZoneOneGLB(scene) {
  console.log("loadZoneOneGLB")
  showDescription("1구역 테크JIRO입니다.")
  for (let i = 0; i < DISTRICT_ONE_GLB.length; i++) {
    const model = DISTRICT_ONE_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  window.DYNAMIC_LOADED = true;  
}

export async function loadZoneTwoGLB(scene) {
  console.log("loadZoneTwoGLB")
  showDescription("2구역 힙JIRO입니다.")

  for (let i = 0; i < DISTRICT_TWO_GLB.length; i++) {
    const model = DISTRICT_TWO_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  window.DYNAMIC_LOADED = true;  
}


export async function loadZoneThreeGLB(scene) {
  console.log("loadZoneThreeGLB")
  showDescription("3구역 빌딩JIRO입니다.")

  for (let i = 0; i < DISTRICT_THREE_GLB.length; i++) {
    const model = DISTRICT_THREE_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  window.DYNAMIC_LOADED = true;  
}

export function onLoadAnimation(model, data, scene) {
  // console.log("load animated models: ", data)
  const { posX, posY, posZ, rx, ry, rz } = data

  if(model){
    model.scene.position.set(posX, posY, posZ);
    model.scene.rotation.set(rx, ry, rz);
    model.scene.rotation.y += Math.PI/2.0; // face front  
  }

  if(data.scale) {
    const inputScale = data.scale
    if(data.zone < 4) {
      model.scene.scale.set(inputScale, inputScale, inputScale/3)
    } else {
      model.scene.scale.set(inputScale, inputScale, inputScale)
    }
  } else if(!data.type) {
    model.scene.scale.set(10, 10, 10);
  } else if(data.type === "monument"){
    model.scene.scale.set(25, 25, 25);
  }

  if(data.name) {
    model.scene.name = data.name
  }

  // add dummy 
  const dummy = new THREE.Mesh(cylinderRay, mat)
  dummy.position.set(posX, 60, posZ)
  dummy.scale.set(data.scale*1.2 || 1, 1, data.scale*1.2 || 1)
  // scene.add(dummy)
  dummy.name = data.name;
  if(data.desc) {
    dummy.desc = data.desc;
  }
  // console.log("dummy for bounding box", dummy)
  // const boxhelper = new THREE.BoxHelper( dummy, 0xff0000 );
  // boxhelper.setFromObject(dummy)
  // boxhelper.name = data.name;

  scene.add(dummy)
  window.RAYOBJ.push(dummy)

  if(model.animations.length) {
    let mixer = new THREE.AnimationMixer(model.scene);
    window.MIXERS.push(mixer)

    var action = mixer.clipAction(model.animations[0])
    action.play();   
  }

  if(data.zone) {
    model.scene.zone = data.zone
  }

  // model.scene.children[0].geometry.computeBoundingBox();
  // console.log("gltf", model.scene) // object3d
  // console.log("gltf bounding box: ", model.scene, model.scene.children[0].geometry.boundingBox) // mesh

  scene.add(model.scene)

}