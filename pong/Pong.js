//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId:-1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

// game state and variables
var game = {
    leftPaddleY: 0,
    rightPaddleY: 0,
    ballPos: [0, 0]
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up the world coordinates
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

    drawMiddleLine();
    drawPaddles();
    drawBall();
}

function drawSquare() {
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawPaddles(){
    var modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [-380, game.leftPaddleY]);
    mat3.scale(modelMat, modelMat, [10, 100]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    drawSquare();

    var modelMat2 = mat3.create();
    mat3.translate(modelMat2, modelMat2, [380, game.rightPaddleY]);
    mat3.scale(modelMat2, modelMat2, [10, 100]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat2);
    drawSquare();

}

function drawBall(){
    var modelMat3 = mat3.create();
    mat3.translate(modelMat3, modelMat3, game.ballPos);
    mat3.scale(modelMat3, modelMat3, [5, 5]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat3);
    drawSquare();
}


function drawMiddleLine() {
    var modelMat = mat3.create();

    mat3.scale(modelMat, modelMat, [2, gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    drawSquare();
}


// animation
var first = true;
var lastTimeStamp = 0;

function drawAnimated(timeStamp) {
    if (first) {
        lastTimeStamp = timeStamp;
        first = false;
    } else {
        var timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;

        if(key._pressed[key.UP] == true){
            game.leftPaddleY = game.leftPaddleY + 5;
        } else if (key._pressed[key.DOWN] == true){
            game.leftPaddleY = game.leftPaddleY - 5;
        }
    }
    draw();
    window.requestAnimationFrame(drawAnimated);
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
