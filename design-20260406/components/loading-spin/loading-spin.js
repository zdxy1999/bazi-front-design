/**
 * 加载动画Spin组件逻辑
 * 提供显示/隐藏加载动画的方法
 */

class LoadingSpin {
  constructor(options = {}) {
    this.text = options.text || '加载中...';
    this.size = options.size || 'default'; // sm, default, lg
    this.overlay = options.overlay || false;
    this.container = options.container || document.body;

    this.element = null;
    this.overlayElement = null;
  }

  /**
   * 创建加载动画元素
   */
  create() {
    const sizeClass = this.size !== 'default' ? `loading-spin-${this.size}` : '';
    const centerHtml = this.overlay ? '' : '<div class="loading-spin-center"></div>';

    const spinnerHtml = `
      <div class="loading-spin ${sizeClass}" role="status" aria-live="polite">
        <div class="loading-spin-ring">
          <div class="loading-spin-dot"></div>
          <div class="loading-spin-dot"></div>
          <div class="loading-spin-dot"></div>
          <div class="loading-spin-dot"></div>
          <div class="loading-spin-dot"></div>
        </div>
        ${centerHtml}
      </div>
    `;

    if (this.overlay) {
      // 创建全屏覆盖层
      this.overlayElement = document.createElement('div');
      this.overlayElement.className = 'loading-spin-overlay';
      this.overlayElement.innerHTML = `
        ${spinnerHtml}
        <p class="loading-spin-text">${this.text}</p>
      `;
      this.element = this.overlayElement;
    } else {
      // 创建普通加载动画
      this.element = document.createElement('div');
      this.element.className = 'loading-spin-container';
      this.element.innerHTML = spinnerHtml + `<p class="loading-spin-text">${this.text}</p>`;
    }

    return this.element;
  }

  /**
   * 显示加载动画
   */
  show() {
    if (!this.element) {
      this.create();
    }

    if (this.overlay) {
      document.body.appendChild(this.element);
      document.body.style.overflow = 'hidden';
    } else {
      this.container.appendChild(this.element);
    }

    return this;
  }

  /**
   * 隐藏加载动画
   */
  hide() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);

      if (this.overlay) {
        document.body.style.overflow = '';
      }
    }

    return this;
  }

  /**
   * 更新加载文字
   */
  setText(text) {
    this.text = text;

    if (this.element) {
      const textElement = this.element.querySelector('.loading-spin-text');
      if (textElement) {
        textElement.textContent = text;
      }
    }

    return this;
  }

  /**
   * 自动显示并在指定时间后隐藏
   */
  autoShow(duration = 2000) {
    this.show();

    setTimeout(() => {
      this.hide();
    }, duration);

    return this;
  }

  /**
   * 静态方法：快速显示加载动画
   */
  static show(options = {}) {
    const loader = new LoadingSpin(options);
    return loader.show();
  }

  /**
   * 静态方法：快速隐藏所有加载动画
   */
  static hideAll() {
    const overlays = document.querySelectorAll('.loading-spin-overlay');
    const containers = document.querySelectorAll('.loading-spin-container');

    overlays.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    containers.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    document.body.style.overflow = '';
  }
}

// 页面加载完成后初始化演示按钮
document.addEventListener('DOMContentLoaded', () => {
  // 演示按钮1：加载2秒
  const demoBtn1 = document.getElementById('demoBtn1');
  if (demoBtn1) {
    demoBtn1.addEventListener('click', () => {
      const loader = new LoadingSpin({
        text: '加载中...',
        size: 'default',
        container: demoBtn1.parentElement
      });

      loader.show();
      setTimeout(() => loader.hide(), 2000);
    });
  }

  // 演示按钮2：加载3秒
  const demoBtn2 = document.getElementById('demoBtn2');
  if (demoBtn2) {
    demoBtn2.addEventListener('click', () => {
      const loader = new LoadingSpin({
        text: '正在处理数据...',
        size: 'lg',
        container: demoBtn2.parentElement
      });

      loader.show();
      setTimeout(() => loader.hide(), 3000);
    });
  }

  // 演示按钮3：全屏加载
  const demoBtn3 = document.getElementById('demoBtn3');
  if (demoBtn3) {
    demoBtn3.addEventListener('click', () => {
      const loader = new LoadingSpin({
        text: '正在加载...',
        overlay: true
      });

      loader.show();
      setTimeout(() => loader.hide(), 2000);
    });
  }
});

// 导出供其他模块使用
export default LoadingSpin;
