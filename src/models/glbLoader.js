import ROBOT_FACE from "../../assets/robot_face.glb"
import PURPLE_CONE from "../../assets/purple_cone.glb"
import BLUE_CONE from "../../assets/blue_cone.glb"
import PINK_CONE from "../../assets/pink_cone2.glb"
import BIRD_1 from "../../assets/bird_1.glb"
import BIRD_2 from "../../assets/bird_2.glb"
import CCTV from "../../assets/cctv.glb"
import OZ_ROBOT from "../../assets/districtOne/Ozrobot45.glb"
import ROBOT_GUIDE from "../../assets/districtOne/robotGuide.glb"
import ROCKET from "../../assets/districtOne/rocket.glb"
import WORKER_1 from "../../assets/districtOne/worker1.glb"
import WORKER_2 from "../../assets/districtOne/Worker2-89.glb"
import BIRD_BOT from "../../assets/districtOne/bird_bot.glb"
import ROBOT_TIGER from "../../assets/districtOne/robotTiger.glb"
import ROBOT_BIRD from "../../assets/districtOne/robotBird.glb"
import TRADE_NEON from "../../assets/districtOne/NeonTrade131.glb"
import ROBOT_CRANE from "../../assets/districtOne/robotCrane.glb"
import ROBOT_CHIP from "../../assets/districtOne/robotChip.glb"

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
import PABLO_SHUTTER from "../../assets/districtTwo/Pablo25.glb"
import DIAMOND_SHUTTER from "../../assets/districtTwo/Diamond34.glb"
import CATFISH_SHUTTER from "../../assets/districtTwo/Catfish25.glb"
import OCTOPUS_SHUTTER from "../../assets/districtTwo/Octopus33.glb"

// district 3
import BNB from "../../assets/districtThree/bnb.glb"
import BNBstatic from "../../assets/districtThree/Bnbstatic.glb"
import BTCstatic from "../../assets/districtThree/Btcstatic.glb"
import ETHstatic from "../../assets/districtThree/Ethstatic.glb"
import BTC from "../../assets/districtThree/btc.glb"
import ETH from "../../assets/districtThree/eth.glb"
import EXCAVATOR from "../../assets/districtThree/construction.glb"

// park
import TIGERLILY from "../../assets/Tigerlily45.glb"
import SQUIRREL from "../../assets/Squirrel40.glb"
import YELLOW_BENCH from "../../assets/Yellowbench37.glb"
import PARK_CAT from "../../assets/Parkcat40.glb"
import CACTUS from "../../assets/Cactus34.glb"

import { getRandomInt } from "../utils"
import { ZONE_POS } from "../globalConstants"

const ZONE1_X_MIN = ZONE_POS.ONE.x - 300;
const ZONE1_X_MAX = ZONE_POS.ONE.x + 300;
const ZONE1_Z_MIN = ZONE_POS.ONE.z - 300;
const ZONE1_Z_MAX = ZONE_POS.ONE.z + 300;


const robotFace = {
 url: ROBOT_FACE,
 posX: ZONE_POS.ONE.x, posY: 200, posZ: ZONE_POS.ONE.z + 50,
 rx: 0, ry: 0, rz: 0,
 scale: 130,
 type: "monument",
 name: "robotFace"
}

const excavator = {
  url: EXCAVATOR,
  posX: ZONE_POS.THREE.x, posY: 300, posZ: ZONE_POS.THREE.z,
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 170,
  type: "monument",
  name: "excavator"
}

 const coffeeSpa = {
  url: COFFEE_SPA,
  posX: ZONE_POS.TWO.x, posY: 280, posZ: ZONE_POS.TWO.z,
  rx: 0, ry: -Math.PI/3.0, rz: 0,
  scale: 120,
  type: "monument",
  name: "coffeeSpa"
}

export const MONUMENTS_GLB = [
  robotFace,
  coffeeSpa,
  excavator
]

// DISTRICT PARK , radius 2000
const ZONE4_X_MIN = ZONE_POS.GARDEN.x - 300;
const ZONE4_X_MAX = ZONE_POS.GARDEN.x + 300;
const ZONE4_Z_MIN = ZONE_POS.GARDEN.z - 300;
const ZONE4_Z_MAX = ZONE_POS.GARDEN.z + 300;

