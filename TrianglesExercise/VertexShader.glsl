attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) {
   gl_Position = vec4(aVertexPosition, 0.0, 1.0);
   // vColor = aVertexColor;
   vTextureCoord = aVertexTextureCoord;
}