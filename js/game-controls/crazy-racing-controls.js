(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    const left = bridge('ArrowLeft');
    const right = bridge('ArrowRight');
    const accel = bridge('ArrowUp');
    window.MobileControls({
        directions: ['left', 'right'],
        ariaLabel: 'Controles da Crazy Racing',
        mount: document.querySelector('.game-container'),
        buttons: [{ id: 'A', label: 'Acelerar', ...accel }],
        onLeft: left.onPress, onLeftRelease: left.onRelease,
        onRight: right.onPress, onRightRelease: right.onRelease
    });
})();
