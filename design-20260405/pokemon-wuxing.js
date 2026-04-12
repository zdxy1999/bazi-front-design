/**
 * Pokemon风格五行命卡 - 3D全息效果
 * 参考: https://codepen.io/simeydotme/pen/abYWJdX
 */

class PokemonCard {
    constructor(element) {
        this.card = element;
        this.translater = this.card.querySelector('.card__translater');
        this.rotator = this.card.querySelector('.card__rotator');

        this.bindEvents();
    }

    bindEvents() {
        // 鼠标进入
        this.card.addEventListener('mouseenter', (e) => this.handleEnter(e));
        this.card.addEventListener('mouseleave', (e) => this.handleLeave(e));
        this.card.addEventListener('mousemove', (e) => this.handleMove(e));

        // 触摸事件支持
        this.card.addEventListener('touchstart', (e) => this.handleEnter(e));
        this.card.addEventListener('touchend', (e) => this.handleLeave(e));
        this.card.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }

    handleEnter(e) {
        this.card.classList.add('active', 'interacting');
        this.updatePosition(e);
    }

    handleLeave(e) {
        this.card.classList.remove('active', 'interacting');
        this.resetPosition();
    }

    handleMove(e) {
        if (!this.card.classList.contains('active')) return;
        this.updatePosition(e);
    }

    handleTouchMove(e) {
        if (!this.card.classList.contains('active')) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.updatePosition(touch);
    }

    updatePosition(e) {
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 计算相对位置 (0-1)
        const px = x / rect.width;
        const py = y / rect.height;

        // 计算旋转角度
        const rotateY = (px - 0.5) * 30; // -15 到 15 度
        const rotateX = (py - 0.5) * -30; // -15 到 15 度

        // 计算位移
        const translateX = (px - 0.5) * 20;
        const translateY = (py - 0.5) * 20;

        // 计算缩放
        const scale = 1 + Math.sqrt(
            Math.pow(px - 0.5, 2) + Math.pow(py - 0.5, 2)
        ) * 0.1;

        // 应用CSS变量
        this.card.style.setProperty('--mx', `${px * 100}%`);
        this.card.style.setProperty('--my', `${py * 100}%`);
        this.card.style.setProperty('--posx', `${px * 100}%`);
        this.card.style.setProperty('--posy', `${py * 100}%`);
        this.card.style.setProperty('--pos', `${px * 100}% ${py * 100}%`);
        this.card.style.setProperty('--rx', `${rotateY}deg`);
        this.card.style.setProperty('--ry', `${rotateX}deg`);
        this.card.style.setProperty('--tx', `${translateX}px`);
        this.card.style.setProperty('--ty', `${translateY}px`);
        this.card.style.setProperty('--s', scale);
        this.card.style.setProperty('--hyp', Math.sqrt(
            Math.pow(px - 0.5, 2) + Math.pow(py - 0.5, 2)
        ));
    }

    resetPosition() {
        this.card.style.setProperty('--mx', '50%');
        this.card.style.setProperty('--my', '50%');
        this.card.style.setProperty('--posx', '50%');
        this.card.style.setProperty('--posy', '50%');
        this.card.style.setProperty('--pos', '50% 50%');
        this.card.style.setProperty('--rx', '0deg');
        this.card.style.setProperty('--ry', '0deg');
        this.card.style.setProperty('--tx', '0px');
        this.card.style.setProperty('--ty', '0px');
        this.card.style.setProperty('--s', '1');
        this.card.style.setProperty('--hyp', '0');
    }
}

// ============================================
// 初始化所有卡片
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const pokemonCards = [];

    cards.forEach(card => {
        pokemonCards.push(new PokemonCard(card));
    });

    console.log(`✨ 已初始化 ${pokemonCards.length} 张五行命卡`);

    // 添加键盘支持
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // 模拟悬停效果
                card.classList.add('active', 'interacting');
                card.style.setProperty('--s', '1.1');
                card.style.setProperty('--rx', '5deg');
                card.style.setProperty('--ry', '-5deg');
            }
        });

        card.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.classList.remove('active', 'interacting');
                pokemonCards[index].resetPosition();
            }
        });
    });
});

// ============================================
// 背景粒子增强效果
// ============================================
class ParticleSystem {
    constructor() {
        this.particles = document.querySelectorAll('.particle');
        this.init();
    }

    init() {
        // 为每个粒子添加随机运动
        this.particles.forEach(particle => {
            this.animateParticle(particle);
        });
    }

    animateParticle(particle) {
        const duration = 10000 + Math.random() * 10000;
        const delay = Math.random() * 5000;

        particle.style.animationDuration = `${duration}ms`;
        particle.style.animationDelay = `${-delay}ms`;

        // 添加鼠标互动
        document.addEventListener('mousemove', (e) => {
            const rect = particle.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(dy, dx);
                const moveX = Math.cos(angle) * force * -20;
                const moveY = Math.sin(angle) * force * -20;

                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                particle.style.opacity = 0.8;

                setTimeout(() => {
                    particle.style.transform = '';
                    particle.style.opacity = '';
                }, 500);
            }
        });
    }
}

// ============================================
// 卡片翻转音效模拟（视觉反馈）
// ============================================
class CardFeedback {
    constructor(card) {
        this.card = card;
        this.feedbackElement = this.createFeedback();
    }

    createFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'card-feedback';
        feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 100;
            border-radius: 4.55% / 3.5%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        `;
        this.card.appendChild(feedback);
        return feedback;
    }

    show() {
        this.feedbackElement.style.opacity = '1';
        setTimeout(() => {
            this.feedbackElement.style.opacity = '0';
        }, 300);
    }
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子系统
    new ParticleSystem();

    // 为每张卡片添加视觉反馈
    document.querySelectorAll('.card').forEach(card => {
        const feedback = new CardFeedback(card);

        card.addEventListener('mouseenter', () => feedback.show());
        card.addEventListener('click', () => feedback.show());
    });

    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// 性能优化
// ============================================
// 使用 requestAnimationFrame 优化动画
let ticking = false;

document.addEventListener('mousemove', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // 可以在这里添加额外的更新逻辑
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// 响应式处理
// ============================================
let resizeTimer;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        // 重新计算卡片位置
        document.querySelectorAll('.card').forEach(card => {
            const pokemonCard = new PokemonCard(card);
            pokemonCard.resetPosition();
        });
    }, 250);
});

// ============================================
// 导出API（可选）
// ============================================
window.PokemonCards = {
    PokemonCard,
    ParticleSystem,
    CardFeedback
};

console.log('🎴 Pokemon风格五行命卡已加载');
console.log('💡 提示: 鼠标悬停在卡片上查看3D全息效果');
