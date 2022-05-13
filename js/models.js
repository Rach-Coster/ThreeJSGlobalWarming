import * as THREE from 'three';

import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';

var loader = new GLTFLoader(); 
const dracoLoader = new DRACOLoader(); 
const textureLoader = new THREE.TextureLoader();

dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/');
dracoLoader.preload();

loader.setDRACOLoader(dracoLoader);

var mixers = []; 

var beeTexture = textureLoader.load('../Textures/Bee/bee.png');
//var beeNormalMap = textureLoader.load('../Textures/Bee/beeNormalMap.png');
//var beeAoMap = textureLoader.load('../Textures/Bee/beeAoMap.png');
//var beeSpecMap = textureLoader.load('../Textures/Bee/beeSpecMap.png');

var coralTexture = textureLoader.load('../Textures/Coral/coral.png');
coralTexture.flipY = false;

var bee = new THREE.Object3D(); 
var coral = new THREE.Object3D(); 

//bee fly
//'../Models/bee.gltf'
// pos z: 0.5
// rot x: THREE.MathUtils.degToRad(90), y: THREE.MathUtils.degToRad(45)
//animID: 1
class models {
    loadBee(position, rotation, animId){
        loader.load('../Models/Bee/bee.gltf', (model) => {
            var anim = model.animations;

            model = model.scene; 
            model.scale.setScalar(0.04);

            model.traverse((object) => {
                if(object.isMesh){
                    object.material = new THREE.MeshPhongMaterial({
                        map: beeTexture, 
                        //normalMap: beeNormalMap, 
                        //aoMap: beeAoMap,
                        //specularMap: beeSpecMap,
                       // specular: 0xA4A4A4,
                       // shininess: 3
                    });
                }
            });
            
            model.position.x = position.x; 
            model.position.y = position.y; 
            model.position.z = position.z;

            model.rotation.x = rotation.x;
            model.rotation.y = rotation.y;
        
            const animMixer = new THREE.AnimationMixer(model);
            animMixer.clipAction(anim[animId]).play(); 
            
            bee.attach(model);
            mixers.push(animMixer);
        
        });

        return bee; 
    }

    loadCoral(position){
        loader.load('../Models/Coral/coral.gltf', (model) => {
            model = model.scene; 
            model.scale.setScalar(0.19);

            model.traverse((object) => {
                if(object.isMesh){
                    object.material = new THREE.MeshPhongMaterial({
                        map: coralTexture
                        //normalMap: beeNormalMap, 
                        //aoMap: beeAoMap,
                        //specularMap: beeSpecMap,
                       // specular: 0xA4A4A4,
                       // shininess: 3
                    });
                }
            });
            
            model.position.x = position.x; 
            model.position.y = position.y; 
            model.position.z = 1;
            
            coral.attach(model); 
        });

        return coral;
    }

    loadMap(){
        const mapGeometry = new THREE.BoxGeometry(30, 15, 1);  

        const mapMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture, 
        bumpMap: earthBumpMap
        });

        var map = new THREE.Mesh(mapGeometry, mapMaterial);
        map.name = "map"; 

        return map; 
    }

    getMixers(){
        return mixers; 
    }
};

export default models;

var earthTexture = textureLoader.load('../Textures/Earth/earth.png');
var earthBumpMap = textureLoader.load('../Textures/Earth/earthBumpMap.png');

//var earthSpecMap = textureLoader.load('../Textures/Earth/earthSpecMap.png'); 
//var clouds = textureLoader.load('../Textures/Earth/clouds.png');






// loader.load('../Models/bee.gltf', (model) => {
//     var anim = model.animations;

//     model = model.scene; 
//     model.scale.setScalar(0.15);

//     model.traverse((object) => {
//         if(object.isMesh){
//             object.material = new THREE.MeshPhongMaterial({
//                 map: beeTexture, 
//                 normalMap: beeNormalMap, 
//                 aoMap: beeAoMap,
//                 specularMap: beeSpecMap,
//                 specular: 0xA4A4A4,
//                 shininess: 3
//             });
//         }
//     })

//     model.position.z = 0.5;
//     model.position.x = -10;

//     model.rotation.x = THREE.MathUtils.degToRad(90);


//     const animMixer = new THREE.AnimationMixer(model);
//     animMixer.clipAction(anim[0]).play(); 
    
//     //scene.add(model);
//     mixers.push(animMixer);
// });


// //Move to a separate file for assets
// const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
// const earthMaterial = new THREE.MeshPhongMaterial({
//     map: earthTexture, 
//     bumpMap: earthBumpMap,
//     specularMap: earthSpecMap,
//     specular: 0xA4A4A4,
//     shininess: 3
//     });

// var earth = new THREE.Mesh(earthGeometry, earthMaterial);
// //scene.add(earth);

// const cloudGeometry = new THREE.SphereGeometry(5.2, 32, 32);
// const cloudMaterial = new THREE.MeshPhongMaterial({
//     map: clouds,
//     transparent: true,
//     opacity: 0.8
// });

// var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
// //earth.add(clouds); 