const tigerlily = {
  url: TIGERLILY,
  posX: 500, posY: 10, posZ: -1000, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 40,
  zone: 4,
  name: "tigerlily"
}

const squirrel = {
  url: SQUIRREL,
  posX: 800, posY: 10, posZ: 1200, 
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 30,
  zone: 4,
  name: "squirrel"
}

const parkCat = {
  url: PARK_CAT,
  posX: -600, posY: 10, posZ: 1700, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 20,
  zone: 4,
  name: "parkcat"
}

const yellowBench = {
  url: YELLOW_BENCH,
  posX: 1600, posY: 10, posZ: 500, 
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 30,
  zone: 4,
  name: "yellowbench"
}
const cactus = {
  url: CACTUS,
  posX: -600, posY: 10, posZ: -1700, 
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 20,
  zone: 4,
  name: "cactus"
}
export const DISTRICT_PARK_GLB = [ 
  tigerlily, squirrel, parkCat, yellowBench, cactus
 ]
 

const worker1 = {
  url: WORKER_1,
  posX: 5500, posY: 10, posZ: -100, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 20,
  zone: 1,
  name: "worker1"
 }

const rocket = {
  url: ROCKET,
  posX: 5200, posY: 100, posZ: 115,
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 40,
  zone: 1,
  name: "rocket"
 }
 const purpleCone = {
  url: PURPLE_CONE,
  posX: 4900, posY: 20, posZ: -85, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/3.5, rz: 0,
  scale: 25,
  zone: 1,
  name: "purpleCone"
 }
 const robotGuide = {
  url: ROBOT_GUIDE,
  posX: 3800, posY: 100, posZ: 95, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 40, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 35,
  zone: 1,
  name: "robotGuide"
 }
 const cctv = {
  name: "cctv",
  url: CCTV,
  posX: 4400, posY: 80, posZ: -800, 
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 60,
  zone: 1
 }

const bird1 = {
  url: BIRD_1,
  posX: 3500, posY: 120, posZ: -1280,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 80,
  zone: 1,
  name: "bird1"
}
const bird2 = {
  url: BIRD_2,
  posX: 3400, posY: 100, posZ: -1355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 1,
  name: "bird2"
 }
 const robotCrane = {
  url: ROBOT_CRANE,
  posX: 2800, posY: 80, posZ: -850,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 60,
  zone: 1,
  name: "robotCrane"
 }
 const ozRobot = {
  url: OZ_ROBOT,
  posX: 2400, posY: 35, posZ: -705,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 120,
  zone: 1,
  name: "ozRobot"
 }
 
const blueCone = {
  url: BLUE_CONE,
  posX: 2000, posY: 70, posZ: -105,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 40,
  zone: 1,
  name: "blueCone"
 }

 const worker2 = {
  url: WORKER_2,
  posX: 1900, posY: 100, posZ: 900,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  scale: 70,
  zone: 1,
  name: "worker2"
 }
 const robotBird = {
  url: ROBOT_BIRD,
  posX: 2500, posY: 200, posZ: 355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 200, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 50,
  zone: 1,
  name: "robotBird"
 }

 const tradeNeon = {
  url: TRADE_NEON,
  posX: 3800, posY: 100, posZ: 1200,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 50,
  zone: 1,
  name: "tradeNeon"
 }

 const robotChip = {
  url: ROBOT_CHIP,
  posX: 3500, posY: 200, posZ: 755,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4, rz: 0,
  scale: 40,
  zone: 1,
  name: "robotChip"
 }

 const robotTiger = {
  url: ROBOT_TIGER,
  posX: 4300, posY: 70, posZ: 605,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 60,
  zone: 1,
  name: "robotTiger"
 }

 const birdBot = {
  url: BIRD_BOT,
  posX: 2700, posY: 150, posZ: 1175,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  scale: 80,
  zone: 1,
  name: "birdBot"
 }

const pinkCone = {
 url: PINK_CONE,
 posX: 2900, posY: 100, posZ: -200,
//  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 30,
 zone: 1,
 name: "pinkCone"
}

