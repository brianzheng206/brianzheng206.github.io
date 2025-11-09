/**
 * About page enhancements (workspace slideshow + optional GIF toggle)
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1) Optional: legacy GIF toggle if present
  (function setupGifToggle() {
    const container = document.getElementById('aboutWorkspace');
    if (!container) return;

    const media = container.querySelector('.about-workspace-media');
    const btn = container.querySelector('.workspace-gif-toggle');
    if (!media || !btn) return;

    const stillSrc = container.getAttribute('data-still');
    const gifSrc = container.getAttribute('data-gif');

    // If GIF source isn't provided, hide the toggle button
    if (!gifSrc || !/\.gif(\?.*)?$/i.test(gifSrc)) {
      btn.style.display = 'none';
      return;
    }

    // Preload GIF to avoid flicker on first play
    const preloader = new Image();
    preloader.onload = function () { /* ready */ };
    preloader.onerror = function () { btn.style.display = 'none'; };
    preloader.src = gifSrc;

    let lockedPlaying = false;

    function setPlayingState(playing) {
      lockedPlaying = playing;
      if (playing) {
        media.src = gifSrc;
        btn.textContent = 'Pause GIF';
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Pause workspace GIF');
        container.classList.add('is-gif-playing');
      } else {
        media.src = stillSrc;
        btn.textContent = 'Play GIF';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Play workspace GIF');
        container.classList.remove('is-gif-playing');
      }
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      setPlayingState(!lockedPlaying);
    });
    container.addEventListener('mouseenter', function () { if (!lockedPlaying) media.src = gifSrc; });
    container.addEventListener('mouseleave', function () { if (!lockedPlaying) media.src = stillSrc; });
    setPlayingState(false);
  })();

  // 2) Workspace slideshow
  (function setupWorkspaceSlideshow() {
    const root = document.getElementById('aboutWorkspaceSlideshow');
    if (!root) return;

    const intervalAttr = parseInt(root.getAttribute('data-interval') || '4500', 10);
    const intervalMs = isNaN(intervalAttr) ? 4500 : intervalAttr;
    let slides = Array.from(root.querySelectorAll('img.workspace-slide'));

    // If no slides exist, build them from data-images
    if (!slides.length) {
      const list = (root.getAttribute('data-images') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      list.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'workspace-slide';
        img.src = src;
        img.alt = `Workspace photo ${i + 1}`;
        root.insertBefore(img, root.firstChild);
      });
      slides = Array.from(root.querySelectorAll('img.workspace-slide'));
    }

    if (!slides.length) return;

    // Preload all images
    slides.forEach(s => { const im = new Image(); im.src = s.src; });

    const dotsContainer = root.querySelector('.workspace-dots');
    const prevBtn = root.querySelector('.workspace-nav.prev');
    const nextBtn = root.querySelector('.workspace-nav.next');

    // Build dots
    const dots = slides.map((_, idx) => {
      const b = document.createElement('button');
      b.className = 'workspace-dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Go to image ${idx + 1}`);
      dotsContainer && dotsContainer.appendChild(b);
      return b;
    });

    let index = 0;
    let timer = null;

    function applyActive(newIndex) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === newIndex);
        s.classList.toggle('kenburns', i === newIndex);
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === newIndex));
      index = newIndex;
    }

    function next() { goTo((index + 1) % slides.length); }
    function prev() { goTo((index - 1 + slides.length) % slides.length); }
    function goTo(i) {
      applyActive(i);
      restartTimer();
    }

    function startTimer() {
      if (timer) return;
      timer = setInterval(next, intervalMs);
    }
    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restartTimer() { stopTimer(); startTimer(); }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    root.addEventListener('mouseenter', stopTimer);
    root.addEventListener('mouseleave', startTimer);

    // Init
    applyActive(0);
    startTimer();
  })();
});
