/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// State variables are the parts of your program that change over time.
let isKeyDown = false;
let keysPressed = [];
// Settings variables should contain all of the "fixed" parts of your programs

// Code that runs over and over again
function loop() {
  console.log(keysPressed)
  window.requestAnimationFrame(loop);
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
 Util.createThing();

// the following event listeners activate code to add elements to an array
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

