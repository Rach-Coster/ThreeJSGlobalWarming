import * as THREE from 'three';

import Models from './models.js';
import Grid from './grid.js';
import Ui from './ui.js';

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const models = new Models; 
const grid = new Grid; 
const ui = new Ui; 

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

var cameralight = new THREE.PointLight(new THREE.Color(1,1,1), 1);
camera.add(cameralight);

scene.add(ui.getTitle());

var currentYear = ui.getYear();
scene.add(currentYear);

//Temp: Number should be 10
var totalMoves = 10; 

var movesLeft = ui.getMoves(); 
scene.add(movesLeft);

var button = ui.getButton();
scene.add(button);

var map = models.loadMap();
scene.add(map);

scene.add(grid.getGridHelper());

var tileArr = grid.generateTiles();
tileArr.forEach(element => { scene.add(element) });

console.log("Tile Arr: ", tileArr);

var tokenArr = []; 
var deadTokenArr = []; 

var maxBees = 20;
var maxCoral = 20;
var maxFish = 40;

var maxTokens = maxBees + maxCoral + maxFish; 

var countBees = 0; 
var countCoral = 0; 
var countFish = 0;

var count = 0; 

while(count != maxTokens){
    var random = Math.floor(Math.random() * tileArr.length);
    if(!tokenArr.length || !tokenArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain != "snow"){
        if(tileArr[random].terrain == "land" && countBees < maxBees){
            countBees++;    
            var token = grid.addToken(tileArr[random]);
            tokenArr.push(token);
            scene.add(token); 
            tileArr[random].hasItem = true; 
            count++;
        }
            
        else if(tileArr[random].terrain == "coast" && countCoral < maxCoral){
            countCoral++;       
            var token = grid.addToken(tileArr[random]);
            tokenArr.push(token);
            scene.add(token);
            tileArr[random].hasItem = true; 
            count++; 
        }

        else if(tileArr[random].terrain == "sea" && countFish < maxFish){
            countFish++; 
            var token = grid.addToken(tileArr[random]);
            tokenArr.push(token);
            scene.add(token);
            tileArr[random].hasItem = true; 
            count++;
        }
    }
}

var randEvent = Math.floor(Math.random() * 4);
 
