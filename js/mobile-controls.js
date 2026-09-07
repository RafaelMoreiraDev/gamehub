(() => {
    if (!matchMedia('(pointer: coarse)').matches) return;
    const slug = location.pathname.split('/').pop();
    const layouts = {
        'snake.html': [['←', 'ArrowLeft'], ['↑', 'ArrowUp'], ['↓', 'ArrowDown'], ['→', 'ArrowRight']],
        'space-invaders.html': [['←', 'ArrowLeft'], ['ATIRAR', ' '], ['→', 'ArrowRight']],
        'crazy-racing.html': [['←', 'ArrowLeft'], ['ACELERAR', 'ArrowUp'], ['→', 'ArrowRight']],
        'corrida-turbo.html': [['←', 'ArrowLeft'], ['NITRO', ' '], ['→', 'ArrowRight']],
        'flappy.html': [['VOAR', ' ']]
    };
    const controls = layouts[slug];
    if (!controls) return;

    const style = document.createElement('style');
    style.textContent = '.gamehub-mobile-controls{position:sticky;bottom:8px;z-index:9000;display:flex;justify-content:center;gap:10px;margin:10px auto;width:100%}.gamehub-mobile-controls button{min-width:64px;min-height:52px;padding:10px;border:1px solid rgba(255,255,255,.35);border-radius:14px;background:rgba(10,10,26,.88);color:#fff;font:700 14px Arial;touch-action:none;box-shadow:0 4px 16px rgba(0,0,0,.35)}';
    document.head.appendChild(style);
    const bar = document.createElement('div');
    bar.className = 'gamehub-mobile-controls';
    bar.setAttribute('aria-label', 'Controles do jogo para celular');

    const dispatch = (type, key) => document.dispatchEvent(new KeyboardEvent(type, { key, code: key === ' ' ? 'Space' : key, bubbles: true }));
    controls.forEach(([label, key]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('aria-label', label);
        button.addEventListener('pointerdown', event => { event.preventDefault(); dispatch('keydown', key); });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => button.addEventListener(type, () => dispatch('keyup', key)));
        bar.appendChild(button);
    });
    document.body.appendChild(bar);
})();
