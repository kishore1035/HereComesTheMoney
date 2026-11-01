import { MediaItem, WebGLUniforms } from './types';
import { TEXTURE_SIZES } from './proceduralArt';

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
  float zoom = mix(0.62, 0.86, uReveal) - 0.05 * uHover;
  t *= zoom;
  t.y += uPar * 0.06;

  vec2 d = uv - uMouse;
  d.x *= ra;
  float dist = length(d);
  float wave = sin(dist * 26.0 - uTime * 3.2) * exp(-dist * 4.5) * uHover;
  vec2 dir = d / (dist + 1e-4);
  t += vec2(dir.x / ra, dir.y) * wave * 0.016;
  t -= vec2(d.x / ra, d.y) * exp(-dist * dist * 7.0) * 0.11 * uHover;
  t.x += sin(uv.y * 10.0 + uTime) * 0.004 * abs(uVel);
  t += 0.5;

  float sh = 0.006 * uHover + min(abs(uVel) * 0.003, 0.01);
  vec3 c;
  c.r = texture2D(uTex, t + vec2(sh, 0.0)).r;
  c.g = texture2D(uTex, t).g;
  c.b = texture2D(uTex, t - vec2(sh, 0.0)).b;

  float lip = smoothstep(edge - 0.02, edge, uv.y) * step(uReveal, 0.999);
  c = mix(c, vec3(0.93, 0.90, 0.85), lip);
  gl_FragColor = vec4(c, 1.0);
}
`;

export class WebGLLiquidRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;
  private uniforms: WebGLUniforms = {
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
  private glTexList: WebGLTexture[] = [];
  public isOk = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private compileShader(type: number, src: string): WebGLShader {
    const gl = this.gl!;
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation error: ${info}`);
    }
    return shader;
  }

  private initGL(): void {
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) {
      console.warn('WebGL not supported');
      this.isOk = false;
      return;
    }
    this.gl = gl;

    try {
      const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

      const prog = gl.createProgram();
      if (!prog) throw new Error('Failed to create WebGL program');
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`WebGL program linking error: ${gl.getShaderInfoLog(prog)}`);
      }

      this.prog = prog;
      gl.useProgram(prog);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      this.buffer = buffer;

      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

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

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.enable(gl.SCISSOR_TEST);
      this.isOk = true;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back:', e);
      this.isOk = false;
    }
  }

  public loadTextures(canvases: HTMLCanvasElement[]): WebGLTexture[] {
    const gl = this.gl;
    if (!gl || !this.isOk) return [];

    this.glTexList = canvases.map((canvas) => {
      const tex = gl.createTexture();
      if (!tex) throw new Error('Failed to create texture');
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        canvas
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    });

    return this.glTexList;
  }

  public updateTexture(index: number, canvas: HTMLCanvasElement): void {
    const gl = this.gl;
    if (!gl || !this.isOk || !this.glTexList[index]) return;
    gl.bindTexture(gl.TEXTURE_2D, this.glTexList[index]);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      canvas
    );
  }

  public render(
    medias: MediaItem[],
    time: number,
    vel: number,
    dpr: number
  ): void {
    const gl = this.gl;
    if (!gl || !this.isOk) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const vh = window.innerHeight;

    gl.viewport(0, 0, w, h);
    gl.scissor(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(this.uniforms.uTime, time);
    gl.uniform1f(this.uniforms.uVel, vel * 0.05);

    for (const m of medias) {
      if (!m.glTex) continue;
      const r = m.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width === 0 || m.reveal < 0.001) {
        continue;
      }

      const vx = Math.round(r.left * dpr);
      const vy = Math.round((vh - r.bottom) * dpr);
      const vw = Math.round(r.width * dpr);
      const vh_box = Math.round(r.height * dpr);

      gl.viewport(vx, vy, vw, vh_box);
      gl.scissor(Math.max(0, vx), Math.max(0, vy), vw, vh_box);

      gl.bindTexture(gl.TEXTURE_2D, m.glTex);
      const imgSize = TEXTURE_SIZES[m.tex] || [1000, 1000];
      gl.uniform2f(this.uniforms.uImg, imgSize[0], imgSize[1]);
      gl.uniform2f(this.uniforms.uSize, r.width, r.height);
      gl.uniform2f(this.uniforms.uMouse, m.mx, m.my);
      gl.uniform1f(this.uniforms.uHover, m.hover);
      gl.uniform1f(this.uniforms.uReveal, m.reveal);
      gl.uniform1f(
        this.uniforms.uPar,
        (r.top + r.height / 2 - vh / 2) / vh
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  public destroy(): void {
    const gl = this.gl;
    if (!gl) return;
    this.glTexList.forEach((t) => gl.deleteTexture(t));
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.prog) gl.deleteProgram(this.prog);
    this.isOk = false;
  }
}
