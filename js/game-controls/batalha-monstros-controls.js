(() => {
    if (typeof window.MobileControls !== 'function') return;
    const mount = document.querySelector('.game-container');
    window.MobileControls({
        showDpad: false,
        ariaLabel: 'Ações de Batalha de Monstros',
        mount,
        buttons: [
            { id: 'A', label: 'Atacar', onPress: () => window.playerAction?.('attack') },
            { id: 'B', label: 'Especial', onPress: () => window.playerAction?.('special') }
        ]
    });
})();
