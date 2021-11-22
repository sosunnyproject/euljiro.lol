export function getRandomArbitrary(min, max) {
 return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function updateStepNum() {
  if(window.ZONE === "GARDEN") {
   window.ACC_STEPS++;
  } else {
   window.ACC_STEPS--;
  }

  console.log("updateStepNum? ", window.ACC_STEPS)

  let per = Math.floor((window.ACC_STEPS / window.STEP_LIMIT) * 100 )
  updateStepProgress(per)
}

export function updateStepProgress(value) {
  // Step Counter Bar
  var stepCounter = document.querySelector('#stepCounter')
  var stepLeftBar = stepCounter.querySelector('.left .bar');
  var stepRightBar = stepCounter.querySelector('.right .bar');
  var stepPer = stepCounter.querySelector('.value');
  stepPer.innerHTML=value +'%';
   if (value <= 50) {
     var degree = 18*value/5;
     stepRightBar.style.transform = "rotate("+degree+"deg)";
     stepLeftBar.style.transform = "rotate(0deg)";
   } else {
     var degree = 18*(value-50)/5;
     stepRightBar.style.transform = "rotate(180deg)";
     stepLeftBar.style.transform = "rotate("+degree+"deg)";
   }
}

export function updateLoadingProgress(value) {
  // Load Progress Bar
  var leftBar = document.querySelector('.left .bar');
  var rightBar = document.querySelector('.right .bar');
  var per = document.querySelector('.value');

  per.innerHTML=value +'%';
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
