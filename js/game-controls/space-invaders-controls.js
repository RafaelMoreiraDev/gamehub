(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    window.MobileControls({
        directions: ['left', 'right'],
        ariaLabel: 'Controles dos Invasores Espaciais',
        mount: document.querySelector('.game-container'),
        buttons: [{ id: 'A', label: 'Atirar', ...bridge(' ') }],
        onLeft: bridge('ArrowLeft').onPress,
        onLeftRelease: bridge('ArrowLeft').onRelease,
        onRight: bridge('ArrowRight').onPress,
        onRightRelease: bridge('ArrowRight').onRelease
    });
})();