var getEarthquakePosition = () => {
    var randX = Math.floor(Math.random() * 16) + 2;
    var randYArr = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    
    var randY = Math.floor(Math.random() * randYArr.length);
    randY = randYArr[randY]; 

    var tile = tileArr.find(element => element.position.x == tileArr[randX].position.x && element.position.y == tileArr[randY].position.y);

    return tile; 
}
var randomEvent = () => {
    var maxFire = 20; 
    var maxHeatwave = 10; 
    var maxWave = 20;

    var eventArr = []; 
    var eventCount = 0; 

    if(randEvent == 0){
        var randFire = Math.floor(Math.random() * maxFire) + 1; 

        while(eventCount != randFire){
            var random = Math.floor(Math.random() * tileArr.length);
            var deadToken = deadTokenArr.find(element => element.name == random);
              
            if(!eventArr.length && tileArr[random].terrain == "land" && !deadToken || 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "land" && !deadToken){

                if(randFire - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randFire > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "bee"){
                            deadTokenCount++;
                        }
                    });
                    
                    if(tileHasItem || deadTokenCount == maxBees){
                        var eventToken = grid.addEvent(tileArr[random]);
                        eventArr.push(eventToken);
                        scene.add(eventToken);
                        eventCount++;
                    }
                }

                else {
                    var eventToken = grid.addEvent(tileArr[random]);
                    eventArr.push(eventToken);
                    scene.add(eventToken);
                    eventCount++;
                }
            }

            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }

        return eventArr; 
    }

    else if(randEvent == 1){
        var randHeatwave = Math.floor(Math.random() * maxHeatwave) + 1; 

        while(eventCount != randHeatwave){
            var random = Math.floor(Math.random() * tileArr.length);
            var deadToken = deadTokenArr.find(element => element.name == random);

            if(!eventArr.length && tileArr[random].terrain == "coast" && !deadToken || 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "coast" && !deadToken){
                
                if(randHeatwave - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randHeatwave > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "coral"){
                            deadTokenCount++;
                        }
                    });

                    
                    
                    if(tileHasItem || deadTokenCount == maxCoral){
                        var eventToken = grid.addEvent(tileArr[random]);
                        eventArr.push(eventToken);
                        scene.add(eventToken);
                        eventCount++;
                    }
                }
                
                else {
                    var eventToken = grid.addEvent(tileArr[random]);
                    eventArr.push(eventToken);
                    scene.add(eventToken);
                    eventCount++;
                }
                 
            }
            
            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }

        return eventArr; 
    }
 
    else if(randEvent == 2){
        var randWave = Math.floor(Math.random() * maxWave) + 1; 
        
        while(eventCount != randWave){
            var random = Math.floor(Math.random() * tileArr.length);
            var deadToken = deadTokenArr.find(element => element.name == random);

            if(!eventArr.length && tileArr[random].terrain == "sea" && !deadToken || 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "sea" && !deadToken){

                if(randWave - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randWave > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "fish"){
                            deadTokenCount++;
                        }
                    });
                    
                    if(tileHasItem || deadTokenCount == maxFish){
                        var eventToken = grid.addEvent(tileArr[random]);
                        eventArr.push(eventToken);
                        scene.add(eventToken);
                        eventCount++;
                    }
                }
                
                else {
                    var eventToken = grid.addEvent(tileArr[random]);
                    eventArr.push(eventToken);
                    scene.add(eventToken);
                    eventCount++;
                }
            }
            
            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }

        return eventArr; 
    }

    else {
        var earthquakePosition = getEarthquakePosition(); 
        var deadToken = deadTokenArr.find(element => element.name == earthquakePosition.name);
        
        while(deadToken){
            earthquakePosition = getEarthquakePosition(); 
            deadToken = deadTokenArr.find(element => element.name == earthquakePosition.name);
        }
        
        eventArr = grid.addEvent(earthquakePosition, "earthquake");
        eventArr.forEach(element => scene.add(element));
        
        return eventArr; 
    }
}

var eventArr = randomEvent(); 

console.log("Event Arr: ", eventArr);

//Animated example of bee
//Change to vector2 for rotation
//var bee1Pos = new THREE.Vector3(0, 0, 0.5);
//var bee1Rot = new THREE.Vector3(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(45), 0);
//var bee1 = models.loadBee(bee1Pos, bee1Rot, 1);

//scene.add(bee1);

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; 

var mixers = models.getMixers(); 

var render = () => {
    renderer.render(scene, camera);
    controls.update();

    var delta = clock.getDelta();

    mixers.forEach(element => element.update(delta));

    requestAnimationFrame(render); 
};

render(); 

window.addEventListener('resize', () => {
    var width = window.innerWidth;
    var height = window.innerHeight;
	
    camera.aspect = width / height; 
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.render(scene, camera)
});

var itemInstance;
var priorGrid; 
var tokenOffsetArr = grid.getTokenOffsetArray(); 

