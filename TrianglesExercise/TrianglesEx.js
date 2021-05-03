window.onload = startup;

/** @type {WebGLRenderingContext} */
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexTextureCoordId: -1,
    uSamplerId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1,
    textureBuffer: -1
};

var jokerCard = {
    textureObject0 : {}
};

function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0.8, 0.8, 0.8, 1);
}

function initTexture(image, textureObject){
    gl.bindTexture(gl.TEXTURE_2D, textureObject);  
    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    // turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null); 
}

function loadTexture() {
    var image = new Image();
    // create a texture object
    jokerCard.textureObject0 = gl.createTexture();
    image.onload = function() {
        initTexture(image, jokerCard.textureObject0);
        // make sure there is a redraw after the loading of the texture
        draw();
    };
    // setting the src will trigger onload
    image.src = "jokercard.png";
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");    
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, 0.5,
        -1, -0.5,
        0.0, -0.5,
        0.1, -0.5,
        1, -0.5,
        0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // create the texture coordinates for the object
    var textureCoord = [
        -0.5, 0.5,
        -1, -0.5,
        0.0, -0.5,
        0.1, -0.5,
        1, -0.5,
        0.5, 0.5
    ];
    rectangleObject.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);

    // position
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0 /* stride in bytes */, 0 /* offset */);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // color
    // gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 256, 8);
    // gl.enableVertexAttribArray(ctx.aVertexColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // enable texture coordinates from the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    // enable the texture mapping
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, jokerCard.textureObject0);
    gl.uniform1i(ctx.uSamplerId, 0);

    gl.uniform4f(ctx.uColorId, 1, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
