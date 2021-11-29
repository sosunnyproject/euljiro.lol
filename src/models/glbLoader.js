import ROBOT_FACE from "../../assets/districtOne/robot_face.glb"
import PURPLE_CONE from "../../assets/districtOne/purple_cone.glb"
import BLUE_CONE from "../../assets/districtOne/blue_cone.glb"
import PINK_CONE from "../../assets/districtOne/pink_cone2.glb"
import BIRD_1 from "../../assets/districtOne/Bird0.glb"
import BIRD_2 from "../../assets/districtOne/Bird1-0.glb"
import BIRD_BOT from "../../assets/districtOne/RoboBird0.glb"
import CCTV from "../../assets/districtOne/Cctv0.glb"
import OZ_ROBOT from "../../assets/districtOne/Ozrobot0.glb"
import ROBOT_GUIDE from "../../assets/districtOne/RobotGuide.glb"
import ROCKET from "../../assets/districtOne/Rocket20.glb"
import WORKER_2 from "../../assets/districtOne/Worker0.glb"
import ROBOT_TIGER from "../../assets/districtOne/RoboTiger15.glb"
import ROBOT_BIRD from "../../assets/districtOne/robotBird.glb"
import TRADE_NEON from "../../assets/districtOne/NeonTrade.glb"
import ROBOT_CRANE from "../../assets/districtOne/Cranebot0.glb"
import ROBOT_CHIP from "../../assets/districtOne/Arduinobot0.glb"

// district 2
import COFFEE_SPA from "../../assets/districtTwo/Coffeecupspa27.glb"
import TAPE from "../../assets/districtTwo/Tape0.glb"
import BEAR from "../../assets/districtTwo/Bear28.glb"
import FORK from "../../assets/districtTwo/fork.glb"
import KNIFE from "../../assets/districtTwo/Knife27.glb"
import SPA_SIGN from "../../assets/districtTwo/Spa0.glb"
import RAINBOW_WEED from "../../assets/districtTwo/Cannabis0.glb"
import COFFEE_CUP from "../../assets/districtTwo/Pinkcoffee17.glb"
import LION from "../../assets/districtTwo/Lion19.glb"
import PURPLE_SUNGLASS from "../../assets/districtTwo/Purple15.glb"
import ORANGE_SUNGLASS from "../../assets/districtTwo/Orange17.glb"
import GREEN_SUNGLASS from "../../assets/districtTwo/Green17.glb"
import IPOD from "../../assets/districtTwo/Ipod0.glb"
import CAMERA from "../../assets/districtTwo/Camera0.glb"
import OLD_PHONE from "../../assets/districtTwo/Oldphone0.glb"
import CHEESE from "../../assets/districtTwo/CheeseStatic.glb"
import PABLO_SHUTTER from "../../assets/districtTwo/Pablo25.glb"
import DIAMOND_SHUTTER from "../../assets/districtTwo/Diamond0.glb"
import CATFISH_SHUTTER from "../../assets/districtTwo/Catfish25.glb"

// district 3
import BNBstatic from "../../assets/districtThree/Bnbstatic.glb"
import BTCstatic from "../../assets/districtThree/Btcstatic.glb"
import ETHstatic from "../../assets/districtThree/Ethstatic.glb"
import EXCAVATOR from "../../assets/districtThree/Crane57.glb"

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
 name: "robotFace",
 desc: "세운 상가 뒷편에 버려졌던 내가 이렇게 다시 태어났어",

}

const excavator = {
  url: EXCAVATOR,
  posX: ZONE_POS.THREE.x, posY: 300, posZ: ZONE_POS.THREE.z,
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 170,
  type: "monument",
  name: "excavator",
  desc: "언제나 항상 공사중. 올라올테면 올라와 보시지.",
}

 const coffeeSpa = {
  url: COFFEE_SPA,
  posX: ZONE_POS.TWO.x, posY: 280, posZ: ZONE_POS.TWO.z,
  rx: 0, ry: -Math.PI/3.0, rz: 0,
  scale: 120,
  type: "monument",
  name: "coffeeSpa",
  desc: "을지로에 있는 모든 커피를 마셨더니..."
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
  posX: 500, posY: 60, posZ: -1000, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 50,
  zone: 4,
  name: "을지로에 남아있던 마지막 꽃"
}

const squirrel = {
  url: SQUIRREL,
  posX: 800, posY: 50, posZ: 1200, 
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 50,
  // zone: 4,
  name: "나는야 공원을 지키는 우람한 다람쥐"
}

const parkCat = {
  url: PARK_CAT,
  posX: -600, posY: 50, posZ: 1700, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 40,
  // zone: 4,
  name: "잔디를 사랑한 나머지 초록색으로 변하고 있어"
}

