(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    window.MobileControls({
        showDpad: false,
        ariaLabel: 'Controles do Flappy Bird',
        mount: document.querySelector('.game-container'),
        buttons: [{ id: 'A', label: 'Voar', ...bridge(' ') }]
    });
})();
