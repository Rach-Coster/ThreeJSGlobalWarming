import * as THREE from 'three';

import Models from './models.js';
import Grid from './grid.js';
import Ui from './ui.js';

import Events from './events.js';

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const models = new Models; 
const grid = new Grid; 
const ui = new Ui; 
const event = new Events; 

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

scene.add(grid.getGridHelper());

var tileArr = grid.generateTiles();
tileArr.forEach(element => { scene.add(element) });

var tokenArr = []; 

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

var fireArr = []; 

var maxFire = 20; 
var fireCount = 0; 

while(fireCount != maxFire){
    var random = Math.floor(Math.random() * tileArr.length);
    if(!fireArr.length && tileArr[random].terrain == "land" || !fireArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "land"){
        var eventToken = grid.addEvent(tileArr[random]);
        fireArr.push(eventToken);
        scene.add(eventToken);
        fireCount++; 
    }
    
    else {
        random = Math.floor(Math.random() * tileArr.length);
    }
}

fireCount = 0; 

var waveArr = [];

var maxWave = 5; 
var waveCount = 0; 


while(waveCount != maxWave){
    var random = Math.floor(Math.random() * tileArr.length);
    if(!waveArr.length && tileArr[random].terrain == "coast" || !waveArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "coast"){
        var eventToken = grid.addEvent(tileArr[random]);
        waveArr.push(eventToken);
        scene.add(eventToken);
        waveCount++; 
    }
    
    else {
        random = Math.floor(Math.random() * tileArr.length);
    }
}

waveCount = 0; 

var getEarthquakePosition = () => {
    //2 and 18
    var randX = Math.floor(Math.random() * 16) + 2;

    var randYArr = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    var randY = Math.floor(Math.random() * randYArr.length);
    randY = randYArr[randY]; 

    var tile = tileArr.find(element => element.position.x == tileArr[randX].position.x && element.position.y == tileArr[randY].position.y);

    return tile; 
}

var earthquake = grid.addEvent(getEarthquakePosition(), "earthquake");
earthquake.forEach(element => scene.add(element));


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

