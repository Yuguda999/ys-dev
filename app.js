/* theme · command palette · scroll reveal · counters — no dependencies */
(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('js');   // reveal styles only apply when JS can undo them

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- theme ---------------------------------------------------- */
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    if (stored === 'light') root.setAttribute('data-theme', 'light');

    function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

    var themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
        var paint = function () {
            var t = currentTheme();
            themeBtn.textContent = t === 'dark' ? '☀' : '☾';
            themeBtn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' theme');
        };
        paint();
        themeBtn.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            next === 'light' ? root.setAttribute('data-theme', 'light') : root.removeAttribute('data-theme');
            try { localStorage.setItem('theme', next); } catch (e) {}
            paint();
        });
    }

    /* ---- nav border on scroll ------------------------------------- */
    var nav = document.querySelector('.nav');
    if (nav) {
        var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 12); };
        onScroll();
        addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- scroll reveal, staggered by group ------------------------ */
    var revealables = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce) {
        revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                en.target.classList.add('in');
                io.unobserve(en.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

        // siblings sharing a parent stagger against each other
        var groups = new Map();
        revealables.forEach(function (el) {
            var p = el.parentElement;
            if (!groups.has(p)) groups.set(p, 0);
            var i = groups.get(p);
            el.style.setProperty('--d', Math.min(i * 80, 400) + 'ms');
            groups.set(p, i + 1);
            io.observe(el);
        });
    }

    /* ---- stat counters -------------------------------------------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCount(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var dur = 1300;
        var t0 = null;
        function frame(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = target * eased;
            el.textContent = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    if (!('IntersectionObserver' in window) || reduce) {
        counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                runCount(en.target);
                cio.unobserve(en.target);
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
    }

    /* ---- gradient-descent plot: animate once in view -------------- */
    var descent = document.querySelector('.descent');
    if (descent) {
        if (!('IntersectionObserver' in window) || reduce) descent.classList.add('in');
        else {
            var dio = new IntersectionObserver(function (entries) {
                if (!entries[0].isIntersecting) return;
                descent.classList.add('in');
                dio.disconnect();
            }, { threshold: 0.35 });
            dio.observe(descent);
        }
    }

    /* ---- pointer-tracked sheen on capability cards ---------------- */
    if (!reduce) {
        document.querySelectorAll('.cap').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
            }, { passive: true });
        });
    }

    /* ---- command palette ------------------------------------------ */
    var modal = document.querySelector('[data-cmdk]');
    if (!modal) return;

    var input = modal.querySelector('input');
    var list = modal.querySelector('.cmdk-list');
    var empty = modal.querySelector('.cmdk-empty');
    var items = Array.prototype.slice.call(list.querySelectorAll('li'));
    var visible = items.slice();
    var cursor = 0;
    var lastFocus = null;

    function mark() {
        visible.forEach(function (li, i) { li.setAttribute('aria-selected', i === cursor ? 'true' : 'false'); });
        if (visible[cursor]) visible[cursor].scrollIntoView({ block: 'nearest' });
    }

    function filter() {
        var q = input.value.trim().toLowerCase();
        visible = items.filter(function (li) {
            var hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
            li.hidden = !hit;
            return hit;
        });
        cursor = 0;
        empty.hidden = visible.length > 0;
        mark();
    }

    function open() {
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        input.value = '';
        filter();
        input.focus();
    }

    function close() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-cmdk-open]').forEach(function (b) { b.addEventListener('click', open); });
    input.addEventListener('input', filter);

    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            modal.hidden ? open() : close();
            return;
        }
        if (modal.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); cursor = (cursor + 1) % visible.length; mark(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); cursor = (cursor - 1 + visible.length) % visible.length; mark(); }
        else if (e.key === 'Enter' && visible[cursor]) { e.preventDefault(); visible[cursor].querySelector('a').click(); }
    });

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (!isMac) document.querySelectorAll('[data-mod]').forEach(function (el) { el.textContent = 'Ctrl'; });
})();
