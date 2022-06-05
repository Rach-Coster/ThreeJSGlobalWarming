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

var movesLeft = ui.getMoves(); 
scene.add(movesLeft);

var button = ui.getButton();
scene.add(button);

var map = models.loadMap();
scene.add(map);

scene.add(grid.getGridHelper());

var tileArr = grid.generateTiles();
tileArr.forEach(element => { scene.add(element) });

var tokenArr = []; 
var deadTokenArr = []; 
var eventArr = []; 

var maxBees = 20;
var maxCoral = 20;
var maxFish = 40;

var maxTokens = maxBees + maxCoral + maxFish; 

var randEvent = Math.floor(Math.random() * 4);
var randStartEvent = randEvent; 

//Run once at the on load and once when a new game is selected
var newGame = () => {
    var countBees = 0; 
    var countCoral = 0; 
    var countFish = 0;
    
    var count = 0; 
    
    //If the maxmimum number of tokens are not on the board
    while(count != maxTokens){
        //Choose random tile
        var random = Math.floor(Math.random() * tileArr.length);
        if(!tokenArr.length || !tokenArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain != "snow"){
            //Determine tiles terrain type
            if(tileArr[random].terrain == "land" && countBees < maxBees){
                countBees++;    
                var token = grid.addToken(tileArr[random]);
                //Add token based on terrain type
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
    
    eventArr = randomEvent(); 
    return eventArr; 
}
 
//Potential migration to grid.js
var getEarthquakePosition = () => {
    //Positions that allow the earthquake to still be within the bounds of the grid
    var randX = Math.floor(Math.random() * 16) + 2;
    var randYArr = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    
    var randY = Math.floor(Math.random() * randYArr.length);
    randY = randYArr[randY]; 

    //Selected at random for each earthquake
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
        //Creates a random amount of the event between 1 and the maximum
        var randFire = Math.floor(Math.random() * maxFire) + 1; 

        while(eventCount != randFire){
            //Selects a random tile 
            var random = Math.floor(Math.random() * tileArr.length);
            //Checks if the tile's token is out of play
            var deadToken = deadTokenArr.find(element => element.name == random);
            //Checks the tile's terrain
            if(!eventArr.length && tileArr[random].terrain == "land" && !deadToken || 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "land"){
                //If there are more than three event tiles, the tile must contain a token
                if(randFire - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randFire > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "bee"){
                            deadTokenCount++;
                        }
                    });
                    /*Adds the event based on the tile containing a live token or 
                      the tile having a dead token if all tokens of that type
                      are out of play */

                    if(tileHasItem || deadTokenCount >= maxBees){
                        var eventToken = grid.addEvent(tileArr[random]);
                        eventArr.push(eventToken);
                        scene.add(eventToken);
                        eventCount++;
                    }
                }

                //Adds the event as long as there is the correpsonding tile type
                else {
                    var eventToken = grid.addEvent(tileArr[random]);
                    eventArr.push(eventToken);
                    scene.add(eventToken);
                    eventCount++;
                }
            }
            //If the terrain type is the same for the token and the event
            //get a new tile
            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }
    
        return eventArr;
       
    }
    //Same as above but for coral
    else if(randEvent == 1){
        var randHeatwave = Math.floor(Math.random() * maxHeatwave) + 1; 

        while(eventCount != randHeatwave){
            var random = Math.floor(Math.random() * tileArr.length);
            var deadToken = deadTokenArr.find(element => element.name == random);

            if(!eventArr.length && tileArr[random].terrain == "coast" && !deadToken|| 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "coast" && !deadToken){
        
                if(randHeatwave - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randHeatwave > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "coral"){
                            deadTokenCount++;
                        }
                    });
                    
                    if(tileHasItem || deadTokenCount >= maxCoral){
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
    //Same as above but for fish
    else if(randEvent == 2){
        var randWave = Math.floor(Math.random() * maxWave) + 1; 
        
        while(eventCount != randWave){
            var random = Math.floor(Math.random() * tileArr.length);
            var deadToken = deadTokenArr.find(element => element.name == random);

        
            if(!eventArr.length && tileArr[random].terrain == "sea" && !deadToken|| 
                !eventArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "sea" && !deadToken){

                if(randWave - 1 == eventCount && !eventArr.find(element => tileArr[element.name].hasItem == true) && randWave > 3){
                    var tileHasItem = tileArr[random].hasItem; 
                    var deadTokenCount = 0;

                    deadTokenArr.forEach(element => {
                        if(element.tokenType == "fish"){
                            deadTokenCount++;
                        }
                    });
                    
                    if(tileHasItem || deadTokenCount >= maxFish){
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
    
    if(randEvent >= 3){
        var earthquakePosition = getEarthquakePosition(); 
        //Checks if the epicentre of the earthquake is on a dead token
        var deadToken = deadTokenArr.find(element => element.name == earthquakePosition.name);
        
        //Generate a new position until the epicentre is not on a dead oken
        while(deadToken){
            earthquakePosition = getEarthquakePosition(); 
            deadToken = deadTokenArr.find(element => element.name == earthquakePosition.name);
        }
        
        //Adds a different number of circles depending on the scale
        eventArr = grid.addEvent(earthquakePosition, "earthquake");
        eventArr.forEach(element => scene.add(element));
        
        return eventArr;
    }
}

var eventArr = newGame();

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

//Orbit controls without rotation
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; 

//Animation mixers for each animated object
var mixers = models.getMixers(); 

var render = () => {
    renderer.render(scene, camera);
    controls.update();
    
    //Get the delta time for animations
    var delta = clock.getDelta(); 

    mixers.forEach(element => element.update(delta));

    requestAnimationFrame(render); 
};

render(); 

//Resize the canvas when the screen size changes
window.addEventListener('resize', () => {
    var width = window.innerWidth;
    var height = window.innerHeight;
	
    camera.aspect = width / height; 
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.render(scene, camera)
});
 

//Msc variables in preperation for checking the raycast
var tokenOffsetArr = grid.getTokenOffsetArray(); 
var gameOverItems;

var itemInstance;
var priorTile; 

var gameOver = false;

//The positions that are checked depending on the size of the earthquake
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

//On click
document.addEventListener('pointerdown', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1; 
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1; 

    //Creates a ray from the click position
    raycaster.setFromCamera(cursor, camera); 
    
    //Checks which objects are intersected with on click
    const intersects = raycaster.intersectObjects(scene.children);

    //Checks that the game isn't over when the 'next turn' button is clicked
    if(intersects.length > 0 && intersects[0].object.name == "button" && !gameOver){
        //Checks that the last tile selected is visible and is not red
        if(priorTile && priorTile.material.visible && priorTile.material.color.getHex() != 0xFF0000){
            priorTile.material.visible = false;    
        }
        
        //Checks that the token that is going to be is visible and not red
        else if(itemInstance && tileArr[itemInstance.name].material.visible && tileArr[itemInstance.name].material.color.getHex() != 0xFF0000){
            tileArr[itemInstance.name].material.visible = false; 
        }

        //If a tile has the same terrain type as the token and does not contain an item
        //Make it invisible
        if(itemInstance){
            tileArr.forEach(element => {
                if(element.terrain == tileArr[itemInstance.name].terrain && !element.hasItem){
                    element.material.visible = false; 
                    element.material.color.setHex(0xFFFFFF);
                }
            });
        }
            
        for(var i = 0; i < eventArr.length; i++){
            var foundToken; 
            
            scene.remove(eventArr[i]);
           
            if(eventArr[i].eventType == "earthquake"){
                var earthquakePosArr = getEarthquakeTilePositions(eventArr.name);
                //Finds all of the tokens that are on the same tiles as the earthquake
                for(var j = 0; j < earthquakePosArr.length; j++){
                    foundToken = tokenArr.find(element => element.name == earthquakePosArr[j].name);
                    if(foundToken){
                        var tokenStatus = deadTokenArr.find(element => element.name == foundToken.name);
                        if(!tokenStatus){
                            //Turns the token's colour to white
                            foundToken.traverse((token) => {
                                if(token.isMesh){
                                    token.material.emissive = new THREE.Color(0xFFFFFF);
                                    token.material.emissiveIntensity = 0.75;
                                }
                            });
                            //Gets the token's animation mixer
                            var tokenName = foundToken.name;
                            var foundAnimation = mixers.find(element => element.getRoot().parent.name == tokenName);
                            //Stops the animation for said token 
                            if(foundAnimation)
                                foundAnimation.stopAllAction();
                            //Turns the tile to red 
                            tileArr[tokenName].material.visible = true;
                            tileArr[tokenName].material.color.setHex(0xFF0000);
            
                            deadTokenArr.push(foundToken);
                        }
                    }
                        
                }
                //Disposes of the earthquake's geometry and materials
                eventArr[i].geometry.dispose();
                eventArr[i].material.dispose();
            }

            else {
                //Does the same as above for all non-earthquake events
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
                        tileArr[tokenName].material.transparent = false; 
                        tileArr[tokenName].material.color.setHex(0xFF0000);

                        deadTokenArr.push(foundToken);
    
                    }                    
                }
   
                eventArr[i].children[0].geometry.dispose();
                eventArr[i].children[1].material.dispose();
            } 
        }
        
        //Disposes the objects from the renderer to stop memory leaks
        renderer.renderLists.dispose();
        
        //Empties the event arr
        eventArr.splice(0, eventArr.length);

        //Checks if all tokens are out of play
        if(deadTokenArr.length == maxTokens){
            //Loads the game over assets
            gameOverItems = ui.getGameOver(); 
            scene.add(gameOverItems);     

            scene.remove(movesLeft);
            
            //Sets the number of moves to zero
            ui.setMoves(0);    
            movesLeft = ui.getMoves(); 
            scene.add(movesLeft); 

            gameOver = true;
        }

        else {
            //Loop until there the event is not the same as the one from last turn
            while(randEvent == randStartEvent){
                randEvent = Math.floor(Math.random() * 4); 
            }

            //Set the unique event so that it can be checked at the end of the turn
            randStartEvent = randEvent; 
            
            eventArr = randomEvent(); 

            earthquakePosArr = getEarthquakeTilePositions(eventArr.name);
            scene.remove(currentYear);
            scene.remove(movesLeft); 

            //Increase the year by two
            ui.setYear(ui.getYearText() + 2); 
            currentYear = ui.getYear();
            scene.add(currentYear);
            
            //Reset the turns to 10
            ui.setMoves(10);
                
            movesLeft = ui.getMoves(); 
            scene.add(movesLeft); 
        } 
    }
    
    //Checks if a new game has been selected
    else if(intersects.length > 0 && intersects[0].object.name == "newGame"){
        //Resets all of the dead token's correpsonding tiles
        deadTokenArr.forEach(element => {
            tileArr[element.name].material.color.setHex(0xFFFFFF);
            tileArr[element.name].material.visible = false;
            //Dispose of each dead token's geometry and material
            element.traverse((token) => {
                if(token.isMesh){
                    token.geometry.dispose();
                    token.material.dispose();
                    
                }
            });

            scene.remove(element);
        });
        //Empty the array of dead tokens and tokens from the last game
        deadTokenArr.splice(0, deadTokenArr.length);
        tokenArr.splice(0, tokenArr.length);
        //Dispose of the game over assets
        for(var i = 0; i < gameOverItems.children.length; i++){
            if(gameOverItems.children[i].type != "Group"){
                gameOverItems.children[i].geometry.dispose();

                if(gameOverItems.children[i].material.length <= 2){
                    for(var j = 0; j < gameOverItems.children[i].material.length; j++){
                        gameOverItems.children[i].material[j].dispose();
                    }
                }

                else{
                    gameOverItems.children[i].material.dispose();
                }
            }         
            else {
                for(var j = 0; j < gameOverItems.children[i].children.length; j++){
                    gameOverItems.children[i].children[j].geometry.dispose(); 
                    gameOverItems.children[i].children[j].material.dispose();
                }
                
            }
        }

        scene.remove(gameOverItems);
        
        renderer.renderLists.dispose();

        gameOverItems = null; 
        gameOver = false;
        
        scene.remove(currentYear);
        //Reset the game    
        ui.setYear(2050); 
        currentYear = ui.getYear();
        scene.add(currentYear);
        
        scene.remove(movesLeft);
        
        ui.setMoves(10);

        movesLeft = ui.getMoves();
        scene.add(movesLeft);
        //Start the new game
        eventArr = newGame(); 
    }

    else if(intersects.length > 0 && intersects[0].object.type != "GridHelper" && ui.getMovesText() != 0){
        //Gets the selected object
        var selected = intersects[0].object;

        //Check if the selected item is a tile
        if(!tileArr.find(element => element.name == selected.name)){
            //If not, make the tile's name discoverable from within the token
            selected.name = selected.material.name; 
        }
        //Check that the token's name can be found within the tile array
        var found = tileArr.find(element => element.name == selected.name); 
        
        //Checks that a tile has been found and it's background is not red
        if(found && found.material.color.getHex() != 0xFF0000){
        
            selected = found; 
            //Checks that this is the first tile to be clicked on
            if(!priorTile && selected.hasItem){
                //Set it's background to yellow
                selected.material.visible = true; 
                selected.material.transparent = true; 
                selected.material.color.setHex(0xFFFF00);
                //Create an instance so that it can be moved at a later date
                itemInstance = tokenArr.find(element => element.name == selected.name);

                //Look for every tile that has the same terrain as the selected tile
                tileArr.forEach(element => {
                    if(element.terrain == selected.terrain && !element.hasItem){
                        //Change make them visible and change the background color to orange 
                        element.material.visible = true; 
                        element.material.color.setHex(0xFFA500);
                        //Make each tile semi-transparent so that the board can still be seen
                        element.material.transparent = true; 
                        element.material.opacity = 0.4; 
                    }
                });
            }
            //Checks that the last tile is not the same as this current tile
            else if(priorTile != selected && selected.hasItem){
                priorTile.material.visible = false; 
                var selectedToken = tokenArr.find(element => element.name == selected.name); 

                if(itemInstance){
                    tileArr.forEach(element => {
                        //Check that each tile is not selected and their background color is not red
                        if(element.terrain == tileArr[itemInstance.name].terrain  && element.material.color.getHex() != 0xFF0000|| 
                            itemInstance.tokenType == selectedToken.tokenType && element.material.color.getHex() != 0xFF0000 && !selected){    
                            //reset the tile
                            element.material.visible = false; 
                            element.material.color.setHex(0xFFFFFF);
                        }
                    });
                    //reset the prior tile as well
                    tileArr[itemInstance.name].material.color.setHex(0xFFFFFF);
                    tileArr[itemInstance.name].material.visible = false;     
                }

                else {
                    selected.material.transparent = true; 
                }
                //Make the selected tile yellow 
                selected.material.visible = true;  
                selected.material.color.setHex(0xFFFF00);   

                //Same instance selection as above
                itemInstance = tokenArr.find(element => element.name == selected.name);
                
                tileArr.forEach(element => {
                    if(element.terrain == selected.terrain && !element.hasItem){
   
                        element.material.visible = true; 
                        element.material.color.setHex(0xFFA500);

                        element.material.transparent = true; 
                        element.material.opacity = 0.4; 
                    }
                });

            }    

            //Checks that the current tile has an item and that the instance's terrain type is the same as the 
            //selected tile's terrain type as well as that instance's background is visible
            else if(itemInstance && !selected.hasItem && tileArr[itemInstance.name].terrain == selected.terrain && 
                    tileArr[itemInstance.name].hasItem && tileArr[itemInstance.name].material.visible){
                //Reset all tiles that have the same terrain type as the selected tile
                tileArr.forEach(element => {
                    if(element.terrain == selected.terrain && element.material.color.getHex() != 0xFF0000){
                        element.material.visible = false; 
                        element.material.color.setHex(0xFFFFFF);
                    }
                });
                
                scene.remove(movesLeft);
                //Decrement the number of moves remaining by one
                ui.setMoves(ui.getMovesText() - 1);
                
                movesLeft = ui.getMoves(); 
                scene.add(movesLeft); 
                
                //Change the selected tile's background to green
                selected.material.visible = true; 
                selected.material.color.setHex(0x00FF00);
                selected.material.transparent = false;  

                //If there aren't any moves remaining, hide the tile
                if(ui.getMovesText() == 0){
                    selected.material.visible = false; 
                }

                priorTile.material.visible = false; 
                //Move the token to the selected tile's location   
                itemInstance.name = selected.name; 
                itemInstance.children[0].position.x = tokenOffsetArr[selected.name].x
                itemInstance.children[0].position.y = tokenOffsetArr[selected.name].y;
                //Change the token's name to the new tile    
                itemInstance.traverse((object) => {
                    if(object.isMesh){
                        object.name = selected.name; 
                        object.material.name = selected.name;  
                    }
                });
                //The selected tile now has an item, the prior tile is now empty
                priorTile.hasItem = false;
                selected.hasItem = true;

                itemInstance = null;  
            }
            //Makes the tile transparent upon multiple clicks
            else if(selected.hasItem){
                //If the prior tile is not visible 
                if(!priorTile.material.visible){
                    //Change it's background colour to yellow
                    selected.material.visible = true;
                    selected.material.color.setHex(0xFFFF00);

                    //Same instance behaviour as above
                    itemInstance = tokenArr.find(element => element.name == selected.name);

                    tileArr.forEach(element => {
                        if(element.terrain == selected.terrain && !element.hasItem){
                            element.material.visible = true; 
                            element.material.color.setHex(0xFFA500);
    
                            element.material.transparent = true; 
                            element.material.opacity = 0.4; 
                        }
                    });
                }
                
                else {
                    //Reset the tile's color and visibility 
                    priorTile.material.visible = false;  
                        
                    tileArr.forEach(element => {
                        if(element.terrain == priorTile.terrain && !element.hasItem){
                            element.material.visible = false; 
                            element.material.color.setHex(0xFFFFFF);
                        }
                    });
                } 
            }
            //If the tile is green, make it invisible 
            else if(priorTile && priorTile.material.color.getHex() == 0x00FF00){
                priorTile.material.visible = false; 
            }
            //The selected tile from this click will be the prior tile next click
            priorTile = selected; 
        }
        //If a tile is found, visible and does not have a red background
        else if(found && found.material.visible && !itemInstance && found.material.color.getHex() != 0xFF0000){
            //Reset it and it's correpsonding tiles of the same terrain type
            found.material.visible = false; 

            tileArr.forEach(element => {
                if(element.terrain == found.terrain && !element.hasItem){
                    element.material.visible = false; 
                    element.material.color.setHex(0xFFFFFF);
                }
            });

        }
    }
});

