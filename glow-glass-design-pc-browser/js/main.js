/**
 * 主入口文件
 * 导入并初始化所有模块
 */

import themeManager from './theme.js';
import backgroundAnimation from './background.js';

// 使过渡管理器在全局可用
window.transitionManager = null;
window.testTransition = null;

// 动态导入过渡动画模块
import('./transitions.js').then(module => {
    window.transitionManager = module.default;
    window.testTransition = () => {
        if (window.transitionManager) {
            window.transitionManager.start(2000);
        }
    };
}).catch(error => {
    console.error('Failed to load transition module:', error);
});

// 导入玻璃卡片模块（自动初始化）
import('./glass-card.js').catch(error => {
    console.error('Failed to load glass card module:', error);
});

// 导出主题管理器（供其他页面使用）
window.themeManager = themeManager;

console.log('Bazi Front Design - PC Browser Edition initialized');
