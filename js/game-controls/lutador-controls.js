(() => {
    const bridge = window.GameControlKeyBridge;
    if (typeof window.MobileControls !== 'function' || typeof bridge !== 'function') return;
    const mount = document.querySelector('.game-container');
    window.MobileControls({
        mount,
        ariaLabel: 'Controles do Lutador de Rua',
        buttons: [
            { id: 'A', label: 'Soco', ...bridge('j') },
            { id: 'B', label: 'Chute', ...bridge('k') }
        ],
        onUp: bridge('ArrowUp').onPress,
        onUpRelease: bridge('ArrowUp').onRelease,
        onDown: bridge('ArrowDown').onPress,
        onDownRelease: bridge('ArrowDown').onRelease,
        onLeft: bridge('ArrowLeft').onPress,
        onLeftRelease: bridge('ArrowLeft').onRelease,
        onRight: bridge('ArrowRight').onPress,
        onRightRelease: bridge('ArrowRight').onRelease
    });
})();
