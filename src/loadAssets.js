import * as THREE from 'three';
import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, DISTRICT_THREE_GLB, MONUMENTS_GLB } from './models/glbLoader.js';
import { updateLoadingProgress } from './utils.js';
import uhbeeFont from "../assets/fonts/uhbeeRiceRegular.json"
import euljiro10years from "../assets/fonts/bmEuljiro10years.json"
import euljiroRegular from "../assets/fonts/bmEuljiroRegular.json"
import { DynamicDrawUsage } from 'three';

export async function loadAssets(gltfLoader, fontLoader, textureLoader) {

 const loadNum = 1 + MONUMENTS_GLB.length + DISTRICT_TWO_GLB.length + DISTRICT_ONE_GLB.length + DISTRICT_THREE_GLB.length;
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
    console.log("loaded")
    let per = Math.floor((count / loadNum) * 100)
    updateLoadingProgress(per);
  })
})

 // Load Font for TextGeometry
 fontLoader.load(
   uhbeeFont,
   (font) => {
     window.UHBEE_FONT = font;
     count++;
     console.log("loaded")
     let per = Math.floor((count / loadNum) * 100)
     updateLoadingProgress(per);
   }
 )

}


export async function loadZoneOneGLB(scene) {
  console.log("loadZoneOneGLB")
  
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

  for (let i = 0; i < DISTRICT_THREE_GLB.length; i++) {
    const model = DISTRICT_THREE_GLB[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  try {
    scene.traverse(obj => {
      if (typeof obj.zone === 'number') {

        if(obj.zone !== 3) {
          // console.log("TRAVERSE TWO: ", obj)
          scene.remove(obj)
        }
      }
    })
  } catch (err) {
   console.log(err)
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
    model.scene.scale.set(inputScale, inputScale, inputScale)
  } else if(!data.type) {
    model.scene.scale.set(10, 10, 10);
  } else if(data.type === "monument"){
    model.scene.scale.set(25, 25, 25);
  }

  if(data.name) {
    model.scene.name = data.name
  }

  if(model.animations.length) {
    let mixer = new THREE.AnimationMixer(model.scene);
    window.MIXERS.push(mixer)

    var action = mixer.clipAction(model.animations[0])
    action.play();   
  }

  if(data.zone) {
    model.scene.zone = data.zone
  }

  window.RAYOBJ.push(model.scene)

  scene.add(model.scene)

}