import * as THREE from 'three';

import {FontLoader} from '../node_modules/three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();

const matDark = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});

class Ui{ 
    getTitle(){
        const title = new THREE.Object3D();
        
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const message = 'Hello World!';
        
            const shapes = font.generateShapes(message, 1);
            const geometry = new THREE.ShapeGeometry(shapes);
        
            const text = new THREE.Mesh(geometry, matDark);
       
            text.position.x = -5;
            text.position.y = 9;
            text.position.z = 1;

            title.attach(text);
        });

        return title; 
    }

    getButton(){
        var button = new THREE.Group(); 
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            
            var boxGeometry = new THREE.BoxGeometry(3.8, 1, 0.1); 
            var boxTexture = new THREE.MeshBasicMaterial({color: 0x000000});
            var box = new THREE.Mesh(boxGeometry, boxTexture);

            box.position.x = 5.8; 
            box.position.y = 8.35;
            box.position.z = 0.9; 

            button.add(box);

            const message = 'Next Turn';

            const shapes = font.generateShapes(message, 0.6);
            const geometry = new THREE.ShapeGeometry(shapes);

            const text = new THREE.Mesh(geometry, matDark);
    
            text.position.x = 4;;
            text.position.y = 8;
            text.position.z = 1;

            button.add(text);
        });

        return button; 
    }

    getYear(){
        const year = new THREE.Object3D();
        
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const message = 'The Year is: 2050';
        
            const shapes = font.generateShapes(message, 0.6);
            const geometry = new THREE.ShapeGeometry(shapes);
        
            const text = new THREE.Mesh(geometry, matDark);
            
            text.position.x = -11;
            text.position.y = 8;
            text.position.z = 1;

            year.attach(text);
        });

        return year; 
    }
}

export default Ui; 