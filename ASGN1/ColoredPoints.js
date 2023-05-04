// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
// Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
//   gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

}

function connectVariablesToGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  
}

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const STARS = 3;

//globals related to ui elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize=5.0;
let g_selectedType=POINT;
let g_segments = 10;
let ranvar = 0;

//set up actions for the html ui elements
function addActionsForHtmlUI(){

    //button events (shape type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
    document.getElementById('draw').onclick = function () {drawDecepticonLogo();};

    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circle').onclick = function() {g_selectedType=CIRCLE};

    //slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100;});
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100;});

    //size slider events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });

    document.getElementById('segments').addEventListener('mouseup', function() {g_segments = this.value;});

    document.getElementById('awesome').onclick = function() {g_selectedType=STARS};

}

function main() {

    // set up canvas and gl variables
    setupWebGL();
    // set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();
    //set up actions for the html ui elements
    addActionsForHtmlUI();
  

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //hold to draw
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {

    //Extract the event click and return it in WebGl Corrdinates
    let [x,y] = convertCoordinatesEventToGL(ev);
    //create and store the new point
    let point;
    if (g_selectedType==POINT){
        point = new Point();
    }
    else if (g_selectedType==CIRCLE){
        point = new Circle();
        point.segments = g_segments; 
    }
    else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    }
    else{
      point = new Star();
      point.segments = g_segments;
    }
    point.position=[x,y];
    point.color=g_selectedColor.slice();
    point.size=g_selectedSize;
    g_shapesList.push(point);

//   // Store the coordinates to g_points array
//   g_points.push([x, y]);

//   //store the color to g_color array
//   g_colors.push(g_selectedColor.slice());

//   // store the size to the g sizes array
//   g_sizes.push(g_selectedSize);
  // Store the coordinates to g_points array
//   if (x >= 0.0 && y >= 0.0) {      // First quadrant
//     g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
//   } else if (x < 0.0 && y < 0.0) { // Third quadrant
//     g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
//   } else {                         // Others
//     g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
//   }

  // Draw shapes that is supposed to be in the canvas
  renderAllShapes();

}

//extract the event click and return it in webgl coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

//draw every shape that is supposed to be in the canvas
function renderAllShapes(){

    // var startTime = performance.now();

    //Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

//   var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    // var xy = g_points[i];
    // var rgba = g_colors[i];
    // var size = g_sizes[i];
    g_shapesList[i].render();
  }
//   var duration = performance.now() - startTime;
//   sendTextToHTML("numdow: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration))
}

// function sendTextToHTML(text, htmlID) {
//     var htmlElm = document.getElementById(htmlID);
//     if (!htmlElm) {
//         console.log("Failed to get " + htmlID + "from HTML");
//         return;
//     }
//     htmlElm.innerHTML = text;
// }

function drawDecepticonLogo(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1f(u_Size, 5.0);
  gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
  drawTriangle([0.0, 0.0, 0.0, -.85, 0.18, 0.14]);
  drawTriangle([0.0, -.85, 0.18, 0.14, 0.42, -0.25]);
  drawTriangle([0.18, 0.14, 0.42, -0.25, 0.46, 0.18]);
  drawTriangle([0.04, -.85, 0.5, -0.64, 0.64, 0.04]);
  drawTriangle([0.42, -0.25, 0.49, 0.57, 0.64, 0.07]);
  drawTriangle([0.49, 0.57, 0.64, 0.07, 0.71, 0.57]);
  drawTriangle([0.49, 0.57, 0.74, 0.93, 0.71, 0.57]);
  drawTriangle([0.0, 0.035, 0.18, 0.18, 0.0, 0.29]);
  drawTriangle([0.0, 0.29, 0.18, 0.18, 0.071, 0.43]);
  drawTriangle([0.071, 0.43, 0.18, 0.18, 0.29, 0.57]);
  drawTriangle([0.071, 0.43, 0.0, 0.57, 0.29, 0.57]);
  drawTriangle([0.071, 0.43, 0.0, 0.57, 0.0, 0.43]);
  drawTriangle([0.071, 0.57, 0.29, 0.86, 0.29, 0.57]);
  drawTriangle([0.5, 0.57, 0.29, 0.5, 0.48, 0.39]);
  drawTriangle([0.25, 0.36, 0.29, 0.5, 0.48, 0.39]);
  drawTriangle([0.25, 0.32, 0.46, 0.21, 0.48, 0.36]);
  drawTriangle([0.25, 0.32, 0.46, 0.21, 0.21, 0.18]);

  drawTriangle([0.0, 0.0, 0.0, -.85, -0.18, 0.14]);
  drawTriangle([0.0, -.85, -0.18, 0.14, -0.42, -0.25]);
  drawTriangle([-0.18, 0.14, -0.42, -0.25, -0.46, 0.18]);
  drawTriangle([-0.04, -.85, -0.5, -0.64, -0.64, 0.04]);
  drawTriangle([-0.42, -0.25, -0.49, 0.57, -0.64, 0.07]);
  drawTriangle([-0.49, 0.57, -0.64, 0.07, -0.71, 0.57]);
  drawTriangle([-0.49, 0.57, -0.74, 0.93, -0.71, 0.57]);
  drawTriangle([0.0, 0.035, -0.18, 0.18, 0.0, 0.29]);
  drawTriangle([0.0, 0.29, -0.18, 0.18, -0.071, 0.43]);
  drawTriangle([-0.071, 0.43, -0.18, 0.18, -0.29, 0.57]);
  drawTriangle([-0.071, 0.43, 0.0, 0.57, -0.29, 0.57]);
  drawTriangle([-0.071, 0.43, 0.0, 0.57, 0.0, 0.43]);
  drawTriangle([-0.071, 0.57, -0.29, 0.86, -0.29, 0.57]);
  drawTriangle([-0.5, 0.57, -0.29, 0.5, -0.48, 0.39]);
  drawTriangle([-0.25, 0.36, -0.29, 0.5, -0.48, 0.39]);
  drawTriangle([-0.25, 0.32, -0.46, 0.21, -0.48, 0.36]);
  drawTriangle([-0.25, 0.32, -0.46, 0.21, -0.21, 0.18]);
  gl.uniform4f(u_FragColor, 1, 0, 0, 1.0);
  drawTriangle([0.21, 0.0, 0.32, -0.07, 0.36, 0.04]);
  drawTriangle([0.21, 0.0, 0.32, -0.07, 0.11, -0.18]);
  drawTriangle([-0.21, 0.0, -0.32, -0.07, -0.36, 0.04]);
  drawTriangle([-0.21, 0.0, -0.32, -0.07, -0.11, -0.18]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function awesomeness(){
  let variable1 = Math.random();
  let variable2 = Math.random();
  let variable3 = Math.random();

  gl.clearColor(variable1, variable2, variable3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
