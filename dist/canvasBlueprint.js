export const BLUEPRINT_SLOTS = [
    {
        id: 0,
        code: 'AIML',
        department: 'Artificial Intelligence & Machine Learning',
        degree: 'B.E. (VTU)',
        dimensions: [2000, 1050],
        aspectRatio: '16:9',
        scheme: 'network',
    },
    {
        id: 1,
        code: 'CSE',
        department: 'Computer Science & Engineering',
        degree: 'B.E. (VTU)',
        dimensions: [1400, 1050],
        aspectRatio: '4:3',
        scheme: 'matrix',
    },
    {
        id: 2,
        code: 'ECE',
        department: 'Electronics & Communication Engineering',
        degree: 'B.E. (VTU)',
        dimensions: [1000, 1250],
        aspectRatio: '4:5',
        scheme: 'signal',
    },
    {
        id: 3,
        code: 'ISE',
        department: 'Information Science & Engineering',
        degree: 'B.E. (VTU)',
        dimensions: [1150, 1150],
        aspectRatio: '1:1',
        scheme: 'graph',
    },
    {
        id: 4,
        code: 'MECH',
        department: 'Mechanical Engineering',
        degree: 'B.E. (VTU)',
        dimensions: [1000, 1250],
        aspectRatio: '4:5',
        scheme: 'vector',
    },
    {
        id: 5,
        code: 'CIVIL',
        department: 'Civil Engineering',
        degree: 'B.E. (VTU)',
        dimensions: [1400, 1000],
        aspectRatio: '7:5',
        scheme: 'truss',
    },
    {
        id: 6,
        code: 'CSEC',
        department: 'CSE (Cyber Security & Data Science)',
        degree: 'B.E. (VTU)',
        dimensions: [1000, 1250],
        aspectRatio: '4:5',
        scheme: 'circuit',
    },
    {
        id: 7,
        code: 'CAMPUS',
        department: '25-Acre Bengaluru Airport Campus',
        degree: 'ESTD 2002',
        dimensions: [1000, 1300],
        aspectRatio: '3:4',
        scheme: 'facade',
    },
];
export function createNoiseCanvas() {
    const nc = document.createElement('canvas');
    nc.width = nc.height = 160;
    const ctx = nc.getContext('2d');
    if (ctx) {
        const imgData = ctx.createImageData(160, 160);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const v = Math.random() * 255;
            imgData.data[i] = v;
            imgData.data[i + 1] = v;
            imgData.data[i + 2] = v;
            imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
    }
    return nc;
}
export function applyGrain(ctx, width, height, noiseCanvas) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
}
function drawCadGrid(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.04)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    // Major grid
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.09)';
    const majorStep = 200;
    for (let x = 0; x < width; x += majorStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += majorStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    // Corner crosshairs (+)
    const pad = 30;
    const crossLen = 14;
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.4)';
    ctx.lineWidth = 1.5;
    const corners = [
        [pad, pad],
        [width - pad, pad],
        [pad, height - pad],
        [width - pad, height - pad],
    ];
    corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - crossLen, cy);
        ctx.lineTo(cx + crossLen, cy);
        ctx.moveTo(cx, cy - crossLen);
        ctx.lineTo(cx, cy + crossLen);
        ctx.stroke();
    });
    // Border frame
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
    ctx.restore();
}
function drawCadLabels(ctx, width, height, slot) {
    ctx.save();
    ctx.fillStyle = 'rgba(237, 230, 216, 0.7)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    const pad = 44;
    ctx.fillText(`MSEC // CAD_SLOT_${slot.id.toString().padStart(2, '0')}`, pad, pad);
    ctx.fillText(`DISCIPLINE: ${slot.code} [${slot.degree}]`, pad, pad + 18);
    ctx.textAlign = 'right';
    ctx.fillText(`RATIO: ${slot.aspectRatio}`, width - pad, pad);
    ctx.fillText(`DIM: ${slot.dimensions[0]} × ${slot.dimensions[1]}`, width - pad, pad + 18);
    // Bottom markers
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(237, 230, 216, 0.4)';
    ctx.fillText(`VTU_AFFILIATED // BENGALURU AIRPORT CAMPUS`, pad, height - pad);
    ctx.textAlign = 'right';
    ctx.fillText(`KCET: E127 · COMEDK: E076`, width - pad, height - pad);
    // Center diagonal framing cross
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.05)';
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.moveTo(width - pad, pad);
    ctx.lineTo(pad, height - pad);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
}
function drawEngineeringSchematic(ctx, width, height, scheme) {
    ctx.save();
    const midX = width / 2;
    const midY = height / 2;
    // Center reticle
    ctx.strokeStyle = 'rgba(237, 230, 216, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(midX, midY, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(midX, midY, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(237, 230, 216, 0.8)';
    ctx.fill();
    switch (scheme) {
        case 'network': {
            // Neural / AI topology
            const nodes = [];
            const cols = 5;
            for (let c = 0; c < cols; c++) {
                const x = midX - 300 + c * 150;
                const count = c === 2 ? 5 : 3;
                for (let r = 0; r < count; r++) {
                    const y = midY - (count - 1) * 45 + r * 90;
                    nodes.push([x, y]);
                }
            }
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.18)';
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i][0] - nodes[j][0];
                    const dy = nodes[i][1] - nodes[j][1];
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i][0], nodes[i][1]);
                        ctx.lineTo(nodes[j][0], nodes[j][1]);
                        ctx.stroke();
                    }
                }
            }
            nodes.forEach(([nx, ny]) => {
                ctx.fillStyle = 'rgba(237, 230, 216, 0.6)';
                ctx.beginPath();
                ctx.arc(nx, ny, 3, 0, Math.PI * 2);
                ctx.fill();
            });
            break;
        }
        case 'matrix': {
            // Logic block bus
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.2)';
            for (let i = -4; i <= 4; i++) {
                ctx.strokeRect(midX - 160 + i * 36, midY - 120, 24, 240);
            }
            break;
        }
        case 'signal': {
            // Waveform carrier
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.3)';
            ctx.beginPath();
            for (let x = -280; x <= 280; x += 4) {
                const y = Math.sin(x * 0.04) * 70 * Math.exp(-Math.pow(x / 200, 2));
                if (x === -280)
                    ctx.moveTo(midX + x, midY + y);
                else
                    ctx.lineTo(midX + x, midY + y);
            }
            ctx.stroke();
            break;
        }
        case 'graph': {
            // Hexagonal routing topology
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.2)';
            const hexR = 70;
            for (let a = 0; a < 6; a++) {
                const ang = (a * Math.PI) / 3;
                const hx = midX + Math.cos(ang) * hexR;
                const hy = midY + Math.sin(ang) * hexR;
                ctx.beginPath();
                ctx.arc(hx, hy, 40, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;
        }
        case 'vector': {
            // Mechanical vector pitch circles
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.25)';
            ctx.beginPath();
            ctx.arc(midX, midY, 140, 0, Math.PI * 2);
            ctx.arc(midX, midY, 100, 0, Math.PI * 2);
            ctx.stroke();
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                ctx.beginPath();
                ctx.moveTo(midX + Math.cos(a) * 100, midY + Math.sin(a) * 100);
                ctx.lineTo(midX + Math.cos(a) * 140, midY + Math.sin(a) * 140);
                ctx.stroke();
            }
            break;
        }
        case 'truss': {
            // Civil truss structural triangulation
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.22)';
            const baseY = midY + 80;
            const topY = midY - 60;
            const trussSpan = 320;
            ctx.beginPath();
            ctx.moveTo(midX - trussSpan, baseY);
            ctx.lineTo(midX + trussSpan, baseY);
            ctx.moveTo(midX - trussSpan + 40, topY);
            ctx.lineTo(midX + trussSpan - 40, topY);
            ctx.stroke();
            for (let x = -trussSpan; x <= trussSpan; x += 80) {
                ctx.beginPath();
                ctx.moveTo(midX + x, baseY);
                ctx.lineTo(midX + x + 40, topY);
                ctx.lineTo(midX + x + 80, baseY);
                ctx.stroke();
            }
            break;
        }
        case 'circuit': {
            // Concentric security ring & cryptographic network
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.22)';
            for (let r = 30; r <= 150; r += 24) {
                ctx.beginPath();
                ctx.arc(midX, midY, r, 0, Math.PI * 1.5);
                ctx.stroke();
            }
            break;
        }
        case 'facade': {
            // 25-Acre campus architectural elevation blueprint
            ctx.strokeStyle = 'rgba(237, 230, 216, 0.24)';
            const archH = 260;
            const archW = 180;
            ctx.strokeRect(midX - archW / 2, midY - archH / 2, archW, archH);
            ctx.beginPath();
            ctx.arc(midX, midY - archH / 2 + archW / 2, archW / 2, Math.PI, 0);
            ctx.stroke();
            break;
        }
    }
    ctx.restore();
}
export function generateBlueprintCanvases(noiseCanvas) {
    return BLUEPRINT_SLOTS.map((slot) => {
        const canvas = document.createElement('canvas');
        canvas.width = slot.dimensions[0];
        canvas.height = slot.dimensions[1];
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return canvas;
        // Dark architectural slate background
        ctx.fillStyle = '#0f0e0c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Subtle CAD elements
        drawCadGrid(ctx, canvas.width, canvas.height);
        drawCadLabels(ctx, canvas.width, canvas.height, slot);
        drawEngineeringSchematic(ctx, canvas.width, canvas.height, slot.scheme);
        applyGrain(ctx, canvas.width, canvas.height, noiseCanvas);
        return canvas;
    });
}
