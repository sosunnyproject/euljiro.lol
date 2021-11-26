import * as THREE from 'three';

export function getRandomArbitrary(min, max) {
 return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function updateStepNum() {
  // console.log(window.ACC_STEPS)
  if(window.ZONE === "GARDEN") {
    if(window.ACC_STEPS <= window.STEP_LIMIT) {
      window.ACC_STEPS++;
    }
  } else {
    if(window.ACC_STEPS >= 0) {
      window.ACC_STEPS--;
    }
  }

  // console.log("updateStepNum? ", window.ACC_STEPS)

  let per = Math.floor((window.ACC_STEPS / window.STEP_LIMIT) * 100 )
  updateStepProgress(per)
}

// https://stackoverflow.com/questions/56421795/how-to-change-the-color-of-progressvalue-webkit-progress-value-property

export function updateStepProgress(stepPercent) {
  // Step Counter Bar
  var progress = document.querySelector("progress");
  // console.log(progress)

  progress.setAttribute('value', stepPercent)
  // console.log("stepPercent: ", stepPercent)

  var n = 2 * parseInt(progress.getAttribute("value"));

  n += stepPercent
  // console.log("rgb: ", n)
  
  progress.style.setProperty("--c", "rgb(" + (255-n) + "," + n + "," + n + ")");
}

export function updateLoadingProgress(value) {
  // Load Progress Bar
  var leftBar = document.querySelector('.left .bar');
  var rightBar = document.querySelector('.right .bar');
  var per = document.querySelector('#loadValue');

  if(value < 100) {
    per.innerHTML='Loading...';
  } else if (value >= 100) {
    per.innerHTML='Ready to Play'
  }
  if (value <= 50) {
    var degree = 18*value/5;
    rightBar.style.transform = "rotate("+degree+"deg)";
    leftBar.style.transform = "rotate(0deg)";
  } else {
    var degree = 18*(value-50)/5;
    rightBar.style.transform = "rotate(180deg)";
    leftBar.style.transform = "rotate("+degree+"deg)";
  }
}

const deltaValue = 0.001

export function retrieveEnergy(scene) {
  scene.traverse(obj => {
    if(!obj.name) return;
    if(obj.name.includes("light")) {
      if(obj.intensity <= 1.0) {
        obj.intensity += deltaValue
      }
    }
    if(obj.name.includes("sky")){
      const currRgb = obj.material.uniforms.topColor.value
      //console.log(obj.material.uniforms.topColor.value)
      if(currRgb.r <= 0.6) {
        const newR = currRgb.r + deltaValue;
        const newG = currRgb.g + deltaValue;
        const newB = currRgb.b + deltaValue;
        const newRgb = new THREE.Color(newR, newG, newB)
        obj.material.uniforms.topColor.value = newRgb;
        //console.log(obj.material.uniforms.topColor.value)  
      }
    }
  })
}

export function warnLowEnergy(scene, delta) {
  // dim the lights

  scene.traverse(obj => {
    if(!obj.name) return
    
    if(obj.name.includes("light")) {
      // console.log(obj)
      if(obj.intensity >= 0) {
        obj.intensity -= deltaValue
      }
    }
    if(obj.name.includes("sky")){
      const currRgb = obj.material.uniforms.topColor.value
      //console.log(obj.material.uniforms.topColor.value)
      if(currRgb.r >= -2.0) {
        const newR = currRgb.r - deltaValue;
        const newG = currRgb.g - deltaValue;
        const newB = currRgb.b - deltaValue;
        const newRgb = new THREE.Color(newR, newG, newB)
        obj.material.uniforms.topColor.value = newRgb;
        //console.log(obj.material.uniforms.topColor.value)  
      }
    }
  })
}

export function showDescription ( objName ) {
  var popup = document.querySelector(".descPopup");
  if(!window.DESC_POP) popup.classList.add("show");
  window.DESC_POP = true;

  const descPopup = document.querySelector("#descContent")
  descPopup.innerText = "This is " + objName
  // console.log(descPopup, objName)

  setTimeout(() => {
    popup.classList.remove("show")
    window.DESC_POP = false;
  }, 3000)
}