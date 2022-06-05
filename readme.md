# Global Warming Simulator

### Please note: This application only works in chromium-based browsers (for now)

## How to Run

If you are using visual studio code, you can use the Live Server extension:
* https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

Otherwise, use a unix-based command prompt and go to where the you have downloaded the folder. Then:

```
npm install
```

This will install all of the node modules you will need to run the project. To run the project type in:

```
npm start 
```

The game should open automatically on  `http://127.0.0.1:8080`


Please let me know if there are any issues via the `issues` tab :blush:

## What's changed since the Original Version?

A lot of things! 

There is now: 
* Accurate selection and movement of tokens
* Tiles will highlight when a token is clicked, this will show you which squares the token can be moved
* A turns counter
* Each turn will have a unique natural disaster
* Natural disasters
    * Heatwaves
    * Contaminated Water
    * Fires
    * Earthquakes
* A death state for each token
* The ability to get a game over
* The option to start a new game

## Controls
This game uses the three.js orbit controller however, I have removed rotate functionality.

The controls are as follows

* Holding down right click - Pans through the scene 
* Scroll - Zoom in and out 
* Left click - Basic interaction with buttons and tokens on the board

## How to Play

You will start with 40 fish, 20 bees and 20 coral. If a disaster lands on one/multiple tile(s) that contain a token, you need to move them within the allocated amount of moves. If you run out of moves, select the next turn button. A new disaster will appear and the token(s) impacted by the prior turn's disaster will die and the tile will no longer be able to be moved. You will reach a game over once all of your tokens have died. 