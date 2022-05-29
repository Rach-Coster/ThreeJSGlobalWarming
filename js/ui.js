import * as THREE from 'three';

import {FontLoader} from '../node_modules/three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();

const matDark = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});

var currentYear = 2050;
var totalMoves = 10; 

class Ui{ 
    getTitle(){
        const title = new THREE.Object3D();
        
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const message = 'Climate Change Simulator';
        
            const shapes = font.generateShapes(message, 1);
            const geometry = new THREE.ShapeGeometry(shapes);
        
            const text = new THREE.Mesh(geometry, matDark);
       
            text.position.x = -8;
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

            box.position.z = 0.9; 
            box.name = "button"; 
            
            button.add(box);

            const message = "Next Turn";

            const shapes = font.generateShapes(message, 0.6);
            const geometry = new THREE.ShapeGeometry(shapes);

            const text = new THREE.Mesh(geometry, matDark);
    
            text.position.x = -1.75;
            text.position.y = -0.3;
            text.position.z = 1;
            text.name = "button";

            button.add(text);
        });

        button.position.x = 8;
        button.position.y = 8.2;
        button.position.z = 0;

        return button; 
    }

    getYear(){
        const year = new THREE.Object3D();
        
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const message = 'The Year is ' + currentYear;
        
            const shapes = font.generateShapes(message, 0.6);
            const geometry = new THREE.ShapeGeometry(shapes);
        
            const text = new THREE.Mesh(geometry, matDark);
            
            text.position.x = -11;
            text.position.y = 8;
            text.position.z = 1;

            text.name = "year"; 
            year.attach(text);

        });

        return year; 
    }

    setYear(amount){
        currentYear += amount;   
    }

    getMoves(){
        const movesLeft = new THREE.Object3D();
        
        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            var message = '';

            if(totalMoves == 0)
                message = 'Out of Moves';
            
            else
                message = 'Moves Left: ' + totalMoves;
     
            const shapes = font.generateShapes(message, 0.6);
            const geometry = new THREE.ShapeGeometry(shapes);
        
            const text = new THREE.Mesh(geometry, matDark);
            
            text.position.x = -11;
            text.position.y = -8;
            text.position.z = 1;

            text.name = "movesLeft"; 
            movesLeft.attach(text);

        });

        return movesLeft;
    }

    setMoves(amount) {
        totalMoves = amount; 
    }
}

export default Ui; 