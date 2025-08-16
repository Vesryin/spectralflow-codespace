precision mediump float;
uniform float u_time;
uniform vec3 u_color;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    gl_FragColor = vec4(u_color, alpha);
}
