import * as THREE from 'three';

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x58ADCB);

//const loader = new FBXLoader(); 
const textureLoader = new THREE.TextureLoader();

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
earth.position

scene.add(earth);

const cloudGeometry = new THREE.SphereGeometry(5.2, 32, 32);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: clouds,
    transparent: true,
    opacity: 0.8
});

var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)

earth.add(clouds); 


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

var controls = new OrbitControls(camera, renderer.domElement);

var render = () => {
    renderer.render(scene, camera);
    controls.update();
    
    var delta = clock.getDelta(); 
    
    earth.rotation.y += 0.15 * delta;
    clouds.rotation.y += 0.05 * delta;

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