var getEarthquakeTilePositions = (tileName) => {
    var eqArr = []; 

    eqArr.push(tileArr[tileName]);

    if(eventArr[0].scale.x.toFixed(1) == 0.2){
        eqArr.push(tileArr[tileName + 20])
        eqArr.push(tileArr[tileName - 20])
    }
    
    else if(eventArr[0].scale.x.toFixed(1) == 0.3){
        eqArr.push(tileArr[tileName + 1]);
        eqArr.push(tileArr[tileName - 1]);
        
        eqArr.push(tileArr[tileName + 20]);
        eqArr.push(tileArr[tileName - 20]);

        eqArr.push(tileArr[tileName + 19]);
        eqArr.push(tileArr[tileName - 19]);

        eqArr.push(tileArr[tileName + 21]);
        eqArr.push(tileArr[tileName - 21]);
    }
        
    else if(eventArr[0].scale.x.toFixed(1) == 0.4){
        eqArr.push(tileArr[tileName + 1]);
        eqArr.push(tileArr[tileName - 1]);

        eqArr.push(tileArr[tileName + 20]);
        eqArr.push(tileArr[tileName - 20]);

        eqArr.push(tileArr[tileName + 40]);
        eqArr.push(tileArr[tileName - 40]);

        eqArr.push(tileArr[tileName + 19]);
        eqArr.push(tileArr[tileName - 19]);

        eqArr.push(tileArr[tileName + 21]);
        eqArr.push(tileArr[tileName - 21]);
    }
        
    else if(eventArr[0].scale.x.toFixed(1) == 0.5){
        eqArr.push(tileArr[tileName + 1]);
        eqArr.push(tileArr[tileName - 1]);

        eqArr.push(tileArr[tileName + 20]);
        eqArr.push(tileArr[tileName - 20]);

        eqArr.push(tileArr[tileName + 40]);
        eqArr.push(tileArr[tileName - 40]);

        eqArr.push(tileArr[tileName + 60]);
        eqArr.push(tileArr[tileName - 60]);

        eqArr.push(tileArr[tileName + 19]);
        eqArr.push(tileArr[tileName - 19]);

        eqArr.push(tileArr[tileName + 21]);
        eqArr.push(tileArr[tileName - 21]);

        eqArr.push(tileArr[tileName + 39]);
        eqArr.push(tileArr[tileName - 39]);

        eqArr.push(tileArr[tileName + 41]);
        eqArr.push(tileArr[tileName - 41]);
    }
    
    return eqArr; 
} 

