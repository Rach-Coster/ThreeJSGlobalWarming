import * as THREE from 'three';

import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
//Using GTLF models
var loader = new GLTFLoader();

//Loading via the draco loader to increase load time and condensing each model's number of vertices
const dracoLoader = new DRACOLoader(); 
const textureLoader = new THREE.TextureLoader();

dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/');
dracoLoader.preload();
//Attaching the Draco loader to the GLTF loader
loader.setDRACOLoader(dracoLoader);

var mixers = []; 
//Loading textures for each model
var earthTexture = textureLoader.load('../Textures/Earth/earth.png');
var earthBumpMap = textureLoader.load('../Textures/Earth/earthBumpMap.png');

var beeTexture = textureLoader.load('../Textures/Bee/bee.png');
var beeNormalMap = textureLoader.load('../Textures/Bee/beeNormalMap.png');
var beeAoMap = textureLoader.load('../Textures/Bee/beeAoMap.png');
var beeSpecMap = textureLoader.load('../Textures/Bee/beeSpecMap.png');
//Flipping textures dimensions 
var coralTexture = textureLoader.load('../Textures/Coral/coral.png');
coralTexture.flipY = false;
coralTexture.flipW = false;        

var coralNormalMap = textureLoader.load('../Textures/Coral/coralNormalMap.png');
coralNormalMap.flipY = false;
coralTexture.flipW = false;    

var fishTexture = textureLoader.load('../Textures/Fish/fish.png');
fishTexture.flipY = false; 

var fishNormalMap = textureLoader.load('../Textures/Fish/fishNormalMap.png');
fishNormalMap.flipY = false; 


var fishEmissive = textureLoader.load('../Textures/Fish/fishEmissive.png');
fishEmissive.flipY = false; 

class models {
    loadBee(position, rotation, animId, name){
        var bee = new THREE.Object3D(); 
        loader.load('../Models/Bee/bee.gltf', (model) => {
            var anim = model.animations;

            model = model.scene; 
            model.scale.setScalar(0.035);

            model.traverse((object) => {
                if(object.isMesh){
                    object.material = new THREE.MeshPhongMaterial({
                        map: beeTexture, 
                        normalMap: beeNormalMap, 
                        aoMap: beeAoMap,
                        specularMap: beeSpecMap,
                        specular: 0xA4A4A4,
                        shininess: 3,
                        name: name
                    });
                }
            });
            
            model.position.x = position.x; 
            model.position.y = position.y - 0.1; 
            model.position.z = 1.45;

            model.rotation.x = rotation.x;
            model.rotation.y = rotation.y;
        
            const animMixer = new THREE.AnimationMixer(model);
            animMixer.clipAction(anim[animId]).play(); 
            
            bee.attach(model);
            mixers.push(animMixer);
        
        });

        return bee; 
    }

    loadCoral(position, name){
        var coral = new THREE.Object3D();
        loader.load('../Models/Coral/coral.gltf', (model) => {
            model = model.scene; 
            model.scale.setScalar(0.15);

            model.traverse((object) => {
                if(object.isMesh){
                    object.material = new THREE.MeshPhongMaterial({
                        map: coralTexture,
                        normalMap: coralNormalMap,
                        name: name
                    });
                }
            });
            
            model.position.x = position.x + 0.1;
            model.position.y = position.y - 0.3; 
            model.position.z = 1.45;
            
            coral.attach(model); 
        });

        return coral;
    }

    loadFish(position, name){
        var fish = new THREE.Object3D(); 
        loader.load('../Models/Fish/fish.gltf', (model) => {
            var anim = model.animations;

            model = model.scene; 
            model.scale.setScalar(0.05);

            model.traverse((object) => {
                if(object.isMesh){
                    object.material = new THREE.MeshPhongMaterial({
                        map: fishTexture, 
                        normalMap: fishNormalMap,
                        emissive: fishEmissive,
                        name: name
                    });
                }
            });
            
            
            model.position.x = position.x; 
            model.position.y = position.y - 0.1;
            model.position.z = 1.45;

            const animMixer = new THREE.AnimationMixer(model);
            animMixer.clipAction(anim[0]).play();
            fish.attach(model); 
            mixers.push(animMixer); 
        });

        return fish;
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
    //Getting a list of the aniamtion mixers for each object
    getMixers(){
        return mixers; 
    }
};

export default models;

