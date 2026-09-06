// Polyfill roundRect (compatibilidade navegadores antigos)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (typeof r === 'number') r = [r, r, r, r];
        if (Array.isArray(r) && r.length === 1) r = [r[0], r[0], r[0], r[0]];
        this.moveTo(x + r[0], y);
        this.lineTo(x + w - r[1], y);
        this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
        this.lineTo(x + w, y + h - r[2]);
        this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
        this.lineTo(x + r[3], y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
        this.lineTo(x, y + r[0]);
        this.quadraticCurveTo(x, y, x + r[0], y);
        return this;
    };
}

// Gerar miniatura com proteção contra erros
function safeThumb(fn, fallbackIcon) {
    try {
        return fn();
    } catch (e) {
        console.warn('Erro na miniatura, usando fallback:', e);
        return null;
    }
}

// Funções de geração de miniaturas
function createMiniCanvas(width, height, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    return canvas.toDataURL();
}

function generateRacingThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Road
    ctx.fillStyle = '#333'; ctx.fillRect(0, h*0.6, w, h*0.4);
    ctx.fillStyle = '#fff';
    for(let i=0; i<w; i+=40) { ctx.fillRect(i, h*0.78, 20, 4); }
    // Car
    ctx.fillStyle = '#e74c3c'; ctx.beginPath();
    ctx.roundRect(w*0.4, h*0.5, 80, 35, 8); ctx.fill();
    ctx.fillStyle = '#333'; ctx.beginPath();
    ctx.arc(w*0.45, h*0.85, 12, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w*0.7, h*0.85, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#87ceeb'; ctx.fillRect(w*0.42, h*0.52, 25, 15);
}

function generatePuzzleThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#f093fb'); grad.addColorStop(1, '#f5576c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    const colors = ['#ff6b6b','#4ecdc4','#ffe66d','#4facfe','#a855f7'];
    const size = 35, gap = 5, ox = (w-3*size-2*gap)/2, oy = (h-3*size-2*gap)/2;
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) {
        ctx.fillStyle = colors[(i+j)%colors.length];
        ctx.beginPath(); ctx.roundRect(ox+i*(size+gap), oy+j*(size+gap), size, size, 5); ctx.fill();
    }
}

function generateRPGThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2d1b4e'); grad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Dragon
    ctx.fillStyle = '#a855f7'; ctx.beginPath();
    ctx.ellipse(w/2, h/2+10, 50, 35, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7c3aed'; ctx.beginPath();
    ctx.ellipse(w/2, h/2-20, 30, 25, 0, 0, Math.PI*2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#ff0'; ctx.beginPath();
    ctx.arc(w/2-12, h/2-25, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+12, h/2-25, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath();
    ctx.arc(w/2-12, h/2-25, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+12, h/2-25, 3, 0, Math.PI*2); ctx.fill();
    // Wings
    ctx.fillStyle = '#c084fc';
    ctx.beginPath(); ctx.moveTo(w/2-45,h/2); ctx.lineTo(w/2-80,h/2-30); ctx.lineTo(w/2-50,h/2+10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w/2+45,h/2); ctx.lineTo(w/2+80,h/2-30); ctx.lineTo(w/2+50,h/2+10); ctx.fill();
}

function generateSoccerThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#22c55e'); grad.addColorStop(1, '#16a34a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Field lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w-40, h-40);
    ctx.beginPath(); ctx.arc(w/2, h/2, 40, 0, Math.PI*2); ctx.stroke();
    // Ball
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w/2, h/2, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.beginPath();
    for(let i=0;i<5;i++) { ctx.arc(w/2+Math.cos(i*1.26)*10, h/2+Math.sin(i*1.26)*10, 5, 0, Math.PI*2); ctx.fill(); }
}

function generateNinjaThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1e3a5f'); grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Ninja body
    ctx.fillStyle = '#1a1a2e'; ctx.beginPath();
    ctx.roundRect(w/2-25, h/2-10, 50, 50, 10); ctx.fill();
    // Head
    ctx.fillStyle = '#f5deb3'; ctx.beginPath(); ctx.arc(w/2, h/2-25, 20, 0, Math.PI*2); ctx.fill();
    // Mask
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(w/2-22, h/2-22, 44, 12);
    // Eyes
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.arc(w/2-8, h/2-18, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+8, h/2-18, 4, 0, Math.PI*2); ctx.fill();
    // Sword
    ctx.fillStyle = '#c0c0c0'; ctx.fillRect(w/2+25, h/2-30, 5, 50);
    ctx.fillStyle = '#ffd700'; ctx.fillRect(w/2+22, h/2+15, 12, 8);
}

function generateZombieThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(1, '#2d1b1b');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Zombie
    ctx.fillStyle = '#4a7c59'; ctx.beginPath();
    ctx.roundRect(w/2-20, h/2, 40, 50, 8); ctx.fill();
    ctx.fillStyle = '#5a8c69'; ctx.beginPath(); ctx.arc(w/2, h/2-10, 22, 0, Math.PI*2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#ff0'; ctx.beginPath();
    ctx.arc(w/2-8, h/2-14, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+8, h/2-14, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath();
    ctx.arc(w/2-8, h/2-14, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+8, h/2-14, 2, 0, Math.PI*2); ctx.fill();
    // Blood
    ctx.fillStyle = '#8b0000'; ctx.beginPath();
    ctx.ellipse(w/2+15, h/2+20, 8, 12, 0.3, 0, Math.PI*2); ctx.fill();
}

function generateCrystalThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0c4a6e'); grad.addColorStop(1, '#164e63');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    const crystals = [[w*0.3,h*0.5,'#06b6d4'],[w*0.5,h*0.4,'#22d3ee'],[w*0.7,h*0.55,'#0891b2']];
    crystals.forEach(([x,y,c]) => {
        ctx.fillStyle = c; ctx.beginPath();
        ctx.moveTo(x,y-30); ctx.lineTo(x+15,y); ctx.lineTo(x+10,y+20); ctx.lineTo(x-10,y+20); ctx.lineTo(x-15,y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath();
        ctx.moveTo(x-5,y-20); ctx.lineTo(x,y-5); ctx.lineTo(x-8,y+5); ctx.closePath(); ctx.fill();
    });
}

function generateMonsterThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#581c87'); grad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Monster
    ctx.fillStyle = '#8b5cf6'; ctx.beginPath();
    ctx.roundRect(w/2-30, h/2-20, 60, 55, 15); ctx.fill();
    ctx.fillStyle = '#a78bfa'; ctx.beginPath(); ctx.arc(w/2, h/2-30, 25, 0, Math.PI*2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.arc(w/2-10, h/2-35, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+10, h/2-35, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ef4444'; ctx.beginPath();
    ctx.arc(w/2-10, h/2-35, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+10, h/2-35, 4, 0, Math.PI*2); ctx.fill();
    // Horns
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.moveTo(w/2-20,h/2-50); ctx.lineTo(w/2-30,h/2-70); ctx.lineTo(w/2-10,h/2-50); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w/2+20,h/2-50); ctx.lineTo(w/2+30,h/2-70); ctx.lineTo(w/2+10,h/2-50); ctx.fill();
}

function generateFighterThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#f97316'); grad.addColorStop(1, '#c2410c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Boxing glove
    ctx.fillStyle = '#dc2626'; ctx.beginPath();
    ctx.ellipse(w/2, h/2, 45, 35, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#b91c1c'; ctx.beginPath();
    ctx.ellipse(w/2-5, h/2-5, 30, 22, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center'; ctx.fillText('VS', w/2, h/2+50);
}

function generateDriftThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ec4899'); grad.addColorStop(1, '#be185d');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Track curve
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(0,h*0.8); ctx.quadraticCurveTo(w/2,h*0.2,w,h*0.7); ctx.stroke();
    // Car
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.save(); ctx.translate(w*0.6, h*0.45); ctx.rotate(0.3);
    ctx.roundRect(-25,-12,50,24,6); ctx.fill();
    ctx.restore();
    // Drift lines
    ctx.strokeStyle = '#ffe66d'; ctx.lineWidth = 3;
    ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(w*0.6,h*0.55); ctx.quadraticCurveTo(w*0.4,h*0.7,w*0.2,h*0.9); ctx.stroke();
    ctx.setLineDash([]);
}

function generateTreasureThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#365314'); grad.addColorStop(1, '#1a2e05');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Map
    ctx.fillStyle = '#d4a574'; ctx.beginPath();
    ctx.roundRect(w/2-40, h/2-30, 80, 60, 5); ctx.fill();
    // X marks the spot
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(w/2-8,h/2-8); ctx.lineTo(w/2+8,h/2+8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w/2+8,h/2-8); ctx.lineTo(w/2-8,h/2+8); ctx.stroke();
    // Coins
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(w/2-25, h/2+30, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+5, h/2+35, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w/2+25, h/2+28, 10, 0, Math.PI*2); ctx.fill();
}

function generateBasketballThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#f59e0b'); grad.addColorStop(1, '#d97706');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Ball
    ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(w/2, h/2, 35, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w/2-35,h/2); ctx.lineTo(w/2+35,h/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w/2,h/2-35); ctx.lineTo(w/2,h/2+35); ctx.stroke();
    ctx.beginPath(); ctx.arc(w/2, h/2, 35, -0.5, 0.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(w/2, h/2, 35, Math.PI-0.5, Math.PI+0.5); ctx.stroke();
}

function generateSwordsThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f766e'); grad.addColorStop(1, '#134e4a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Crossed swords
    ctx.fillStyle = '#c0c0c0';
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(-0.5);
    ctx.fillRect(-4, -50, 8, 70); ctx.fillStyle = '#fbbf24'; ctx.fillRect(-12, 15, 24, 8);
    ctx.restore();
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(0.5);
    ctx.fillStyle = '#c0c0c0'; ctx.fillRect(-4, -50, 8, 70); ctx.fillStyle = '#fbbf24'; ctx.fillRect(-12, 15, 24, 8);
    ctx.restore();
}

function generatePuzzleManiaThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e11d48'); grad.addColorStop(1, '#be123c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Target
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w/2, h/2, 40, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e11d48'; ctx.beginPath(); ctx.arc(w/2, h/2, 28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w/2, h/2, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e11d48'; ctx.beginPath(); ctx.arc(w/2, h/2, 5, 0, Math.PI*2); ctx.fill();
    // Arrow
    ctx.fillStyle = '#fbbf24'; ctx.beginPath();
    ctx.moveTo(w/2+50, h/2); ctx.lineTo(w/2+35, h/2-5); ctx.lineTo(w/2+35, h/2+5); ctx.closePath(); ctx.fill();
}

function generateTurboThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#7c3aed'); grad.addColorStop(1, '#5b21b6');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Speed lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
    for(let i=0;i<8;i++) { ctx.beginPath(); ctx.moveTo(0,i*(h/8)); ctx.lineTo(w*0.3,i*(h/8)+20); ctx.stroke(); }
    // Turbo car
    ctx.fillStyle = '#3b82f6'; ctx.beginPath();
    ctx.roundRect(w*0.45, h*0.35, 70, 30, 8); ctx.fill();
    ctx.fillStyle = '#1e40af'; ctx.beginPath();
    ctx.roundRect(w*0.5, h*0.3, 40, 15, 5); ctx.fill();
    // Flames
    ctx.fillStyle = '#f97316'; ctx.beginPath();
    ctx.moveTo(w*0.45,h*0.45); ctx.lineTo(w*0.3,h*0.5); ctx.lineTo(w*0.45,h*0.55); ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.beginPath();
    ctx.moveTo(w*0.45,h*0.48); ctx.lineTo(w*0.35,h*0.5); ctx.lineTo(w*0.45,h*0.52); ctx.fill();
}

function generatePirateThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0c4a6e'); grad.addColorStop(1, '#164e63');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Ship
    ctx.fillStyle = '#8b4513'; ctx.beginPath();
    ctx.moveTo(w*0.2,h*0.7); ctx.lineTo(w*0.8,h*0.7); ctx.lineTo(w*0.7,h*0.5); ctx.lineTo(w*0.3,h*0.5); ctx.closePath(); ctx.fill();
    // Mast
    ctx.fillStyle = '#654321'; ctx.fillRect(w*0.48, h*0.2, 6, h*0.35);
    // Sail
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.moveTo(w*0.5,h*0.22); ctx.lineTo(w*0.75,h*0.35); ctx.lineTo(w*0.5,h*0.48); ctx.closePath(); ctx.fill();
    // Flag
    ctx.fillStyle = '#000'; ctx.beginPath();
    ctx.moveTo(w*0.51,h*0.15); ctx.lineTo(w*0.65,h*0.18); ctx.lineTo(w*0.51,h*0.22); ctx.closePath(); ctx.fill();
    // Skull
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w*0.57, h*0.19, 3, 0, Math.PI*2); ctx.fill();
}

function generateTennisThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#65a30d'); grad.addColorStop(1, '#4d7c0f');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Court
    ctx.fillStyle = '#92400e'; ctx.fillRect(w*0.15, h*0.25, w*0.7, h*0.5);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.strokeRect(w*0.15, h*0.25, w*0.7, h*0.5);
    ctx.beginPath(); ctx.moveTo(w/2, h*0.25); ctx.lineTo(w/2, h*0.75); ctx.stroke();
    // Racket
    ctx.fillStyle = '#c0c0c0'; ctx.beginPath();
    ctx.ellipse(w*0.7, h*0.4, 18, 25, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#654321'; ctx.fillRect(w*0.72, h*0.55, 4, 20);
    // Ball
    ctx.fillStyle = '#c8e617'; ctx.beginPath(); ctx.arc(w*0.4, h*0.45, 10, 0, Math.PI*2); ctx.fill();
}

function generatePongThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.setLineDash([8,8]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w/2, 10); ctx.lineTo(w/2, h-10); ctx.stroke();
    ctx.setLineDash([]);
    // Paddles
    ctx.fillStyle = '#00f5ff'; ctx.fillRect(15, h*0.3, 10, 50);
    ctx.fillStyle = '#ff00ff'; ctx.fillRect(w-25, h*0.4, 10, 50);
    // Ball
    ctx.fillStyle = '#ffe66d'; ctx.beginPath(); ctx.arc(w*0.6, h*0.45, 8, 0, Math.PI*2); ctx.fill();
}

function generateMemoryThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#831843'); grad.addColorStop(1, '#500724');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Cards
    const cards = [[w*0.25,h*0.35,'#667eea'],[w*0.5,h*0.35,'#f093fb'],[w*0.75,h*0.35,'#4ecdc4'],
                   [w*0.25,h*0.65,'#ffe66d'],[w*0.5,h*0.65,'#ff6b6b'],[w*0.75,h*0.65,'#00f5ff']];
    cards.forEach(([x,y,c]) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x-20, y-25, 40, 50, 6); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.roundRect(x-15, y-20, 30, 20, 4); ctx.fill();
    });
    // Question marks
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
    ctx.fillText('?', w*0.5, h*0.38);
}

function generateQuizThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1e40af'); grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Brain
    ctx.fillStyle = '#f0abfc'; ctx.beginPath();
    ctx.ellipse(w/2, h/2, 35, 30, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w/2, h/2-30); ctx.lineTo(w/2, h/2+30); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w/2-20, h/2-15); ctx.quadraticCurveTo(w/2, h/2-25, w/2+20, h/2-15); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w/2-20, h/2+15); ctx.quadraticCurveTo(w/2, h/2+5, w/2+20, h/2+15); ctx.stroke();
    // Question mark
    ctx.fillStyle = '#ffe66d'; ctx.font = 'bold 30px Arial'; ctx.textAlign = 'center';
    ctx.fillText('?', w/2, h/2+55);
}

function generateSpaceThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0a1a'); grad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Stars
    for(let i=0;i<30;i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.5+0.3})`;
        ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*1.5+0.5, 0, Math.PI*2); ctx.fill();
    }
    // Ship
    ctx.fillStyle = '#00ff88'; ctx.beginPath();
    ctx.moveTo(w/2, h*0.25); ctx.lineTo(w/2+25, h*0.5); ctx.lineTo(w/2-25, h*0.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#00cc6a'; ctx.beginPath();
    ctx.moveTo(w/2, h*0.3); ctx.lineTo(w/2+15, h*0.45); ctx.lineTo(w/2-15, h*0.45); ctx.closePath(); ctx.fill();
    // Enemies
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(w*0.2, h*0.15, 15, 12); ctx.fillRect(w*0.4, h*0.1, 15, 12);
    ctx.fillRect(w*0.6, h*0.18, 15, 12); ctx.fillRect(w*0.8, h*0.12, 15, 12);
    // Laser
    ctx.fillStyle = '#00ffff'; ctx.fillRect(w/2-1, h*0.5, 2, 20);
}

function generateSnakeThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#14532d'); grad.addColorStop(1, '#0a0f0a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Grid
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for(let x=0;x<8;x++) for(let y=0;y<5;y++) if((x+y)%2===0) ctx.fillRect(x*40, y*40, 40, 40);
    // Corpo da cobra
    const body = [[5,2],[4,2],[3,2],[2,2],[2,3],[2,4]];
    body.forEach(([x,y],i) => {
        const t = i/body.length;
        ctx.fillStyle = i===0 ? '#4ade80' : `rgba(34,197,94,${1-t*0.6})`;
        ctx.beginPath(); ctx.roundRect(x*40+3, y*40+3, 34, 34, 6); ctx.fill();
    });
    // Olhos
    ctx.fillStyle = '#0a0f0a';
    ctx.beginPath(); ctx.arc(5*40+14, 2*40+14, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(5*40+26, 2*40+14, 4, 0, Math.PI*2); ctx.fill();
    // Maçã
    ctx.shadowBlur = 15; ctx.shadowColor = '#ff6b6b';
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath(); ctx.arc(7*40+20, 3*40+20, 12, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(7*40+18, 3*40+3, 4, 8);
}

function generateFlappyThumb(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#4facfe'); grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Nuvens
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.ellipse(w*0.2, h*0.25, 30, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w*0.7, h*0.15, 25, 8, 0, 0, Math.PI*2); ctx.fill();
    // Canos
    ctx.fillStyle = '#2ea043';
    ctx.fillRect(w*0.55, 0, 55, h*0.35);
    ctx.fillRect(w*0.55, h*0.65, 55, h*0.35);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(w*0.55-4, h*0.35-14, 63, 14);
    ctx.fillRect(w*0.55-4, h*0.65, 63, 14);
    // Pássaro
    ctx.shadowBlur = 12; ctx.shadowColor = '#ffe66d';
    ctx.fillStyle = '#ffe66d';
    ctx.beginPath(); ctx.arc(w*0.28, h*0.45, 20, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.ellipse(w*0.26, h*0.48, 11, 7, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(w*0.32, h*0.42, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath(); ctx.arc(w*0.34, h*0.42, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.moveTo(w*0.36, h*0.46); ctx.lineTo(w*0.46, h*0.49); ctx.lineTo(w*0.36, h*0.52); ctx.fill();
}

// Dados dos Jogos
const gamesDatabase = [
    {
        id: 2,
        title: "Corrida Maluca",
        category: "corrida",
        icon: "🏎️",
        rating: 4.6,
        plays: 12350,
        badge: "new",
        description: "Desvie do tráfego, colete moedas e sobreviva à velocidade!",
        color: "#4ecdc4",
        gameFile: "games/crazy-racing.html",
        thumbnail: generateRacingThumb
    },
    {
        id: 3,
        title: "Quebra-Cabeça Mental",
        category: "puzzle",
        icon: "🧩",
        rating: 4.9,
        plays: 8920,
        badge: "top",
        description: "Quebra-cabeça deslizante com arte neon e recorde de movimentos.",
        color: "#ffe66d",
        gameFile: "games/sliding-puzzle.html",
        thumbnail: generatePuzzleThumb
    },
    {
        id: 4,
        title: "Missão do Dragão",
        category: "rpg",
        icon: "🐉",
        rating: 4.7,
        plays: 20100,
        badge: "new",
        description: "RPG de batalhas por turnos! Evolua, compre equipamentos e derrote o dragão Ignaros.",
        color: "#a855f7",
        gameFile: "games/dragon-quest.html",
        thumbnail: generateRPGThumb
    },
    {
        id: 5,
        title: "Estrelas do Futebol",
        category: "esportes",
        icon: "⚽",
        rating: 4.5,
        plays: 18750,
        badge: "new",
        description: "Copa dos Pênaltis! Mire, dê o efeito e vença goleiros cada vez melhores.",
        color: "#22c55e",
        gameFile: "games/football.html",
        thumbnail: generateSoccerThumb
    },
    {
        id: 6,
        title: "Corrida Ninja",
        category: "aventura",
        icon: "🥷",
        rating: 4.8,
        plays: 16800,
        badge: "new",
        description: "Corra, pule (até 2x!) e colete shurikens douradas. Com recorde salvo!",
        color: "#3b82f6",
        gameFile: "games/ninja-run.html",
        thumbnail: generateNinjaThumb
    },
    {
        id: 7,
        title: "Sobrevivência Zumbi",
        category: "acao",
        icon: "🧟",
        rating: 4.4,
        plays: 14200,
        badge: "new",
        description: "Sobreviva a ondas infinitas de zumbis! Atire, colete power-ups e bata recordes.",
        color: "#ef4444",
        gameFile: "games/zombie-survival.html",
        thumbnail: generateZombieThumb
    },
    {
        id: 8,
        title: "Minas de Cristal",
        category: "puzzle",
        icon: "💎",
        rating: 4.6,
        plays: 9800,
        badge: "new",
        description: "Campo minado de cristais! Bandeiras, números e recorde de tempo.",
        color: "#06b6d4",
        gameFile: "games/mines.html",
        thumbnail: generateCrystalThumb
    },
    {
        id: 9,
        title: "Batalha de Monstros",
        category: "rpg",
        icon: "👾",
        rating: 4.7,
        plays: 22500,
        badge: "popular",
        description: "Capture e treine monstros para batalhar.",
        color: "#8b5cf6",
        thumbnail: generateMonsterThumb
    },
    {
        id: 10,
        title: "Lutador de Rua",
        category: "acao",
        icon: "🥊",
        rating: 4.9,
        plays: 25000,
        badge: "top",
        description: "Lute contra oponentes em batalhas épicas.",
        color: "#f97316",
        thumbnail: generateFighterThumb
    },
    {
        id: 11,
        title: "Mestre do Drift",
        category: "corrida",
        icon: "🏁",
        rating: 4.5,
        plays: 11200,
        badge: null,
        description: "Domine a arte do drift nas pistas mais difíceis.",
        color: "#ec4899",
        thumbnail: generateDriftThumb
    },
    {
        id: 12,
        title: "Caça ao Tesouro",
        category: "aventura",
        icon: "🗺️",
        rating: 4.3,
        plays: 7600,
        badge: "new",
        description: "Encontre tesouros perdidos pelo mundo.",
        color: "#84cc16",
        thumbnail: generateTreasureThumb
    },
    {
        id: 13,
        title: "Basquete Pro",
        category: "esportes",
        icon: "🏀",
        rating: 4.6,
        plays: 13400,
        badge: "new",
        description: "Arremessos com física real! Tabela, rede e bola dourada.",
        color: "#f59e0b",
        gameFile: "games/basketball.html",
        thumbnail: generateBasketballThumb
    },
    {
        id: 14,
        title: "Espadas Mágicas",
        category: "rpg",
        icon: "⚔️",
        rating: 4.8,
        plays: 19800,
        badge: "popular",
        description: "Colete espadas mágicas e derrote o mal.",
        color: "#14b8a6",
        thumbnail: generateSwordsThumb
    },
    {
        id: 15,
        title: "Mania do Puzzle",
        category: "puzzle",
        icon: "🎯",
        rating: 4.4,
        plays: 6500,
        badge: "new",
        description: "Encaixe blocos, complete linhas e faça combos infinitos!",
        color: "#e11d48",
        gameFile: "games/block-puzzle.html",
        thumbnail: generatePuzzleManiaThumb
    },
    {
        id: 16,
        title: "Corrida Turbo",
        category: "corrida",
        icon: "🚗",
        rating: 4.7,
        plays: 15600,
        badge: "top",
        description: "Corridas de alta velocidade com carros turbo.",
        color: "#7c3aed",
        thumbnail: generateTurboThumb
    },
    {
        id: 17,
        title: "Aventuras Piratas",
        category: "aventura",
        icon: "🏴‍☠️",
        rating: 4.5,
        plays: 11900,
        badge: "new",
        description: "Navegue os mares em busca de tesouros.",
        color: "#0891b2",
        thumbnail: generatePirateThumb
    },
    {
        id: 18,
        title: "Campeão de Tênis",
        category: "esportes",
        icon: "🎾",
        rating: 4.3,
        plays: 8200,
        badge: "new",
        description: "Tênis arcade com efeito e placar real. Melhor de 3 games!",
        color: "#65a30d",
        gameFile: "games/tennis.html",
        thumbnail: generateTennisThumb
    },
    {
        id: 19,
        title: "Pong",
        category: "esportes",
        icon: "🏓",
        rating: 4.7,
        plays: 28500,
        badge: "top",
        description: "O clássico jogo de tênis de mesa. Desafie a CPU ou um amigo!",
        color: "#00f5ff",
        gameFile: "games/pong.html",
        thumbnail: generatePongThumb
    },
    {
        id: 20,
        title: "Memória",
        category: "puzzle",
        icon: "🃏",
        rating: 4.6,
        plays: 19200,
        badge: "new",
        description: "Encontre todos os pares de cartas iguais! Teste sua memória.",
        color: "#f093fb",
        gameFile: "games/memory.html",
        thumbnail: generateMemoryThumb
    },
    {
        id: 21,
        title: "Quiz do Conhecimento",
        category: "puzzle",
        icon: "🧠",
        rating: 4.8,
        plays: 24500,
        badge: "popular",
        description: "Teste seus conhecimentos! 6 categorias com mais de 60 perguntas.",
        color: "#4facfe",
        gameFile: "games/quiz.html",
        thumbnail: generateQuizThumb
    },
    {
        id: 22,
        title: "Invasores Espaciais",
        category: "acao",
        icon: "🚀",
        rating: 4.9,
        plays: 32100,
        badge: "top",
        description: "Defenda a Terra dos alienígenas! 6 níveis com chefes.",
        color: "#00ff88",
        gameFile: "games/space-invaders.html",
        thumbnail: generateSpaceThumb
    },
    {
        id: 23,
        title: "Cobrinha",
        category: "puzzle",
        icon: "🐍",
        rating: 4.9,
        plays: 42000,
        badge: "popular",
        description: "O clássico viciante da cobrinha! Coma maçãs e bata seu recorde.",
        color: "#22c55e",
        gameFile: "games/snake.html",
        thumbnail: generateSnakeThumb
    },
    {
        id: 24,
        title: "Flappy Bird",
        category: "acao",
        icon: "🐦",
        rating: 4.5,
        plays: 35800,
        badge: "new",
        description: "Voe entre os canos! Um toque, mil frustrações — o mais difícil do site!",
        color: "#4facfe",
        gameFile: "games/flappy.html",
        thumbnail: generateFlappyThumb
    }
];

// Categorias
const categories = [
    { name: "Ação", icon: "💥", count: 0, category: "acao" },
    { name: "Aventura", icon: "🗺️", count: 0, category: "aventura" },
    { name: "Puzzle", icon: "🧩", count: 0, category: "puzzle" },
    { name: "Corrida", icon: "🏎️", count: 0, category: "corrida" },
    { name: "Esportes", icon: "⚽", count: 0, category: "esportes" },
    { name: "RPG", icon: "⚔️", count: 0, category: "rpg" }
];

// Contar jogos por categoria
categories.forEach(cat => {
    cat.count = gamesDatabase.filter(game => game.category === cat.category).length;
});

// Elementos DOM
const gamesGrid = document.getElementById('gamesGrid');
const categoriesGrid = document.getElementById('categoriesGrid');
const popularCarousel = document.getElementById('popularCarousel');
const featuredGame = document.getElementById('featuredGame');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const gameContainer = document.getElementById('gameContainer');
const gameInfoContainer = document.getElementById('gameInfo');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
    renderGames(gamesDatabase);
    renderPopularGames();
    renderFeaturedGame();
    animateStats();
    initEventListeners();
});

// Renderizar Categorias
function renderCategories() {
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.category}')">
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
            <div class="category-count">${cat.count} jogos</div>
        </div>
    `).join('');
}

