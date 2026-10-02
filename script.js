/* All text lives in data.json. This file is just the logic. */
(() => {
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = a => a[Math.floor(Math.random() * a.length)];
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.textContent = h; return e; };
let D;

/* ---------- effects ---------- */
function floatHeart(emoji = pick(['❤️','💖','✨','⭐','💫'])) {
  const h = el('span', 'fl', emoji);
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 14 + Math.random() * 22 + 'px';
  h.style.animationDuration = 6 + Math.random() * 6 + 's';
  $('fx').appendChild(h); setTimeout(() => h.remove(), 12500);
}
function confetti(n = 80) {
  if (reduce) return;
  const cols = ['#ff5d8f','#ffb36b','#3ee0d0','#b79cff','#fff'];
  for (let i = 0; i < n; i++) {
    const c = el('i', 'conf'); c.style.left = Math.random() * 100 + '%';
    c.style.background = pick(cols); c.style.animationDuration = 2 + Math.random() * 2.5 + 's';
    $('fx').appendChild(c); setTimeout(() => c.remove(), 5000);
  }
}
function heartBurst(n = 30) { for (let i = 0; i < n; i++) setTimeout(() => floatHeart('❤️'), i * 80); }
if (!reduce) {
  setInterval(() => { if (!document.hidden) floatHeart(); }, 1800);
  addEventListener('pointermove', e => { const g = $('glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });
}
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
const reveal = e => { e.classList.add('reveal'); io.observe(e); };

/* ---------- load data ---------- */
async function init() {
  try {
    const r = await fetch('data.json'); D = await r.json();
  } catch (err) {
    $('heroB').textContent = 'Almost there!';
    $('openBtn').hidden = true;
    const p = el('p', 'hand', 'Browsers block data.json when index.html is opened as a file. Deploy to GitHub Pages or use a local server (see README).');
    $('hero').appendChild(p); return;
  }
  document.title = D.site.name;
  $('siteName').textContent = D.site.name; $('siteSub').textContent = D.site.subtitle;
  build();
  $('openBtn').addEventListener('click', start);
}

function start() {
  heartBurst(20);
  $('hero').hidden = true; $('main').hidden = false; $('musicBtn').hidden = false;
  scrollTo(0, 0);
  document.querySelectorAll('main section').forEach(reveal);
}

/* ---------- builders ---------- */
function build() {
  /* memories */
  D.memories.forEach(m => {
    const c = el('article', 'mem'); c.dataset.e = m.emoji || '💫';
    c.innerHTML = '<small></small><h3></h3><p class="t"></p><button class="btn ghost" aria-expanded="false">Read more</button><div class="more"><div><img loading="lazy" alt=""><p class="l"></p></div></div>';
    c.querySelector('small').textContent = m.date; c.querySelector('h3').textContent = m.title;
    c.querySelector('.t').textContent = m.description; c.querySelector('.l').textContent = m.more || '';
    const img = c.querySelector('img'); img.src = m.image; img.alt = m.title; img.onerror = () => img.remove();
    const b = c.querySelector('button');
    b.addEventListener('click', () => { const o = c.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.textContent = o ? 'Show less' : 'Read more'; });
    $('timeline').appendChild(c);
  });
  /* polaroid wall */
  D.wall.forEach((p, i) => {
    const b = el('button', 'pol ' + (p.style || 'polaroid'));
    b.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1 + (i * 1.7) % 3)) + 'deg');
    b.innerHTML = '<span class="ph"><img loading="lazy" alt=""></span><span class="c"></span>';
    const img = b.querySelector('img'); img.src = p.image; img.alt = p.alt || p.caption; img.onerror = () => img.remove();
    b.querySelector('.c').textContent = p.caption;
    b.addEventListener('click', () => openModal(p));
    $('polaroids').appendChild(b);
  });
  quiz(); tot();
  /* generators */
  $('complimentBtn').addEventListener('click', () => { $('complimentOut').textContent = pick(D.compliments); floatHeart('💌'); });
  $('jokeBtn').addEventListener('click', () => { $('jokeOut').textContent = pick(D.jokes); });
  /* secret */
  $('secretBtn').textContent = D.secret.button;
  $('secretBtn').addEventListener('click', () => {
    const s = $('secretScreen'), t = $('secretText'); t.innerHTML = ''; s.hidden = false; heartBurst(50);
    D.secret.lines.forEach((l, i) => { const p = el('p', '', l); p.style.animationDelay = i * 1.6 + 's'; t.appendChild(p); });
    const close = el('button', 'btn ghost', 'Close'); close.style.marginTop = '2rem'; close.style.animation = 'pop 1s ' + D.secret.lines.length * 1.6 + 's both';
    close.addEventListener('click', () => { s.hidden = true; }); t.appendChild(close); close.focus();
  });
  /* letter */
  $('letterTitle').textContent = D.loveLetter.title;
  let typed = false;
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !typed) { typed = true; typeLetter(D.loveLetter.content); o.disconnect(); } }, { threshold: .4 }).observe($('letter'));
  /* final */
  $('finTitle').textContent = D.final.title; $('finText').textContent = D.final.text; $('finFoot').textContent = D.final.footer;
  $('replayBtn').addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); confetti(40); });
  /* music (optional; never breaks if file missing) */
  const audio = new Audio(); audio.loop = true; audio.src = D.site.musicFile || 'assets/music/song.mp3';
  $('musicBtn').addEventListener('click', () => {
    const b = $('musicBtn');
    if (audio.paused) audio.play().then(() => b.setAttribute('aria-pressed', 'true')).catch(() => { b.title = 'Add assets/music/song.mp3'; });
    else { audio.pause(); b.setAttribute('aria-pressed', 'false'); }
  });
  /* modal */
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); $('secretScreen').hidden = true; } });
}

