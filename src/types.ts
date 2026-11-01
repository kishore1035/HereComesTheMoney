export type Dimension = [number, number];

export interface BlueprintSlotConfig {
  id: number;
  code: string;
  department: string;
  degree: string;
  dimensions: Dimension;
  aspectRatio: string;
  scheme: 'network' | 'matrix' | 'signal' | 'circuit' | 'vector' | 'truss' | 'graph' | 'facade';
}

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
  uTex: WebGLUniformLocation | null;
  uSize: WebGLUniformLocation | null;
  uImg: WebGLUniformLocation | null;
  uMouse: WebGLUniformLocation | null;
  uHover: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uReveal: WebGLUniformLocation | null;
  uPar: WebGLUniformLocation | null;
  uVel: WebGLUniformLocation | null;
}

export interface LenisInstance {
  raf: (time: number) => void;
  scrollTo: (target: string | number, options?: { duration?: number; offset?: number }) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
  velocity: number;
}
