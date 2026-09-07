(() => {
    if (typeof window.MobileControls !== 'function' || typeof window.snakeSetDirection !== 'function') return;
    window.MobileControls({
        showDpad: true,
        buttons: [],
        mount: document.querySelector('.game-container'),
        ariaLabel: 'Direcional da Cobrinha',
        onUp: () => window.snakeSetDirection('up'),
        onDown: () => window.snakeSetDirection('down'),
        onLeft: () => window.snakeSetDirection('left'),
        onRight: () => window.snakeSetDirection('right')
    });
})();
