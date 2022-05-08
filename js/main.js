import * as THREE from 'three';

import Grid from './grid.js';

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const grid = new Grid; 

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x58ADCB);

const loader = new GLTFLoader(); 
const textureLoader = new THREE.TextureLoader();

var mixers = []; 

const ratio = window.innerWidth / window.innerHeight; 
var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
camera.position.set(0, 0, 15);
camera.lookAt(0, 0, 0);  

scene.add(camera);

var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 1);
camera.add(cameralight);


var earthTexture = textureLoader.load('../Textures/Earth/earth.png');
var earthBumpMap = textureLoader.load('../Textures/Earth/earthBumpMap.png');
var earthSpecMap = textureLoader.load('../Textures/Earth/earthSpecMap.png'); 

var clouds = textureLoader.load('../Textures/Earth/clouds.png');

var beeTexture = textureLoader.load('../Textures/Bee/bee.png');
var beeNormalMap = textureLoader.load('../Textures/Bee/beeNormalMap.png');
var beeAoMap = textureLoader.load('../Textures/Bee/beeAoMap.png');
var beeSpecMap = textureLoader.load('../Textures/Bee/beeSpecMap.png');


//Externalise models
var bee = new THREE.Object3D(); 
//scene.add(bee);

loader.load('../Models/bee.gltf', (model) => {
    var anim = model.animations;

    model = model.scene; 
    model.scale.setScalar(0.15);

    model.traverse((object) => {
        if(object.isMesh){
            object.material = new THREE.MeshPhongMaterial({
                map: beeTexture, 
                normalMap: beeNormalMap, 
                aoMap: beeAoMap,
                specularMap: beeSpecMap,
                specular: 0xA4A4A4,
                shininess: 3
            });
        }
    })

    model.position.z = 0.5;
    model.rotation.x = THREE.MathUtils.degToRad(90);
    model.rotation.y = THREE.MathUtils.degToRad(45);



    const animMixer = new THREE.AnimationMixer(model);
    animMixer.clipAction(anim[1]).play(); 
    
    bee.attach(model);
    mixers.push(animMixer);

    render();
});


loader.load('../Models/bee.gltf', (model) => {
    var anim = model.animations;

    model = model.scene; 
    model.scale.setScalar(0.15);

    model.traverse((object) => {
        if(object.isMesh){
            object.material = new THREE.MeshPhongMaterial({
                map: beeTexture, 
                normalMap: beeNormalMap, 
                aoMap: beeAoMap,
                specularMap: beeSpecMap,
                specular: 0xA4A4A4,
                shininess: 3
            });
        }
    })

    model.position.z = 0.5;
    model.position.x = -10;
    model.rotation.x = THREE.MathUtils.degToRad(90);


    const animMixer = new THREE.AnimationMixer(model);
    animMixer.clipAction(anim[0]).play(); 
    
    //scene.add(model);
    mixers.push(animMixer);
});


//Move to a separate file for assets
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture, 
    bumpMap: earthBumpMap,
    specularMap: earthSpecMap,
    specular: 0xA4A4A4,
    shininess: 3
    });

var earth = new THREE.Mesh(earthGeometry, earthMaterial);
//scene.add(earth);

const cloudGeometry = new THREE.SphereGeometry(5.2, 32, 32);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: clouds,
    transparent: true,
    opacity: 0.8
});

var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
//earth.add(clouds); 

const mapGeometry = new THREE.BoxGeometry(30, 15, 1);  

const mapMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture, 
    bumpMap: earthBumpMap
});

var map = new THREE.Mesh(mapGeometry, mapMaterial);

scene.add(map);

//Populates grid
//grid.populateGrid("items").forEach(element => scene.add(element));

var positions = []; 

positions = grid.populateGrid("positions"); 

scene.add(grid.getGridHelper());

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

var controls = new OrbitControls(camera, renderer.domElement);


var render = () => {
    renderer.render(scene, camera);
    controls.update();
    
    var delta = clock.getDelta();

    // for(const mixer of mixers) {
    //     mixer.update(delta); 
    // }

    // bee.position.x += 2 * delta; 
    // bee.position.y -= 2 * delta; 

    //earth.rotation.y += 0.15 * delta;
    //clouds.rotation.y += 0.05 * delta;

    requestAnimationFrame(render); 
};

render(); 

var resize = () => {
    var width = window.innerWidth;
    var height = window.innerHeight; 
    renderer.setSize(width, height);

    camera.aspect = width / height; 
    camera.updateProjectionMatrix();
    renderer.render(scene, camera)
};

window.addEventListener('resize', resize);


