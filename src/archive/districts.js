

function createDistrictGarden() {
 console.log("createDistrictGarden")

 // create a scene, that will hold all our elements such as objects, cameras and lights.
 districtGarden = new THREE.Scene();
 districtGarden.background = new THREE.Color().setHSL( 0.6, 0, 1 );
 districtGarden.fog = new THREE.Fog( districtGarden.background, 1, 5000 );
 districtGarden.fog.color.copy(new THREE.Color( 0xffffff ))
 districtGarden.name = "D_GARDEN"

 const objects = generateDistrictGardenObjects()
 
 for(let i = 0; i < objects.length; i++){
   districtGarden.add(objects[i])
 }
}

function createDistrictOne() {
 console.log("createDistrictOne")

 districtOne = new THREE.Scene();
 districtOne.background = new THREE.Color(0x000000);
 
 const alphaFog= new THREE.Color().setHSL( 0.2, 0, 0.1 );
 districtOne.name = "D_ONE"
 districtOne.fog = new THREE.Fog( alphaFog, 1400, 1800 );


 sceneOneTerrain = generateGround(900, 900, 10, 60, THREE.DoubleSide)
 sceneOneTerrain.rotateY(Math.PI/6.0)
 sceneOneTerrain.position.set(-1400, 150, 0)
 districtOne.add(sceneOneTerrain)

 const objects = generateDistrictOneObjects()
 for(let i = 0; i < objects.length; i++){
   districtOne.add(objects[i])
 }

  for (let i = 0; i < DISTRICT_ONE_GLB.length; i++) {
   const currentModel = DISTRICT_ONE_GLB[i]
   try {
     onLoadAnimation(currentModel.gltf, currentModel, DISTRICT_NAMES[1])
   } catch (err) {
     console.log(err)
   }
 }
 
}

function createDistrictTwo() {
 console.log("createDistrictTwo")

 districtTwo = new THREE.Scene();
 districtTwo.background = new THREE.Color(0xffffff);
 districtTwo.name = "D_TWO"

 const objects = generateDistrictTwoObjects()
 for(let i = 0; i < objects.length; i++){
   districtTwo.add(objects[i]);
 }
 
 for (let i = 0; i < DISTRICT_TWO_GLB.length; i++) {
   const currentModel = DISTRICT_TWO_GLB[i]
   onLoadAnimation(currentModel.gltf, currentModel, DISTRICT_NAMES[2])
 }

}

function createDistrictThree() {
 districtThree = new THREE.Scene();
 districtThree.background = new THREE.Color(0xffffff);
 districtThree.name = "D_THREE"

 const objects = generateDistrictThreeObjects();

 for(let i = 0; i < objects.length; i++){
   districtThree.add(objects[i]);
 }
}


function onLoadAnimation(model, data, district) {
 // console.log("load animated models: ", data)
 const { posX, posY, posZ, rx, ry, rz } = data
 if(model){
   model.scene.position.set(posX, posY, posZ);
   model.scene.rotation.set(rx, ry, rz);
   model.scene.rotation.y = Math.PI/2.0; // face front  
 }

 if(data.name === "cctv") {

   // Particles
   const particlesGeometry = new THREE.SphereGeometry(5, 32, 32)
   const particlesMaterial = new THREE.PointsMaterial({
     size: 5,
     sizeAttenuation: true
   })
   const particles = new THREE.Points(particlesGeometry, particlesMaterial)
   model.scene.rotateX(Math.PI/6.0)
   model.scene.add(particles)
 }

 if(data.scale) {
   const inputScale = data.scale
   model.scene.scale.set(inputScale, inputScale, inputScale)
 } else {
   model.scene.scale.set(25, 25, 25);
 }

 if(model.animations.length) {
   let mixer = new THREE.AnimationMixer(model.scene);
   window.mixers.push(mixer)

   var action = mixer.clipAction(model.animations[0])
   action.play();   
 }

 switch(district) {
   case DISTRICT_NAMES[0]:
     districtGarden.add(model.scene);
     break;
   case DISTRICT_NAMES[1]:
     districtOne.add(model.scene);
     break;
   case DISTRICT_NAMES[2]:
     districtTwo.add(model.scene);
     break;
   case DISTRICT_NAMES[3]:
     districtThree.add(model.scene);
     break;
 }
}
