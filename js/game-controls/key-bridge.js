(() => {
    /** Translate touch controls to the same keyboard contract used by each game. */
    const emit = (key, type) => {
        const code = key === ' ' ? 'Space' : (key.length === 1 ? `Key${key.toUpperCase()}` : key);
        document.dispatchEvent(new KeyboardEvent(type, {
            key,
            code,
            bubbles: true,
            cancelable: true
        }));
    };

    window.GameControlKeyBridge = key => ({
        onPress: () => emit(key, 'keydown'),
        onRelease: () => emit(key, 'keyup')
    });
})();
