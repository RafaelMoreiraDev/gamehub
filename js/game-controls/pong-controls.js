(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    const up = bridge('ArrowUp');
    const down = bridge('ArrowDown');
    window.MobileControls({
        directions: ['up', 'down'],
        ariaLabel: 'Controles do Pong',
        mount: document.querySelector('.game-container'),
        buttons: [],
        onUp: up.onPress, onUpRelease: up.onRelease,
        onDown: down.onPress, onDownRelease: down.onRelease
    });
})();
