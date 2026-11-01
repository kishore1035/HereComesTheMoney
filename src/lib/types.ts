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

export interface WebGLUniforms {
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

export interface Programme {
  id: string;
  name: string;
  degree: string;
  code: string;
  since?: string;
  seats?: string;
  tags?: string;
  texIndex: number;
  aspectRatioClass?: string;
  gridClass: string;
}

export interface CampusService {
  num: string;
  title: string;
  desc: string;
  tags: string;
}

export interface NewsItem {
  yearOrDate: string;
  title: string;
  category: string;
  type: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  accent?: boolean;
}
