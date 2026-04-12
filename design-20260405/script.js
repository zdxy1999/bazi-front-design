// ============================================
// 主题切换功能
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// 检查本地存储的主题偏好
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

// 主题切换事件
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // 触发主题切换动画
    triggerThemeTransition(newTheme);
});

// 主题切换动画效果
function triggerThemeTransition(theme) {
    const halos = document.querySelectorAll('.halo');

    halos.forEach((halo, index) => {
        halo.style.transition = 'all 0.5s ease';
        halo.style.opacity = theme === 'dark' ? '0.3' : '0.6';

        setTimeout(() => {
            halo.style.transition = '';
        }, 500);
    });
}

// ============================================
// 五行生克图动画
// ============================================

const elements = document.querySelectorAll('.element');

elements.forEach(element => {
    element.addEventListener('mouseenter', handleElementHover);
    element.addEventListener('mouseleave', handleElementLeave);
});

function handleElementHover(e) {
    const element = e.currentTarget;
    const elementType = element.dataset.element;

    // 放大当前元素
    element.style.transform = element.style.transform.replace('scale(1)', 'scale(1.2)');

    // 显示元素信息（可以扩展为显示详细说明）
    showElementInfo(elementType);
}

function handleElementLeave(e) {
    const element = e.currentTarget;
    const elementType = element.dataset.element;

    // 恢复原始大小
    const originalTransform = getOriginalTransform(elementType);
    element.style.transform = originalTransform;

    hideElementInfo();
}

function getOriginalTransform(elementType) {
    const transforms = {
        'metal': 'translateX(-50%)',
        'water': '',
        'wood': '',
        'fire': 'translateX(-50%)',
        'earth': ''
    };
    return transforms[elementType] || '';
}

// 显示五行信息（可扩展）
function showElementInfo(elementType) {
    const info = {
        'metal': '金：代表坚固、决断、收敛',
        'water': '水：代表智慧、流动、适应',
        'wood': '木：代表生长、仁慈、创造力',
        'fire': '火：代表热情、向上、礼仪',
        'earth': '土：代表稳定、信任、包容'
    };

    console.log(info[elementType]);
}

function hideElementInfo() {
    // 隐藏信息（可扩展为实际UI）
}

// ============================================
// 光晕位置动态更新（鼠标跟踪效果）
// ============================================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    updateHaloPositions();
});

function updateHaloPositions() {
    const halos = document.querySelectorAll('.halo');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (mouseX - centerX) / centerX;
    const deltaY = (mouseY - centerY) / centerY;

    halos.forEach((halo, index) => {
        const speed = (index + 1) * 0.5;
        const offsetX = deltaX * 20 * speed;
        const offsetY = deltaY * 20 * speed;

        // 获取当前位置并添加偏移
        const currentLeft = parseFloat(halo.style.left) || halo.offsetLeft;
        const currentTop = parseFloat(halo.style.top) || halo.offsetTop;

        halo.style.marginLeft = `${offsetX}px`;
        halo.style.marginTop = `${offsetY}px`;
    });
}

// ============================================
// 八字柱子动画
// ============================================

const pillars = document.querySelectorAll('.pillar');

pillars.forEach((pillar, index) => {
    pillar.style.animationDelay = `${index * 0.1}s`;
    pillar.classList.add('fade-in');

    pillar.addEventListener('mouseenter', () => {
        pillar.style.transform = 'translateY(-5px) scale(1.05)';
    });

    pillar.addEventListener('mouseleave', () => {
        pillar.style.transform = '';
    });
});

// ============================================
// 五行条形图动画
// ============================================

const barFills = document.querySelectorAll('.bar-fill');

// 页面加载时触发动画
window.addEventListener('load', () => {
    barFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';

        setTimeout(() => {
            fill.style.width = width;
        }, 500);
    });
});

// ============================================
// 边缘高光效果
// ============================================

function checkEdgeGlow() {
    const halos = document.querySelectorAll('.halo');

    halos.forEach(halo => {
        const rect = halo.getBoundingClientRect();
        const edgeThreshold = 50;

        const nearEdge =
            rect.left < edgeThreshold ||
            rect.right > window.innerWidth - edgeThreshold ||
            rect.top < edgeThreshold ||
            rect.bottom > window.innerHeight - edgeThreshold;

        if (nearEdge) {
            halo.style.boxShadow = `0 0 ${getComputedStyle(document.documentElement)
                .getPropertyValue('--halo-blur')} ${getElementColor(halo)}`;
        } else {
            halo.style.boxShadow = 'none';
        }
    });
}

function getElementColor(halo) {
    if (halo.classList.contains('halo-1')) return 'var(--color-metal)';
    if (halo.classList.contains('halo-2')) return 'var(--color-wood)';
    if (halo.classList.contains('halo-3')) return 'var(--color-water)';
    if (halo.classList.contains('halo-4')) return 'var(--color-fire)';
    if (halo.classList.contains('halo-5')) return 'var(--color-earth)';
    return 'white';
}

// 定期检查边缘高光
setInterval(checkEdgeGlow, 100);

// ============================================
// 页面加载动画
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 卡片依次出现
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + index * 150);
    });
});

// ============================================
// 响应式处理
// ============================================

let resizeTimer;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        // 重新计算布局相关参数
        updateHaloPositions();
    }, 250);
});

// ============================================
// 可访问性支持
// ============================================

// 键盘导航支持
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});

// 为所有交互元素添加焦点样式
const interactiveElements = document.querySelectorAll('.element, .pillar, .wuxing-tag');

interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
        }
    });
});

// ============================================
// 性能优化
// ============================================

// 使用 requestAnimationFrame 优化动画
let ticking = false;

function updateHaloPositionsRAF() {
    updateHaloPositions();
    ticking = false;
}

document.addEventListener('mousemove', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHaloPositionsRAF);
        ticking = true;
    }
});

// ============================================
// 初始化
// ============================================

console.log('五行算命页面已加载');
console.log('当前主题:', html.getAttribute('data-theme'));
