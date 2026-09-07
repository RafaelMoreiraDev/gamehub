(() => {
    const MAX_EVENTS = 100;
    const sessionKey = 'gamehub:session';
    const eventsKey = 'gamehub:events';
    const sessionId = sessionStorage.getItem(sessionKey) || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem(sessionKey, sessionId);

    window.gamehubTrack = (name, details = {}) => {
        const event = {
            name,
            details,
            path: location.pathname,
            sessionId,
            timestamp: new Date().toISOString()
        };
        const events = JSON.parse(localStorage.getItem(eventsKey) || '[]');
        events.push(event);
        localStorage.setItem(eventsKey, JSON.stringify(events.slice(-MAX_EVENTS)));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: name, ...details });
    };

    window.gamehubTrack('page_view', {
        referrer: document.referrer || 'direct',
        source: new URLSearchParams(location.search).get('utm_source') || ''
    });

    document.addEventListener('click', event => {
        const gameLink = event.target.closest('a[href*="games/"]');
        if (gameLink) window.gamehubTrack('game_open', { href: gameLink.getAttribute('href') });
        const button = event.target.closest('button');
        const label = button?.textContent.trim().toLowerCase() || '';
        if (/jogar novamente|correr novamente|play again/.test(label)) window.gamehubTrack('game_replay');
        else if (/iniciar|começar|jogar agora/.test(label)) window.gamehubTrack('game_start');
    });

    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
})();
