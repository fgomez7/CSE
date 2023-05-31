// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    // v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
//inspired source for spot light : https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-spot.html
var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
varying vec3 v_Normal;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform int u_whichTexture;
uniform vec3 u_lightPos;
uniform vec3 u_cameraPos;
varying vec4 v_VertPos;
uniform bool u_lightOn;
uniform bool u_spotlightON;

uniform vec3 u_spotPosition;
uniform vec3 u_spotDirection;
uniform float u_spotCutOff;
uniform vec3 u_lightColor;
uniform vec3 u_lightColor2;
uniform vec3 u_lightColor3;

  void main() {
    if (u_whichTexture == -3){ 
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    } else if(u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }

    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);

    float nDotL = max(dot(N,L), 0.0);
    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0), 65.0) * 0.7;
    vec3 diffuse = u_lightColor * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    vec3 diffuse2 = u_lightColor2 * vec3(gl_FragColor) * nDotL * 1.0;
    vec3 diffuse3 = u_lightColor3 * vec3(gl_FragColor) * nDotL * 1.0;

    vec3 slightvector = u_lightPos - vec3(v_VertPos);
    vec3 S = normalize(slightvector);
    float nDots = max(dot(N, S), 0.0);
    float spotDirection = dot(S, u_spotDirection);
    vec3 SR = reflect(-S, N);
    float spotSpecular = pow(max(dot(E, SR), 0.0), 64.0) * 1.0;
    vec3 spotDiffuse = vec3(gl_FragColor) * nDots * 0.3;
    vec3 spotAmbient = vec3(gl_FragColor) * 0.2;

    
    if(u_lightOn){
      if(u_spotlightON && spotDirection >= u_spotCutOff){
        if (u_whichTexture == 0){
          gl_FragColor = vec4(spotDiffuse + spotAmbient, 1.0);  
        }
        else{
          gl_FragColor = vec4(spotDiffuse + spotSpecular + spotAmbient, 1.0);
        }
      }
      else if (!u_spotlightON){
        if(u_whichTexture == 0){
          gl_FragColor = vec4(diffuse2 + diffuse3 + ambient, 1.0);
        } else {
          gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
        }
      }
    }
  }
