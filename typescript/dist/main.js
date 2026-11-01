(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const lerp = (a, b, t) => a + (b - a) * t;
    /* ---------- grain texture ---------- */
    const nc = document.createElement('canvas');
    nc.width = nc.height = 160;
    const noiseCtx = nc.getContext('2d');
    if (noiseCtx) {
        const d = noiseCtx.createImageData(160, 160);
        for (let i = 0; i < d.data.length; i += 4) {
            const v = Math.random() * 255;
            d.data[i] = v;
            d.data[i + 1] = v;
            d.data[i + 2] = v;
            d.data[i + 3] = 255;
        }
        noiseCtx.putImageData(d, 0, 0);
    }
    document.documentElement.style.setProperty('--noise', `url(${nc.toDataURL()})`);
    /* ---------- procedural artworks ---------- */
    let W = 1000;
    let H = 1250;
    const SIZES = [
        [2000, 1050],
        [1400, 1050],
        [1000, 1250],
        [1150, 1150],
        [1000, 1250],
        [1400, 1000],
        [1000, 1250],
        [1000, 1300],
    ];
    const rnd = ((s) => () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
    })(7);
    function grainOver(x) {
        x.save();
        x.globalAlpha = 0.12;
        x.globalCompositeOperation = 'overlay';
        const pattern = x.createPattern(nc, 'repeat');
        if (pattern) {
            x.fillStyle = pattern;
            x.fillRect(0, 0, W, H);
        }
        x.restore();
    }
    function vignette(x, a = 0.55) {
        const g = x.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.8);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(0,0,0,${a})`);
        x.fillStyle = g;
        x.fillRect(0, 0, W, H);
    }
    const arts = [
        // 0 AI & DS — neural constellation
        (x) => {
            let g = x.createLinearGradient(0, 0, W, H);
            g.addColorStop(0, '#0a0f1c');
            g.addColorStop(1, '#1c1430');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            const layers = [5, 9, 12, 9, 4];
            const pts = [];
            layers.forEach((n, l) => {
                const lx = W * (0.18 + l * 0.16);
                for (let i = 0; i < n; i++)
                    pts.push([lx, H * (0.5 + (i - (n - 1) / 2) * (0.7 / Math.max(...layers))), l]);
            });
            x.lineWidth = 1;
            pts.forEach((a) => pts.forEach((b) => {
                if (b[2] === a[2] + 1 && rnd() < 0.55) {
                    x.strokeStyle = `rgba(${rnd() < 0.15 ? '200,85,61' : '237,230,216'},${0.08 + rnd() * 0.25})`;
                    x.beginPath();
                    x.moveTo(a[0], a[1]);
                    x.lineTo(b[0], b[1]);
                    x.stroke();
                }
            }));
            pts.forEach(([px, py], i) => {
                g = x.createRadialGradient(px, py, 0, px, py, 40);
                g.addColorStop(0, 'rgba(200,85,61,.5)');
                g.addColorStop(1, 'rgba(200,85,61,0)');
                x.fillStyle = g;
                x.fillRect(px - 40, py - 40, 80, 80);
                x.fillStyle = i % 7 ? '#ede6d8' : '#c8553d';
                x.beginPath();
                x.arc(px, py, i % 7 ? 6 : 10, 0, 7);
                x.fill();
            });
            for (let i = 0; i < 400; i++) {
                x.fillStyle = `rgba(237,230,216,${rnd() * 0.35})`;
                x.fillRect(rnd() * W, rnd() * H, 1.5, 1.5);
            }
            x.fillStyle = 'rgba(237,230,216,.5)';
            x.font = '22px "JetBrains Mono", monospace';
            x.fillText('y = σ(Wx + b)', W * 0.06, H * 0.92);
            vignette(x, 0.5);
        },
        // 1 CSE — code glyph field
        (x) => {
            x.fillStyle = '#0f1210';
            x.fillRect(0, 0, W, H);
            const glyphs = '{}[]()<>/=;01λ#*+&|'.split('');
            x.font = '26px "JetBrains Mono", monospace';
            for (let r = 0; r < H / 34; r++) {
                for (let c = 0; c < W / 22; c++) {
                    const d = Math.hypot(c * 22 - W * 0.62, r * 34 - H * 0.48) / W;
                    if (rnd() < 0.6 - d * 0.4) {
                        x.fillStyle = `rgba(${d < 0.18 ? '200,85,61' : '237,230,216'},${Math.max(0.05, 0.6 - d)})`;
                        x.fillText(glyphs[Math.floor(rnd() * glyphs.length)], c * 22, r * 34);
                    }
                }
            }
            x.fillStyle = '#ede6d8';
            x.font = 'italic 360px "Instrument Serif", serif';
            x.fillText('{ }', W * 0.08, H * 0.7);
            vignette(x, 0.5);
        },
        // 2 ECE — waveforms
        (x) => {
            x.fillStyle = '#071612';
            x.fillRect(0, 0, W, H);
            x.strokeStyle = 'rgba(120,200,170,.12)';
            x.lineWidth = 1;
            for (let i = 0; i < W; i += 50) {
                x.beginPath();
                x.moveTo(i, 0);
                x.lineTo(i, H);
                x.stroke();
            }
            for (let i = 0; i < H; i += 50) {
                x.beginPath();
                x.moveTo(0, i);
                x.lineTo(W, i);
                x.stroke();
            }
            const waves = [
                [0.3, '#ede6d8', 0.012, 90],
                [0.5, '#c8553d', 0.03, 60],
                [0.7, '#7fd1b0', 0.007, 140],
            ];
            waves.forEach(([y, c, f, a], k) => {
                x.strokeStyle = c;
                x.lineWidth = 4;
                x.shadowColor = c;
                x.shadowBlur = 24;
                x.beginPath();
                for (let i = 0; i <= W; i += 4) {
                    const v = k === 1
                        ? (Math.sin(i * f) > 0 ? 1 : -1) * a * 0.6
                        : Math.sin(i * f) * a * Math.exp(-Math.pow((i - W / 2) / W, 2) * 2);
                    if (i !== 0)
                        x.lineTo(i, H * y + v);
                    else
                        x.moveTo(i, H * y + v);
                }
                x.stroke();
            });
            x.shadowBlur = 0;
            x.fillStyle = 'rgba(237,230,216,.5)';
            x.font = '20px "JetBrains Mono", monospace';
            x.fillText('CH1 2V/div   CH2 50mV/div', W * 0.06, H * 0.95);
            vignette(x, 0.45);
        },
        // 3 EEE — coil + arc
        (x) => {
            let g = x.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, '#1a1408');
            g.addColorStop(1, '#3b2a0c');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            const cx = W * 0.5;
            for (let i = 0; i < 26; i++) {
                const y = H * 0.22 + i * H * 0.022;
                x.strokeStyle = `rgba(214,150,70,${0.5 + 0.5 * Math.sin(i * 0.4)})`;
                x.lineWidth = 7;
                x.beginPath();
                x.ellipse(cx, y, W * 0.22, H * 0.03, 0, 0, Math.PI);
                x.stroke();
            }
            x.fillStyle = '#2b2318';
            x.fillRect(cx - W * 0.04, H * 0.15, W * 0.08, H * 0.66);
            x.save();
            x.globalCompositeOperation = 'lighter';
            x.strokeStyle = 'rgba(180,200,255,.9)';
            x.shadowColor = '#9fb4ff';
            x.shadowBlur = 40;
            x.lineWidth = 3;
            for (let k = 0; k < 3; k++) {
                let px = cx, py = H * 0.13;
                x.beginPath();
                x.moveTo(px, py);
                while (py > 0) {
                    px += (rnd() - 0.5) * 90;
                    py -= 30 + rnd() * 30;
                    x.lineTo(px, py);
                }
                x.stroke();
            }
            x.restore();
            g = x.createRadialGradient(cx, H * 0.13, 0, cx, H * 0.13, W * 0.4);
            g.addColorStop(0, 'rgba(160,180,255,.5)');
            g.addColorStop(1, 'rgba(160,180,255,0)');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            vignette(x, 0.5);
        },
        // 4 Mech — gears
        (x) => {
            x.fillStyle = '#18191b';
            x.fillRect(0, 0, W, H);
            const gear = (cx, cy, r, teeth, col, rot) => {
                x.fillStyle = col;
                x.beginPath();
                for (let i = 0; i < teeth * 2; i++) {
                    const a = rot + (i * Math.PI) / teeth, rr = i % 2 ? r : r * 1.12;
                    x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
                }
                x.closePath();
                x.fill();
                x.fillStyle = '#18191b';
                x.beginPath();
                x.arc(cx, cy, r * 0.28, 0, 7);
                x.fill();
                x.strokeStyle = 'rgba(0,0,0,.4)';
                x.lineWidth = r * 0.08;
                x.beginPath();
                x.arc(cx, cy, r * 0.7, 0, 7);
                x.stroke();
            };
            gear(W * 0.38, H * 0.45, W * 0.26, 18, '#9a9690', 0);
            gear(W * 0.78, H * 0.78, W * 0.17, 12, '#c8553d', 0.2);
            gear(W * 0.8, H * 0.2, W * 0.12, 10, '#5d5a55', 0.1);
            const g = x.createLinearGradient(0, 0, W, H);
            g.addColorStop(0, 'rgba(255,255,255,.12)');
            g.addColorStop(1, 'rgba(0,0,0,.3)');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            vignette(x, 0.5);
        },
        // 5 Civil — bridge arches
        (x) => {
            let g = x.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, '#cdb79a');
            g.addColorStop(0.55, '#8a6f58');
            g.addColorStop(0.6, '#2a2420');
            g.addColorStop(1, '#14110f');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            const deck = H * 0.42, base = H * 0.6, n = 4, span = W / n;
            x.fillStyle = '#2b2521';
            x.fillRect(0, deck - 24, W, 24);
            for (let i = 0; i < n; i++) {
                const ax = i * span;
                x.beginPath();
                x.moveTo(ax, base);
                x.lineTo(ax, deck);
                x.lineTo(ax + span, deck);
                x.lineTo(ax + span, base);
                x.lineTo(ax + span - span * 0.08, base);
                x.quadraticCurveTo(ax + span / 2, deck - H * 0.02, ax + span * 0.08, base);
                x.closePath();
                x.fill();
            }
            x.save();
            x.globalAlpha = 0.35;
            x.scale(1, -1);
            x.translate(0, -base * 2);
            for (let i = 0; i < n; i++) {
                const ax = i * span;
                x.beginPath();
                x.moveTo(ax, base);
                x.lineTo(ax, deck);
                x.lineTo(ax + span, deck);
                x.lineTo(ax + span, base);
                x.lineTo(ax + span - span * 0.08, base);
                x.quadraticCurveTo(ax + span / 2, deck - H * 0.02, ax + span * 0.08, base);
                x.closePath();
                x.fill();
            }
            x.restore();
            x.strokeStyle = 'rgba(237,230,216,.2)';
            for (let i = 0; i < 30; i++) {
                const y = base + 10 + i * i * 0.5;
                x.beginPath();
                x.moveTo(rnd() * W * 0.3, y);
                x.lineTo(W * 0.4 + rnd() * W * 0.6, y);
                x.stroke();
            }
            vignette(x, 0.4);
        },
        // 6 IT — network globe
        (x) => {
            let g = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.7);
            g.addColorStop(0, '#14202c');
            g.addColorStop(1, '#06090d');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            const cx = W / 2, cy = H * 0.48, r = W * 0.36;
            x.strokeStyle = 'rgba(237,230,216,.25)';
            x.lineWidth = 1.5;
            for (let i = 1; i < 8; i++) {
                x.beginPath();
                x.ellipse(cx, cy, r * Math.sin((i * Math.PI) / 8), r, 0, 0, 7);
                x.stroke();
                x.beginPath();
                x.ellipse(cx, cy, r, r * Math.sin((i * Math.PI) / 8) * 0.3 + 0, 0, 0, 7);
                x.stroke();
            }
            for (let i = -3; i <= 3; i++) {
                const yy = cy + (i * r) / 4, rr = Math.sqrt(Math.max(0, r * r - Math.pow((i * r) / 4, 2)));
                x.beginPath();
                x.ellipse(cx, yy, rr, rr * 0.12, 0, 0, 7);
                x.stroke();
            }
            const nodes = Array.from({ length: 18 }, () => {
                const a = rnd() * 7, b = (rnd() - 0.5) * 2.6;
                return [cx + Math.cos(a) * r * Math.cos(b / 2) * 0.95, cy + Math.sin(b / 2) * r * 0.95];
            });
            x.strokeStyle = 'rgba(200,85,61,.7)';
            x.lineWidth = 2;
            for (let i = 0; i < 14; i++) {
                const a = nodes[i], b = nodes[(i * 5 + 3) % 18];
                x.beginPath();
                x.moveTo(a[0], a[1]);
                x.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 120, b[0], b[1]);
                x.stroke();
            }
            nodes.forEach(([px, py]) => {
                x.fillStyle = '#ede6d8';
                x.beginPath();
                x.arc(px, py, 5, 0, 7);
                x.fill();
            });
            vignette(x, 0.4);
        },
        // 7 Hero — arched facade at dusk
        (x) => {
            let g = x.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, '#1b1d3a');
            g.addColorStop(0.6, '#b0603e');
            g.addColorStop(1, '#e2a66b');
            x.fillStyle = g;
            x.fillRect(0, 0, W, H);
            const top = H * 0.3;
            x.fillStyle = '#1a1512';
            x.fillRect(0, top, W, H - top);
            const cols = 4, cw = W / cols;
            for (let row = 0; row < 3; row++)
                for (let c = 0; c < cols; c++) {
                    const ax = c * cw + cw * 0.18, aw = cw * 0.64, ay = top + H * 0.06 + row * H * 0.22, ah = H * 0.16;
                    g = x.createLinearGradient(0, ay, 0, ay + ah);
                    g.addColorStop(0, '#f2c58a');
                    g.addColorStop(1, '#d07d47');
                    x.fillStyle = (row + c) % 3 ? g : '#3a2a20';
                    x.beginPath();
                    x.moveTo(ax, ay + ah);
                    x.lineTo(ax, ay + aw / 2);
                    x.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0);
                    x.lineTo(ax + aw, ay + ah);
                    x.closePath();
                    x.fill();
                }
            x.fillStyle = 'rgba(0,0,0,.35)';
            x.fillRect(0, top, W, 8);
            vignette(x, 0.5);
        },
    ];
    const textures = arts.map((fn, i) => {
        [W, H] = SIZES[i];
        const c = document.createElement('canvas');
        c.width = W;
        c.height = H;
        const x = c.getContext('2d');
        if (x) {
            fn(x, W, H, rnd);
            grainOver(x);
        }
        return c;
    });
    /* ---------- WebGL liquid distortion ---------- */
    const canvas = $('#gl');
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    const medias = $$('.media').map((el) => ({
        el,
        tex: +(el.dataset.tex || 0),
        hover: 0,
        th: 0,
        mx: 0.5,
        my: 0.5,
        tmx: 0.5,
        tmy: 0.5,
        reveal: reduce ? 1 : 0,
        tr: reduce ? 1 : 0,
        glTex: null,
    }));
    let glOk = !!gl;
    const VS = `attribute vec2 p; varying vec2 vUv; void main(){ vUv=p*.5+.5; gl_Position=vec4(p,0.,1.); }`;
    const FS = `precision highp float;
