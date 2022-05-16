import * as THREE from 'three';

import Grid from './grid.js';
import Ui from './ui.js';
import Models from './models.js';

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const grid = new Grid; 
const ui = new Ui; 
const models = new Models; 

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x58ADCB);

const raycaster = new THREE.Raycaster(); 

var cursor = new THREE.Vector2(); 

const ratio = window.innerWidth / window.innerHeight; 
var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
camera.position.set(0, 0, 15);
camera.lookAt(0, 0, 0);  

scene.add(camera);

var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 1);
camera.add(cameralight);

scene.add(ui.getTitle());

var currentYear = ui.getYear();
scene.add(currentYear);

var button = ui.getButton();
scene.add(button);

var map = models.loadMap();
scene.add(map);

//Animated example of bee
//Change to vector2 for rotation
//var bee1Pos = new THREE.Vector3(0, 0, 0.5);
//var bee1Rot = new THREE.Vector3(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(45), 0);
//var bee1 = models.loadBee(bee1Pos, bee1Rot, 1);

//scene.add(bee1);

//Example of idle bee

var itemArr = []; 

var positions = grid.populateGrid("positions"); 

var groundArr = [
    206, 186, 266, 246, 226, 256,
    251, 149, 155, 154, 130, 170,   
    231, 211, 191, 171, 151, 152,
    150, 170, 207, 227, 169, 135,
    136, 134, 133, 115, 114, 116,
    113, 124, 104, 105, 103, 257
    
];

// var beeArr = grid.populateWithBees(); 
// for(var i = 0; i < groundArr.length; i++){
//     scene.add(beeArr[groundArr[i]]);
// }

//beeArr.forEach(element => scene.add(element));

var coastArr = [
    210, 230, 250, 97, 153, 166, 143,
    165, 212, 258, 278, 118, 187, 109,
    205, 185, 297, 267, 306, 123, 145, 
    215, 195, 125, 164, 137, 252, 117,
    270, 129, 225, 176, 237, 189, 190
];

// var coralArr = grid.populateWithCoral();
// for(var i = 0; i < coastArr.length; i++){
//    scene.add(coralArr[coastArr[i]]);
// } 
//coralArr.forEach(element => scene.add(element));

var seaArr = [
    225, 275, 272, 291, 290, 229,
    249, 269, 287, 245, 265,
    126, 102, 122, 142, 143, 296, 
    297, 318, 106, 82, 118, 138,
    158, 233, 234, 253, 254, 122,
    142, 141, 279
]

// var fishArr = grid.populateWithFish();
// for(var i = 0; i < seaArr.length; i++){
//     scene.add(fishArr[seaArr[i]]);
// }

//fishArr.forEach(element => scene.add(element)); 

//Populates grid
// var itemArr = grid.populateGrid("items");
// itemArr.forEach(element => scene.add(element));

scene.add(grid.getGridHelper());

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

var controls = new OrbitControls(camera, renderer.domElement);

var render = () => {
    renderer.render(scene, camera);
    controls.update();
    
    var delta = clock.getDelta();

 
    for(const mixer of models.getMixers()) {
        mixer.update(delta); 
    }

    //bee1.position.x += 2 * delta; 
    //bee1.position.y -= 2 * delta; 

    //earth.rotation.y += 0.15 * delta;
    //clouds.rotation.y += 0.05 * delta;

    requestAnimationFrame(render); 
};

render(); 

window.addEventListener('resize', () => {
    var width = window.innerWidth;
    var height = window.innerHeight; 
    renderer.setSize(width, height);
	
    camera.aspect = width / height; 
    camera.updateProjectionMatrix();
    renderer.render(scene, camera)
});

document.addEventListener('pointerdown', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1; 
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1; 

    raycaster.setFromCamera(cursor, camera); 
    
    const intersects = raycaster.intersectObjects(scene.children);


    if(intersects.length > 0 && intersects[0].object.name == "button"){
        ui.setYear(2); 

        scene.remove(currentYear);
        currentYear = ui.getYear();
        
        scene.add(currentYear);
    }
    
    if(intersects.length > 0 && intersects[0].object.type != "GridHelper" ){
        var selected = intersects[0].object; 
        if(itemArr.find(element => element.name == selected.name)){
            console.log(itemArr.indexOf(selected));
            selected.visible = false;
        }
        
        // var found = beeArr.find(element => element.name == selected.material.name);
        // if(found){
        //     //Temp for finding grid points
        //     console.log(beeArr.indexOf(found));
        //     selected.visible = false;
        //}

        var found = coralArr.find(element => element.name == selected.material.name)
        if(found){
            console.log(coralArr.indexOf(found));
            selected.visible = false; 
        }
        // var found = fishArr.find(element => element.name == selected.material.name);
        // if(found){
        //     //Temp for finding grid points
        //     console.log(fishArr.indexOf(found));
        //     selected.visible = false;
            
            // if(selected.material.emissive.getHex() == "0xFFFF00")
            //     selected.material.emissive.setHex(null);
                 
            
            // else{
            //     selected.material.emissive.setHex(0xFFFF00);
            //     selected.visible = false;
            // }
        
    }
});

