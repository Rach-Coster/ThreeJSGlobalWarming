import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

class Grid { 
    getGridHelper() {
        const gridHelper = new THREE.GridHelper(20,20, 0xFF0000, 0xFF0000);
    
        gridHelper.rotation.x = THREE.MathUtils.degToRad(90);
        gridHelper.position.z = 1;
        gridHelper.scale.x = 1.47; 
        gridHelper.scale.z = 0.72;
        
        return gridHelper; 
    }
    populateGrid(arrayType) {
        var gridPositions = [];
        var testMeshes = [];
    
        
        const testTexture = textureLoader.load('../Textures/placeholder.jpg');
        const testGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);
        const testMesh = new THREE.MeshBasicMaterial();
        testMesh.map = testTexture; 
        
        var total = -9.3;
        var totalY = -9.1;
    
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j ++){
                var test = new THREE.Mesh(testGeometry, testMesh);
    
                test.position.x = (30 / 20 * (total++)) - j * 0.03;
                test.position.y = (15 / 20 * totalY) - i * 0.03;
                test.position.z = 1;
    
                //scene.add(test);
                testMeshes.push(test); 
                var position = new THREE.Vector2(test.position.x, test.position.y); 
                gridPositions.push(position); 
            }   
            total = -9.3;
            totalY++;
        }

        if(arrayType == "items")
            return testMeshes;
        else
            return gridPositions; 
    }
};


export default Grid; 