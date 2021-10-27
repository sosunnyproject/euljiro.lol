import * as THREE from 'three';
import { toRadians, toDegrees } from '../utils';


export function generateLsystemTree() {
 const tree = new THREE.BoxGeometry( 40, 40, 1 );

  const totalGeom = updateGeometry(tree)
  console.log("main return: ", totalGeom)
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  var lsystemTreeMesh = new THREE.Mesh(lsystemTreeMesh, material);

  return lsystemTreeMesh;
}

let j = 0;
let rightX = 0;
let rightY = 0;
let rightZ = 0;

let preXAngle = 0;
let preYAngle = 0;
let preZAngle = 0;

function updateGeometry(totalGeometry){
  const lengthReductionFactor = 0.0008;
  const radiusReductionFactor = 0.01
  const angle = 60;  // degrees;
  const branchLength = 10;
  const branchRadius = 40;
  let topPoint = new THREE.Vector3(10, 0, 0);

  // random

  while (j < 20) {
    let randX = Math.random(), randY = Math.random(), randZ = Math.random();
    randX = randX > 0.50 ? 1 : -1
    rightX += randX;
  
    randY = randY > 0.50 ? 1 : -1
    rightY += randY
    
    randZ = randZ > 0.5 ? 1: -1
    rightZ += randZ

    topPoint = addBranch(totalGeometry, branchLength * (1 - j * lengthReductionFactor),
    branchRadius * (1 - j * radiusReductionFactor), topPoint, angle * rightX + preXAngle,
    angle * rightY + preYAngle, angle * rightZ + preZAngle);
    j += 1;
    console.log("toppoint", topPoint)

    preXAngle += angle * rightX;
    preYAngle += angle * rightY;
    preZAngle += angle * rightZ;
    rightX = 0;
    rightY = 0;
    rightZ = 0;
  }

  return totalGeometry;

}

// https://github.com/FrancescoGradi/L-System-Trees/blob/master/js/app.js
function addBranch(totalGeometry, length, radius, topTargetPoint, theta, rho, phi) {
  if (length < 0 || radius < 0) {
   return topTargetPoint
  }
  console.log("add branch")
  const branchGeom = new THREE.BoxGeometry( 40, 40, 1 );
  const branchMat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  
  const newTopPoint = new THREE.Vector3(0, length/2, 0);
  const bottomPoint = new THREE.Vector3(0, -length/2, 0);

  const branchMesh = new THREE.Mesh(branchGeom, branchMat);
  branchMesh.matrixAutoUpdate = false;

  branchMesh.rotation.set(toRadians(theta), toRadians(rho), toRadians(phi));

  branchMesh.updateMatrix();

  newTopPoint.applyEuler(branchMesh.rotation);
  bottomPoint.applyEuler(branchMesh.rotation);

  newTopPoint.x = newTopPoint.x + topTargetPoint.x - bottomPoint.x;
  newTopPoint.y = newTopPoint.y + topTargetPoint.y - bottomPoint.y;
  newTopPoint.z = newTopPoint.z + topTargetPoint.z - bottomPoint.z;
  
  branchMesh.position.set(topTargetPoint.x - bottomPoint.x, topTargetPoint.y - bottomPoint.y, topTargetPoint.z - bottomPoint.z);
  branchMesh.updateMatrix();

  branchMesh.castShadow = true;
  branchMesh.receiveShadow = true;

  totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);

  totalGeometry.castShadow = true;
  totalGeometry.receiveShadow = true;

  return newTopPoint;
}