const yellowBench = {
  url: YELLOW_BENCH,
  posX: 1600, posY: 50, posZ: 500, 
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 50,
  // zone: 4,
  name: "와서 잠시 앉아 쉬어가도 돼"
}
const cactus = {
  url: CACTUS,
  posX: -600, posY: 60, posZ: -1700, 
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 40,
  // zone: 4,
  name: "메마른 땅에서 버티다보니 지금 여기에 있어"
}
export const DISTRICT_PARK_GLB = [ 
  tigerlily, squirrel, parkCat, yellowBench, cactus
 ]
 

// const worker1 = {
//   url: WORKER_1,
//   posX: 5500, posY: 10, posZ: -100, 
//   // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
//   rx: 0, ry: Math.PI/6.0, rz: 0,
//   scale: 20,
//   zone: 1,
//   name: "worker1"
//  }

const rocket = {
  url: ROCKET,
  posX: 5200, posY: 100, posZ: 115,
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 40,
  zone: 1,
  name: "rocket",
  desc: "접는 도시 을지로 테크JIRO 입성 완료"
 }
 const purpleCone = {
  url: PURPLE_CONE,
  posX: 4900, posY: 30, posZ: -85, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/3.5, rz: 0,
  scale: 25,
  zone: 1,
  name: "purpleCone",
  desc: "감시 드론 항시 작동중! 허튼 짓 금물!"
 }
 const robotGuide = {
  url: ROBOT_GUIDE,
  posX: 3800, posY: 100, posZ: 95, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 40, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 35,
  zone: 1,
  name: "robotGuide",
  desc: "로봇 다리? 인간 팔? 말만 하세요!"
 }
 const cctv = {
  name: "cctv",
  url: CCTV,
  posX: 4400, posY: 80, posZ: -800, 
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 60,
  zone: 1,
  desc: "모든 걸 다 지켜보고 있다니까?!"
 }

const bird1 = {
  url: BIRD_1,
  posX: 3500, posY: 120, posZ: -1280,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 80,
  zone: 1,
  name: "bird1",
  desc: "고철 솟대도 이렇게 멋진 로봇이 될 수 있다고!"
}
const bird2 = {
  url: BIRD_2,
  posX: 3400, posY: 100, posZ: -1355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 1,
  name: "bird2",
  desc: "부품 교체는 좋지만 불법 수술은 절대 안 돼."
 }
 const robotCrane = {
  url: ROBOT_CRANE,
  posX: 2800, posY: 80, posZ: -850,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 60,
  zone: 1,
  name: "robotCrane",
  desc: "나는 그저 로봇과 인간이 평화롭게 공존하길 바랄 뿐이야"
 }
 const ozRobot = {
  url: OZ_ROBOT,
  posX: 2400, posY: 35, posZ: -705,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 120,
  zone: 1,
  name: "ozRobot",
  desc: "나야말로 로봇들의 아버지같은 존재 아니겠어?"
 }
 
const blueCone = {
  url: BLUE_CONE,
  posX: 2000, posY: 70, posZ: -105,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 40,
  zone: 1,
  name: "blueCone",
  desc: "그런데 로봇이 인간을 먹어서 뭐하겠어? 사실은 인간 아닐까?"
 }

 const worker2 = {
  url: WORKER_2,
  posX: 1900, posY: 100, posZ: 900,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  scale: 70,
  zone: 1,
  name: "worker2",
  desc: "로봇 팔이 나보다 정교하니까, 나는 이런 반복 작업이 더 편해"
 }
 const robotBird = {
  url: ROBOT_BIRD,
  posX: 2500, posY: 200, posZ: 355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 200, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 50,
  zone: 1,
  name: "robotBird",
  desc: "내 날개 어때? 요즘은 진짜 새 같은 피부도 만든다니까?"
 }

 const tradeNeon = {
  url: TRADE_NEON,
  posX: 3800, posY: 100, posZ: 1200,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 50,
  zone: 1,
  name: "tradeNeon",
  desc: "규율만 잘 지키면 언제든지 환영이야"
 }

 const robotChip = {
  url: ROBOT_CHIP,
  posX: 3500, posY: 200, posZ: 755,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4, rz: 0,
  scale: 40,
  zone: 1,
  name: "robotChip",
  desc: "이 칩이 없으면 로봇도 죽은 몸일 뿐이야."
 }

 const robotTiger = {
  url: ROBOT_TIGER,
  posX: 4300, posY: 70, posZ: 605,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 60,
  zone: 1,
  name: "robotTiger",
  desc: "길거리 생활이 지겨워서 이식 좀 해봤지. 더이상 날 무시하진 않아서 좋긴 하네."
 }

 const birdBot = {
  url: BIRD_BOT,
  posX: 2700, posY: 150, posZ: 1175,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  scale: 80,
  zone: 1,
  name: "birdBot",
  desc: "로봇에게는 인간이, 인간에게는 로봇이 필요할 수 밖에!"
 }

