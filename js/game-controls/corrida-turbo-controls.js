(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    const keys = { up: bridge('ArrowUp'), down: bridge('ArrowDown'), left: bridge('ArrowLeft'), right: bridge('ArrowRight') };
    window.MobileControls({
        ariaLabel: 'Controles da Corrida Turbo',
        mount: document.querySelector('.game-container'),
        buttons: [{ id: 'A', label: 'Nitro', ...bridge(' ') }],
        onUp: keys.up.onPress, onUpRelease: keys.up.onRelease,
        onDown: keys.down.onPress, onDownRelease: keys.down.onRelease,
        onLeft: keys.left.onPress, onLeftRelease: keys.left.onRelease,
        onRight: keys.right.onPress, onRightRelease: keys.right.onRelease
    });
})();
