precision mediump float;
varying vec4 color;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    //gl_FragColor = vColor;
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}