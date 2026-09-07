(() => {
    const params = new URLSearchParams(location.search);
    const challengeScore = Number.parseInt(params.get('score'), 10);
    const challenger = (params.get('desafio') || '').slice(0, 30);

    function gameName() {
        return document.querySelector('h1')?.textContent.trim() || document.title.split(' - ')[0];
    }

    function currentScore() {
        const element = document.getElementById('finalScore');
        const match = element?.textContent.match(/\d+/);
        return match ? Number.parseInt(match[0], 10) : null;
    }

    function cleanGameUrl(score) {
        const url = new URL(location.href);
        url.search = '';
        if (Number.isFinite(score)) {
            url.searchParams.set('desafio', 'um amigo');
            url.searchParams.set('score', String(score));
        }
        return url.toString();
    }

    async function share() {
        const score = currentScore();
        const scoreText = Number.isFinite(score) ? ` Fiz ${score} pontos.` : '';
        const data = {
            title: `${gameName()} | GameHub`,
            text: `${scoreText} Você consegue superar meu resultado em ${gameName()}?`.trim(),
            url: cleanGameUrl(score)
        };

        try {
            if (navigator.share) {
                await navigator.share(data);
            } else {
                await navigator.clipboard.writeText(`${data.text} ${data.url}`);
                const original = shareButton.textContent;
                shareButton.textContent = '✓ Link copiado';
                setTimeout(() => { shareButton.textContent = original; }, 1800);
            }
            window.gamehubTrack?.('share_complete', { game: gameName(), score });
            window.dispatchEvent(new CustomEvent('gamehub:share', { detail: { game: gameName(), score } }));
        } catch (error) {
            if (error.name !== 'AbortError') location.href = `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .gamehub-share { position: fixed; right: 16px; bottom: 16px; z-index: 9999; border: 0; border-radius: 999px; padding: 12px 18px; background: linear-gradient(135deg,#ff6b6b,#a855f7); color: #fff; font: 700 14px/1.2 Arial,sans-serif; cursor: pointer; box-shadow: 0 8px 28px rgba(0,0,0,.4); min-height: 44px; }
        .gamehub-share:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .gamehub-share-inline { position: static; display: inline-flex; align-items: center; justify-content: center; margin: 10px 5px; box-shadow: none; }
        .gamehub-challenge { width: min(680px,calc(100% - 30px)); margin: 8px auto 14px; padding: 12px 16px; border: 1px solid #ffe66d; border-radius: 12px; background: rgba(255,230,109,.12); color: #fff; text-align: center; font: 700 14px/1.4 Arial,sans-serif; }
        .gamehub-next { margin: 14px auto 4px; color: #fff; font: 700 13px/1.5 Arial,sans-serif; text-align: center; }
        .gamehub-next a { color: #4ecdc4; margin: 0 6px; }
        @media (pointer: coarse) { .gamehub-share:not(.gamehub-share-inline) { display: none; } }
    `;
    document.head.appendChild(style);

    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'gamehub-share';
    shareButton.textContent = '↗ Compartilhar desafio';
    shareButton.setAttribute('aria-label', 'Compartilhar este jogo ou seu resultado');
    shareButton.addEventListener('click', share);
    document.body.appendChild(shareButton);

    const scoreElement = document.getElementById('finalScore');
    const resultArea = scoreElement?.closest('.game-overlay, .result-screen, .end-overlay, .end-screen, .overlay');
    if (resultArea) {
        const inlineButton = shareButton.cloneNode(true);
        inlineButton.classList.add('gamehub-share-inline');
        inlineButton.textContent = '↗ Desafiar um amigo';
        inlineButton.addEventListener('click', share);
        const replayButton = resultArea.querySelector('button:last-of-type');
        (replayButton || resultArea).insertAdjacentElement(replayButton ? 'afterend' : 'beforeend', inlineButton);

        const games = [
            ['snake.html', 'Cobrinha'], ['flappy.html', 'Flappy Bird'],
            ['space-invaders.html', 'Invasores Espaciais'], ['quiz.html', 'Quiz'],
            ['pong.html', 'Pong'], ['memory.html', 'Memória']
        ].filter(([file]) => !location.pathname.endsWith(file)).slice(0, 3);
        const next = document.createElement('nav');
        next.className = 'gamehub-next';
        next.setAttribute('aria-label', 'Jogar em seguida');
        next.innerHTML = `Jogue em seguida: ${games.map(([file, name]) => `<a href="${file}">${name}</a>`).join(' • ')}`;
        resultArea.appendChild(next);

        let lastScore = null;
        new MutationObserver(() => {
            const score = currentScore();
            if (Number.isFinite(score) && score !== lastScore) {
                lastScore = score;
                localStorage.setItem('gamehub:lastGame', location.pathname);
                window.gamehubTrack?.('game_end', { game: gameName(), score });
            }
        }).observe(scoreElement, { childList: true, characterData: true, subtree: true });
    }

    if (Number.isFinite(challengeScore) || challenger) {
        const banner = document.createElement('aside');
        banner.className = 'gamehub-challenge';
        banner.setAttribute('aria-live', 'polite');
        banner.textContent = challenger === 'diario' && !Number.isFinite(challengeScore)
            ? `🔥 Desafio do dia: faça seu melhor resultado em ${gameName()}!`
            : `${challenger || 'Um amigo'} desafiou você: supere ${challengeScore} pontos!`;
        const header = document.querySelector('.game-header') || document.body.firstElementChild;
        header?.insertAdjacentElement('afterend', banner);
    }
})();