uniform sampler2D uTex; uniform vec2 uSize, uImg, uMouse; uniform float uHover, uTime, uReveal, uPar, uVel;
varying vec2 vUv;
void main(){
  vec2 uv = vUv;
  float edge = uReveal*1.15;
  if(uv.y > edge) discard;
  float ra = uSize.x/uSize.y, ia = uImg.x/uImg.y;
  vec2 s = ra > ia ? vec2(1., ia/ra) : vec2(ra/ia, 1.);
  vec2 t = (uv - .5) * s;
  float zoom = mix(.62, .86, uReveal) - .05*uHover;
  t *= zoom;
  t.y += uPar * .06;
  vec2 d = uv - uMouse; d.x *= ra;
  float dist = length(d);
  float wave = sin(dist*26. - uTime*3.2) * exp(-dist*4.5) * uHover;
  vec2 dir = d / (dist + 1e-4);
  t += vec2(dir.x/ra, dir.y) * wave * .016;
  t -= vec2(d.x/ra, d.y) * exp(-dist*dist*7.) * .11 * uHover;
  t.x += sin(uv.y*10. + uTime) * .004 * abs(uVel);
  t += .5;
  float sh = .006*uHover + min(abs(uVel)*.003,.01);
  vec3 c;
  c.r = texture2D(uTex, t + vec2(sh, 0.)).r;
  c.g = texture2D(uTex, t).g;
  c.b = texture2D(uTex, t - vec2(sh, 0.)).b;
  float lip = smoothstep(edge-.02, edge, uv.y) * step(uReveal, .999);
  c = mix(c, vec3(.93,.9,.85), lip);
  gl_FragColor = vec4(c, 1.);
}`;
    let prog = null;
    const U = {};
    let glTex = [];
    if (glOk && gl) {
        try {
            const sh = (t, src) => {
                const s = gl.createShader(t);
                if (!s)
                    throw new Error('Cannot create shader');
                gl.shaderSource(s, src);
                gl.compileShader(s);
                if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
                    throw gl.getShaderInfoLog(s);
                return s;
            };
            prog = gl.createProgram();
            if (!prog)
                throw new Error('Cannot create program');
            gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
            gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
                throw 'link error';
            gl.useProgram(prog);
            const b = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, b);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            const loc = gl.getAttribLocation(prog, 'p');
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
            const uniformNames = [
                'uTex',
                'uSize',
                'uImg',
                'uMouse',
                'uHover',
                'uTime',
                'uReveal',
                'uPar',
                'uVel',
            ];
            uniformNames.forEach((n) => {
                U[n] = gl.getUniformLocation(prog, n);
            });
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            glTex = textures.map((c) => {
                const t = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, t);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return t;
            });
            medias.forEach((m) => (m.glTex = glTex[m.tex]));
            gl.enable(gl.SCISSOR_TEST);
        }
        catch (e) {
            console.warn('WebGL disabled:', e);
            glOk = false;
        }
    }
    if (!glOk) {
        medias.forEach((m) => {
            m.el.style.backgroundImage = `url(${textures[m.tex].toDataURL('image/jpeg', 0.85)})`;
        });
    }
    medias.forEach((m) => {
        const host = m.el.closest('.card') || m.el;
        host.addEventListener('pointerenter', () => (m.th = 1));
        host.addEventListener('pointerleave', () => (m.th = 0));
        m.el.addEventListener('pointermove', (e) => {
            const r = m.el.getBoundingClientRect();
            m.tmx = (e.clientX - r.left) / r.width;
            m.tmy = 1 - (e.clientY - r.top) / r.height;
        });
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) {
            const m = medias.find((item) => item.el === e.target);
            if (m)
                m.tr = 1;
            else
                e.target.classList.add('in');
            io.unobserve(e.target);
        }
    }), { threshold: 0.18 });
    medias.forEach((m) => io.observe(m.el));
    $$('.fade').forEach((el) => io.observe(el));
    let dpr = 1;
    function resize() {
        dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
    }
    resize();
    addEventListener('resize', resize);
    /* ---------- kinetic type: split chars ---------- */
    $$('.hero h1 .ln').forEach((ln) => {
        let i = 0;
        const parentChildren = ln.parentNode ? Array.from(ln.parentNode.children) : [];
        const lineIndex = parentChildren.indexOf(ln);
        ln.innerHTML = ln.textContent
            .split('')
            .map((c) => c === ' '
            ? ' '
            : `<span class="ch" style="transition-delay:${(0.15 + i++ * 0.035 + lineIndex * 0.12).toFixed(3)}s">${c}</span>`)
            .join('');
    });
    // words for scroll reveal
    const rw = $('.reveal-words');
    let words = [];
    if (rw) {
        rw.innerHTML = rw.innerHTML.replace(/(<em>.*?<\/em>)|([^\s<>]+)/g, (m) => `<span class="w">${m}</span>`);
        words = $$('.w', rw);
        if (reduce)
            words.forEach((w) => w.classList.add('on'));
    }
    /* ---------- smooth scroll ---------- */
    let lenis = null;
    if (!reduce && window.Lenis) {
        lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    }
    const scrollTo0 = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    const scrollTo = (t) => {
        if (lenis) {
            lenis.scrollTo(t, { duration: 1.6, offset: t === 0 ? 0 : -20 });
        }
        else {
            if (t === 0 || t === '#top')
                scrollTo0();
            else {
                const el = $(t);
                el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }
        }
    };
    /* ---------- menu ---------- */
    const btn = $('.menu-btn');
    const setMenu = (open) => {
        document.body.classList.toggle('menu-open', open);
        if (btn) {
            btn.setAttribute('aria-expanded', String(open));
            if (btn.firstChild)
                btn.firstChild.textContent = open ? 'Close ' : 'Menu ';
        }
        if (lenis) {
            if (open)
                lenis.stop();
            else
                lenis.start();
        }
    };
    if (btn) {
        btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    }
    addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            setMenu(false);
    });
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        e.preventDefault();
        setMenu(false);
        const h = a.getAttribute('href');
        scrollTo(h === '#top' ? 0 : h);
        $$('.nav ul a').forEach((n) => n.classList.toggle('cur', n.getAttribute('href') === h));
    }));
    const toTopBtn = $('#totop');
    if (toTopBtn) {
        toTopBtn.addEventListener('click', () => scrollTo(0));
    }
    /* ---------- clock ---------- */
    const clock = $('#clock');
    const tick = () => {
        try {
            if (clock) {
                clock.textContent =
                    'Chennai ' +
                        new Intl.DateTimeFormat('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Kolkata',
                        }).format(new Date());
            }
        }
        catch { }
    };
    tick();
    setInterval(tick, 20000);
    /* ---------- cursor ---------- */
    const cur = $('.cursor');
    const curLabel = $('b', cur);
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
        cur.classList.add('on');
    });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('on'));
    $$('[data-cursor]').forEach((el) => {
        el.addEventListener('pointerenter', () => {
            curLabel.textContent = el.dataset.cursor || '';
            cur.classList.add('big');
        });
        el.addEventListener('pointerleave', () => cur.classList.remove('big'));
    });
    /* ---------- loop ---------- */
    const speeds = $$('[data-speed]');
    const marquee = $('.marquee .track');
    let mx = 0, lastY = scrollY, vel = 0, start = performance.now();
    function frame(now) {
        if (lenis)
            lenis.raf(now);
        const y = scrollY, vh = innerHeight;
        const rawV = lenis ? lenis.velocity : y - lastY;
        lastY = y;
        vel = lerp(vel, Math.max(-60, Math.min(60, rawV)), 0.12);
        // cursor
        cx = lerp(cx, tx, 0.2);
        cy = lerp(cy, ty, 0.2);
        cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        if (!reduce) {
            // parallax
            speeds.forEach((el) => {
                const parent = el.parentElement;
                if (!parent)
                    return;
                const r = parent.getBoundingClientRect();
                const c = r.top + r.height / 2 - vh / 2;
                el.style.transform = `translate3d(0,${(-c * +el.dataset.speed).toFixed(2)}px,0)`;
            });
            // marquee: drift + scroll velocity
            if (marquee) {
                mx -= 0.5 + Math.abs(vel) * 0.35;
                const half = marquee.scrollWidth / 2;
                if (-mx > half)
                    mx += half;
                marquee.style.transform = `translate3d(${mx}px,0,0) skewX(${(-vel * 0.25).toFixed(2)}deg)`;
            }
            // word reveal
            if (rw && words.length > 0) {
                const r = rw.getBoundingClientRect();
                const p = (vh * 0.82 - r.top) / (r.height + vh * 0.25);
                const n = Math.floor(Math.max(0, Math.min(1, p)) * words.length * 1.05);
                words.forEach((w, i) => w.classList.toggle('on', i < n));
            }
        }
        // GL
        if (glOk && gl) {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.scissor(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const t = (now - start) / 1000;
            if (U.uTime)
                gl.uniform1f(U.uTime, t);
            if (U.uVel)
                gl.uniform1f(U.uVel, vel * 0.05);
            for (const m of medias) {
                if (!m.glTex)
                    continue;
                const r = m.el.getBoundingClientRect();
                m.hover = lerp(m.hover, m.th, 0.06);
                m.mx = lerp(m.mx, m.tmx, 0.1);
                m.my = lerp(m.my, m.tmy, 0.1);
                m.reveal = lerp(m.reveal, m.tr, 0.028);
                if (m.tr === 1 && m.reveal > 0.999)
                    m.reveal = 1;
                if (r.bottom < 0 || r.top > vh || r.width === 0 || m.reveal < 0.001)
                    continue;
                const vx = Math.round(r.left * dpr);
                const yb = Math.round((vh - r.bottom) * dpr);
                const w = Math.round(r.width * dpr);
                const h = Math.round(r.height * dpr);
                gl.viewport(vx, yb, w, h);
                gl.scissor(Math.max(0, vx), Math.max(0, yb), w, h);
                gl.bindTexture(gl.TEXTURE_2D, m.glTex);
                if (U.uImg)
                    gl.uniform2f(U.uImg, SIZES[m.tex][0], SIZES[m.tex][1]);
                if (U.uSize)
                    gl.uniform2f(U.uSize, r.width, r.height);
                if (U.uMouse)
                    gl.uniform2f(U.uMouse, m.mx, m.my);
                if (U.uHover)
                    gl.uniform1f(U.uHover, m.hover);
                if (U.uReveal)
                    gl.uniform1f(U.uReveal, m.reveal);
                if (U.uPar)
                    gl.uniform1f(U.uPar, (r.top + r.height / 2 - vh / 2) / vh);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    const go = () => {
        // redraw artworks now that display fonts are available, then re-upload
        arts.forEach((fn, i) => {
            [W, H] = SIZES[i];
            const x = textures[i].getContext('2d');
            if (x) {
                x.clearRect(0, 0, W, H);
                fn(x, W, H, rnd);
                grainOver(x);
            }
            if (glOk && gl) {
                gl.bindTexture(gl.TEXTURE_2D, glTex[i]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[i]);
            }
        });
        requestAnimationFrame(() => document.body.classList.add('loaded'));
    };
    if (document.fonts && document.fonts.ready) {
        Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(go);
    }
    else {
        go();
    }
})();
export {};
