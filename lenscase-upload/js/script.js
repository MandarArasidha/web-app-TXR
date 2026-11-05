/* ===== EASY SETTINGS ===== */
const SLIDE_SECONDS = 5;   // time each banner slide stays on screen
const SHIFT_SPEED = 0.35;  // how fast the logo strip moves on scroll (bigger = faster)

const RESPECT_REDUCED_MOTION = false;  // false = animations play on every phone. true = switch them off for phones set to "reduce motion"
const reduceMotion = RESPECT_REDUCED_MOTION && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== 1. BANNER SLIDER ===== */
const track = document.getElementById('track');
const slider = document.getElementById('slider');
const dotsBox = document.getElementById('dots');
const total = track.children.length;
let index = 0, timer;

for (let i = 0; i < total; i++) {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  b.addEventListener('click', () => { go(i); restart(); });
  dotsBox.appendChild(b);
}

function go(i) {
  index = (i + total) % total;
  track.style.transform = 'translateX(' + (-100 * index) + '%)';
  [...dotsBox.children].forEach((d, n) => d.classList.toggle('on', n === index));
}
function restart() {
  clearInterval(timer);
  if (!reduceMotion) {
    timer = setInterval(() => go(index + 1), SLIDE_SECONDS * 1000);
  }
}
document.getElementById('next').onclick = () => { go(index + 1); restart(); };
document.getElementById('prev').onclick = () => { go(index - 1); restart(); };
slider.addEventListener('mouseenter', () => clearInterval(timer));
slider.addEventListener('mouseleave', restart);

/* swipe on phones */
let startX = null;
slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
  startX = null;
});
go(0); restart();

/* ===== 2. LOGO STRIP THAT SHIFTS AS THE PAGE SCROLLS ===== */
const strip = document.getElementById('marquee');
const colours = ['#4b4b4b', '#6d5a8f', '#cdbfae', '#3f5a4a'];  // grey, violet, sand, bottle green
['.row-a', '.row-b'].forEach(sel => {
  const row = strip.querySelector(sel);
  for (let n = 0; n < 8; n++) {
    row.insertAdjacentHTML('beforeend', 'lenscase<i style="background:' + colours[n % 4] + '"></i>');
  }
});
function shiftStrip() {
  const r = strip.getBoundingClientRect();
  strip.style.setProperty('--shift', (r.top - innerHeight / 2) * -SHIFT_SPEED + 'px');
}
if (!reduceMotion) {
  addEventListener('scroll', () => requestAnimationFrame(shiftStrip), { passive: true });
  shiftStrip();
}

/* ===== 3. HIGHLIGHT THE NAV LINK OF THE SECTION YOU ARE IN ===== */
const links = document.querySelectorAll('.nav a');
const seen = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['home', 'intent', 'featured'].forEach(id => seen.observe(document.getElementById(id)));

/* ===== 4. FOOTER YEAR ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== 5. VIDEOS: silent endless autoplay, with fallbacks for phones ===== */
const videos = document.querySelectorAll('.video-frame video');
const visibleVideos = new Set();

/* Phones and tablets get a lighter 720p copy (loads fast, plays everywhere). Desktops keep the 1080p one. */
const lightVideo = matchMedia('(max-width: 1024px)').matches || (navigator.connection && navigator.connection.saveData);
function showOpenLink(v) {                    // last resort if a video file cannot load: link opens it in the phone's own player
  const box = v.parentElement;
  if (box.querySelector('.video-open')) return;
  const a = document.createElement('a');
  a.className = 'video-open'; a.href = v.querySelector('source').src; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open video';
  box.appendChild(a);
}
videos.forEach(v => {
  const source = v.querySelector('source');
  if (lightVideo && v.dataset.mobile) { source.src = v.dataset.mobile; v.load(); }
  source.addEventListener('error', () => showOpenLink(v));
  v.addEventListener('error', () => showOpenLink(v));
});

function startVideo(v) {
  v.muted = true; v.defaultMuted = true; v.playsInline = true;   // phones only allow autoplay when muted
  const p = v.play();
  if (p && p.then) p.then(() => hideTap(v)).catch(err => { if (err && err.name === 'NotAllowedError') showTap(v); });
}
function showTap(v) {                         // phone blocked autoplay (Low Power Mode / Data Saver): show a play button
  const box = v.parentElement;
  if (!box.querySelector('.play')) { const b = document.createElement('span'); b.className = 'play'; b.setAttribute('aria-label', 'Play video'); box.appendChild(b); }
}
function hideTap(v) { const b = v.parentElement.querySelector('.play'); if (b) b.remove(); }

const vidWatch = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { visibleVideos.add(e.target); startVideo(e.target); }
  else { visibleVideos.delete(e.target); e.target.pause(); }
}), { threshold: 0.25 });

videos.forEach(v => {
  v.parentElement.addEventListener('click', () => { if (v.paused) startVideo(v); });      // tap to play if blocked
  v.addEventListener('loadeddata', () => { if (visibleVideos.has(v)) startVideo(v); });  // start as soon as data arrives
  vidWatch.observe(v);
});
/* some phones only allow video after the first touch: retry once then */
['touchend', 'click'].forEach(t => addEventListener(t, () => visibleVideos.forEach(startVideo), { once: true, passive: true }));
