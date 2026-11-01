import { createNoiseCanvas, generateBlueprintCanvases } from './canvasBlueprint.js';
import { WebGLLiquidRenderer } from './webglLiquid.js';
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = (a, b, t) => a + (b - a) * t;
    const canvas = document.querySelector('#gl');
    if (!canvas)
        return;
    // 1. Noise grain texture setup
    const noiseCanvas = createNoiseCanvas();
    const noiseUrl = noiseCanvas.toDataURL();
    document.documentElement.style.setProperty('--noise', `url(${noiseUrl})`);
    // 2. Procedural CAD blueprint canvases
    const textureCanvases = generateBlueprintCanvases(noiseCanvas);
    // 3. WebGL renderer setup
    const renderer = new WebGLLiquidRenderer(canvas);
    let glTexList = [];
    if (renderer.isOk) {
        glTexList = renderer.loadTextures(textureCanvases);
    }
    // 4. Media elements mapping
    const mediaElements = Array.from(document.querySelectorAll('.media'));
    const medias = mediaElements.map((el) => {
        const tex = +(el.dataset.tex || 0);
        return {
            el,
            tex,
            hover: 0,
            th: 0,
            mx: 0.5,
            my: 0.5,
            tmx: 0.5,
            tmy: 0.5,
            reveal: reduce ? 1 : 0,
            tr: reduce ? 1 : 0,
            glTex: renderer.isOk ? glTexList[tex] || null : null,
        };
    });
    // Fallback if WebGL unavailable
    if (!renderer.isOk) {
        medias.forEach((m) => {
            if (textureCanvases[m.tex]) {
                m.el.style.backgroundImage = `url(${textureCanvases[m.tex].toDataURL('image/jpeg', 0.85)})`;
                m.el.style.backgroundSize = 'cover';
                m.el.style.backgroundPosition = 'center';
            }
        });
    }
    // Pointer events on cards/media
    medias.forEach((m) => {
        const host = m.el.closest('.card') || m.el;
        const onEnter = () => {
            m.th = 1;
        };
        const onLeave = () => {
            m.th = 0;
        };
        const onMove = (e) => {
            const r = m.el.getBoundingClientRect();
            m.tmx = (e.clientX - r.left) / r.width;
            m.tmy = 1 - (e.clientY - r.top) / r.height;
        };
        host.addEventListener('pointerenter', onEnter);
        host.addEventListener('pointerleave', onLeave);
        m.el.addEventListener('pointermove', onMove);
    });
    // 5. IntersectionObserver for fade & media reveal
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const m = medias.find((item) => item.el === e.target);
                if (m) {
                    m.tr = 1;
                }
                else {
                    e.target.classList.add('in');
                }
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    medias.forEach((m) => io.observe(m.el));
    document.querySelectorAll('.fade').forEach((el) => io.observe(el));
    // 6. Viewport resize & devicePixelRatio
    let dpr = 1;
    const handleResize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    // 7. Smooth scrolling with Lenis
    let lenis = null;
    if (!reduce && window.Lenis) {
        lenis = new window.Lenis({
            lerp: 0.085,
            smoothWheel: true,
            wheelMultiplier: 0.95,
        });
    }
    const scrollTo = (t) => {
        if (lenis) {
            lenis.scrollTo(t, { duration: 1.5, offset: t === 0 ? 0 : -20 });
        }
        else {
            if (t === 0 || t === '#top') {
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            }
            else if (typeof t === 'string') {
                const targetEl = document.querySelector(t);
                targetEl?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }
        }
    };
    // 8. Navigation & Overlay Menu
    const menuBtn = document.querySelector('.menu-btn');
    const overlay = document.querySelector('#overlay');
    const toggleMenu = () => {
        const isOpen = document.body.classList.toggle('menu-open');
        menuBtn?.setAttribute('aria-expanded', String(isOpen));
        if (lenis) {
            if (isOpen)
                lenis.stop();
            else
                lenis.start();
        }
    };
    const closeMenu = () => {
        document.body.classList.remove('menu-open');
        menuBtn?.setAttribute('aria-expanded', 'false');
        if (lenis)
            lenis.start();
    };
    menuBtn?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav ul a, .overlay a').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeMenu();
                scrollTo(href === '#top' ? 0 : href);
            }
        });
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            closeMenu();
    });
    // 9. Back to top button
    const toTopBtn = document.querySelector('#totop');
    toTopBtn?.addEventListener('click', () => scrollTo(0));
    // 10. Live Bengaluru IST Clock
    const clockEl = document.querySelector('#clock');
    const updateClock = () => {
        if (!clockEl)
            return;
        try {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            clockEl.textContent = `Bengaluru — ${timeStr} IST`;
        }
        catch {
            clockEl.textContent = 'Bengaluru — IST';
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
    // 11. Custom Cursor with Touch Guard
    const cursor = document.querySelector('.cursor');
    if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
        let cx = -100;
        let cy = -100;
        let tx = -100;
        let ty = -100;
        window.addEventListener('pointermove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });
        const updateCursor = () => {
            cx = lerp(cx, tx, 0.2);
            cy = lerp(cy, ty, 0.2);
            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            requestAnimationFrame(updateCursor);
        };
        requestAnimationFrame(updateCursor);
        document.querySelectorAll('[data-cursor]').forEach((el) => {
            const label = el.dataset.cursor || 'View';
            el.addEventListener('pointerenter', () => {
                cursor.classList.add('active');
                const b = cursor.querySelector('b');
                if (b)
                    b.textContent = label;
            });
            el.addEventListener('pointerleave', () => {
                cursor.classList.remove('active');
            });
        });
    }
    // 12. Frame Render Loop
    const speedElements = Array.from(document.querySelectorAll('[data-speed]'));
    const marqueeTrack = document.querySelector('.marquee .track');
    const revealWords = document.querySelector('.reveal-words');
    const words = revealWords ? Array.from(revealWords.querySelectorAll('.w')) : [];
    if (reduce) {
        words.forEach((w) => w.classList.add('on'));
    }
    let mx = 0;
    let lastY = window.scrollY;
    let vel = 0;
    const startTime = performance.now();
    const frame = (now) => {
        if (lenis)
            lenis.raf(now);
        const y = window.scrollY;
        const vh = window.innerHeight;
        const rawV = lenis ? lenis.velocity : y - lastY;
        lastY = y;
        vel = lerp(vel, Math.max(-50, Math.min(50, rawV)), 0.12);
        if (!reduce) {
            // Parallax
            speedElements.forEach((el) => {
                const parent = el.parentElement;
                if (!parent)
                    return;
                const r = parent.getBoundingClientRect();
                const c = r.top + r.height / 2 - vh / 2;
                const speed = +(el.dataset.speed || 0);
                el.style.transform = `translate3d(0, ${(-c * speed).toFixed(2)}px, 0)`;
            });
            // Kinetic Marquee
            if (marqueeTrack) {
                mx -= 0.5 + Math.abs(vel) * 0.35;
                const half = marqueeTrack.scrollWidth / 2;
                if (-mx > half)
                    mx += half;
                marqueeTrack.style.transform = `translate3d(${mx}px, 0, 0) skewX(${(-vel * 0.25).toFixed(2)}deg)`;
            }
            // Word Reveal
            if (revealWords && words.length > 0) {
                const r = revealWords.getBoundingClientRect();
                const p = (vh * 0.82 - r.top) / (r.height + vh * 0.25);
                const n = Math.floor(Math.max(0, Math.min(1, p)) * words.length * 1.05);
                words.forEach((w, i) => {
                    w.classList.toggle('on', i < n);
                });
            }
        }
        // WebGL Frame
        if (renderer.isOk) {
            const time = (now - startTime) / 1000;
            medias.forEach((m) => {
                m.hover = lerp(m.hover, m.th, 0.06);
                m.mx = lerp(m.mx, m.tmx, 0.1);
                m.my = lerp(m.my, m.tmy, 0.1);
                m.reveal = lerp(m.reveal, m.tr, 0.028);
                if (m.tr === 1 && m.reveal > 0.999)
                    m.reveal = 1;
            });
            renderer.render(medias, time, vel, dpr);
        }
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // Trigger body loaded state
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    if (document.readyState === 'complete') {
        document.body.classList.add('loaded');
    }
})();
