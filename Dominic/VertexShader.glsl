attribute vec3 vertexPosition;
attribute vec3 vertexColor;

varying vec3 pixelColor;

void main(void) {
   pixelColor = vertexColor;
   gl_Position = vec4(vertexPosition, 1.0);
}