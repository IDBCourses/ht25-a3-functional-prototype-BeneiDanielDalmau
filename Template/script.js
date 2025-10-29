/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";


//--------------STATE VARIABLES----------------------------------------
// State variables are the parts of your program that change over time.

//keysPressed stores in real time the KeyboardEvent.code of all the buttons that are pressed down
let keysPressed = [];

let allKeys =     ["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0"   ,
                   "KeyQ"  ,"KeyW"  ,"KeyE"  ,"KeyR"  ,"KeyT"  ,"KeyY"  ,"KeyU"  ,"KeyI"  ,"KeyO"  ,"KeyP"     ,
                   "KeyA"  ,"KeyS"  ,"KeyD"  ,"KeyF"  ,"KeyG"  ,"KeyH"  ,"KeyJ"  ,"KeyK"  ,"KeyL"  ,"Semicolon",
                   "KeyZ"  ,"KeyX"  ,"KeyC"  ,"KeyV"  ,"KeyB"  ,"KeyN"  ,"KeyM"  ,"Comma" ,"Period","Slash"    ]

//stores hue
let h = 0;

//--------------SETTINGS------------------------------------------------------
// Settings variables should contain all of the "fixed" parts of your programs


//---------------FUNCTIONS--------------
//see all function definitions just below

function highlight(){
 if (keysPressed.length >=1){
  h = 120;
 } else {
  h = 0;
 }
 return (h);
}

function keyColumn (key){
  return (allKeys.indexOf(key)%10)
}

function keyRow (key){
  return (allKeys.indexOf(key) - allKeys.indexOf(key)%10)
}

function keyI (key){
  return (allKeys.indexOf(key))
}
/*checkIfNeighbours - ckecks if key2 is a neighbour to key2 and outputs text describing the result,
  there are 6 possible "neighbour positions" based on a hexagonal grid*/
function checkIfNeighbours (key1,key2) { 
 let relationStatus = "default";
 if (keyI(key1) - keyI(key2) === 10){
  relationStatus = "top left neighbour";
 } else if (keyI(key1) - keyI(key2) === 9){
  relationStatus = "top right neighbour"
 } else if (keyI(key1) - keyI(key2) === -9){
  relationStatus = "bottom left neighbour"
 } else if (keyI(key1) - keyI(key2) === -10){
  relationStatus = "bottom right neighbour"
 } else if ((keyRow (key1) === keyRow (key2)) && keyI(key1) - keyI(key2) === 1){
  relationStatus = "left neighbour"
 } else if ((keyRow (key1) === keyRow (key2)) && keyI(key1) - keyI(key2) ===-1){
  relationStatus = "right neighbour"
 } else {
  relationStatus = "not neighbours"
 }
 console.log(relationStatus);
 return(relationStatus);
}
//---------------LOOP----------------
// Code that runs over and over again
function loop() {
  //console.log(keysPressed);
  highlight();
  checkIfNeighbours(keysPressed[0],keysPressed[1]);
  Util.setColour(h,100,50,1,thing0);
  window.requestAnimationFrame(loop);
}

//---------------SETUP----------------------------------------------------------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  Util.setColour(0,100,50,1,thing0);
// Put your event listener code here
// the following event listeners activate code to add elements to an array so actively pressed keys can be tracked
 document.addEventListener("keydown", (event)=>{
  if (!event.repeat){
  keysPressed.push(event.code)
  
  }
 })
 document.addEventListener("keyup", (event)=>{
  let eventCode = event.code;
  let index = keysPressed.indexOf(eventCode);
  keysPressed.splice(index,1);
 })
  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!

