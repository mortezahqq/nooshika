(() => {
  'use strict';
  function mount() {
    const widget = document.querySelector('[data-id="beef911"], .elementor-element-beef911');
    const image = widget?.querySelector('img');
    if (!widget || !image || widget.dataset.sahelCupMotion === 'ready') return;
    widget.dataset.sahelCupMotion = 'ready';
    const layer = document.createElement('div');
    layer.className = 'sahel-cup-motion-layer';
    image.parentNode.insertBefore(layer, image);
    layer.append(image);
    const hero = widget.closest('[data-id="607f914"]');
    if (hero) hero.classList.add('sahel-cup-motion-hero');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let start = 0, span = 1, shift = 0, rotation = 0, current = 0, frame = 0, previousTime = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    function target() { return reduce.matches ? 0 : clamp((window.scrollY - start) / span); }
    function paint(progress) {
      if (reduce.matches) { layer.style.removeProperty('transform'); return; }
      layer.style.transform = `translate3d(0, ${(progress * shift).toFixed(3)}px, 0) rotate(${(progress * rotation).toFixed(3)}deg)`;
    }
    function tick(now) {
      frame = 0;
      const goal = target();
      const elapsed = previousTime ? Math.min(64, now - previousTime) : 16;
      previousTime = now;
      current += (goal - current) * (1 - Math.exp(-elapsed / 70));
      if (Math.abs(goal - current) < 0.0005) current = goal;
      paint(current);
      if (current !== goal) frame = requestAnimationFrame(tick);
      else previousTime = 0;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
    function measure() {
      const box = widget.getBoundingClientRect();
      const top = box.top + window.scrollY;
      start = Math.max(0, top - window.innerHeight * 0.65);
      span = Math.max(250, top + Math.min(box.height * 0.55, window.innerHeight * 0.55) - start);
      const mobile = window.innerWidth < 768, tablet = window.innerWidth < 1024;
      shift = Math.min(mobile ? 64 : tablet ? 120 : 180, Math.max(30, box.height * 0.3));
      rotation = mobile ? 10 : tablet ? 14 : 18;
      schedule();
    }
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', measure, {passive:true});
    window.addEventListener('pageshow', measure);
    reduce.addEventListener('change', () => { current = target(); paint(current); schedule(); });
    image.addEventListener('load', measure);
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(measure);
      observer.observe(widget);
      if (hero) observer.observe(hero);
    }
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    measure();
    // A restored scroll position should render immediately without an initial jump.
    current = target(); paint(current);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();