const pinkCone = {
 url: PINK_CONE,
 posX: 2900, posY: 100, posZ: -200,
//  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
 rx: 0, ry: 0, rz: 0,
 scale: 30,
 zone: 1,
 name: "pinkCone",
 desc: "로봇과 인간 모두 3원칙을 잘 지켜야지 우리 동네 장사도 잘 유지된다고. 그게 그렇게 어려워?"

}

export const DISTRICT_ONE_GLB = [
 purpleCone, blueCone, pinkCone,
 bird1, bird2, 
 ozRobot, robotGuide, rocket,
 robotBird, robotTiger, tradeNeon,
 worker2, birdBot, cctv, // worker1, 
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
  posX: -200, posY: 30, posZ: -3800,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "저 아이팟보다 내가 훨씬 오래됐다고! 요즘은 나 같은 애 보기 힘들 걸?"
}

const bear = {
  url: BEAR,
  posX: 450, posY: 40, posZ: -3500,
  rx: 0, ry: Math.PI/5, rz: 0,
  scale: 30,
  zone: 2,
  desc: "나만큼 유행 안타고 스테디셀러인 애가 없지. 실수로 눈을 잃어버렸더니 특이하다고 더 좋아하더라니까?"
}

const fork = {
  url: FORK,
  posX: 450, posY: 150, posZ: -3550,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "을지로의 맛집, 내가 안 가본 데가 없지. 내 맛집 리뷰가 최고인데, 이 곰덩어리가 나보다 유명하다니 짜증나."
}

const weedRainbow = {
  url: RAINBOW_WEED,
  posX: 250, posY: 80, posZ: -4500,
  rx: 0, ry: -Math.PI/2, rz: 0,
  scale: 50,
  zone: 2,
  desc: "모두 나를 보면 금방 잠들더라..."
}
const coffeeCup = {
  url: COFFEE_CUP,
  posX: 40, posY: 120, posZ: -2500,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "카페가 너무 많아서 커피로 강을 채운 지 벌써 오래야. "
}

const spaSign = {
  url: SPA_SIGN,
  posX: 50, posY: 10, posZ: -2500,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "아주 오래 전에 이 간판이 무슨 의미였는지 아는 사람?"
}

const purpleSunglass = {
  url: PURPLE_SUNGLASS,
  posX: -1600, posY: 70, posZ: -4300,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2,
  desc: "여기서 우리만큼 힙한 애들 봤어?"
}

const camera = {
  url: CAMERA,
  posX: -1400, posY: 30, posZ: -3800,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "내가 옛날에 찍은 을지로 사진들 보면 너무 힙해서 모두 기절할걸"
}
const greenSunglass = {
  url: GREEN_SUNGLASS,
  posX: -1200, posY: 70, posZ: -3500,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2,
  desc: "내가 잘 어울리는 사람은 진정한 힙스터로 인정해줄게"
}

const orangeSunglass = {
  url: ORANGE_SUNGLASS,
  posX: -800, posY: 70, posZ: -2800,
  rx: 0, ry: 0, rz: 0,
  scale: 60,
  zone: 2,
  desc: "아무나 우리랑 어울릴 수 없지. 함부로 다가오지 못할걸."
}

const ipod = {
  url: IPOD,
  posX: 1000, posY: 60, posZ: -2800,
  rx: 0, ry: Math.PI/4, rz: 0,
  scale: 30,
  zone: 2,
  desc: "hi... i love music ... thank you and you...?"
}


const oldPhone = {
  url: OLD_PHONE,
  posX: 200, posY: 70, posZ: -3000,
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "질린다고 할 땐 언제고 이제는 특이해서 좋다나."
}

const cheese = {
  url: CHEESE,
  posX: -800, posY: 50, posZ: -4200,
  rx: 0, ry: 0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "나는 진짜 치즈일까 치즈케이크일까. 여기는 을지로일까 아닐까."
}

const knife = {
  url: KNIFE,
  posX: -800, posY: 130, posZ: -4200,
  rx: Math.PI, ry: -Math.PI/2.0, rz: 0,
  scale: 30,
  zone: 2,
  desc: "모든 맛집에 내가 없으면 안 되니까, 내가 여기서 짱이야"
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
  zone: 2,
  desc: "사자의 모습으로 냥냥 펀치를 하면 이뻐해주겠지?"
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
  zone: 2,
  desc: "예전에는 겨울에 이렇게 생긴 걸 먹었다네...?"
}

export const DISTRICT_TWO_GLB = [ 
  tape, bear, fork, knife, 
  purpleSunglass, greenSunglass, orangeSunglass, 
  spaSign, coffeeCup, weedRainbow,
  camera, cheese, ipod, oldPhone,
  lionShutter, diamondShutter, pabloShutter, catfishShutter
 ]
 
// DISTRICT THREE
const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

const bnb = {
  url: BNBstatic,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

const eth = {
  url: ETHstatic,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

const btc = {
  url: BTCstatic,
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 50,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  scale: 10,
  zone: 3
}

export const DISTRICT_THREE_GLB = [ 
  bnb, eth, btc
 ]
 