export const DISTRICT_ONE_GLB = [
 purpleCone, blueCone, pinkCone,
 bird1, bird2, birdBot, cctv,
 ozRobot, robotGuide, rocket,
 robotBird, robotTiger, tradeNeon,
 worker2, // worker1,
 robotChip, robotCrane
]

const ZONE2_X_MIN = ZONE_POS.TWO.x - 300;
const ZONE2_X_MAX = ZONE_POS.TWO.x + 300;
const ZONE2_Z_MIN = ZONE_POS.TWO.z - 300;
const ZONE2_Z_MAX = ZONE_POS.TWO.z + 300;

// District Two
// TWO: {x: -100, y: 0, z: -3500},  radius: 900

const tape = {
  url: TAPE,
  posX: -200, posY: 10, posZ: -3700,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 2
}

const bear = {
  url: BEAR,
  posX: 450, posY: 10, posZ: -3500,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const fork = {
  url: FORK,
  posX: 450, posY: 150, posZ: -3550,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const weedRainbow = {
  url: RAINBOW_WEED,
  posX: 250, posY: 80, posZ: -4500,
  rx: 0, ry: -Math.PI/2, rz: 0,
  scale: 50,
  zone: 2
}
const coffeeCup = {
  url: COFFEE_CUP,
  posX: 40, posY: 120, posZ: -2500,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const spaSign = {
  url: SPA_SIGN,
  posX: 50, posY: 10, posZ: -2500,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const purpleSunglass = {
  url: PURPLE_SUNGLASS,
  posX: -1600, posY: 70, posZ: -4300,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2
}

const camera = {
  url: CAMERA,
  posX: -1400, posY: 30, posZ: -3800,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}
const greenSunglass = {
  url: GREEN_SUNGLASS,
  posX: -1200, posY: 70, posZ: -3500,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2
}

const orangeSunglass = {
  url: ORANGE_SUNGLASS,
  posX: -800, posY: 70, posZ: -2800,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2
}

const ipod = {
  url: IPOD,
  posX: 400, posY: 60, posZ: -4000,
  rx: 0, ry: -Math.PI/2, rz: 0,
  scale: 30,
  zone: 2
}


const oldPhone = {
  url: OLD_PHONE,
  posX: 200, posY: 30, posZ: -3000,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const cheese = {
  url: CHEESE,
  posX: -800, posY: 50, posZ: -4200,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2
}

const knife = {
  url: KNIFE,
  posX: -800, posY: 120, posZ: -4200,
  rx: Math.PI, ry: -Math.PI/2.0, rz: 0,
  scale: 30,
  zone: 2
}

const pabloShutter = {
  url: PABLO_SHUTTER,
  posX: 1200, posY: 90, posZ: -4000,
  rx: 0, ry: -Math.PI/2.0, rz: 0,
  scale: 60,
  zone: 2  
}

const lionShutter = {
  url: LION,
  posX: -600, posY: 100, posZ: -4600,
  rx: 0, ry: -Math.PI/3, rz: 0,
  scale: 90,
  zone: 2
}

const diamondShutter = {
  url: DIAMOND_SHUTTER,
  posX: 700, posY: 120, posZ: -4800,
  rx: 0, ry: Math.PI/2, rz: 0,
  scale: 70,
  zone: 2
}

const catfishShutter = {
  url: CATFISH_SHUTTER,
  posX: 100, posY: -10, posZ: -4800,
  rx: 0, ry: -Math.PI/3, rz: 0,
  scale: 100,
  zone: 2
}

const octopusShutter = {
  url: OCTOPUS_SHUTTER,
  posX: 1150, posY: 50, posZ: -2800,
  rx: 0, ry: 0, rz: 0,
  scale: 80,
  zone: 2
}

export const DISTRICT_TWO_GLB = [ 
  tape, bear, fork, knife, 
  purpleSunglass, greenSunglass, orangeSunglass, 
  weedRainbow, spaSign, coffeeCup,
  camera, cheese, ipod, oldPhone,
  lionShutter, diamondShutter, pabloShutter, octopusShutter, catfishShutter
 ]
 
// DISTRICT THREE
const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

const bnb = {
  url: BNB,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

const eth = {
  url: ETH,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

const btc = {
  url: BTC,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

export const DISTRICT_THREE_GLB = [ 
  bnb, eth, btc
 ]
 