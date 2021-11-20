import * as THREE from 'three';
import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, MONUMENTS_GLB } from './models/glbLoader.js';
import { updateLoadingProgress } from './utils.js';
import uhbeeFont from "../assets/fonts/uhbeeRiceRegular.json"
import euljiro10years from "../assets/fonts/bmEuljiro10years.json"
import euljiroRegular from "../assets/fonts/bmEuljiroRegular.json"

export async function loadAssets(gltfLoader, fontLoader, textureLoader) {

 const loadNum = MONUMENTS_GLB.length + DISTRICT_TWO_GLB.length + DISTRICT_ONE_GLB.length;
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