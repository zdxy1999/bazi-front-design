/**
 * 主题切换模块
 * 负责处理深色/浅色主题的切换和持久化
 */

class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.init();
    }

    /**
     * 初始化主题
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * 切换主题
     */
    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        this.updateIcons();
    }

    /**
     * 应用主题
     */
    applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        this.updateIcons();
    }

    /**
     * 更新图标显示
     */
    updateIcons() {
        const darkIcon = document.querySelector('.theme-icon-dark');
        const lightIcon = document.querySelector('.theme-icon-light');

        if (this.currentTheme === 'light') {
            darkIcon?.style.setProperty('display', 'none');
            lightIcon?.style.setProperty('display', 'block');
        } else {
            darkIcon?.style.setProperty('display', 'block');
            lightIcon?.style.setProperty('display', 'none');
        }
    }

    /**
     * 从本地存储加载主题
     */
    loadTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    /**
     * 保存主题到本地存储
     */
    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    /**
     * 获取当前主题
     */
    getTheme() {
        return this.currentTheme;
    }
}

// 导出单例
const themeManager = new ThemeManager();
export default themeManager;
