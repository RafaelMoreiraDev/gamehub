(() => {
    const MEASUREMENT_ID = 'G-LNXXZDQ333';
    const CONSENT_KEY = 'gamehub:analytics-consent';
    const MAX_EVENTS = 100;
    let analyticsLoaded = false;
    let consent;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (_) { consent = null; }

    const gameId = () => (location.pathname.match(/^\/games\/([a-z0-9-]+)\.html$/i) || [])[1] || '';
    const allowedEvents = new Set(['game_open', 'game_start', 'game_end', 'game_replay', 'share_complete', 'filter_category', 'search_game']);
    function sendEvent(name, details = {}) {
        if (!analyticsLoaded || consent !== 'accepted' || !allowedEvents.has(name)) return;
        const params = {};
        const game = gameId();
        if (game) params.game = game;
        if (name === 'game_open' && typeof details.href === 'string') {
            const match = details.href.match(/(?:^|\/)games\/([a-z0-9-]+)\.html$/i);
            if (match) params.game = match[1];
        }
        if (name === 'filter_category' && /^(acao|aventura|puzzle|corrida|esportes|rpg|todos)$/.test(details.category || '')) params.category = details.category;
        if (name === 'search_game') params.has_query = Boolean(details.hasQuery);
        window.gtag('event', name, params);
    }
    window.gamehubTrack = (name, details = {}) => {
        try {
            const events = JSON.parse(localStorage.getItem('gamehub:events') || '[]');
            events.push({ name, path: location.pathname, timestamp: new Date().toISOString() });
            localStorage.setItem('gamehub:events', JSON.stringify(events.slice(-MAX_EVENTS)));
        } catch (_) { /* O jogo continua funcionando se o armazenamento estiver indisponível. */ }
        sendEvent(name, details);
    };
    function startAnalytics() {
        if (analyticsLoaded || consent !== 'accepted') return;
        analyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        window.gtag('js', new Date());
        window.gtag('config', MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: '' });
        window.gtag('event', 'page_view', { page_location: location.origin + location.pathname, page_title: document.title, page_referrer: '' });
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        document.head.appendChild(script);
    }
    function eraseAnalyticsCookies() {
        const domains = [location.hostname, '.' + location.hostname, ''];
        document.cookie.split(';').forEach(part => {
            const name = part.trim().split('=')[0];
            if (!/^_ga(?:_|$)/.test(name)) return;
            domains.forEach(domain => { document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax'; });
        });
    }
    const style = document.createElement('style');
    style.textContent = '.gh-privacy-button{display:inline-block;color:#4ecdc4;background:none;border:0;padding:10px;font:14px Arial;text-decoration:underline;cursor:pointer}.gh-privacy-panel{position:fixed;z-index:10001;left:0;right:0;bottom:0;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:16px;padding:16px 24px;background:#20243a;color:#fff;border-top:1px solid #8d98b5;box-shadow:0 -4px 24px #0008;font:14px/1.5 Arial}.gh-privacy-panel[hidden]{display:none}.gh-privacy-panel p{margin:0;max-width:680px;color:#fff}.gh-privacy-panel a{color:#8df5e4}.gh-privacy-actions{display:flex;flex-wrap:wrap;gap:8px}.gh-privacy-panel button{min-height:42px;padding:8px 16px;border:1px solid #b8c4d6;border-radius:8px;background:#315d66;color:#fff;font:inherit;cursor:pointer}@media(max-width:640px){.gh-privacy-panel{align-items:flex-start;flex-direction:column;gap:8px;padding:12px 16px}}';
    document.head.appendChild(style);
    const panel = document.createElement('section');
    panel.className = 'gh-privacy-panel';
    panel.setAttribute('aria-label', 'Aviso de cookies');
    panel.innerHTML = '<p>Usamos cookies de análise para entender como você usa o GameHub. Você pode aceitar ou recusar. <a href="/politica-de-privacidade.html">Saiba mais</a></p><div class="gh-privacy-actions"><button type="button" data-choice="accepted">Aceitar</button><button type="button" data-choice="denied">Recusar</button></div>';
    panel.hidden = consent === 'accepted' || consent === 'denied';
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.className = 'gh-privacy-button'; toggle.textContent = 'Configurações de cookies';
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; toggle.setAttribute('aria-expanded', String(!panel.hidden)); });
    panel.addEventListener('click', event => {
        const choice = event.target.closest('button[data-choice]')?.dataset.choice;
        if (!choice) return;
        const wasLoaded = analyticsLoaded;
        consent = choice;
        try { localStorage.setItem(CONSENT_KEY, choice); } catch (_) { /* Preferência vale para a página atual. */ }
        panel.hidden = true; toggle.setAttribute('aria-expanded', 'false');
        if (choice === 'accepted') startAnalytics();
        else if (wasLoaded) { window.gtag('consent', 'update', { analytics_storage: 'denied' }); eraseAnalyticsCookies(); location.reload(); }
        else eraseAnalyticsCookies();
    });
    document.body.append(panel);
    (document.querySelector('footer') || document.body).append(toggle);
    startAnalytics();
    document.addEventListener('click', event => {
        const gameLink = event.target.closest('a[href*="games/"]');
        if (gameLink) window.gamehubTrack('game_open', { href: gameLink.getAttribute('href') });
        const button = event.target.closest('button');
        const label = button?.textContent.trim().toLowerCase() || '';
        if (gameId() && /jogar (?:novamente|de novo)|correr novamente|tentar novamente|recomeçar jornada|play again/.test(label)) window.gamehubTrack('game_replay');
        else if (gameId() && /^(iniciar(?: jornada)?|começar(?: quiz)?|jogar(?: agora)?)$/.test(label)) window.gamehubTrack('game_start');
    });
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/service-worker.js').catch(() => {});
})();
