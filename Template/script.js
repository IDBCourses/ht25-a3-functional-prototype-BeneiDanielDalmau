/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

//--------------STATE VARIABLES----------------------------------------
// State variables are the parts of your program that change over time.
let finishObj = {
  rou: 0,
  h: 120,
  x: window.innerWidth-100,
  y: window.innerHeight-300,
  width: 100,
  height: 100,
  div: finish,
}

let obstacle1Obj = {
  rou: 0,
  h: 0,
  x: window.innerWidth/3,
  y: 0,
  width: 100,
  height: 600,
  div: obstacle1,
}

let obstacle2Obj = {
  rou: 0,
  h: 0,
  x: window.innerWidth/3*2,
  y: window.innerHeight-600,
  width: 100,
  height: 600,
  div: obstacle2,
}

let worm = {
  headObj: {
    x:0,
    y:0,
  },
  bodyObj: {
    x:0,
    y:0,
    deg:0,
    len:0,
  },
  endObj: {
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
let distance = undefined;
let fwdShrinkX = undefined;
let fwdShrinkY = undefined;
let neighbours = false;
let lastDeletedIndex = undefined;
//--------------SETTINGS------------------------------------------------------
// Settings variables should contain all of the "fixed" parts of your programs
const growthSpeed = 2;

//---------------FUNCTIONS--------------
//see all function definitions just below

function wormCollidesWith(obstacle){
  let collisionX = undefined;
  let collisionY = undefined;
  if (worm.headObj.x>obstacle.x && worm.headObj.x <obstacle.x+obstacle.width){
    collisionX = true;
  }
  if (worm.headObj.y>obstacle.y && worm.headObj.y <obstacle.y+obstacle.height){
    collisionY = true;
  }
  if (collisionX && collisionY){
    return(true);
  }else{
    return(false);
  }
}

function keepWormTogether(){

const {headObj,bodyObj,endObj} = worm

headObj.x = bodyObj.x+Math.cos(rad(bodyObj.deg))*(bodyObj.len-25)
headObj.y = bodyObj.y+Math.sin(rad(bodyObj.deg))*(bodyObj.len-25)
endObj.x = bodyObj.x-Math.cos(rad(bodyObj.deg))*(50)
endObj.y = bodyObj.y-Math.sin(rad(bodyObj.deg))*(50)
Util.setRotation(bodyObj.deg, head)
Util.setRotation(bodyObj.deg, end)
Util.setPositionPixels(headObj.x,headObj.y,head)
Util.setPositionPixels(endObj.x,endObj.y,end)
}

function shrinkForward(){
const {headObj,bodyObj} = worm
  //calculating the body's distance from head
  let xDiff = fwdShrinkX-bodyObj.x;
  let yDiff = fwdShrinkY-bodyObj.y;
  distance = Math.sqrt(xDiff*xDiff+yDiff*yDiff);
  
  if(distance>=0&&bodyObj.len>=growthSpeed){
    //shrinking
    bodyObj.len -=growthSpeed;

    //keeping head at initial position
    headObj.x=fwdShrinkX;
    headObj.y=fwdShrinkY;

    //coordinates for moving the body at the same rate at it shrinks, so it appears to shrink towards the head
    bodyObj.x = headObj.x-Math.cos(rad(bodyObj.deg))*(bodyObj.len-25)
    bodyObj.y = headObj.y-Math.sin(rad(bodyObj.deg))*(bodyObj.len-25)

    //moving the body and the end, while maintining their relative position
    Util.setPositionPixels(bodyObj.x,bodyObj.y,body)
    Util.setPositionPixels(bodyObj.x,bodyObj.y,end)
  }
  return(distance)
}


function wormMovement(){
  if (neighbours&&keysPressed.length ===2){
    worm.bodyObj.len+=growthSpeed;//grow
  }else if (lastDeletedIndex === 0 && keysPressed.length ===1){ 
    shrinkForward();
  }else if(lastDeletedIndex === 1 && keysPressed.length ===1 && worm.bodyObj.len>0){ 
    worm.bodyObj.len-=growthSpeed;//shrinkBack
  }else if (keysPressed.length === 0 && worm.bodyObj.len>0)
    worm.bodyObj.len-=growthSpeed;
  return(worm.bodyObj.len)
}

/*calRelPos - ckecks if key1 is a neighbour to key2 and outputs text describing the result,
  there are 6 possible "neighbour positions" based on a hexagonal grid*/
function calcRelPos (key1,key2) { 
  function keyRow (key){
    return (allKeys.indexOf(key) - allKeys.indexOf(key)%10)
  }
  let sameRow = keyRow (key1) === keyRow (key2);
  let indexDiff = allKeys.indexOf(key1)-allKeys.indexOf(key2);

 if (indexDiff === 10){
  neighbours = true;
  worm.bodyObj.deg = -120;//top left neighbour, angle -30
 } else if (indexDiff === 9){
  neighbours = true;
  worm.bodyObj.deg = -60;//top right neighbour, angle +30
 } else if (indexDiff === -9){
  neighbours = true;
  worm.bodyObj.deg = -240;//bottom left neighbour, angle -150
 } else if (indexDiff === -10){
  neighbours = true;
  worm.bodyObj.deg = 60;//bottom right neighbour, angle +150
 } else if (sameRow && indexDiff === 1){
  neighbours = true;
  worm.bodyObj.deg = -180;//left neighbour, angle - 90
 } else if (sameRow && indexDiff ===-1){
  neighbours = true;
  worm.bodyObj.deg = 0;//right neighbour, angle + 90
 } else {
  neighbours = false;
 }
 return(worm.bodyObj.deg);
}
//function to convert from deg to rad
function rad(deg){
return (deg*Math.PI/180)
}

//---------------LOOP----------------
// Code that runs over and over again
function loop() {
  Util.setRotation(calcRelPos(keysPressed[0],keysPressed[1]),body);
  wormMovement()
  Util.setSize(25+worm.bodyObj.len,100,body);
  keepWormTogether();
  console.log("len "+worm.bodyObj.len,"distance "+distance);

  if (wormCollidesWith(finishObj)){
    Util.setColour(120,100,50,1,won);//setting the whole screen green
  }else if (wormCollidesWith(obstacle1Obj)||wormCollidesWith(obstacle2Obj)){
    Util.setColour(0,100,50,1,lost);//setting the whole screen red
  }

  window.requestAnimationFrame(loop);   
}
//---------------SETUP----------------------------------------------------------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
//Roundedness
  Util.setRoundedness(0,body);
  Util.setRoundedness(0,won);
  Util.setRoundedness(0,lost);
//Position
  Util.setPositionPixels(100,500,head)
  Util.setPositionPixels(100,500,head);
  worm.headObj.x = 100;
  worm.headObj.y = 500;
  Util.setPositionPixels(100,500,body);
  worm.bodyObj.x = 100;
  worm.bodyObj.y = 500;
  Util.setPositionPixels(100-50,500,end);
  worm.endObj.x = 100-50;
  worm.endObj.y = 500;

//Size
  Util.setSize(10000,10000,won);
  Util.setSize(10000,10000,lost);
//Color
  Util.setColour(0,100,85,1,head);
  Util.setColour(120,100,50,0,won);
  Util.setColour(0,100,50,0,lost);

  for (let obj of [finishObj,obstacle1Obj,obstacle2Obj]){
    Util.setRoundedness(obj.rou,obj.div);
    Util.setColour(obj.h,100,60,1,obj.div);
    Util.setPositionPixels(obj.x,obj.y,obj.div);
    Util.setSize(obj.width,obj.height,obj.div);
  }

// Put your event listener code here
// we add event.code to keysPressed array
 document.addEventListener("keydown", (event)=>{
  if (!event.repeat){
  keysPressed.push(event.code)
  }
 })
 // we remove event.code from keysPressed array
 document.addEventListener("keyup", (event)=>{
  lastDeletedIndex = keysPressed.indexOf(event.code)
  keysPressed.splice(keysPressed.indexOf(event.code),1);
  if(keysPressed.length===1&&lastDeletedIndex===0){
    fwdShrinkX = worm.headObj.x;
    fwdShrinkY = worm.headObj.y;
  }
 })
  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!

