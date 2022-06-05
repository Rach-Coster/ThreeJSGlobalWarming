import * as THREE from 'three';
import Models from './models.js';
import Events from './events.js';

const model = new Models; 
const event = new Events; 

var tokenOffsetArr = []; 
var eventOffsetArr = []; 

class Grid { 
    getGridHelper() {
        //Creating game's grid
        const gridHelper = new THREE.GridHelper(20,20, 0x000000, 0x000000);
    
        gridHelper.rotation.x = THREE.MathUtils.degToRad(90);
        gridHelper.position.z = 1;
        gridHelper.scale.x = 1.45; 
        gridHelper.scale.z = 0.72;
                
        return gridHelper; 
    }

    generateTiles() {
        var tileArr = [];

        var totalX = -13.5;
        var totalY = 6.7;
        var totalNo = 0; 
        //Making a 20x20 grid of boxes based on the grid helper's position
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var tileGeometry = new THREE.BoxGeometry(1.3, 0.65, 0.1);
                var tileMesh = new THREE.MeshBasicMaterial; 
                tileMesh.visible = false; 

                var tile = new THREE.Mesh(tileGeometry, tileMesh);
                //Offsetting each tile's position
                var tilePos = new THREE.Vector2(
                    totalX + (1.42 * j), 
                    totalY + (-0.707 * i)
                );
                //These tiles will have a snow terrain
                if(totalNo >= 5 && totalNo <= 8 || totalNo >= 23 && totalNo <= 28 || totalNo >= 33 && totalNo <= 38||
                   totalNo >= 40 && totalNo <= 48 || totalNo >= 50 && totalNo <= 59 || totalNo >= 61 && totalNo <= 66 ||
                   totalNo >= 70 && totalNo <= 79 || totalNo >= 83 && totalNo <= 86 || totalNo >= 91 && totalNo <= 97 ||
                   totalNo == 346 || totalNo >= 349 && totalNo <= 358 || totalNo >= 360){
                    
                    tile.terrain = "snow";
                }
                //These tiles will have a land terrain
                else if(totalNo == 90 || totalNo >= 103 && totalNo <= 105  ||  totalNo >= 109 && totalNo <= 117 || 
                        totalNo >= 123 && totalNo <= 125 || totalNo >= 129 && totalNo <= 136 ||  totalNo == 144 || 
                        totalNo >= 149 && totalNo <= 156 || totalNo >= 169 && totalNo <= 172 || totalNo >= 174 && totalNo <= 175 || totalNo == 186 || 
                        totalNo == 191 || totalNo >= 206 && totalNo <= 207 || totalNo == 211 || totalNo >= 226 && totalNo <= 227 || 
                        totalNo == 231 || totalNo >= 246 && totalNo <= 247 || totalNo == 251 || totalNo >= 256 && totalNo <= 258 || totalNo == 266 || 
                        totalNo == 271 || totalNo >= 276 && totalNo <= 278 || totalNo == 286){

                    tile.terrain = "land"; 
                }
                //These tiles will have a coastal terrain
                else if(totalNo == 69  || totalNo == 106 || totalNo == 137 || totalNo == 143 || totalNo == 145 || totalNo >= 164 && totalNo <= 165 ||
                        totalNo == 176 || totalNo == 185 || totalNo == 187 || totalNo >= 189 && totalNo <= 190 || totalNo == 192 ||
                        totalNo >= 195 && totalNo <= 196 || totalNo == 205 || totalNo == 210 || totalNo == 212 ||
                        totalNo >= 215 && totalNo <= 218 || totalNo == 225 || totalNo == 230 || totalNo == 232 || 
                        totalNo >= 236 && totalNo <= 238 || totalNo == 250 || totalNo == 252 || totalNo == 267 || totalNo == 270 ||
                        totalNo == 285 || totalNo >= 298 && totalNo <= 299 || totalNo >= 305 && totalNo <= 306 || totalNo == 319){

                    tile.terrain = "coast"; 
                }

                else {
                    //All other tiles will be sea terrain 
                    tile.terrain = "sea"; 
                }
                //Offsets of each individual token on the grid
                var tokenPos = new THREE.Vector2(
                    totalX + (1.4201 * j), 
                    totalY + (-0.697 * i)
                );
                
                //Offsets for each invidual event on the grid
                var eventPos = new THREE.Vector2(
                    totalX + (1.49 * j),
                    totalY + (-0.75 * i)
                );

                tokenOffsetArr.push(tokenPos); 
                eventOffsetArr.push(eventPos);
                //Setting the tile position
                tile.position.x = tilePos.x; 
                tile.position.y = tilePos.y; 
                tile.position.z = 1.25;
                
                tile.name = totalNo; 
                //Each tile is empty by default
                tile.hasItem = false; 

                tileArr.push(tile); 

                totalNo++;
            }   

            totalX = -13.5;
            totalY = 6.7;
            
        }

        return tileArr;
    }

    addToken(tile){
        var token; 
        //Creating bee tokens for land tiles
        if(tile.terrain == "land"){ 
            var rotation = new THREE.Vector3(THREE.MathUtils.degToRad(90), 0, 0);
            token = model.loadBee(tokenOffsetArr[tile.name], rotation, 0, tile.name);
            token.name = tile.name;
            token.tokenType = "bee";    
            return token; 
        }
        //Creating coral tokens for coastal tiles
        else if(tile.terrain == "coast"){
            token = model.loadCoral(tokenOffsetArr[tile.name], tile.name);
            token.name = tile.name;
            token.tokenType = "coral";    
            return token; 
        }
        //Creating fish for sea tiles
        else if(tile.terrain == "sea"){
            token = model.loadFish(tokenOffsetArr[tile.name], tile.name);
            token.name = tile.name;
            token.tokenType = "fish";
            return token; 
        }

        return null; 

    }

    addEvent(tile, eventType){
        var eventToken;
       //Creating an earthquake event
        if(eventType == "earthquake"){
            eventToken = event.getEarthquake(eventOffsetArr[tile.name]);
            eventToken.name = tile.name; 
            eventToken.eventType = "earthquake";
            return eventToken; 
        }
        
        else {
            //Creating a fire event for land tiles
            if(tile.terrain == "land"){
                eventToken = event.createFire(eventOffsetArr[tile.name]);
                eventToken.name = tile.name; 
                eventToken.eventType = "fire";
                return eventToken; 
            }
            //Creating a heatwave for coastal tiles
            else if(tile.terrain == "coast"){
                eventToken = event.createHeatwave(eventOffsetArr[tile.name]);
                eventToken.name = tile.name;
                eventToken.eventType = "heatwave";
                return eventToken;
            }
            //Creating a tsunami for sea tiles
            else if(tile.terrain == "sea"){
                eventToken = event.createTsunami(eventOffsetArr[tile.name]);
                eventToken.name = tile.name; 
                eventToken.eventType = "tsunami"; 
                return eventToken; 
            }
            return null; 
        }
    }
    //Returning the offets so that they can be applied when tokens move positions
    getTokenOffsetArray(){
        return tokenOffsetArr;
    }
};

export default Grid; 