function typeLetter(text) {
  const box = $('letter'); if (reduce) { box.textContent = text; return; }
  let i = 0; (function tick() { box.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, 28); })();
}

let lastFocus;
function openModal(p) {
  lastFocus = document.activeElement; const img = $('modalImg');
  img.src = p.image; img.alt = p.alt || p.caption; $('modalCap').textContent = p.caption;
  $('modal').hidden = false; $('modalClose').focus();
}
function closeModal() { if (!$('modal').hidden) { $('modal').hidden = true; lastFocus && lastFocus.focus(); } }

/* ---------- quiz ---------- */
function quiz() {
  let i = 0, score = 0; const box = $('quizBox');
  (function show() {
    box.innerHTML = '';
    if (i >= D.quiz.length) {
      const ratio = score / D.quiz.length;
      const res = [...D.quizResults].reverse().find(r => ratio >= r.min);
      box.append(el('p', 'big-line', `${score} / ${D.quiz.length}`), el('p', 'big-line', res.text));
      const again = el('button', 'btn', 'Play again'); again.onclick = () => { i = 0; score = 0; show(); }; box.appendChild(again);
      confetti(120); return;
    }
    const q = D.quiz[i];
    box.append(el('small', '', `Question ${i + 1} of ${D.quiz.length} · Score ${score}`), el('h3', 'big-line', q.question));
    const opts = el('div', 'opts'), fb = el('p', 'fb'); fb.setAttribute('aria-live', 'polite');
    q.options.forEach((o, k) => {
      const b = el('button', 'opt', o);
      b.onclick = () => {
        opts.querySelectorAll('button').forEach(x => x.disabled = true);
        const ok = k === q.correct; if (ok) score++;
        b.classList.add(ok ? 'ok' : 'no'); opts.children[q.correct].classList.add('ok');
        fb.textContent = ok ? q.right : q.wrong; if (ok) floatHeart('💖');
        const n = el('button', 'btn', i + 1 < D.quiz.length ? 'Next' : 'See result'); n.onclick = () => { i++; show(); };
        box.appendChild(n); n.focus();
      };
      opts.appendChild(b);
    });
    box.append(opts, fb);
  })();
}

/* ---------- this or that ---------- */
function tot() {
  let i = 0; const picks = [], box = $('totBox');
  (function show() {
    box.innerHTML = '';
    if (i >= D.thisOrThat.length) {
      box.append(el('p', 'big-line', 'Okay, apparently our perfect date is...'), el('p', 'big-line', picks.join(', ').replace(/, ([^,]*)$/, ' and $1') + '. 😌'));
      const b = el('button', 'btn', 'Again'); b.onclick = () => { i = 0; picks.length = 0; show(); }; box.appendChild(b); confetti(60); return;
    }
    const q = D.thisOrThat[i];
    box.appendChild(el('p', 'big-line', 'Which one?'));
    const pair = el('div', 'pair');
    [[q.a, q.wordA], [q.b, q.wordB]].forEach(([label, word]) => {
      const b = el('button', 'btn', label); b.onclick = () => { picks.push(word); floatHeart(); i++; show(); }; pair.appendChild(b);
    });
    box.appendChild(pair);
  })();
}

init();
})();
