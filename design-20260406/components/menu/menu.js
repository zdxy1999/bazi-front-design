/**
 * 环形菜单组件
 * 通用组件，支持任意数量菜单项自动等距排列
 */

class CircularMenu {
  constructor(element, options = {}) {
    this.menu = element;
    this.toggleButton = this.menu.querySelector('.menu-toggle');
    this.items = this.menu.querySelectorAll('.menu-item');
    this.itemCount = this.items.length;
    this.radius = options.radius || 80; // 菜单项距离中心的半径
    this.isOpen = false;

    this.init();
  }

  init() {
    console.log('[CircularMenu] 初始化菜单项数量:', this.itemCount);

    // 计算每个菜单项的位置
    this.calculatePositions();

    // 绑定事件
    console.log('[CircularMenu] 绑定主按钮点击事件');
    this.toggleButton.addEventListener('click', (e) => {
      console.log('[CircularMenu] 主按钮被点击');
      e.stopPropagation();
      this.toggle();
    });

    // 菜单项点击事件
    this.items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        console.log(`[CircularMenu] 菜单项 ${index + 1} 被点击`);
        this.handleItemClick(item, e);
      });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menu.contains(e.target)) {
        console.log('[CircularMenu] 点击外部，关闭菜单');
        this.close();
      }
    });

    // ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.toggleButton.focus();
      }
    });

    // 触摸支持
    this.setupTouchEvents();

    console.log('[CircularMenu] 初始化完成');
  }

  /**
   * 计算每个菜单项的位置
   * 使用CSS变量存储位置，支持任意数量菜单项
   * 只在上半圆展开菜单项（180度范围）
   */
  calculatePositions() {
    // 只使用上半圆（180度），从左上(-180°/180°)到右上(0°/360°)
    const totalAngleSpan = 180;

    // 计算角度间隔：如果有1个项，间隔为0；否则平分180度
    const angleStep = this.itemCount > 1 ? totalAngleSpan / (this.itemCount - 1) : 0;

    // 起始角度：180度（左上方）
    const startAngle = 180;

    console.log('[CircularMenu] 计算位置（上半圆模式） - 菜单项数量:', this.itemCount, '角度间隔:', angleStep, '起始角度:', startAngle, '半径:', this.radius);

    this.items.forEach((item, index) => {
      const angle = startAngle + (index * angleStep);
      // 将角度转换为弧度
      const radians = (angle * Math.PI) / 180;

      // 计算位置（使用三角函数）
      const x = Math.cos(radians) * this.radius;
      const y = Math.sin(radians) * this.radius;

      console.log(`[CircularMenu] 菜单项 ${index + 1}: 角度=${angle.toFixed(1)}°, x=${x.toFixed(1)}px, y=${y.toFixed(1)}px`);

      // 设置CSS变量
      item.style.setProperty('--translate-x', `${x}px`);
      item.style.setProperty('--translate-y', `${y}px`);

      // 为每个菜单项添加延迟动画
      item.style.transitionDelay = `${index * 0.05}s`;
    });
  }

  /**
   * 切换菜单展开/收起状态
   */
  toggle() {
    console.log('[CircularMenu] toggle() 被调用，当前状态:', this.isOpen);
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 打开菜单
   */
  open() {
    console.log('[CircularMenu] open() 打开菜单');
    this.menu.classList.add('active');
    this.isOpen = true;
    this.toggleButton.setAttribute('aria-expanded', 'true');

    // 为第一个菜单项设置焦点（可访问性）
    setTimeout(() => {
      if (this.items.length > 0) {
        this.items[0].focus();
      }
    }, 100);
  }

  /**
   * 关闭菜单
   */
  close() {
    console.log('[CircularMenu] close() 关闭菜单');
    this.menu.classList.remove('active');
    this.isOpen = false;
    this.toggleButton.setAttribute('aria-expanded', 'false');
  }

  /**
   * 处理菜单项点击
   */
  handleItemClick(item, event) {
    // 触发自定义事件，允许外部监听
    const clickEvent = new CustomEvent('menuItemClick', {
      detail: {
        item: item,
        index: Array.from(this.items).indexOf(item),
        label: item.getAttribute('aria-label')
      },
      bubbles: true
    });
    this.menu.dispatchEvent(clickEvent);

    // 点击后关闭菜单
    setTimeout(() => {
      this.close();
    }, 200);

    // 返回焦点到主按钮（可访问性）
    setTimeout(() => {
      this.toggle.focus();
    }, 300);
  }

  /**
   * 设置触摸事件（移动端）
   */
  setupTouchEvents() {
    let startX, startY;

    this.menu.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    this.menu.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;

      // 如果移动距离小于10像素，视为点击
      const distance = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );

      if (distance < 10) {
        // 这是一个点击事件，让click事件处理器处理
        return;
      }
    }, { passive: true });
  }

  /**
   * 更新半径（响应式）
   */
  updateRadius(newRadius) {
    this.radius = newRadius;
    this.calculatePositions();
  }

  /**
   * 销毁菜单
   */
  destroy() {
    this.toggleButton.removeEventListener('click', this.toggle);
    this.items.forEach(item => {
      item.removeEventListener('click', this.handleItemClick);
    });
    this.close();
  }
}

/**
 * 初始化所有环形菜单
 */
function initCircularMenus() {
  console.log('[环形菜单] 开始初始化...');

  const menus = document.querySelectorAll('.circular-menu');
  console.log(`[环形菜单] 找到 ${menus.length} 个菜单`);

  if (menus.length === 0) {
    console.warn('[环形菜单] 未找到任何菜单元素');
    return;
  }

  menus.forEach((menu, index) => {
    const items = menu.querySelectorAll('.menu-item');
    console.log(`[环形菜单] 菜单 ${index + 1}: ${items.length} 个菜单项`);

    // 根据屏幕大小设置默认半径
    const getDefaultRadius = () => {
      if (window.innerWidth < 480) return 60;
      if (window.innerWidth < 768) return 70;
      return 80;
    };

    const circularMenu = new CircularMenu(menu, {
      radius: getDefaultRadius()
    });

    console.log(`[环形菜单] 菜单 ${index + 1} 初始化完成`);

    // 响应式：窗口大小改变时更新半径
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        circularMenu.updateRadius(getDefaultRadius());
      }, 250);
    });

    // 监听菜单项点击事件（示例）
    menu.addEventListener('menuItemClick', (e) => {
      console.log('菜单项点击:', e.detail);
    });
  });

  console.log('[环形菜单] 所有菜单初始化完成');
}

/**
 * 主题切换功能
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');

  // 如果没有主题切换按钮，跳过初始化
  if (!themeToggle) {
    console.log('未找到主题切换按钮，跳过初始化');
    return;
  }

  const themeIcon = themeToggle.querySelector('.theme-icon');

  // 从localStorage读取主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
    } else {
      themeIcon.textContent = '☀️';
    }
  }
}

/**
 * 页面加载完成后初始化
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCircularMenus();
    initThemeToggle();
  });
} else {
  initCircularMenus();
  initThemeToggle();
}

/**
 * 导出供外部使用
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CircularMenu, initCircularMenus };
}