document.addEventListener('pointerdown', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1; 
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1; 

    raycaster.setFromCamera(cursor, camera); 
    
    const intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length > 0 && intersects[0].object.name == "button"){
        if(priorGrid && priorGrid.material.visible)
            priorGrid.material.visible = false;      
            
        for(var i = 0; i < eventArr.length; i++){
            var foundToken; 
            
            scene.remove(eventArr[i]);
           
            if(eventArr[i].eventType == "earthquake"){
                var earthquakePosArr = getEarthquakeTilePositions(eventArr.name);
                
                for(var j = 0; j < earthquakePosArr.length; j++){
                    foundToken = tokenArr.find(element => element.name == earthquakePosArr[j].name);
                    if(foundToken){
                        var tokenStatus = deadTokenArr.find(element => element.name == foundToken.name);
                        if(!tokenStatus){


                            foundToken.traverse((token) => {
                                if(token.isMesh){
                                    token.material.emissive = new THREE.Color(0xFFFFFF);
                                    token.material.emissiveIntensity = 0.75;
                                }
                            });
        
                            var tokenName = foundToken.name;
                            var foundAnimation = mixers.find(element => element.getRoot().parent.name == tokenName);
                        
                            if(foundAnimation)
                                foundAnimation.stopAllAction();

                            tileArr[tokenName].material.visible = true;
                            tileArr[tokenName].material.color.setHex(0xFF0000);
            
                            deadTokenArr.push(foundToken);
                        }
                    }
                        
                }

                eventArr[i].geometry.dispose();
                eventArr[i].material.dispose();
            }

            else {
                foundToken = tokenArr.find(element => element.name == eventArr[i].name);
        
                if(foundToken){  
                    
                    var tokenStatus = deadTokenArr.find(element => element.name == foundToken.name);
                    
                    if(!tokenStatus){

                        foundToken.traverse((token) => {
                            if(token.isMesh){
                                token.material.emissive = new THREE.Color(0xFFFFFF);
                                token.material.emissiveIntensity = 0.75;
                            }
                        });
    
                        var tokenName = foundToken.name;
        
                        var foundAnimation = mixers.find(element => element.getRoot().parent.name == tokenName);
                        
                        if(foundAnimation)
                            foundAnimation.stopAllAction();
    
    
                        tileArr[tokenName].material.visible = true;
                        tileArr[tokenName].material.color.setHex(0xFF0000);
        
                        deadTokenArr.push(foundToken);
    
                    }      
                                
                   
                }
   
                eventArr[i].children[0].geometry.dispose();
                eventArr[i].children[1].material.dispose();
            } 
            
        }
        eventArr.splice(0, eventArr.length);

        renderer.renderLists.dispose();

        randEvent = Math.floor(Math.random() * 4);

        eventArr = randomEvent(); 
        earthquakePosArr = getEarthquakeTilePositions(eventArr.name);
    
        console.log("Event Arr: ", eventArr);

        scene.remove(currentYear);
        
        ui.setYear(2); 
        currentYear = ui.getYear();
        scene.add(currentYear);
        
        scene.remove(movesLeft);
        
        //Change this to get totalMoves and setTotalMoves within the Ui class
        totalMoves = 10; 
        ui.setMoves(totalMoves);

        movesLeft = ui.getMoves();
        scene.add(movesLeft); 
    }

    else if(intersects.length > 0 && intersects[0].object.type != "GridHelper" && totalMoves != 0){
        console.log("---Selected Tile---");

        var selected = intersects[0].object;
        console.log("Selected Tile:", selected); 
        console.log("Terrain: ", selected.terrain);
        console.log("TileNo: ", selected.name); 
        console.log("x: ", selected.position.x, " y:", selected.position.y); 
    

        console.log("--- New Instance ---");
        console.log("Selected prior to array check ", selected);                        
 
        if(!tileArr.find(element => element.name == selected.name)){
            console.log("could not be found in array", selected);
            selected.name = selected.material.name; 
        }

        var found = tileArr.find(element => element.name == selected.name); 
        console.log("Found: ", found); 
        
        if(found && !found.material.visible){
            console.log("Item instance: ", itemInstance); 
            
            selected = found; 
            console.log("Selected item: ", selected);
            console.log("Prior Grid: ", priorGrid);

            if(!priorGrid && selected.hasItem){
                console.log("Checks for the first instance - lack of prior grid", selected);
                selected.material.visible = true; 
                selected.material.color.setHex(0xFFFF00);

                itemInstance = tokenArr.find(element => element.name == selected.name);
            }

            else if(priorGrid != selected && selected.hasItem){
                console.log("checks that the prior grid is not the same as the selected", selected)
                selected.material.visible = true; 
                selected.material.color.setHex(0xFFFF00);   

                priorGrid.material.visible = false; 
                  
                itemInstance = tokenArr.find(element => element.name == selected.name);
            }    
            
            else if(itemInstance && !selected.hasItem && priorGrid.hasItem && priorGrid.material.visible){
                console.log("moves the item over to the new location")
                
                scene.remove(movesLeft);

                totalMoves--;
                ui.setMoves(totalMoves);
                
                movesLeft = ui.getMoves(); 
                scene.add(movesLeft); 

                console.log("Moves left: ", totalMoves); 
                            
                selected.material.visible = true; 
                selected.material.color.setHex(0x00FF00); 

                if(totalMoves == 0){
                    selected.material.visible = false; 
                }

                priorGrid.material.visible = false; 
                   
                itemInstance.name = selected.name; 
                itemInstance.children[0].position.x = tokenOffsetArr[selected.name].x
                itemInstance.children[0].position.y = tokenOffsetArr[selected.name].y;
                    
                itemInstance.traverse((object) => {
                    if(object.isMesh){
                        object.name = selected.name; 
                        object.material.name = selected.name; 
                    }
                });
            
                priorGrid.hasItem = false;
                selected.hasItem = true;

                itemInstance = null;  
            }

            else if(selected.hasItem){
                console.log("Makes the grid transparent after multiple clicks")
                if(!priorGrid.material.visible){
                    selected.material.visible = true;
                    selected.material.color.setHex(0xFFFF00);

                    itemInstance = tokenArr.find(element => element.name == selected.name);
                }
                
                else {
                    priorGrid.material.visible = false;          
                } 
            }

            else if(priorGrid && priorGrid.material.color.getHex() == 0x00FF00){
                priorGrid.material.visible = false; 
            }
        
            priorGrid = selected; 
        }

        else if(found && found.material.visible && found.material.color.getHex() != 0xFF0000){
            found.material.visible = false; 
        }
    }

    else if(totalMoves == 0){
        console.log("Out of moves, please take your next turn");
    }
});

