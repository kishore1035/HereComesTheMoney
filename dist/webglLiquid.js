import { BLUEPRINT_SLOTS } from './canvasBlueprint.js';
export const VERTEX_SHADER = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;
export const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uSize;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform float uReveal;
uniform float uPar;
uniform float uVel;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float edge = uReveal * 1.15;
  if (uv.y > edge) discard;

  float ra = uSize.x / uSize.y;
  float ia = uImg.x / uImg.y;
  vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
  vec2 t = (uv - 0.5) * s;
  float zoom = mix(0.70, 0.90, uReveal) - 0.03 * uHover;
  t *= zoom;
  t.y += uPar * 0.05;

  vec2 d = uv - uMouse;
  d.x *= ra;
  float dist = length(d);
  float wave = sin(dist * 24.0 - uTime * 3.0) * exp(-dist * 4.2) * uHover;
  vec2 dir = d / (dist + 1e-4);
  t += vec2(dir.x / ra, dir.y) * wave * 0.012;
  t -= vec2(d.x / ra, d.y) * exp(-dist * dist * 6.5) * 0.08 * uHover;
  t.x += sin(uv.y * 8.0 + uTime) * 0.003 * abs(uVel);
  t += 0.5;

  // Crisp monochrome blueprint sampling without chromatic aberration
  vec3 c = texture2D(uTex, t).rgb;

  // Subtle interactive wave illumination
  c += vec3(0.08, 0.08, 0.07) * wave;

  float lip = smoothstep(edge - 0.02, edge, uv.y) * step(uReveal, 0.999);
  c = mix(c, vec3(0.93, 0.90, 0.85), lip);
  gl_FragColor = vec4(c, 1.0);
}
`;
export class WebGLLiquidRenderer {
    canvas;
    gl = null;
    prog = null;
    buffer = null;
    uniforms = {
        uTex: null,
        uSize: null,
        uImg: null,
        uMouse: null,
        uHover: null,
        uTime: null,
        uReveal: null,
        uPar: null,
        uVel: null,
    };
    glTexList = [];
    isOk = false;
    constructor(canvas) {
        this.canvas = canvas;
        this.initGL();
    }
    compileShader(type, src) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader)
            throw new Error('Failed to create shader');
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${info}`);
        }
        return shader;
    }
    initGL() {
        const gl = this.canvas.getContext('webgl', {
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
            powerPreference: 'high-performance',
        });
        if (!gl)
            return;
        this.gl = gl;
        try {
            const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
            const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
            const prog = gl.createProgram();
            if (!prog)
                throw new Error('Failed to create program');
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                throw new Error(`Program link error: ${gl.getProgramInfoLog(prog)}`);
            }
            this.prog = prog;
            gl.useProgram(prog);
            this.uniforms = {
                uTex: gl.getUniformLocation(prog, 'uTex'),
                uSize: gl.getUniformLocation(prog, 'uSize'),
                uImg: gl.getUniformLocation(prog, 'uImg'),
                uMouse: gl.getUniformLocation(prog, 'uMouse'),
                uHover: gl.getUniformLocation(prog, 'uHover'),
                uTime: gl.getUniformLocation(prog, 'uTime'),
                uReveal: gl.getUniformLocation(prog, 'uReveal'),
                uPar: gl.getUniformLocation(prog, 'uPar'),
                uVel: gl.getUniformLocation(prog, 'uVel'),
            };
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            this.buffer = buf;
            const pLoc = gl.getAttribLocation(prog, 'p');
            gl.enableVertexAttribArray(pLoc);
            gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
            this.isOk = true;
        }
        catch {
            this.isOk = false;
        }
    }
    loadTextures(canvases) {
        const gl = this.gl;
        if (!gl)
            return [];
        this.glTexList = canvases.map((c) => {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return tex;
        });
        return this.glTexList;
    }
    updateTexture(idx, canvas) {
        const gl = this.gl;
        if (!gl || !this.glTexList[idx])
            return;
        gl.bindTexture(gl.TEXTURE_2D, this.glTexList[idx]);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    }
    render(medias, time, vel, dpr) {
        const gl = this.gl;
        if (!gl || !this.isOk)
            return;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.SCISSOR_TEST);
        const vh = window.innerHeight;
        medias.forEach((m) => {
            if (!m.glTex || m.reveal <= 0.001)
                return;
            const r = m.el.getBoundingClientRect();
            if (r.bottom < -40 || r.top > vh + 40)
                return;
            const sx = Math.round(r.left * dpr);
            const sy = Math.round((vh - r.bottom) * dpr);
            const sw = Math.round(r.width * dpr);
            const sh = Math.round(r.height * dpr);
            gl.viewport(sx, sy, sw, sh);
            gl.scissor(sx, sy, sw, sh);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, m.glTex);
            gl.uniform1i(this.uniforms.uTex, 0);
            gl.uniform2f(this.uniforms.uSize, r.width, r.height);
            const dims = BLUEPRINT_SLOTS[m.tex]?.dimensions || [1000, 1000];
            gl.uniform2f(this.uniforms.uImg, dims[0], dims[1]);
            gl.uniform2f(this.uniforms.uMouse, m.mx, m.my);
            gl.uniform1f(this.uniforms.uHover, m.hover);
            gl.uniform1f(this.uniforms.uTime, time);
            gl.uniform1f(this.uniforms.uReveal, m.reveal);
            const par = (r.top + r.height / 2 - vh / 2) / vh;
            gl.uniform1f(this.uniforms.uPar, par);
            gl.uniform1f(this.uniforms.uVel, vel);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        });
        gl.disable(gl.SCISSOR_TEST);
    }
    destroy() {
        const gl = this.gl;
        if (!gl)
            return;
        this.glTexList.forEach((t) => gl.deleteTexture(t));
        if (this.buffer)
            gl.deleteBuffer(this.buffer);
        if (this.prog)
            gl.deleteProgram(this.prog);
    }
}