// Renderizar Jogos
function renderGames(games) {
    // Jogos prontos primeiro, depois "em breve"
    const sorted = [...games].sort((a, b) => {
        if (a.gameFile && !b.gameFile) return -1;
        if (!a.gameFile && b.gameFile) return 1;
        return 0;
    });
    
    gamesGrid.innerHTML = sorted.map(game => {
        const thumbUrl = game.thumbnail ? safeThumb(game.thumbnail) : null;
        const thumbStyle = thumbUrl ? `background-image: url(${thumbUrl}); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, ${game.color} 0%, ${adjustColor(game.color, -30)} 100%);`;
        const isReady = !!game.gameFile;
        const badge = !isReady 
            ? `<span class="game-badge badge-soon">EM BREVE</span>` 
            : (game.badge ? `<span class="game-badge badge-${game.badge}">${game.badge.toUpperCase()}</span>` : '');
        return `
        <div class="game-card ${isReady ? '' : 'soon'}" onclick="openGame(${game.id})">
            ${badge}
            <div class="game-thumbnail" style="${thumbStyle}">
                ${!thumbUrl ? `<span>${game.icon}</span>` : ''}
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-category">${getCategoryName(game.category)}</p>
                <div class="game-stats">
                    <div class="game-rating">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                    <span class="game-plays">${isReady ? formatNumber(game.plays) + ' jogadas' : 'em desenvolvimento'}</span>
                </div>
            </div>
            ${isReady ? `<button class="play-button" onclick="event.stopPropagation(); openGame(${game.id})">▶</button>` : ''}
        </div>
        `;
    }).join('');
}

