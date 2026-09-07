(() => {
    if (typeof window.MobileControls !== 'function') return;
    const mount = document.querySelector('.game-container');
    window.MobileControls({
        showDpad: false,
        ariaLabel: 'Ações de Missão do Dragão',
        mount,
        buttons: [
            { id: 'A', label: 'Atacar', onPress: () => window.heroAttack?.() },
            { id: 'B', label: 'Magia', onPress: () => window.heroFireball?.() }
        ]
    });
})();
