precision mediump float;
uniform float u_time;
uniform vec3 u_color;

varying float v_is_hovered;
varying float v_is_selected;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

    vec3 final_color = u_color;
    if (v_is_selected > 0.5) {
        final_color = vec3(0.8, 0.6, 1.0); // A shade of purple for selected
    } else if (v_is_hovered > 0.5) {
        final_color = u_color * 1.5; // Brighter when hovered
    }

    gl_FragColor = vec4(final_color, alpha);
}
