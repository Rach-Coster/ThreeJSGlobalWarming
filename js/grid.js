import * as THREE from 'three';
import Models from './models.js';

const models = new Models; 

const textureLoader = new THREE.TextureLoader();

var coastArr = [
    210, 230, 250, 153, 166, 143, 
    165, 212, 258, 278, 187, 109,
    205, 185, 297, 267, 306, 123, 145, 
    215, 125, 164, 137, 252,
    270, 129, 225, 176, 237, 189, 190
];

var groundArr = [
    206, 186, 266, 246, 226, 256,
    251, 149, 155, 154, 130, 170,   
    231, 211, 191, 171, 151, 152,
    150, 170, 207, 227, 169, 135,
    136, 134, 133, 115, 114, 116,
    113, 124, 104, 105, 103, 257  
];

var seaArr = [
    225, 275, 272, 291, 290, 229,
    249, 269, 287, 245, 265,
    126, 102, 122, 142, 143, 296, 
    297, 318, 106, 82, 118, 138,
    158, 233, 234, 253, 254, 122,
    142, 141, 279
]

var coralArr = []; 
var beeArr = [];
var fishArr = [];

var itemPosArr = []; 

class Grid { 
    getGridHelper() {
        const gridHelper = new THREE.GridHelper(20,20, 0x000000, 0x000000);
    
        gridHelper.rotation.x = THREE.MathUtils.degToRad(90);
        gridHelper.position.z = 1;
        gridHelper.scale.x = 1.45; 
        gridHelper.scale.z = 0.72;
                
        return gridHelper; 
    }

    populateWithFish(){
        var fishArr = [];

        var total = -13.5;
        var totalY = 6.7;

        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var position = new THREE.Vector2(
                    total + (1.42 * j), 
                    totalY + (-0.707 * i)
                );
                var name = i + " " + j; 

                var fish = models.loadFish(position, name);
                fish.name = name;
                fishArr.push(fish);
            }   

            total = -13.5;
            totalY = 6.7;
        }

        return fishArr; 

    }
    populateGrid() {
        var testMeshes = [];

        const testTexture = textureLoader.load('../Textures/placeholder.jpg');

        var totalX = -13.5;
        var totalY = 6.7;
        var totalNo = 0; 
    
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var testGeometry = new THREE.BoxGeometry(1.3, 0.65, 0.1);
                var testMesh = new THREE.MeshPhongMaterial();
                testMesh.map = testTexture; 
                testMesh.opacity = 0.0;
                testMesh.transparent = true;

                var test = new THREE.Mesh(testGeometry, testMesh);

                var gridPos = new THREE.Vector2(
                    totalX + (1.42 * j), 
                    totalY + (-0.707 * i)
                );

                var itemPos = new THREE.Vector2(
                    totalX + (1.4201 * j), 
                    totalY + (-0.697 * i)
                )
                
                test.position.x = gridPos.x; 
                test.position.y = gridPos.y; 
                test.position.z = 1.25;
                
                test.name = totalNo; 
                
                testMeshes.push(test); 
                itemPosArr.push(itemPos);

                if(coastArr.find(element => element == totalNo)){
                    var coral = models.loadCoral(itemPos, totalNo);
                    coral.name = totalNo;
                    coral.itemType = "coral";
                    coralArr.push(coral);

                    test.hasItem = true;
                }
                else if(groundArr.find(element => element == totalNo)){
                    var rotation = new THREE.Vector3(THREE.MathUtils.degToRad(90), 0, 0);
                    var bee = models.loadBee(itemPos, rotation, 0, totalNo);
                    bee.name = totalNo;
                    bee.itemType = "bee";
                    beeArr.push(bee);

                    test.hasItem = true; 
                }
                else if(seaArr.find(element => element == totalNo)){
                    var fish = models.loadFish(itemPos, totalNo);
                    fish.name = totalNo;
                    fish.itemType = "fish";
                    fishArr.push(fish);

                    test.hasItem = true;
                }
                else
                    test.hasItem = false;
                
                totalNo++;
            }   

            totalX = -13.5;
            totalY = 6.7;
        }

        return testMeshes;
    }

    getCoralArray(){
        return coralArr; 
    }

    getBeeArray(){
        return beeArr; 
    }

    getFishArray(){
        return fishArr;
    }

    getItemPosArray(){
        return itemPosArr; 
    }
};

export default Grid; 