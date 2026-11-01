export interface MediaItem {
  el: HTMLElement;
  tex: number;
  hover: number;
  th: number;
  mx: number;
  my: number;
  tmx: number;
  tmy: number;
  reveal: number;
  tr: number;
  glTex: WebGLTexture | null;
}

export interface UniformLocations {
  uTex?: WebGLUniformLocation | null;
  uSize?: WebGLUniformLocation | null;
  uImg?: WebGLUniformLocation | null;
  uMouse?: WebGLUniformLocation | null;
  uHover?: WebGLUniformLocation | null;
  uTime?: WebGLUniformLocation | null;
  uReveal?: WebGLUniformLocation | null;
  uPar?: WebGLUniformLocation | null;
  uVel?: WebGLUniformLocation | null;
}

export type ArtGenerator = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rnd: () => number
) => void;

export type Dimension = [number, number];

export interface LenisInstance {
  raf: (time: number) => void;
  scrollTo: (target: string | number | HTMLElement, options?: { duration?: number; offset?: number }) => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  velocity: number;
}
