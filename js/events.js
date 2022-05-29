import * as THREE from 'three';
import {SVGLoader} from '../node_modules/three/examples/jsm/loaders/SVGLoader.js'; 

const loader = new SVGLoader(); 

var circleArr = []; 

class Events {
    getEarthquake(position) {
        var rand = Math.floor(Math.random() * 5 + 1) * 0.1;
        
        //remove meshes that are not needed
        for(var i = 0; i < 3; i++){    
            var circleGeometry = new THREE.CircleGeometry(5, 30);
            var circleMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFF00, transparent: true, opacity: 0.5});
            var circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
         
            circleMesh.position.x = position.x - 0.75; 
            circleMesh.position.y = position.y + 0.4; 
            circleMesh.position.z = 0.5;

            circleMesh.scale.x = rand;
            circleMesh.scale.y = rand;
            circleMesh.eventType = "earthquake";

            if(i == 0){
                circleMesh.material.color.setHex(0xFFFFF00);
                circleArr.push(circleMesh);
            }
            else if(i == 1){
                
                if(circleArr[i - 1].scale.x <= 0.5 && circleArr[i - 1].scale.x >= 0.2){
                    
                    circleMesh.material.color.setHex(0xFF6A06);
                    circleMesh.scale.x = circleArr[i - 1].scale.x - 0.1;
                    circleMesh.scale.y = circleArr[i - 1].scale.y - 0.1;
                    
                    circleArr.push(circleMesh);
                }
            }
            else if(i == 2 && circleArr.length == 2){
                if(circleArr[i - 1].scale.x <= 0.4 && circleArr[i - 1].scale.x >= 0.2){

                    circleMesh.material.color.setHex(0xFF0000);
                    circleMesh.scale.x = circleArr[i - 1].scale.x - 0.1;
                    circleMesh.scale.y = circleArr[i - 1].scale.y - 0.1;
                    
                    circleArr.push(circleMesh);
                }
            }
        }   

        return circleArr; 
    }

    createFire(position){
        var group = new THREE.Group(); 
        loader.load('../Svgs/fire.svg', (image) => {
            const paths = image.paths;
    
            for(var i = 0; i < paths.length; i++){
                const path = paths[i];

                const material = new THREE.MeshBasicMaterial({
                    color: path.color,
                    transparent: true, 
                    opacity: 0.7,
                    side: THREE.DoubleSide,
                });

                const shapes = SVGLoader.createShapes(path);

                for(var j = 0; j < shapes.length; j++){
                    const shape = shapes[j];

                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = position.x - 0.3; 
                    mesh.position.y = position.y + 1; 
                    mesh.position.z = 0.6;
                    
                    mesh.scale.x = 0.002; 
                    mesh.scale.y = 0.002; 

                    mesh.rotation.z = THREE.MathUtils.degToRad(180);

                    group.add(mesh);
                }
            }
        });
        
        return group; 
    }

    createWave(position){
        var group = new THREE.Group(); 
        loader.load('../Svgs/wave.svg', (image) => {
            const paths = image.paths;
    

            for(var i = 0; i < paths.length; i++){
                const path = paths[i];
                
                const material = new THREE.MeshBasicMaterial({
                    color: path.color,
                    transparent: true, 
                    opacity: 0.7,
                    side: THREE.DoubleSide,
               
                });

                const shapes = SVGLoader.createShapes(path);

                for(var j = 0; j < shapes.length; j++){
                    const shape = shapes[j];

                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = position.x - 1.2; 
                    mesh.position.y = position.y + 1; 
                    mesh.position.z = 0.6;
                    
                    mesh.scale.x = 0.003; 
                    mesh.scale.y = 0.003; 

                    mesh.rotation.z = THREE.MathUtils.degToRad(180);
                    mesh.rotation.y = THREE.MathUtils.degToRad(180);

                    group.add(mesh);
                }
            }
        });
    
        return group; 
    }

    createHeatwave(position){
        var group = new THREE.Group(); 
        loader.load('../Svgs/heatwave.svg', (image) => {
            const paths = image.paths;
    

            for(var i = 0; i < paths.length; i++){
                const path = paths[i];
                
                const material = new THREE.MeshBasicMaterial({
                    color: path.color,
                    transparent: true, 
                    opacity: 0.7,
                    side: THREE.DoubleSide,
               
                });

                const shapes = SVGLoader.createShapes(path);

                for(var j = 0; j < shapes.length; j++){
                    const shape = shapes[j];

                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = position.x - 1.2; 
                    mesh.position.y = position.y + 0.8; 
                    mesh.position.z = 0.6;
                    
                    mesh.scale.x = 0.002; 
                    mesh.scale.y = 0.002; 

                    mesh.rotation.z = THREE.MathUtils.degToRad(180);
                    mesh.rotation.y = THREE.MathUtils.degToRad(180);

                    group.add(mesh);
                }
            }
        });
    
        return group; 
    }
}

export default Events;