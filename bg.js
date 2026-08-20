/* ============================================================
   Hero background — a live feed-forward network.
   Not decoration: nodes hold an activation, edges hold a weight,
   and the travelling dots are a forward pass. a = tanh(Σ w·x + b).
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.querySelector('.hero-canvas');
    if (!canvas) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    var host = canvas.parentElement;

    var LAYERS = [4, 7, 7, 3];
    var nodes = [];      // {x, y, a, layer, i}
    var edges = [];      // {from, to, w}
    var pulses = [];     // {edge, t, v}
    var dust = [];       // slow drifting points
    var W = 0, H = 0, dpr = 1;
    var pointer = { x: -1e5, y: -1e5 };
    var running = true;
    var tick = 0;

    /* ---- palette pulled from CSS so the theme toggle applies ---- */
    var accent = '#BEF264', dim = '#1D2124';
    function readTheme() {
        var cs = getComputedStyle(document.documentElement);
        accent = (cs.getPropertyValue('--accent') || '#BEF264').trim();
        dim = (cs.getPropertyValue('--line-2') || '#2A2F33').trim();
    }
    readTheme();

    function rgba(hex, a) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        var n = parseInt(h, 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }

    /* ---- build the graph ---------------------------------------- */
    function build() {
        nodes = []; edges = []; pulses = [];

        // the net sits in the right two-thirds so it never fights the headline
        var x0 = W * 0.40, x1 = W * 0.94;
        var span = LAYERS.length - 1;

        LAYERS.forEach(function (count, l) {
            var gap = Math.min(H * 0.15, 108);
            var top = H / 2 - ((count - 1) * gap) / 2;
            for (var i = 0; i < count; i++) {
                nodes.push({
                    layer: l, i: i,
                    hx: x0 + (x1 - x0) * (l / span),
                    hy: top + i * gap,
                    x: 0, y: 0,
                    a: 0,
                    // per-node drift so the lattice breathes
                    px: Math.random() * Math.PI * 2,
                    py: Math.random() * Math.PI * 2
                });
            }
        });

        nodes.forEach(function (from) {
            nodes.forEach(function (to) {
                if (to.layer !== from.layer + 1) return;
                edges.push({ from: from, to: to, w: (Math.random() * 2 - 1) });
            });
        });

        dust = [];
        var n = Math.round(Math.min(70, (W * H) / 26000));
        for (var d = 0; d < n; d++) {
            dust.push({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.09,
                vy: (Math.random() - 0.5) * 0.09,
                r: Math.random() * 1.1 + 0.3
            });
        }
    }

    function resize() {
        var r = host.getBoundingClientRect();
        W = r.width; H = r.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        build();
    }

    /* ---- forward pass ------------------------------------------- */
    function fire() {
        nodes.filter(function (n) { return n.layer === 0; }).forEach(function (n) {
            if (Math.random() < 0.62) emit(n, Math.random() * 0.8 + 0.2);
        });
    }

    function emit(node, value) {
        node.a = Math.min(1, node.a + value);
        edges.forEach(function (e) {
            if (e.from !== node) return;
            if (pulses.length > 150) return;
            if (Math.abs(e.w) < 0.25) return;           // pruned connections stay quiet
            pulses.push({ e: e, t: 0, v: value * Math.abs(e.w) });
        });
    }

    function step() {
        for (var i = pulses.length - 1; i >= 0; i--) {
            var p = pulses[i];
            p.t += 0.016 + Math.abs(p.e.w) * 0.006;
            if (p.t >= 1) {
                // tanh squash on arrival, then propagate
                var out = Math.tanh(p.v * p.e.w * 2.2);
                if (Math.abs(out) > 0.12 && p.e.to.layer < LAYERS.length - 1) {
                    emit(p.e.to, Math.abs(out));
                } else {
                    p.e.to.a = Math.min(1, p.e.to.a + Math.abs(out));
                }
                pulses.splice(i, 1);
            }
        }
        nodes.forEach(function (n) { n.a *= 0.955; });
    }

    /* ---- draw ---------------------------------------------------- */
    function draw() {
        ctx.clearRect(0, 0, W, H);
        tick++;

        // node positions: gentle drift + pointer parallax
        var cx = pointer.x > -1e4 ? pointer.x : W / 2;
        var cy = pointer.y > -1e4 ? pointer.y : H / 2;
        nodes.forEach(function (n) {
            var driftX = Math.sin(tick * 0.004 + n.px) * 7;
            var driftY = Math.cos(tick * 0.0035 + n.py) * 9;
            var dx = (n.hx - cx) * 0.014;
            var dy = (n.hy - cy) * 0.014;
            n.x = n.hx + driftX + dx;
            n.y = n.hy + driftY + dy;
        });

        // dust
        ctx.fillStyle = rgba(dim, 0.9);
        dust.forEach(function (d) {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
            if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, 6.284);
            ctx.fill();
        });

        // edges — opacity carries |weight|, sign carries colour
        edges.forEach(function (e) {
            var mag = Math.abs(e.w);
            var live = Math.max(e.from.a, e.to.a);
            var alpha = 0.05 + mag * 0.10 + live * 0.30;
            ctx.strokeStyle = e.w >= 0 ? rgba(accent, alpha * 0.85) : rgba(dim, alpha + 0.16);
            ctx.lineWidth = 0.5 + mag * 0.7;
            ctx.beginPath();
            ctx.moveTo(e.from.x, e.from.y);
            ctx.lineTo(e.to.x, e.to.y);
            ctx.stroke();
        });

        // pulses
        pulses.forEach(function (p) {
            var t = p.t;
            var x = p.e.from.x + (p.e.to.x - p.e.from.x) * t;
            var y = p.e.from.y + (p.e.to.y - p.e.from.y) * t;
            var r = 1.5 + p.v * 1.9;
            var g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
            g.addColorStop(0, rgba(accent, 0.85));
            g.addColorStop(1, rgba(accent, 0));
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r * 5, 0, 6.284); ctx.fill();
            ctx.fillStyle = rgba(accent, 0.95);
            ctx.beginPath(); ctx.arc(x, y, r, 0, 6.284); ctx.fill();
        });

        // nodes
        nodes.forEach(function (n) {
            var a = Math.min(1, n.a);
            var near = Math.hypot(n.x - cx, n.y - cy);
            var hover = near < 110 ? (1 - near / 110) * 0.5 : 0;
            var lit = Math.max(a, hover);

            if (lit > 0.02) {
                var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 26 + lit * 22);
                g.addColorStop(0, rgba(accent, 0.30 * lit));
                g.addColorStop(1, rgba(accent, 0));
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(n.x, n.y, 26 + lit * 22, 0, 6.284); ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.6 + lit * 2.6, 0, 6.284);
            ctx.fillStyle = lit > 0.05 ? rgba(accent, 0.55 + lit * 0.45) : rgba(dim, 1);
            ctx.fill();

            if (lit > 0.3) {
                ctx.strokeStyle = rgba(accent, lit * 0.4);
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(n.x, n.y, 8 + lit * 5, 0, 6.284); ctx.stroke();
            }
        });
    }

    /* ---- loop ----------------------------------------------------- */
    var since = 0;
    function loop() {
        if (!running) return;
        since++;
        if (since > 78) { fire(); since = 0; }   // a forward pass every ~1.3s
        step();
        draw();
        requestAnimationFrame(loop);
    }

    function start() { if (!running) { running = true; requestAnimationFrame(loop); } }
    function stop() { running = false; }

    /* ---- wiring ---------------------------------------------------- */
    var rt;
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 160); }, { passive: true });

    host.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        host.style.setProperty('--mx', pointer.x + 'px');
        host.style.setProperty('--my', pointer.y + 'px');
    }, { passive: true });

    host.addEventListener('pointerleave', function () {
        pointer.x = -1e5; pointer.y = -1e5;
        host.style.removeProperty('--mx');
        host.style.removeProperty('--my');
    });

    // a click fires an explicit forward pass from wherever you clicked
    host.addEventListener('pointerdown', function () {
        var seeds = nodes.filter(function (n) { return n.layer === 0; });
        seeds.forEach(function (n) { emit(n, 1); });
    });

    document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : start();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0 }).observe(host);
    }

    new MutationObserver(readTheme).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-theme']
    });

    resize();
    fire();
    requestAnimationFrame(loop);
})();
