/**
 * 缘分匹配页面脚本
 */

let currentMatch = 0;
const totalMatches = 3;

function updateMatchCards() {
    const cards = document.querySelectorAll('.match-card');
    const indicators = document.querySelectorAll('.indicator');

    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev');
        if (index === currentMatch) {
            card.classList.add('active');
        } else if (index < currentMatch) {
            card.classList.add('prev');
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentMatch);
    });
}

function nextMatch() {
    currentMatch = (currentMatch + 1) % totalMatches;
    updateMatchCards();
}

function prevMatch() {
    currentMatch = (currentMatch - 1 + totalMatches) % totalMatches;
    updateMatchCards();
}

function goToMatch(index) {
    currentMatch = index;
    updateMatchCards();
}

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevMatch();
    } else if (e.key === 'ArrowRight') {
        nextMatch();
    }
});

// 触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextMatch();
        } else {
            prevMatch();
        }
    }
}

// 导出到全局
window.nextMatch = nextMatch;
window.prevMatch = prevMatch;
window.goToMatch = goToMatch;
