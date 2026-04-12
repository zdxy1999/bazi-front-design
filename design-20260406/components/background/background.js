/**
 * 背景组件逻辑
 * 处理主题切换
 */

class BackgroundComponent {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.currentTheme = null;

    this.init();
  }

  init() {
    // 确定初始主题
    this.determineInitialTheme();

    // 绑定主题切换事件
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // 绑定测试按钮
    const testBtn = document.getElementById('testThemeBtn');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.toggleTheme());
    }

    // 监听系统主题变化
    this.initSystemThemeDetection();
  }

  /**
   * 确定初始主题
   */
  determineInitialTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // 使用保存的主题
      this.currentTheme = savedTheme;
    } else {
      // 默认使用暗色主题
      this.currentTheme = 'dark';
    }

    // 设置主题
    this.setTheme(this.currentTheme, !!savedTheme);
  }

  /**
   * 设置主题
   */
  setTheme(theme, saveToStorage = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    if (saveToStorage) {
      localStorage.setItem('theme', theme);
    }

    // 更新图标
    this.updateThemeIcon();
  }

  /**
   * 切换主题
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * 更新主题图标
   */
  updateThemeIcon() {
    if (!this.themeToggle) return;

    const isDark = this.currentTheme === 'dark';

    // 太阳图标 - 暗色主题下显示
    const sunIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    `;

    // 月亮图标 - 亮色主题下显示
    const moonIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;

    // 暗色主题显示太阳，亮色主题显示月亮
    this.themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
  }

  /**
   * 监听系统主题变化
   */
  initSystemThemeDetection() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 只有在没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new BackgroundComponent();
});