// Renderizar Jogos Populares (apenas jogos prontos para jogar)
function renderPopularGames() {
    const readyGames = gamesDatabase.filter(game => game.gameFile);
    
    popularCarousel.innerHTML = readyGames.map(game => {
        const thumbUrl = game.thumbnail ? safeThumb(game.thumbnail) : null;
        const thumbStyle = thumbUrl ? `background-image: url(${thumbUrl}); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, ${game.color} 0%, ${adjustColor(game.color, -30)} 100%);`;
        return `
        <div class="popular-game" onclick="openGame(${game.id})">
            ${game.badge ? `<span class="game-badge badge-${game.badge}">${game.badge.toUpperCase()}</span>` : ''}
            <div class="game-thumbnail" style="${thumbStyle}">
                ${!thumbUrl ? `<span>${game.icon}</span>` : ''}
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-category">${getCategoryName(game.category)}</p>
                <div class="game-stats">
                    <div class="game-rating">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                    <span class="game-plays">${formatNumber(game.plays)} jogadas</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Renderizar Jogo em Destaque
function renderFeaturedGame() {
    const featured = gamesDatabase.find(game => game.badge === 'top' && game.gameFile) || gamesDatabase.find(game => game.gameFile) || gamesDatabase[0];
    const thumbUrl = featured.thumbnail ? safeThumb(featured.thumbnail) : null;
    const thumbStyle = thumbUrl ? `background-image: url(${thumbUrl}); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, ${featured.color} 0%, ${adjustColor(featured.color, -30)} 100%);`;
    
    featuredGame.innerHTML = `
        <div class="featured-thumbnail" style="${thumbStyle}">
            ${!thumbUrl ? featured.icon : ''}
        </div>
        <div class="featured-info">
            <h3>${featured.title}</h3>
            <p class="featured-description">${featured.description}</p>
            <div class="featured-stats">
                <div class="featured-stat">
                    <span class="featured-stat-value">⭐ ${featured.rating}</span>
                    <span class="featured-stat-label">Avaliação</span>
                </div>
                <div class="featured-stat">
                    <span class="featured-stat-value">${formatNumber(featured.plays)}</span>
                    <span class="featured-stat-label">Jogadas</span>
                </div>
                <div class="featured-stat">
                    <span class="featured-stat-value">${getCategoryName(featured.category)}</span>
                    <span class="featured-stat-label">Categoria</span>
                </div>
            </div>
            <button class="cta-button" onclick="openGame(${featured.id})">Jogar Agora</button>
        </div>
    `;
}

// Animar Estatísticas
function animateStats() {
    animateNumber('totalGames', gamesDatabase.length);
    animateNumber('totalCategories', categories.length);
    animateNumber('totalPlayers', 1250000);
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(Math.max(elapsed / duration, 0), 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(update);
}

// Event Listeners
function initEventListeners() {
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filtered = category === 'all' 
                ? gamesDatabase 
                : gamesDatabase.filter(game => game.category === category);
            
            renderGames(filtered);
        });
    });
    
    // Busca
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Modal
    modalClose.addEventListener('click', closeGameModal);
    gameModal.addEventListener('click', function(e) {
        if (e.target === gameModal) closeGameModal();
    });
    
    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Busca
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        renderGames(gamesDatabase);
        return;
    }
    
    const results = gamesDatabase.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query)
    );
    
    renderGames(results);
    
    // Reset filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') btn.classList.add('active');
    });
}

// Filtrar por Categoria
function filterByCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) btn.classList.add('active');
    });
    
    const filtered = gamesDatabase.filter(game => game.category === category);
    renderGames(filtered);
    
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Abrir Jogo
function openGame(gameId) {
    const game = gamesDatabase.find(g => g.id === gameId);
    if (!game) return;
    
    // Jogo jogável: abrir em nova aba (com versão para quebrar cache)
    if (game.gameFile) {
        window.open(game.gameFile + '?v=3', '_blank');
        return;
    }
    
    // Jogo em desenvolvimento: modal "EM BREVE"
    const readyGames = gamesDatabase.filter(g => g.gameFile);
    
    gameContainer.innerHTML = `
        <div class="soon-modal-content">
            <div class="soon-icon">${game.icon}</div>
            <h2>${game.title}</h2>
            <p><strong>Em desenvolvimento! 🚧</strong><br>
            Este jogo está sendo construído. Enquanto isso, experimente nossos jogos prontos:</p>
            <div class="soon-modal-actions">
                ${readyGames.slice(0, 3).map(g => `
                    <button class="cta-button" style="padding: 0.7rem 1.2rem; font-size: 0.9rem;" 
                            onclick="window.open('${g.gameFile}', '_blank')">
                        ${g.icon} ${g.title}
                    </button>
                `).join('')}
            </div>
            <button class="cta-button" style="background: rgba(255,255,255,0.1); margin-top: 1rem;" onclick="closeGameModal()">Fechar</button>
        </div>
    `;
    
    gameInfoContainer.innerHTML = '';
    
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar Modal
function closeGameModal() {
    gameModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Funções Auxiliares
function getCategoryName(category) {
    const cat = categories.find(c => c.category === category);
    return cat ? cat.name : category;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Scroll para jogos
function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Efeito de parallax
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// Intersection Observer para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.game-card, .category-card, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Função global para scroll
window.scrollToGames = scrollToGames;

// Função para scroll do carousel
function scrollCarousel(direction) {
    const carousel = document.getElementById('popularCarousel');
    const scrollAmount = 300;
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Tornar função global
window.scrollCarousel = scrollCarousel;

// Animação idle do hero canvas (mini Space Invaders)
function initHeroCanvas() {
    const hc = document.getElementById('heroCanvas');
    if (!hc) return;
    
    const hctx = hc.getContext('2d');
    const W = hc.width, H = hc.height;
    
    // Estrelas
    const stars = [];
    for (let i = 0; i < 40; i++) {
        stars.push({ x: Math.random()*W, y: Math.random()*H, s: Math.random()*1.5+0.3, sp: Math.random()*0.4+0.1 });
    }
    
    // Inimigos em formação
    const enemies = [];
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 6; c++) {
            enemies.push({
                x: 45 + c * 42,
                y: 25 + r * 32,
                color: r === 0 ? '#ff6b6b' : '#ffe66d',
                phase: (c + r) * 0.5
            });
        }
    }
    
    // Nave
    const ship = { x: W/2, y: H - 35, dir: 1 };
    let frame = 0;
    
    function heroLoop() {
        frame++;
        hctx.fillStyle = '#0a0a1a';
        hctx.fillRect(0, 0, W, H);
        
        // Estrelas
        stars.forEach(s => {
            s.y += s.sp;
            if (s.y > H) { s.y = 0; s.x = Math.random()*W; }
            hctx.fillStyle = `rgba(255,255,255,${0.3+s.sp})`;
            hctx.beginPath(); hctx.arc(s.x, s.y, s.s, 0, Math.PI*2); hctx.fill();
        });
        
        // Inimigos (mexendo)
        hctx.shadowBlur = 8;
        enemies.forEach(e => {
            const wobble = Math.sin(frame * 0.03 + e.phase) * 4;
            hctx.shadowColor = e.color;
            hctx.fillStyle = e.color;
            hctx.fillRect(e.x + wobble, e.y, 20, 14);
            hctx.fillRect(e.x + 5 + wobble, e.y - 5, 10, 5);
        });
        
        // Laser ocasional
        if (frame % 90 < 12) {
            hctx.shadowColor = '#00ffff';
            hctx.fillStyle = '#00ffff';
            hctx.fillRect(ship.x - 1, ship.y - 30 - (frame % 90) * 3, 2, 18);
        }
        
        // Nave
        ship.x += ship.dir * 0.6;
        if (ship.x > W - 30 || ship.x < 30) ship.dir *= -1;
        hctx.shadowColor = '#00ff88';
        hctx.fillStyle = '#00ff88';
        hctx.beginPath();
        hctx.moveTo(ship.x, ship.y - 18);
        hctx.lineTo(ship.x + 16, ship.y + 8);
        hctx.lineTo(ship.x - 16, ship.y + 8);
        hctx.closePath();
        hctx.fill();
        hctx.shadowBlur = 0;
        
        requestAnimationFrame(heroLoop);
    }
    
    heroLoop();
}

// Iniciar animação do hero
initHeroCanvas();
