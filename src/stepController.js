import { updateStepProgress } from './utils';

export function initSteps() {
 // Init Steps
 console.log("Init steps")
 window.ACC_STEPS = 0;
 updateStepProgress(100);
}

export function updateStepNum() {
  if(window.ZONE === "GARDEN") {
   window.ACC_STEPS++;
  } else {
   window.ACC_STEPS--;
  }
}