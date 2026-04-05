/**
 * 玻璃卡片交互模块
 * 负责处理卡片的鼠标跟随辉光效果
 */

class GlassCardManager {
    constructor() {
        this.cards = [];
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.bindCards();
        this.observeNewCards();
    }

    /**
     * 绑定现有卡片的鼠标事件
     */
    bindCards() {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => this.bindCard(card));
    }

    /**
     * 绑定单个卡片的鼠标事件
     */
    bindCard(card) {
        if (!card || this.cards.includes(card)) return;

        this.cards.push(card);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    }

    /**
     * 监听新添加的卡片
     */
    observeNewCards() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('glass-card')) {
                            this.bindCard(node);
                        }
                        const cards = node.querySelectorAll?.('.glass-card');
                        if (cards) {
                            cards.forEach(card => this.bindCard(card));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 延迟初始化，等待DOM加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlassCardManager();
    });
} else {
    new GlassCardManager();
}

export default GlassCardManager;
