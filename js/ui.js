import * as THREE from 'three';

import {FontLoader} from '../node_modules/three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();

//Three different font colours
const matDark = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});

const matRed = new THREE.LineBasicMaterial({
    color: 0xFF0000,
    side: THREE.DoubleSide
});

const matBlack = new THREE.LineBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
});

//default year and default moves 
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
            //Creating a next turn button
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
        //Adding both the text and the box to a group in order to create a clickable button
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

    getYearText(){
        return currentYear;
    }

    setYear(amount){
        currentYear = amount;   
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

    getMovesText(){
        return totalMoves;
    }
    
    setMoves(amount) {
        totalMoves = amount; 
    }

    getGameOver(){
        const gameOver = new THREE.Object3D(); 
        const newGameButton = new THREE.Group();

        fontLoader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
           
            const gameOverText = font.generateShapes('Game Over', 3);
            const yearsSurvivedText = font.generateShapes('You made it to the year: ' + currentYear, 0.75);
            const newGameText = font.generateShapes('New Game', 1);
            
            const gameOverSettings = {
                bevelEnabled: true,  
                bevelSize: 0.1, 
            };

            const yearsSurvivedSettings = {
                bevelEnabled: true,  
                bevelSize: 0.015,
                bevelThickness: 0,
                depth: 0
            };

            //Using extrudeGeometry to create depth for the gameOver text and the yearsSurvived text
            const gameOverGeometry = new THREE.ExtrudeGeometry(gameOverText, gameOverSettings);
            const yearsSurvivedGeometry = new THREE.ExtrudeGeometry(yearsSurvivedText, yearsSurvivedSettings);

            const newGameGeometry = new THREE.ShapeGeometry(newGameText); 
            //Creating a new game button
            const boxGeometry = new THREE.BoxGeometry(10, 2, 0.1);

            const materials = [matRed, matBlack]; 
            const boxMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

            const gameOverMesh = new THREE.Mesh(gameOverGeometry, materials);

            gameOverMesh.position.x = -10.7;
            gameOverMesh.position.y = 1;
            gameOverMesh.position.z = 2;

            const yearsSurvivedMesh = new THREE.Mesh(yearsSurvivedGeometry, matDark);

            yearsSurvivedMesh.position.x = -7;
            yearsSurvivedMesh.position.y = -1.5; 
            yearsSurvivedMesh.position.z = 2; 
 
           
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.y = -4.1; 
            box.position.z = 1.9; 

            box.name = "newGame"; 
            
            const newGameMesh = new THREE.Mesh(newGameGeometry, matDark);
            
            newGameMesh.position.x = -3.25;
            newGameMesh.position.y = -4.5; 
            newGameMesh.position.z = 2; 

            newGameMesh.name = 'newGame';
            //Adding the button to a group so that the entire group is clickable
            newGameButton.add(box);
            newGameButton.add(newGameMesh);

            gameOver.attach(gameOverMesh);
            gameOver.attach(yearsSurvivedMesh);
            gameOver.attach(newGameButton); 
        });

        return gameOver; 
    }
}

export default Ui; 