`

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_NormalMatrix;
let u_spotPosition;
let u_spotlightON;
let u_spotDirection;
let u_spotCutOff;
let u_lightColor;
let u_lightColor2;
let u_lightColor3;

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

  gl.enable(gl.DEPTH_TEST);

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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0){
    console.log('Failed to get the storage location of a_uv');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn){
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos){
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos){
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix){
    console.log("Failed to get the storage location of a u_ModelMatrix");
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix){
    console.log('Failed to get the storage location of a u_NormalMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
    console.log('failed to get the storage location of u_whichTexture');
  }

  u_spotPosition = gl.getUniformLocation(gl.program, 'u_spotPosition');
  if (!u_spotPosition){
    console.log('failed to get the storage location of u_spotPosition');
  }

  u_spotlightON = gl.getUniformLocation(gl.program, 'u_spotlightON');
  if (!u_spotlightON){
    console.log('failed to get the storage location of u_spotlightON');
  }

  u_spotDirection = gl.getUniformLocation(gl.program, 'u_spotDirection');
  if (!u_spotDirection){
    console.log('failed to get the storage location of u_spotdirection');
  }

  u_spotCutOff = gl.getUniformLocation(gl.program, 'u_spotCutOff');
  if (!u_spotCutOff){
    console.log('failed to get the storage location of u_spotCutOff');
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor){
    console.log('Failed to get the storage location of u_lightColor');
  }

  u_lightColor2 = gl.getUniformLocation(gl.program, 'u_lightColor2');
  if (!u_lightColor2){
    console.log('Failed to get the storage location of u_lightColor2');
  }

  u_lightColor3 = gl.getUniformLocation(gl.program, 'u_lightColor3');
  if (!u_lightColor3){
    console.log('Failed to get the storage location of u_lightColor3');
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
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
let g_globalAngle = 0;
let g_yelloAngle = 0;
let g_magentaAngle= 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
let headJoint = 0;
let tailJoint = 0;
let tailJoint2 = 0;
let tailJoint3 = 0;
let g_sAnimation = false;
let g_footanimation = 0;
let g_normalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = true;
let g_spotlightON = false;
let g_spotPosition = [0, 4, 4];
let g_lightAnimation = false;
let g_lightColor = [1,1,1];
let g_lightColor2 = [1,1,1];

//set up actions for the html ui elements
function addActionsForHtmlUI(){

  document.getElementById('normalOn').onclick = function () {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function () {g_normalOn = false;};
  document.getElementById('lighton').onclick = function () {g_lightOn = true;};
  document.getElementById('lightoff').onclick = function () {g_lightOn = false;};
  document.getElementById('Slighton').onclick = function () {g_spotlightON = true;};
  document.getElementById('Slightoff').onclick = function () {g_spotlightON = false;};
  //button events (shape type)
  // document.getElementById('animationYellowButtonOff').onclick = function() {g_yellowAnimation = false;};
  // document.getElementById('animationYellowButtonOn').onclick = function() {g_yellowAnimation = true;};
  document.getElementById('animationMOff').onclick = function() {g_magentaAnimation = false;};
  document.getElementById('animationMOn').onclick = function() {g_magentaAnimation = true;};

  //slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes();});
  // document.getElementById('yelloSlide').addEventListener('mousemove', function(){ g_yelloAngle = this.value; renderAllShapes();});
  document.getElementById('magentaSlide').addEventListener('mousemove', function(){ g_magentaAngle = this.value; renderAllShapes();});
  document.getElementById('headjoint').addEventListener('mousemove', function() {headJoint = this.value; renderAllShapes();});
  document.getElementById('tailjoint').addEventListener('mousemove', function() {tailJoint = this.value; renderAllShapes();});
  document.getElementById('tailjoint2').addEventListener('mousemove', function() {tailJoint2 = this.value; renderAllShapes();});
  document.getElementById('tailjoint3').addEventListener('mousemove', function() {tailJoint3 = this.value; renderAllShapes();});
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[2] = this.value/100; renderAllShapes();}});
  document.getElementById('lightAnimation').onclick = function () { if (g_lightAnimation == true){g_lightAnimation = false;} else{g_lightAnimation = true;}};
  document.getElementById('red').addEventListener('mousemove', function() {g_lightColor[0] = this.value; g_lightColor2[0] = this.value;});
  document.getElementById('green').addEventListener('mousemove', function() {g_lightColor[1] = this.value; g_lightColor2[1] = this.value;});
  document.getElementById('blue').addEventListener('mousemove', function() {g_lightColor[2] = this.value; g_lightColor2[2] = this.value;});

  //size slider events
  // document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });

  // document.getElementById('segments').addEventListener('mouseup', function() {g_segments = this.value;});


}

function initTextures() {

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(image, 0); };
  // Tell the browser to load an image
  image.src = 'sky.jpg';

  var image2 = new Image();
  if (!image2){
    console.log('Failed to create the image2 object');
    return false;
  }

  image2.onload = function(){ loadTexture(image2, 1);};
  image2.src = 'grass.jpg';

  return true;
}

function loadTexture(image, x) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  // gl.activeTexture(gl.TEXTURE0);
  switch(x){
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      break;
    default:
      console.log('unable to find texture');
      break;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler

  switch(x){
    case 0:
      gl.uniform1i(u_Sampler0, 0);
      break;
    case 1:
      gl.uniform1i(u_Sampler1, 1);
      break;
    default:
      console.log("Texture not found");
      break;
  }
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log('compiled texture');
}

lastcoordinates = [0,0];
foodcollected = 0;
function main() {

    // set up canvas and gl variables
    setupWebGL();
    // set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();
    //set up actions for the html ui elements
    addActionsForHtmlUI();

    // generateWorld();

    // generateFood();
  

  // Register function (event handler) to be called on a mouse press
  //   canvas.onmousedown = click;
  //hold to draw
  // canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev) } };
  document.onkeydown = keydown;
  // canvas.onmousedown = function(ev) { if (ev.shiftKey && g_yellowAnimation == false && foodcollected > 0) { g_yellowAnimation = true;} else{ g_yellowAnimation = false; foodcollected = 0;}};
  
  canvas.onmousedown = function(ev) {

    if (ev.buttons == 1) {
      canvas.onmousemove = function(ev) {
        let [x, y] = convertCoordinatesEventToGL(ev);
        if (lastcoordinates[0] > x) {
          g_camera.panLeft();
        } else if (lastcoordinates[0] < x){
          g_camera.panRight();
        }
        lastcoordinates = [x,y];
      };
    }
  };
  
  canvas.onmouseup = function(ev) {
    canvas.onmousemove = null; // Remove the mousemove event listener
  };
  


  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return([x,y]);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    // console.log(g_seconds);//print debug informaiton so we know we are running

    //update animation angles
    updateAnimationAngles();
    //draw everything
    renderAllShapes();

    //make browser constantly update
    requestAnimationFrame(tick);

}


function updateAnimationAngles(){
  if (g_yellowAnimation) {
      g_yelloAngle = (45*Math.sin(g_seconds));
      tailJoint = (45*Math.sin(3*g_seconds));
      tailJoint2 = (45*Math.sin(3*g_seconds));
      tailJoint3 = (45*Math.sin(3*g_seconds));
  }
  if (g_magentaAnimation){
      g_magentaAngle = (45*Math.sin(3*g_seconds));
      tailJoint = (45*Math.sin(3*g_seconds));
      tailJoint2 = (45*Math.sin(3*g_seconds));
      tailJoint3 = (45*Math.sin(3*g_seconds));
  }
  if (g_lightAnimation){
    var x = 3 * Math.cos(g_seconds);
    var z = 3 * Math.sin(g_seconds);
    var y = 3 * Math.max(Math.cos(g_seconds) + 1, 0);
    g_lightPos = [x, y, z];

    // document.getElementById('lightSlideX').value = x;
    // document.getElementById('lightSlideY').value = y;
    // document.getElementById('lightSlideX').value = z;

  }

  // g_lightPos[0] = Math.cos(g_seconds);
}

function keydown(ev){         //I SHOULD BE USING WASD KEYS
  if (ev.keyCode == 87){      //right arrow
    // g_eye[0] += 0.2;
    g_camera.forward();
  } else if(ev.keyCode == 83){// left arrow
    // g_eye[0] -= 0.2;
    g_camera.backward();
  } else if (ev.keyCode == 65){
    g_camera.left();
  } else if (ev.keyCode == 68){
    g_camera.right();
  }
  else if (ev.keyCode == 81){
    g_camera.panLeft();
  }
  else if (ev.keyCode == 69){
    g_camera.panRight();
  }
  else if (ev.keyCode == 76){
    break_add_block();
  }
  else if (ev.keyCode == 74){
    let coo = g_camera.requestCamCoor();
    coo[0] = Math.floor(coo[0]) + 25;
    coo[2] = Math.floor(coo[2]) + 24;
    console.log(coo);
  }
  if (ev.keyCode == 16 && foodcollected > 0){
    g_yellowAnimation = true;
    foodcollected = 0;
  }else if (ev.keyCode == 16 && foodcollected == 0){
    g_yellowAnimation = false;
    // foodcollected = 0;
  }

  renderAllShapes();
  console.log(ev.keyCode);
}


var g_camera = new Camera();

function drawMap(){
  let body = new Cube();
  let food = new Cube();
  for(x = 0; x < 50; x++){
    for (y = 0; y < 50; y++){
      if (map[x][y] == 1){
        // continue;
        body.color = [1.0, 0.0, 0.0, 1.0];
        body.textureNum = -1;
        body.matrix.setTranslate(y - map.length/2, 0, x - map.length/2);
        body.matrix.translate(0, -.75, 0);
        body.renderfasterV2()
      }
      else if (map[x][y] == 2){
        food.color = [1.0, 1.0, 0.0, 1.0];
        food.textureNum = -2;
        food.matrix.setTranslate(y - map.length/2, 0, x - map.length/2);
        food.matrix.translate(0, -.75, 0);
        food.renderfaster();
      }
    }
  }
}

var map = [];
function generateWorld(){
  var counter = 0;
  for (let i = 0; i < 50; i++){
    let row = [];
    for (let j = 0; j <50; j++){
      if (counter == 3){
        row.push(Math.random() > 0.5 ? 1 : 0);
        counter = 0;
        continue;
      }
      counter++;
      row.push(0);
      
    }
    map.push(row);
  }
  console.log(map);
}

function break_add_block(){
  let coordinates = g_camera.requestCamCoor();
  coordinates[0] = Math.floor(coordinates[0]);
  coordinates[2] = Math.floor(coordinates[2]);
  
  // coordinates[0] += 25;
  // coordinates[2] += 24;

  coordinates[0] += 25;
  coordinates[2] += 24;

  let x = coordinates[2];
  let y = coordinates[0];
  // console.log(x, y);
  
  if (map[x][y] == 1){
    map[x][y] = 0;
  } else if(map[x][y] == 0){
    map[x][y] = 1;
  }
}

let random1 = null;
let random2 = null;
function generateFood(){
  random1 = Math.floor(Math.random() * 51);
  random2 = Math.floor(Math.random() * 51);
  map[random1][random2] = 2;
}

function foodFound(){
  let foodCoordinates = g_camera.requestCamCoor();
  let x = Math.floor(foodCoordinates[2]);
  let y = Math.floor(foodCoordinates[0]);
  x += 25;
  y += 25;

  if (random1 == x && random2 == y){
    map[random1][random2] = 0;
    foodcollected += 1;
    alert('You found the food, collect more or go to the fox and click shift to feed him');
    generateFood();
  }
}


var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];
function renderAllShapes(){

  var startTime = performance.now();

  // foodFound();

  //pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  //pass the view matrix
  var viewMat = new Matrix4();
  // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
                    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
                    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  //pass the matrix to u_modelmatrix*attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_spotlightON, g_spotlightON);
  gl.uniform3f(u_spotPosition, g_spotPosition[0], g_spotPosition[1], g_spotPosition[2]);
  gl.uniform3f(u_spotDirection, 0, -1, 0);
  gl.uniform1f(u_spotCutOff, Math.cos(5400/Math.PI));
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);
  gl.uniform3f(u_lightColor2, g_lightColor2[0] *.14, g_lightColor2[1] *.14, g_lightColor2[2]*.14);
  gl.uniform3f(u_lightColor3, 1, 1, 1);
  renderScene();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function renderScene(){

  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.setTranslate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();

  var testCube = new Cube();
  if (g_normalOn) testCube.textureNum = -3;
  testCube.matrix.translate(3, -.5, -3);
  testCube.animalPart = false;
  testCube.render();

  var ball = new Sphere();
  ball.textureNum = -2;
  if (g_normalOn) ball.textureNum = -3;
  ball.matrix.translate(-1, 0, -1.5);
  ball.matrix.scale(.4, .4, .4);
  ball.render();

  // drawing the floor  
  var floor = new Cube();
  floor.color = [1, 0, 0, 1];
  floor.textureNum = 1;//this was texture 1
  if (g_normalOn) floor.textureNum = -3;
  floor.matrix.translate(0, -.75, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  //draw the sky
  var sky = new Cube();
  sky.color = [0.8,0.8,0.8,1];
  if (g_normalOn) {sky.textureNum = -3;}
  else {
    sky.textureNum = 0;//this was texture 
  }
  // sky.textureNum = -1;
  sky.matrix.scale(-10,-10,-10);
  sky.matrix.translate(-.5,-.5,-.5);
  // sky.normalMatrix.setInverseOf(sky.matrix).transpose();
  sky.render();

  // drawMap();

  //draw a cube
  var body = new Cube();
  body.color = [0.82, 0.32, 0.0, 1.0];
  if (g_normalOn) body.textureNum = -3;
  //   body.matrix.translate(-.65, -.15, -0.40);
  //   body.matrix.rotate(-5, 1, 0, 0)
  // body.textureNum = -2;
  body.matrix.translate(-0.1, -.50 ,-0.16);
  //   body.matrix.scale(.3, .3, .5625);
  body.matrix.scale(.2, .2, .375);
  var bodyCoordinates = new Matrix4(body.matrix);
  var tailcoordinates = new Matrix4(body.matrix);
  var feetcoordinates = new Matrix4(body.matrix);
  body.animalPart = false;
  body.render();

  var head = new Cube();
  head.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) head.textureNum = -3;
  head.matrix = bodyCoordinates;
  head.matrix.translate(.5, -0.2, -0.46);
  head.matrix.rotate(-g_yelloAngle, 0, 0, 1);
  head.matrix.scale(1.3, 1.1, .5);
  head.matrix.translate(-.5, 0, 1.0);
  head.matrix.rotate(-90, 1, 0, 0);
  head.matrix.rotate(headJoint, 1, 0, 0);
  var yellowCoordinates = new Matrix4(head.matrix);
  var earss2 =  new Matrix4(head.matrix);
  var eyes = new Matrix4(head.matrix);
  head.animalPart = false;
  head.render();


  var eye1 = new Cube();
  eye1.color = [0, 0, 0, 1];
  if (g_normalOn) eye1.textureNum = -3;
  eye1.matrix = eyes;
  eye1.matrix.translate(0.85, 1.1, 0.4);
  eye1.matrix.scale(0.15, 0.08, 0.15);
  var eyes1s1 = new Matrix4(eye1.matrix);
  eye1.matrix.translate(0, -1.1,0);
  eye1.matrix.scale(1, 0.5, 1);
  var eyes1s2 = new Matrix4(eye1.matrix);
  var eyes2 = new Matrix4(eye1.matrix);
  eye1.animalPart = false;
  eye1.render();

  var eye1s1 = new Cube();
  eye1s1.color = [1, 1, 1, 1];
  if (g_normalOn) eye1s1.textureNum = -3;
  eye1s1.matrix = eyes1s1;
  eye1s1.matrix.translate(1.05, -3.9, 0);
  eye1s1.matrix.scale(0, 2.5, 1);
  //   var eyes2s2 = new Matrix4(eye1s1.matrix);
  eye1s1.animalPart = false;
  eye1s1.render();

  var eye1s2 = new Cube();
  eye1s2.color = [1, 1, 1, 1];
  if (g_normalOn) eye1s2.textureNum = -3;
  eye1s2.matrix = eyes1s2;
  eye1s2.matrix.translate(-1, 0, 0);
  eye1s2.animalPart = false;
  eye1s2.render();

  var eye2 = new Cube();
  eye2.color = [0, 0, 0, 1];
  if (g_normalOn) eye2.textureNum = -3;
  eye2.matrix = eyes2;
  eye2.matrix.translate(-5.6, 0, 0);
  var eyes2s1 = new Matrix4(eye2.matrix);
  var eyes2s2 = new Matrix4(eye2.matrix);
  var nosecor = new Matrix4(eye2.matrix);
  eye2.animalPart = false;
  eye2.render();

  var eye2s1 = new Cube();
  eye2s1.color = [1, 1, 1, 1];
  if (g_normalOn) eye2s1.textureNum = -3;
  eye2s1.matrix = eyes2s1;
  eye2s1.matrix.translate(1, 0, 0);
  var fur = new Matrix4(eye2s1.matrix);
  eye2s1.animalPart = false;
  eye2s1.render();

  var eye2s2 = new Cube();
  eye2s2.color = [1, 1, 1, 1];
  if (g_normalOn) eye2s2.textureNum = -3;
  eye2s2.matrix = eyes2s2;
  eye2s2.matrix.translate(-0.1, -6, 0);
  eye2s2.matrix.scale(0.1, 5, 1);
  eye2s2.animalPart = false;
  eye2s2.render();

  var patch = new Cube();
  patch.color= [1, 1, 1, 1];
  if (g_normalOn) patch.textureNum = -3;
  patch.matrix = fur;
  patch.matrix.translate(-1, 0, -2.5)
  patch.matrix.scale(6.5, 1, 1);
  patch.animalPart = false;
  patch.render();

  var nose = new Cube();
  nose.color = [0, 0, 0, 1];
  if (g_normalOn) nose.textureNum = -3;
  nose.matrix = nosecor;
  nose.matrix.translate(2.25, 6.5, -1.45);
  nose.matrix.scale(2, 1, 1);
  var nosepathcor = new Matrix4(nose.matrix);
  nose.animalPart = false;
  nose.render();

  var nosepatch = new Cube();
  nosepatch.color = [1, 1, 1, 1];
  if (g_normalOn) nosepatch.textureNum = -3;
  nosepatch.matrix = nosepathcor;
  nosepatch.matrix.translate(-0.55, 0, -0.8);
  nosepatch.matrix.scale(2.1, 1, 1);
  nosepatch.animalPart = false;
  nosepatch.render();


  var snout = new Cube();
  snout.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) snout.textureNum = -3;
  snout.matrix = yellowCoordinates;
  snout.matrix.rotate(90, 1, 0, 0);
  snout.matrix.translate(0.175, 0.05, -1.3);
  snout.matrix.scale(.65, .30, .39);
  snout.animalPart = false;
  snout.render();

  var ears = new Cube();
  ears.color = [1, 1, 1, 1];
  if (g_normalOn) ears.textureNum = -3;
  ears.matrix = earss2;
  ears.matrix.rotate(90, 1, 0, 0);
  ears.matrix.scale(0.3, 0.3, 0.1);
  ears.matrix.translate(0, 3.35, -10.3);
  var secondears = new Matrix4(ears.matrix);
  var triears2 = new Matrix4(ears.matrix);
  ears.animalPart = false;
  ears.render();

  // var triear2 = new TriangleP();
  // triear2.color = [0.98, 0.50, 0.11, 0.1];
  // triear2.matrix = triears2;
  // triear2.matrix.translate(0.0, 1.0, 0);
  // triear2.matrix.scale(1.0, 0.5, 1.0);
  // triear2.render();

  var ears2 = new Cube();
  ears2.color = [1, 1, 1, 1];
  if (g_normalOn) ears2.textureNum = -3;
  ears2.matrix = secondears;
  ears2.matrix.translate(2.37, 0, 0);
  var triears = new Matrix4(ears2.matrix);
  ears2.animalPart = false;
  ears2.render();

  // var triear1 = new TriasngleP();
  // triear1.color = [0.98, 0.50, 0.11, 0.1];
  // triear1.matrix = triears;
  // triear1.matrix.translate(0.0, 1.0, 0);
  // triear1.matrix.scale(1.0, 0.5, 1.0);
  // triear1.render();

  var tail = new Cube();
  tail.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) tail.textureNum = -3;
  tail.matrix = tailcoordinates;
  tail.matrix.translate(.5, 0.12, 1.0);
  tail.matrix.scale(.8, .8, .5)
  // tail.matrix.rotate(g_yelloAngle, 0, 1, 0);
  // tail.matrix.rotate(g_magentaAngle/2, 0, 1, 0);
  tail.matrix.rotate(-tailJoint/2, 0, 1, 0);
  tail.matrix.translate(-.5,  0, 0);
  var tail2coordinates = new Matrix4(tail.matrix);
  tail.animalPart = false;
  tail.render();

  var tail2 = new Cube();
  tail2.color = [0.98, 0.50, 0.11, 0.1];
  if (g_normalOn) tail2.textureNum = -3;
  tail2.matrix = tail2coordinates;
  tail2.matrix.translate(0.5, 0.11, 1.0);
  tail2.matrix.scale(0.8, 0.8, 1.2)
  //   tail2.matrix.rotate(180, 0, 0, 1);
  //   tail2.matrix.translate(-1, -1, 0);
  //   tail2.matrix.translate(0, 0, .2)
  // tail2.matrix.rotate(g_magentaAngle/2, 0, 1, 0);
  // tail2.matrix.rotate(g_yelloAngle, 0, 1, 0);
  tail2.matrix.rotate(-tailJoint2, 0, 1, 0);
  tail2.matrix.translate(-.5, 0, 0);
  var tail3coordinates = new Matrix4(tail2.matrix);
  tail2.animalPart = false;
  tail2.render();

  var tail3 = new Cube();
  tail3.color = [1, 1, 1, 1];
  if (g_normalOn) tail3.textureNum = -3;
  tail3.matrix = tail3coordinates;
  tail3.matrix.translate(0.5, 0, 0);
  tail3.matrix.scale(0.7, 0.7, 0.7);
  tail3.matrix.translate(0.15, 0.2, 1.3);
  // tail3.matrix.rotate(g_magentaAngle, 0, 1, 0);
  // tail3.matrix.rotate(g_yelloAngle, 0, 1, 0);
  tail3.matrix.rotate(-tailJoint3, 0, 1, 0);
  tail3.matrix.translate(-0.65, 0, 0);
  tail3.animalPart = false;
  tail3.render();


  var foot = new Cube();
  foot.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) foot.textureNum = -3;
  foot.matrix = feetcoordinates;
  foot.matrix.translate(0.9, -.52, 0.2);
  foot.matrix.scale(.3, .5, .2);
  foot.matrix.rotate(-90, 0, 0, 1);
  foot.matrix.translate(-1.6, -2.7, 0);
  var foot2Coordinates = new Matrix4(foot.matrix);
  //   foot.matrix.rotate(-90, 0, 1, 0);
  //   foot.matrix.translate(-0.5, 0, -1);
  // foot.matrix.rotate(g_footanimation, 0, 1, 0);
  foot.matrix.rotate(g_magentaAngle/2, 0, 1, 0);
  foot.matrix.scale(1.9, 1, 1);
  var footF = new Matrix4(foot.matrix);
  foot.animalPart = false;
  foot.render();

  var footfoot = new Cube();
  footfoot.color = [0, 0, 1, 1];
  if (g_normalOn) footfoot.textureNum = -3;
  footfoot.matrix = footF;
  footfoot.matrix.translate(0.8, -0.1, -0.1);
  footfoot.matrix.scale(0.3, 1.2, 1.2);
  footfoot.animalPart = false;
  footfoot.render();

  var foot2 = new Cube();
  foot2.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) foot2.textureNum = -3;
  foot2.matrix = foot2Coordinates;
  foot2.matrix.translate(0.0, 1.8, 0);
  var foot3Coordinates = new Matrix4(foot2.matrix);
  // foot2.matrix.rotate(-g_footanimation, 0, 1, 0);
  foot2.matrix.rotate(-g_magentaAngle/2, 0, 1, 0);
  foot2.matrix.scale(1.9, 1, 1);
  var footF2 = new Matrix4(foot2.matrix);
  foot2.animalPart = false;
  foot2.render();

  var footfoot2 = new Cube();
  footfoot2.color = [0, 0, 1, 1];
  if (g_normalOn) footfoot2.textureNum = -3;
  footfoot2.matrix = footF2;
  footfoot2.matrix.translate(0.8, -0.1, -0.1);
  footfoot2.matrix.scale(0.3, 1.2, 1.2);
  footfoot2.animalPart = false;
  footfoot2.render();

  var foot3 = new Cube();
  foot3.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) foot3.textureNum = -3;
  foot3.matrix = foot3Coordinates;
  foot3.matrix.translate(0.0, 0.0, 2.5);
  var foot4Coordinates = new Matrix4(foot3.matrix);
  // foot3.matrix.rotate(g_footanimation, 0, 1, 0);
  foot3.matrix.rotate(g_magentaAngle/2, 0, 1, 0);
  foot3.matrix.scale(1.9, 1, 1);
  var footF3 = new Matrix4(foot3.matrix);
  foot3.animalPart = false;
  foot3.render();

  var footfoot3 = new Cube();
  footfoot3.color = [0, 0, 1, 1];
  if (g_normalOn) footfoot3.textureNum = -3;
  footfoot3.matrix = footF3;
  footfoot3.matrix.translate(0.8, -0.1, -0.1);
  footfoot3.matrix.scale(0.3, 1.2, 1.2);
  footfoot3.animalPart = false;
  footfoot3.render();

  var foot4 = new Cube();
  foot4.color = [0.98, 0.50, 0.11, 1.0];
  if (g_normalOn) foot4.textureNum = -3;
  foot4.matrix = foot4Coordinates;
  foot4.matrix.translate(0.0, -1.8, 0);
  // foot4.matrix.rotate(-g_footanimation, 0, 1, 0);
  foot4.matrix.rotate(-g_magentaAngle/2, 0, 1, 0);
  foot4.matrix.scale(1.9, 1, 1);
  var footF4 = new Matrix4(foot4.matrix);
  foot4.animalPart = false;
  foot4.render();

  var footfoot4 = new Cube();
  footfoot4.color = [0, 0, 1, 1];
  if (g_normalOn) footfoot4.textureNum = -3;
  footfoot4.matrix = footF4;
  footfoot4.matrix.translate(0.8, -0.1, -0.1);
  footfoot4.matrix.scale(0.3, 1.2, 1.2);
  footfoot4.animalPart = false;
  footfoot4.render();
  
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + "from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

