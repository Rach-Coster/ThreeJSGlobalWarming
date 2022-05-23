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

var itemPosArr = grid.getItemPosArray(); 

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


    else if(intersects.length > 0 && intersects[0].object.type != "GridHelper"){
        var selected = intersects[0].object; 

        console.log("--- New Instance ---");
        console.log("Selected prior to array check ", selected);                        
 
        if(!itemArr.find(element => element.name == selected.name)){
            console.log("could not be found in array", selected);
            selected.name = selected.material.name; 
        }

        var found = itemArr.find(element => element.name == selected.name); 
        if(found){
            console.log("Item instance: ", itemInstance); 
            
            selected = found; 
            console.log("Selected item: ", selected);
            console.log("Prior Grid: ", priorGrid);

            if(!priorGrid && selected.hasItem){
                console.log("Checks for the first instance - lack of prior grid", selected);
                selected.material.visible = true; 
                selected.material.color.setHex(0xFFFF00);

                // originalName = selected.name;
                itemInstance = coralArr.find(element => element.name == selected.name);
                if(!itemInstance){
                    itemInstance = beeArr.find(element => element.name == selected.name);
                    if(!itemInstance){
                        itemInstance = fishArr.find(element => element.name == selected.name);
                    } 
                }
            }

            else if(priorGrid != selected && selected.hasItem){
                console.log("checks that the prior grid is not the same as the selected", selected)
                selected.material.visible = true; 
                selected.material.color.setHex(0xFFFF00);   

                priorGrid.material.visible = false; 
                  

                // originalName = selected.name;
                itemInstance = coralArr.find(element => element.name == selected.name);
                if(!itemInstance){
                    itemInstance = beeArr.find(element => element.name == selected.name);
                    if(!itemInstance){
                        itemInstance = fishArr.find(element => element.name == selected.name);
                    } 
                }
            }    
            
            else if(itemInstance && !selected.hasItem && priorGrid.hasItem && priorGrid.material.visible){
                console.log("moves the item over to the new location")

                selected.material.visible = true; 
                selected.material.color.setHex(0x00FF00); 

                priorGrid.material.visible = false; 
               
                if(itemInstance.itemType == "coral"){
                    let coralInstance = coralArr.find(element => element.name == itemInstance.name);
                    coralInstance.name = selected.name; 
                    coralInstance.children[0].position.x = itemPosArr[selected.name].x + 0.1;
                    coralInstance.children[0].position.y = itemPosArr[selected.name].y - 0.25;
                      
                    coralInstance.traverse((object) => {
                        if(object.isMesh){
                            object.name = selected.name; 
                            object.material.name = selected.name; 
                        }
                    });
                }
                     
                else if(itemInstance.itemType == "bee"){
                    let beeInstance = beeArr.find(element => element.name == itemInstance.name);
                    beeInstance.name = selected.name; 
                    beeInstance.children[0].position.x = itemPosArr[selected.name].x + 0.1;
                    beeInstance.children[0].position.y = itemPosArr[selected.name].y; 

                    beeInstance.traverse((object) => {
                        if(object.isMesh){
                            object.name = selected.name; 
                            object.material.name = selected.name; 
                        }
                    });
                } 
                    
                else if(itemInstance.itemType == "fish"){
                    let fishInstance = fishArr.find(element => element.name == itemInstance.name);
                    fishInstance.name = selected.name; 
                    fishInstance.children[0].position.x = itemPosArr[selected.name].x;
                    fishInstance.children[0].position.y = itemPosArr[selected.name].y - 0.1;  
                        
                    fishInstance.traverse((object) => {
                        if(object.isMesh){
                            object.name = selected.name; 
                            object.material.name = selected.name; 
                        }
                    });
                    
                }
                

                priorGrid.hasItem = false;
                selected.hasItem = true;

                itemInstance = null;  
            }

            else if(selected.hasItem){
                console.log("Makes the grid transparent after multiple clicks")
                if(!priorGrid.material.visible){
                    selected.material.visible = true;
                    selected.material.color.setHex(0xFFFF00);

                    itemInstance = coralArr.find(element => element.name == selected.name);
                    if(!itemInstance){
                        itemInstance = beeArr.find(element => element.name == selected.name);
                        if(!itemInstance){
                            itemInstance = fishArr.find(element => element.name == selected.name);
                        } 
                    }
                }
                
                else {
                    priorGrid.material.visible = false;          
                } 
            }

            else if(priorGrid.material.color.getHexString() == "00ff00"){
                priorGrid.material.visible = false; 
            }
        
            priorGrid = selected; 

        }
    }
});

