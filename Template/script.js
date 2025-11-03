/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

//--------------STATE VARIABLES----------------------------------------
// State variables are the parts of your program that change over time.
let worm = {
  head: {
    x:0,
    y:0,
  },
  body: {
    x:0,
    y:0,
    deg: 0,
    len:0,
  },
  end: {
    x:0,
    y:0,
  }
}
//keysPressed stores in real time the KeyboardEvent.code of all the buttons that are pressed down
let keysPressed = [];

// we store all keys used in the game in this array
const allKeys =   ["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0"   ,
                   "KeyQ"  ,"KeyW"  ,"KeyE"  ,"KeyR"  ,"KeyT"  ,"KeyY"  ,"KeyU"  ,"KeyI"  ,"KeyO"  ,"KeyP"     ,
                   "KeyA"  ,"KeyS"  ,"KeyD"  ,"KeyF"  ,"KeyG"  ,"KeyH"  ,"KeyJ"  ,"KeyK"  ,"KeyL"  ,"Semicolon",
                   "KeyZ"  ,"KeyX"  ,"KeyC"  ,"KeyV"  ,"KeyB"  ,"KeyN"  ,"KeyM"  ,"Comma" ,"Period","Slash"    ]

//stores hue
let h = 0;
let lengthTarget = 0;
let lastDeleted = null;
let lastDeletedIndex = null;
//--------------SETTINGS------------------------------------------------------
// Settings variables should contain all of the "fixed" parts of your programs


//---------------FUNCTIONS--------------
//see all function definitions just below

//simple function to highlight our html element by changing its color anytime at least 1 key is down
function highlight(){
 if (keysPressed.length >=1){
  h = 240;
 } else {
  h = 0;
 }
 return (h);
}

function keepWormTogether(){
// we should read rotation value,
//then set head position based on that and the body lenght,
worm.head.x = worm.body.x+Math.cos(rad(worm.body.deg))*(worm.body.len)
worm.head.y = worm.body.y+Math.sin(rad(worm.body.deg))*(worm.body.len)
Util.setRotation(worm.body.deg, head)
Util.setPositionPixels(worm.head.x,worm.head.y,head)
console.log("head x "+worm.head.x,"head y "+worm.head.y, "worm body", worm.body, "head", head)
}

function shrinkForward(){
  
}

function shrinkBack(){
  worm.body.len-=10;
}

function wormBehaviour(){
  //rotation
  function rotateWorm(){
    if (keysPressed.length ===2){
   Util.setRotation(checkIfNeighbours(keysPressed[0],keysPressed[1]),body)
    }
  }
  rotateWorm()
  //growth
  if (relationStatus === !"not neighbours"&&keysPressed.length ===2){ +
    function grow(){
      Util.setSize(50+worm.body.len,100,body);//grow should happen w Util.setSize
    }
  //shrinking
  }else if (lastDeletedIndex === 0 && keysPressed.length ===1){ 
    shrinkForward()
  }else if(lastDeletedIndex === 1 && keysPressed.length ===1){ 
    shrinkBack()
  }
}

/*checkIfNeighbours - ckecks if key1 is a neighbour to key2 and outputs text describing the result,
  there are 6 possible "neighbour positions" based on a hexagonal grid*/
function checkIfNeighbours (key1,key2) { 
  function keyRow (key){
    return (allKeys.indexOf(key) - allKeys.indexOf(key)%10)
  }
  let sameRow = keyRow (key1) === keyRow (key2);
  let indexDiff = allKeys.indexOf(key1)-allKeys.indexOf(key2);
  let relationStatus = "default";
 if (indexDiff === 10){
  relationStatus = "top left neighbour, angle -30";
  worm.body.deg = -120;
 } else if (indexDiff === 9){
  relationStatus = "top right neighbour, angle +30"
  worm.body.deg = -60;
 } else if (indexDiff === -9){
  relationStatus = "bottom left neighbour, angle -150"
  worm.body.deg = -240;
 } else if (indexDiff === -10){
  relationStatus = "bottom right neighbour, angle +150 "
  worm.body.deg = 60;
 } else if (sameRow && indexDiff === 1){
  relationStatus = "left neighbour, angle - 90"
  worm.body.deg = -180;
 } else if (sameRow && indexDiff ===-1){
  relationStatus = "right neighbour, angle + 90"
  worm.body.deg = 0;
 } else {
  relationStatus = "not neighbours"
 }
 return(worm.body.deg);
}

function rad(deg){
return (deg*Math.PI/180)
}

//---------------LOOP----------------
// Code that runs over and over again
function loop() {
  console.log(keysPressed);
  highlight();
  Util.setRotation(checkIfNeighbours(keysPressed[0],keysPressed[1]),body);
  Util.setSize(50+worm.body.len,100,body);
  Util.setColour(h,100,85,1,head);
  keepWormTogether();
//---------------TEST-----

  window.requestAnimationFrame(loop);   
}
//---------------SETUP----------------------------------------------------------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {

  Util.setRoundedness(0,body);//make body square, end and head are round by default
  Util.setSize(100,100,head);
  Util.setSize(100,100,body);
  Util.setSize(100,100,end);
  Util.setPositionPixels(500,500,head);
  worm.head.x = 500;
  worm.head.y = 500;
  Util.setPositionPixels(500,500,body);
  worm.body.x = 500;
  worm.body.y = 500;
  Util.setPositionPixels(500-50,500,end);
  worm.end.x = 500-50;
  worm.end.y = 500;
// Put your event listener code here
// we add event.code to keysPressed array
 document.addEventListener("keydown", (event)=>{
  if (!event.repeat){
  keysPressed.push(event.code)
  }else if(event.repeat){//
    worm.body.len+=10;
  }
 })
 // we remove event.code from keysPressed array
 document.addEventListener("keyup", (event)=>{
  lastDeleted = keysPressed.splice(keysPressed.indexOf(event.code),1);// store the event.code of the last deleted element from keysPressed array 
  lastDeletedIndex = keysPressed.indexOf(event.code) // store the index of the last deleted element from keysPressed array
 })
  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!

