(() => {
    const STYLE_ID = 'gamehub-mobile-controls-style';
    const directions = [['up', '↑', 'Cima'], ['left', '←', 'Esquerda'], ['down', '↓', 'Baixo'], ['right', '→', 'Direita']];

    function installStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            .mobile-controls { --control-size:clamp(56px,17vw,68px); display:flex; align-items:center; justify-content:space-between; gap:20px; width:100%; max-width:620px; margin:16px auto 4px; padding:10px 4px; user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; touch-action:none; overscroll-behavior:contain; }
            .mobile-controls__dpad { display:grid; grid-template-columns:repeat(3,var(--control-size)); grid-template-rows:repeat(2,var(--control-size)); gap:4px; flex:0 0 auto; }
            .mobile-controls__actions { display:flex; align-items:center; justify-content:flex-end; gap:12px; min-width:0; }
            .mobile-controls__button { display:flex; align-items:center; justify-content:center; min-width:var(--control-size); width:var(--control-size); min-height:var(--control-size); height:var(--control-size); padding:0; border:2px solid rgba(255,255,255,.38); border-radius:16px; background:linear-gradient(145deg,rgba(38,48,78,.96),rgba(8,12,30,.96)); color:#fff; font:700 clamp(18px,5vw,24px)/1 Arial,sans-serif; box-shadow:0 5px 0 rgba(0,0,0,.45),0 8px 18px rgba(0,0,0,.28); cursor:pointer; touch-action:none; -webkit-tap-highlight-color:transparent; transition:transform 70ms ease,filter 70ms ease,box-shadow 70ms ease,border-color 70ms ease; }
            .mobile-controls__button.is-pressed { transform:translateY(4px) scale(.96); filter:brightness(1.35); border-color:#4ecdc4; box-shadow:0 1px 0 rgba(0,0,0,.5),0 3px 8px rgba(78,205,196,.28); }
            .mobile-controls__button:focus-visible { outline:3px solid #ffe66d; outline-offset:3px; }
            .mobile-controls__button--up { grid-column:2; grid-row:1; }
            .mobile-controls__button--left { grid-column:1; grid-row:2; }
            .mobile-controls__button--down { grid-column:2; grid-row:2; }
            .mobile-controls__button--right { grid-column:3; grid-row:2; }
            .mobile-controls__dpad--horizontal { grid-template-columns:repeat(2,var(--control-size)); grid-template-rows:var(--control-size); }
            .mobile-controls__dpad--horizontal .mobile-controls__button--left { grid-column:1; grid-row:1; }
            .mobile-controls__dpad--horizontal .mobile-controls__button--right { grid-column:2; grid-row:1; }
            .mobile-controls__dpad--vertical { grid-template-columns:var(--control-size); grid-template-rows:repeat(2,var(--control-size)); }
            .mobile-controls__dpad--vertical .mobile-controls__button--up,
            .mobile-controls__dpad--vertical .mobile-controls__button--down { grid-column:1; }
            .mobile-controls__dpad--vertical .mobile-controls__button--up { grid-row:1; }
            .mobile-controls__dpad--vertical .mobile-controls__button--down { grid-row:2; }
            .mobile-controls__button--action { border-radius:50%; background:linear-gradient(145deg,#ff6b6b,#a83f64); font-size:clamp(13px,3.8vw,17px); text-align:center; overflow-wrap:anywhere; }
            .mobile-controls--actions-only { justify-content:flex-end; }
            .mobile-controls--dpad-only { justify-content:flex-start; }
            @media (pointer:coarse), (max-width:768px) { .game-container > .instructions { display:none; } }
            @media (min-width:769px), (pointer:fine) { .mobile-controls[data-mobile-only="true"] { display:none; } }
            @media (max-width:380px) { .mobile-controls { --control-size:56px; gap:10px; } .mobile-controls__actions { gap:7px; } }
        `;
        document.head.appendChild(style);
    }

    function MobileControls(options = {}) {
        installStyles();
        const showDpad = options.showDpad !== false;
        const enabledDirections = new Set(Array.isArray(options.directions) ? options.directions : directions.map(([id]) => id));
        const configuredButtons = Array.isArray(options.buttons) ? options.buttons.slice(0, 2) : [];
        const enabledButtons = configuredButtons.filter(button => button && button.id && button.hidden !== true);
        const mount = options.mount || document.body;
        const root = document.createElement('section');
        root.className = 'mobile-controls';
        root.dataset.mobileOnly = String(options.mobileOnly !== false);
        root.setAttribute('aria-label', options.ariaLabel || 'Controles do personagem');
        const activePointers = new Map();

        const makeButton = ({ id, label, className, onPress, onRelease }) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `mobile-controls__button ${className}`;
            button.textContent = label;
            button.dataset.control = id;
            button.setAttribute('aria-label', label);
            button.setAttribute('aria-pressed', 'false');
            const release = event => {
                if (!activePointers.has(event.pointerId)) return;
                activePointers.delete(event.pointerId);
                button.classList.remove('is-pressed');
                button.setAttribute('aria-pressed', 'false');
                onRelease?.({ id, pointerId: event.pointerId, originalEvent: event });
            };
            button.addEventListener('pointerdown', event => {
                if (activePointers.has(event.pointerId)) return;
                event.preventDefault();
                try { button.setPointerCapture?.(event.pointerId); } catch (_) { /* Synthetic/legacy pointers may not be capturable. */ }
                activePointers.set(event.pointerId, id);
                button.classList.add('is-pressed');
                button.setAttribute('aria-pressed', 'true');
                onPress?.({ id, pointerId: event.pointerId, originalEvent: event });
            }, { passive: false });
            ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => button.addEventListener(type, release));
            button.addEventListener('contextmenu', event => event.preventDefault());
            return button;
        };

        if (showDpad) {
            const dpad = document.createElement('div');
            dpad.className = 'mobile-controls__dpad';
            const directionIds = [...enabledDirections];
            if (directionIds.length === 2 && directionIds.every(id => ['left', 'right'].includes(id))) dpad.classList.add('mobile-controls__dpad--horizontal');
            if (directionIds.length === 2 && directionIds.every(id => ['up', 'down'].includes(id))) dpad.classList.add('mobile-controls__dpad--vertical');
            dpad.setAttribute('aria-label', 'Direcional');
            directions.filter(([id]) => enabledDirections.has(id)).forEach(([id, symbol, label]) => {
                const cap = id[0].toUpperCase() + id.slice(1);
                const button = makeButton({ id, label: symbol, className: `mobile-controls__button--${id}`, onPress: options[`on${cap}`], onRelease: options[`on${cap}Release`] });
                button.setAttribute('aria-label', label);
                dpad.appendChild(button);
            });
            root.appendChild(dpad);
        }

        if (enabledButtons.length) {
            const actions = document.createElement('div');
            actions.className = 'mobile-controls__actions';
            actions.setAttribute('aria-label', 'Ações');
            enabledButtons.forEach(action => actions.appendChild(makeButton({ id: action.id, label: action.label || action.id, className: `mobile-controls__button--action mobile-controls__button--${String(action.id).toLowerCase()}`, onPress: action.onPress, onRelease: action.onRelease })));
            root.appendChild(actions);
        }

        if (!showDpad) root.classList.add('mobile-controls--actions-only');
        if (!enabledButtons.length) root.classList.add('mobile-controls--dpad-only');
        mount.appendChild(root);
        return { element: root, destroy() { activePointers.clear(); root.remove(); } };
    }

    window.MobileControls = MobileControls;
})();