var render = () => {
    renderer.render(scene, camera);
    controls.update();
    
    var delta = clock.getDelta();

 
    for(const mixer of models.getMixers()) {
        mixer.update(delta); 
    }

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


// var getEarthquakeItems = (circleArr) => {
//     var smallestAmtX = 1;
//     var smallestAmtY = 1;  
//     var index; 

//     var eqArr = []; 

//     for(var i = 0; i < itemArr.length; i++){
//         var amtX = Math.abs(circleArr[0].position.x - itemArr[i].position.x);
//         var amtY = Math.abs(circleArr[0].position.y - itemArr[i].position.y);
        
//         if(amtX <= smallestAmtX && amtY <= smallestAmtY){
//             smallestAmtX = amtX;
//             smallestAmtY = amtY;
//             index = i;
//         }
//     }

//     var rounded = Math.round(circleArr[0].scale.x * 10) / 10; 

//     eqArr.push(itemArr[index]);

//     if(rounded == 0.2){
//         eqArr.push(itemArr[index + 20])
//         eqArr.push(itemArr[index - 20])
//     }

//     else if(rounded == 0.3){
//         eqArr.push(itemArr[index + 1]);
//         eqArr.push(itemArr[index - 1]);
        
//         eqArr.push(itemArr[index + 20]);
//         eqArr.push(itemArr[index - 20]);

//         eqArr.push(itemArr[index + 21]);
//         eqArr.push(itemArr[index - 19]);

//         eqArr.push(itemArr[index + 19]);
//         eqArr.push(itemArr[index - 21]);
//     }

//     else if(rounded == 0.4){
//         eqArr.push(itemArr[index + 1]);
//         eqArr.push(itemArr[index - 1]);

//         eqArr.push(itemArr[index + 20]);
//         eqArr.push(itemArr[index - 20]);

//         eqArr.push(itemArr[index + 40]);
//         eqArr.push(itemArr[index - 40]);

//         eqArr.push(itemArr[index + 21]);
//         eqArr.push(itemArr[index - 19]);

//         eqArr.push(itemArr[index + 19]);
//         eqArr.push(itemArr[index - 21]);

//         eqArr.push(itemArr[index + 41]);
//         eqArr.push(itemArr[index - 39]);

//         eqArr.push(itemArr[index + 39]);
//         eqArr.push(itemArr[index - 41]);
//     }

//     else if(rounded == 0.5){
//         eqArr.push(itemArr[index + 1]);
//         eqArr.push(itemArr[index - 1]);

//         eqArr.push(itemArr[index + 20]);
//         eqArr.push(itemArr[index - 20]);

//         eqArr.push(itemArr[index + 40]);
//         eqArr.push(itemArr[index - 40]);

//         eqArr.push(itemArr[index + 21]);
//         eqArr.push(itemArr[index - 19]);

//         eqArr.push(itemArr[index + 19]);
//         eqArr.push(itemArr[index - 21]);

//         eqArr.push(itemArr[index + 41]);
//         eqArr.push(itemArr[index - 39]);

//         eqArr.push(itemArr[index + 39]);
//         eqArr.push(itemArr[index - 41]);

//         eqArr.push(itemArr[index + 59]);
//         eqArr.push(itemArr[index - 61]);
//     }

//     return eqArr; 
// }


document.addEventListener('pointerdown', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1; 
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1; 

    raycaster.setFromCamera(cursor, camera); 
    
    const intersects = raycaster.intersectObjects(scene.children);


    if(intersects.length > 0 && intersects[0].object.name == "button"){
        for(var i = 0; i < fireArr.length; i++){
            scene.remove(fireArr[i]);
           
            fireArr[i].children[0].geometry.dispose();
            fireArr[i].children[1].material.dispose();
        }

        fireArr.splice(0, fireArr.length);

        for(var i = 0; i < waveArr.length; i++){
            scene.remove(waveArr[i]);
           
            waveArr[i].children[0].geometry.dispose();
            waveArr[i].children[1].material.dispose();
        }

        waveArr.splice(0, waveArr.length);

        for(var i = 0; i < earthquake.length; i++){
            scene.remove(earthquake[i]);
            earthquake[i].geometry.dispose();
            earthquake[i].material.dispose();
        }
        earthquake.splice(0, earthquake.length);

        renderer.renderLists.dispose();

        earthquake = grid.addEvent(getEarthquakePosition(), "earthquake");
        earthquake.forEach(element => scene.add(element));

        while(fireCount != maxFire){
            var random = Math.floor(Math.random() * tileArr.length);
            if(!fireArr.length && tileArr[random].terrain == "land" || !fireArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "land"){
                var eventToken = grid.addEvent(tileArr[random]);
                fireArr.push(eventToken);
                scene.add(eventToken);
                fireCount++; 
            }
            
            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }

        fireCount = 0;

        while(waveCount != maxWave){
            var random = Math.floor(Math.random() * tileArr.length);
            if(!waveArr.length && tileArr[random].terrain == "coast" || !waveArr.find(element => element.name == tileArr[random].name) && tileArr[random].terrain == "coast"){
                var eventToken = grid.addEvent(tileArr[random]);
                waveArr.push(eventToken);
                scene.add(eventToken);
                waveCount++; 
            }
            
            else {
                random = Math.floor(Math.random() * tileArr.length);
            }
        }

        waveCount = 0; 
        
        
        // console.log(getEarthquakeItems(circleArr)); 
        
        ui.setYear(2); 

        scene.remove(currentYear);
        currentYear = ui.getYear();
        
        scene.add(currentYear);

    }

    else if(intersects.length > 0 && intersects[0].object.type != "GridHelper"){
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
        if(found){
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

                selected.material.visible = true; 
                selected.material.color.setHex(0x00FF00); 

                priorGrid.material.visible = false; 
                   
                itemInstance.name = selected.name; 
                itemInstance.children[0].position.x = tileArr[selected.name].position.x;
                itemInstance.children[0].position.y = tileArr[selected.name].position.y;
                    
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

            else if(priorGrid && priorGrid.material.color.getHexString() == "00ff00"){
                priorGrid.material.visible = false; 
            }
        
            priorGrid = selected; 
        }
    }
});

