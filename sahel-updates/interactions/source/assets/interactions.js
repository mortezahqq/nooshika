(() => {
  'use strict';
  function mount() {
    if (document.body.classList.contains('wp-admin')) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const selector = '.product-card,.elementor-heading-title,.elementor-widget-button,.sahel-store .products > .product';
    const seen = new WeakSet();
    const effects = new Set();
    let observer;
    function reveal(node) {
      if (reduced.matches || !node.animate) return;
      const siblings = [...(node.parentElement?.children || [])];
      const delay = Math.min(3, Math.max(0, siblings.indexOf(node))) * 45;
      const mobile = matchMedia('(max-width: 767px)').matches;
      const animation = node.animate([
        {opacity: 0, translate: mobile ? '0 14px' : '0 24px'},
        {opacity: 1, translate: '0 0'}
      ], {duration: mobile ? 460 : 620, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'});
      effects.add(animation);
      animation.finished.then(() => effects.delete(animation), () => effects.delete(animation));
    }
    if ('IntersectionObserver' in window) observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        reveal(entry.target);
      }
    }, {threshold: .08});
    function scan(root) {
      const nodes = [...root.querySelectorAll(selector)];
      if (root.matches?.(selector)) nodes.unshift(root);
      for (const node of nodes) {
        if (seen.has(node) || node.closest('#wpadminbar,dialog,.cart-dropdown,.sahel-product-dialog')) continue;
        seen.add(node);
        // Do not animate visible content on load or hide anything before JavaScript runs.
        if (observer && node.getBoundingClientRect().top > innerHeight && !reduced.matches) observer.observe(node);
        if (node.matches('.product-card')) {
          node.classList.add('sahel-hover-card');
          let frame = 0;
          node.addEventListener('pointermove', event => {
            if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              frame = 0;
              const box = node.getBoundingClientRect();
              const x = Math.max(-.5, Math.min(.5, (event.clientX - box.left) / box.width - .5));
              const y = Math.max(-.5, Math.min(.5, (event.clientY - box.top) / box.height - .5));
              node.style.setProperty('--sahel-rx', `${(-y * 5).toFixed(2)}deg`);
              node.style.setProperty('--sahel-ry', `${(x * 5).toFixed(2)}deg`);
            });
          }, {passive: true});
          const reset = () => {
            cancelAnimationFrame(frame); frame = 0;
            node.style.removeProperty('--sahel-rx'); node.style.removeProperty('--sahel-ry');
          };
          node.addEventListener('pointerleave', reset);
          node.addEventListener('pointercancel', reset);
        }
      }
    }
    scan(document);
    // WooCommerce may replace the product grid after filtering.
    let queued = false;
    const roots = new Set();
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node.nodeType === 1) roots.add(node);
      if (!roots.size || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; for (const root of roots) if (root.isConnected) scan(root); roots.clear(); });
    }).observe(document.body, {childList: true, subtree: true});
    reduced.addEventListener('change', () => {
      if (reduced.matches) { observer?.disconnect(); for (const effect of effects) effect.cancel(); effects.clear(); }
    });
    document.body.classList.add('sahel-interactions-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once: true});
  else mount();
})();
