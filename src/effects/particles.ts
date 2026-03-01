/**
 * Particle System — CSS-based particle burst effects for rare card reveals.
 * Uses DOM elements instead of Three.js for simplicity and performance.
 */

let particleContainer: HTMLElement | null = null;

function ensureContainer(): HTMLElement {
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.id = 'particle-container';
        particleContainer.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    `;
        document.body.appendChild(particleContainer);
    }
    return particleContainer;
}

interface ParticleConfig {
    count: number;
    colors: string[];
    size: [number, number];
    speed: [number, number];
    lifetime: number;
    spread: number;
    shapes: string[];
}

const PRESETS: Record<string, ParticleConfig> = {
    subtle: {
        count: 12,
        colors: ['#ffd700', '#f0c040', '#ffec80'],
        size: [4, 8],
        speed: [80, 200],
        lifetime: 1200,
        spread: 120,
        shapes: ['✦', '✧', '·'],
    },
    intense: {
        count: 30,
        colors: ['#ffd700', '#ff4ea3', '#9b59ff', '#00e5ff', '#ff6ec7', '#ffffff'],
        size: [6, 14],
        speed: [120, 350],
        lifetime: 2000,
        spread: 200,
        shapes: ['✦', '✧', '★', '✶', '◆', '·'],
    },
};

export function createParticles(x: number, y: number, preset: 'subtle' | 'intense'): void {
    const container = ensureContainer();
    const config = PRESETS[preset];

    for (let i = 0; i < config.count; i++) {
        const particle = document.createElement('div');
        const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed - 100; // Bias upward

        particle.textContent = shape;
        particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}px;
      color: ${color};
      pointer-events: none;
      will-change: transform, opacity;
      text-shadow: 0 0 ${size}px ${color};
      z-index: 9999;
    `;

        container.appendChild(particle);

        // Animate with requestAnimationFrame
        const start = performance.now();
        function animate(time: number) {
            const elapsed = time - start;
            const progress = elapsed / config.lifetime;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const px = x + dx * easeOut;
            const py = y + dy * easeOut + 0.5 * 200 * progress * progress; // gravity
            const opacity = 1 - progress;
            const scale = 1 + progress * 0.5;
            const rotation = progress * 360 * (Math.random() > 0.5 ? 1 : -1);

            particle.style.transform = `translate(${px - x}px, ${py - y}px) scale(${scale}) rotate(${rotation}deg)`;
            particle.style.opacity = String(opacity);

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
}

export function destroyParticles(): void {
    if (particleContainer) {
        particleContainer.innerHTML = '';
    }
}
