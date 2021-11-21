import ROBOT_FACE from "../../assets/robot_face.glb"
import PURPLE_CONE from "../../assets/purple_cone.glb"
import BLUE_CONE from "../../assets/blue_cone.glb"
import PINK_CONE from "../../assets/pink_cone2.glb"
import BIRD_1 from "../../assets/bird_1.glb"
import BIRD_2 from "../../assets/bird_2.glb"
import CCTV from "../../assets/cctv.glb"
import METAL_PAN from "../../assets/districtOne/metalPan.glb"
import METAL_STICK from "../../assets/districtOne/metalStick.glb"
import OZ_ROBOT from "../../assets/districtOne/ozRobot.glb"
import ROBOT_GUIDE from "../../assets/districtOne/robotGuide.glb"
import ROCKET from "../../assets/districtOne/rocket.glb"
import WORKER_1 from "../../assets/districtOne/worker1.glb"
import WORKER_2 from "../../assets/districtOne/worker2.glb"

// district 2
import TAPE from "../../assets/districtTwo/tape.glb"
import BEAR from "../../assets/districtTwo/bear.glb"
import FORK from "../../assets/districtTwo/fork.glb"
import KNIFE from "../../assets/districtTwo/knife.glb"
import SPA_SIGN from "../../assets/districtTwo/spaSign.glb"
import RAINBOW_WEED from "../../assets/districtTwo/weed2.glb"
import COFFEE_CUP from "../../assets/districtTwo/coffee1.glb"
import COFFEE_SPA from "../../assets/districtTwo/coffeeSpa2.glb"
import LION from "../../assets/districtTwo/lion.glb"
import PURPLE_SUNGLASS from "../../assets/districtTwo/purple.glb"
import ORANGE_SUNGLASS from "../../assets/districtTwo/orange.glb"
import GREEN_SUNGLASS from "../../assets/districtTwo/green.glb"
import IPOD from "../../assets/districtTwo/ipod.glb"
import CAMERA from "../../assets/districtTwo/camera.glb"
import OLD_PHONE from "../../assets/districtTwo/oldPhone.glb"
import CHEESE from "../../assets/districtTwo/cheese.glb"

import { getRandomInt } from "../utils"
import { ZONE_POS } from "../globalConstants"

const ZONE1_X_MIN = ZONE_POS.ONE.x - 300;
const ZONE1_X_MAX = ZONE_POS.ONE.x + 300;
const ZONE1_Z_MIN = ZONE_POS.ONE.z - 300;
const ZONE1_Z_MAX = ZONE_POS.ONE.z + 300;


const robotFace = {
 url: ROBOT_FACE,
 posX: ZONE_POS.ONE.x, posY: 30, posZ: ZONE_POS.ONE.z,
 rx: 0, ry: 0, rz: 0,
 scale: 40,
 type: "monument"
}

const purpleCone = {
 url: PURPLE_CONE,
 posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 10,
 zone: 1
}

const blueCone = {
 url: BLUE_CONE,
 posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 10,
 zone: 1
}

const pinkCone = {
 url: PINK_CONE,
 posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 10,
 zone: 1
}

const bird1 = {
  url: BIRD_1,
  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 1
}
const bird2 = {
 url: BIRD_2,
 posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 10,
 zone: 1

}
const cctv = {
 name: "cctv",
 url: CCTV,
 posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 10,
 zone: 1

}

const metalPan = {
 url: METAL_PAN,
 posX: -100, posY: 50, posZ: -300,
 rx: 0, ry: Math.PI/2, rz: 0,
 scale: 100
}
const metalStick = {
 url: METAL_STICK,
 posX: -100, posY: 50, posZ: -400,
 rx: 0, ry: Math.PI/2, rz: 0,
 scale: 100
}
const ozRobot = {
 url: OZ_ROBOT,
 posX: 100, posY: 10, posZ: -500,
 rx: 0, ry: -Math.PI/2, rz: 0,
 scale: 100
}
const robotGuide = {
 url: ROBOT_GUIDE,
 posX: 50, posY: 20, posZ: -50,
 rx: 0, ry: 0, rz: 0,
 scale: 5
}
const rocket = {
 url: ROCKET,
 posX: -200, posY: 100, posZ: 0,
 rx: 0, ry: 0, rz: 0,
 scale: 10
}
const worker1 = {
 url: WORKER_1,
 posX: 100, posY: 10, posZ: 400,
 rx: 0, ry: Math.PI/3, rz: 0,
 scale: 40
}
const worker2 = {
 url: WORKER_2,
 posX: 200, posY: 10, posZ: 600,
 rx: 0, ry: Math.PI/3, rz: 0,
 scale: 40
}

const excavator = {
  url: WORKER_1,
  posX: 0, posY: 10, posZ: 750,
  rx: 0, ry: Math.PI/3, rz: 0,
  scale: 40,
  type: "monument"
 }

export const DISTRICT_ONE_GLB = [
 purpleCone, blueCone, pinkCone,
 bird1, bird2, cctv
//  metalPan, metalStick,
//  ozRobot, robotGuide, rocket,
//  worker1, worker2
]

const ZONE2_X_MIN = ZONE_POS.TWO.x - 300;
const ZONE2_X_MAX = ZONE_POS.TWO.x + 300;
const ZONE2_Z_MIN = ZONE_POS.TWO.z - 300;
const ZONE2_Z_MAX = ZONE_POS.TWO.z + 300;

// District Two
const coffeeSpa = {
  url: COFFEE_SPA,
  posX: ZONE_POS.TWO.x, posY: 60, posZ: ZONE_POS.TWO.z,
  rx: 0, ry: 0, rz: 0,
  type: "monument"
}

const tape = {
  url: TAPE,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const bear = {
  url: BEAR,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const fork = {
  url: FORK,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const knife = {
  url: KNIFE,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const spaSign = {
  url: SPA_SIGN,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
}

const weedRainbow = {
  url: RAINBOW_WEED,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
}
const coffeeCup = {
  url: COFFEE_CUP,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const lion = {
  url: LION,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const purpleSunglass = {
  url: PURPLE_SUNGLASS,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const greenSunglass = {
  url: GREEN_SUNGLASS,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

const orangeSunglass = {
  url: ORANGE_SUNGLASS,
  posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2
}

export const DISTRICT_TWO_GLB = [ 
  tape, bear, fork, knife, lion, 
  purpleSunglass, greenSunglass, orangeSunglass, 
 //  weedRainbow, coffeeSpa, spaSign, coffeeCup,
 //  camera, cheese, ipod, oldPhone
 ]
 
// DISTRICT THREE
const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

const ipod = {
  url: IPOD,
  posX:  getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 20,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 3
}

const camera = {
  url: CAMERA,
  posX:  getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 20,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 3
}

const oldPhone = {
  url: OLD_PHONE,
  posX:  getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 20,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 3
}

const cheese = {
  url: CHEESE,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 400,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 3
}

export const DISTRICT_THREE_GLB = [ 
  // tape, bear, fork, knife, lion, 
  // purpleSunglass, greenSunglass, orangeSunglass, 
  // weedRainbow, coffeeSpa, spaSign, coffeeCup,
  camera, cheese, ipod, oldPhone
 ]
 


export const MONUMENTS_GLB = [
  robotFace,
  coffeeSpa,
  excavator
]