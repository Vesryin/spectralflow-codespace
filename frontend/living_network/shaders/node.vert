attribute vec3 position;
attribute float a_index;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float u_time;
uniform float u_size;
uniform float u_hovered;
uniform float u_selected;

varying float v_is_hovered;
varying float v_is_selected;

void main() {
    v_is_hovered = step(u_hovered - 0.1, a_index) - step(u_hovered + 0.1, a_index);
    v_is_selected = step(u_selected - 0.1, a_index) - step(u_selected + 0.1, a_index);

    vec3 pos = position;
    pos.z += sin(u_time + pos.x * 10.0) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = u_size;
}
