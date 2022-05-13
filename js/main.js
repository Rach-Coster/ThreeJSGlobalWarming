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
var groundArr = [
    264, 244, 206, 186, 187, 166, 146, 126,
    285, 284, 283, 270, 249, 229, 250, 251,
    231, 230, 211, 191, 171, 151, 291, 272,
    252, 273, 293, 294, 274, 254, 295, 296,
    310, 329, 275, 255, 235, 297, 236, 216,
    196, 195, 197, 198, 157, 137, 156, 136, 
    138, 118, 311
];

var coastArr = [
    210, 86, 170, 130, 150, 127, 85,
    165, 243, 192, 178, 118, 253, 207, 
    205, 263, 185, 277, 234, 266
];

var itemArr = []; 

var positions = grid.populateGrid("positions"); 
//console.log(positions); 

for(var i = 0; i < groundArr.length; i++){
    var bee2Pos = new THREE.Vector3((positions[groundArr[i]].x - 0.3)  + i * 0.02, (positions[groundArr[i]].y + 0.1) + i * 0.01, 0.5); 
    var bee2Rot = new THREE.Vector3(THREE.MathUtils.degToRad(90), 0, 0);
    var bee2 = models.loadBee(bee2Pos, bee2Rot, 1); 

    itemArr.push(bee2); 

    scene.add(bee2);     
}

for(var i = 0; i < coastArr.length; i++){
    var coralPos = new THREE.Vector2((positions[coastArr[i]].x), positions[coastArr[i]].y);
    var coral = models.loadCoral(coralPos);

    itemArr.push(coral);

    scene.add(coral);
}

//scene.add(models.loadCoral()); 

//Populates grid
//var itemArr = grid.populateGrid("items")
//itemArr.forEach(element => scene.add(element));

// var itemArr = [];

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
    
    const intersects = raycaster.intersectObjects(scene.children, true);
    if(intersects.length > 0 && intersects[0].object.name == "button"){
        ui.setYear(2); 

        scene.remove(currentYear);
        currentYear = ui.getYear();
        
        scene.add(currentYear);
    }
    else if(intersects.length > 0){
        var selected = intersects[0].object; 
        
        if(itemArr.find(element => element.name == selected.name)){
            //Temp for finding grid points
            console.log(itemArr.indexOf(selected));
            selected.visible = false;
            
            // if(selected.material.emissive.getHex() == "0xFFFF00")
            //     selected.material.emissive.setHex(null);
                 
            
            // else{
            //     selected.material.emissive.setHex(0xFFFF00);
            //     selected.visible = false;
            // }
        }
    }
});

