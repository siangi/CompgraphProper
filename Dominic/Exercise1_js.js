"use strict";
//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
/** @type {WebGLRenderingContext} */
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    /** @type {WebGLProgram} */
    shaderProgram: -1,
    // add local parameters for attributes and uniforms here
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    /** @type {WebGLBuffer} */
    buffer: -1,
    /** @type {WebGLBuffer} */
    colorbuffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();

    requestAnimationFrame(draw);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    // add code here to get the ids of attributes and uniform variables from the shaders
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    const vertices = [
        -0.8, 0.8, 0,
        -0.8, -0.8, 0,
        0.8, 0.8, 0,
        0.8, -0.8, 0,
    ];
    const colors = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        1, 1, 0,
    ];
    rectangleObject.buffer = bufferDataToAttribute(new Float32Array(vertices), 3, "vertexPosition", gl.FLOAT);
    rectangleObject.colorbuffer = bufferDataToAttribute(new Float32Array(colors), 3, "vertexColor", gl.FLOAT);
}

/**
 * 
 * @param {BufferSource} data 
 * @param {number} size example: floats per element vec2 => 2
 * @param {string} attribName 
 * @param {number} type
 * @returns {WebGLBuffer}
 */
function bufferDataToAttribute(data, size, attribName, type) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const location = gl.getAttribLocation(ctx.shaderProgram, attribName);
    gl.vertexAttribPointer(location, size, type, false, 0, 0);
    gl.enableVertexAttribArray(location);

    return buffer;
}

/**
 * Draw the scene.
 */
function draw() {
    console.log("Drawing");

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}