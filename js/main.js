import * as THREE from 'three';

import Models from './models.js';
import Grid from './grid.js';
import Ui from './ui.js';

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

//Populates grid
var itemArr = grid.populateGrid();
itemArr.forEach(element => scene.add(element));

var coralArr = grid.getCoralArray(); 
coralArr.forEach(element => scene.add(element)); 

var beeArr = grid.getBeeArray(); 
beeArr.forEach(element => scene.add(element));

var fishArr = grid.getFishArray(); 
fishArr.forEach(element => scene.add(element)); 


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

var itemInstance;
var originalName;  
var priorGrid; 

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

    //TODO: 
    //Make it so that when you click on an object, the corresponding tile is clicked on
    //
    else if(intersects.length > 0 && intersects[0].object.type != "GridHelper"){
        var selected = intersects[0].object; 
 
        if(!itemArr.find(element => element.name == selected.name)){
            selected.name = selected.material.name; 
        }

        if(selected.type == "SkinnedMesh" && selected.material.name ==  originalName){
           selected.name = priorGrid.name;
       }

        var found = itemArr.find(element => element.name == selected.name); 
        if(found){
            selected = found; 

            if(!priorGrid && selected.hasItem){

                selected.material.transparent = false; 
                selected.material.color.setHex(0xFFFF00); 
                

                originalName = selected.name;
                itemInstance = coralArr.find(element => element.name == selected.name);
                if(!itemInstance){
                    itemInstance = beeArr.find(element => element.name == selected.name);
                    if(!itemInstance){
                        itemInstance = fishArr.find(element => element.name == selected.name);
                    } 
                }
            }
            
            else if(priorGrid != selected && selected.hasItem){

                selected.material.transparent = false; 
                selected.material.color.setHex(0xFFFF00);   

                priorGrid.material.transparent = true;
                priorGrid.material.opacity = 0.0;  

                originalName = selected.name;
                itemInstance = coralArr.find(element => element.name == selected.name);
                if(!itemInstance){
                    itemInstance = beeArr.find(element => element.name == selected.name);
                    if(!itemInstance){
                        itemInstance = fishArr.find(element => element.name == selected.name);
                    } 
                }
    
            }    

            else if(itemInstance && !selected.hasItem && priorGrid.hasItem){

                selected.material.transparent = false; 
                selected.material.color.setHex(0x00FF00); 

                priorGrid.material.transparent = true;
                priorGrid.material.opacity = 0.0;  
                
                //Change offset
                itemInstance.children[0].position.x = selected.position.x;
                itemInstance.children[0].position.y = selected.position.y - 0.2; 

                priorGrid.hasItem = false;  
                selected.hasItem = true; 
            }

            else if(priorGrid == selected && selected.hasItem){
                if(priorGrid.material.transparent){
                    priorGrid.material.transparent = false;
                    selected.material.color.setHex(0xFFFF00);
                } 
                else
                    priorGrid.material.transparent = true;                
            }

            
            
            priorGrid = selected; 

        }
    }
});

