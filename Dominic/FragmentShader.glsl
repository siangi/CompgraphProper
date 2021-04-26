precision mediump float;

varying vec3 pixelColor;

void main() {
    gl_FragColor = vec4(pixelColor, 1);
}