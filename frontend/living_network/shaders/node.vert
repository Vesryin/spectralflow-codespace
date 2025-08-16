attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float u_time;
uniform float u_size;

void main() {
    vec3 pos = position;
    pos.z += sin(u_time + pos.x * 10.0) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = u_size;
}
