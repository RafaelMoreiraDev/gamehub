(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    window.MobileControls({
        showDpad: false,
        ariaLabel: 'Controles do Ninja Run',
        mount: document.querySelector('.game-container'),
        buttons: [{ id: 'A', label: 'Pular', ...bridge(' ') }]
    });
})();
