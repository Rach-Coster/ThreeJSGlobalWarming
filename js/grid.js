import * as THREE from 'three';
import Models from './models.js';

const models = new Models; 

const textureLoader = new THREE.TextureLoader();

class Grid { 
    getGridHelper() {
        const gridHelper = new THREE.GridHelper(20,20, 0xFF0000, 0xFF0000);
    
        gridHelper.rotation.x = THREE.MathUtils.degToRad(90);
        gridHelper.position.z = 1;
        gridHelper.scale.x = 1.45; 
        gridHelper.scale.z = 0.72;
                
        return gridHelper; 
    }

    populateWithBees(){
        var beeArr = [];

        var total = -13.5;
        var totalY = 6.7;
        
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var position = new THREE.Vector2(
                    total + (1.42 * j), 
                    totalY + (-0.707 * i)
                );
                var name = i + " " + j; 
                var rotation = new THREE.Vector3(THREE.MathUtils.degToRad(90), 0, 0);
                var bee = models.loadBee(position, rotation, 0, name);
                bee.name = name;
                beeArr.push(bee);
            }   

            total = -13.5;
            totalY = 6.7;
        }

        return beeArr; 
    }

    populateWithCoral(){
        var coralArr = [];

        var total = -13.5;
        var totalY = 6.7;

        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var position = new THREE.Vector2(
                    total + (1.42 * j), 
                    totalY + (-0.707 * i)
                );
                var name = i + " " + j; 

                var coral = models.loadCoral(position, name);
                coral.name = name;
                coralArr.push(coral);
            }   

            total = -13.5;
            totalY = 6.7;
        }

        return coralArr; 
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
    populateGrid(arrayType) {
        var gridPositions = [];
        var testMeshes = [];

        const testTexture = textureLoader.load('../Textures/placeholder.jpg');
        //5.85
        var total = -13.5;
        var totalY = 6.7;
    
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){  
                var testGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);
                var testMesh = new THREE.MeshPhongMaterial();
                testMesh.map = testTexture; 

                var test = new THREE.Mesh(testGeometry, testMesh);

                var position = new THREE.Vector2(
                    total + (1.42 * j), 
                    totalY + (-0.707 * i)
                );
                
                test.position.x = position.x; 
                test.position.y = position.y; 
                test.position.z = 1.25;

                test.name = "test " + j + " " +  i; 
       
                testMeshes.push(test); 
                
                gridPositions.push(position); 
            }   

            total = -13.5;
            totalY = 6.7;
        }

        if(arrayType == "items")
            return testMeshes;
        else
            return gridPositions; 
    }
};


export default Grid; 