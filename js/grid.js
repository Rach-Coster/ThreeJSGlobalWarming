import * as THREE from 'three';

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
    populateGrid(arrayType) {
        var gridPositions = [];
        var testMeshes = [];

        const testTexture = textureLoader.load('../Textures/placeholder.jpg');
    
        var total = -9.05;
        var totalY = -9;
    
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j ++){  
                var testGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);
                var testMesh = new THREE.MeshPhongMaterial();
                testMesh.map = testTexture; 

                var test = new THREE.Mesh(testGeometry, testMesh);
    
                test.position.x = (30 / 20 * total++) - j * 0.074;
                test.position.y = (15 / 20 * totalY) - i * 0.042;
                test.position.z = 1.25;
                test.name = "test " + j + " " +  i; 
       
                testMeshes.push(test); 
                
                var position = new THREE.Vector2(test.position.x, test.position.y); 
                gridPositions.push(position); 
            }   
            total = -9.05;
            totalY++;
        }

        if(arrayType == "items")
            return testMeshes;
        else
            return gridPositions; 
    }
};


export default Grid; 