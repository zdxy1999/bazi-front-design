/**
 * 处理中动画组件逻辑
 * 提供显示/隐藏处理中动画的方法
 * 完全照抄参考文件的太极旋转实现
 */

class ProcessingAnimation {
  constructor(options = {}) {
    this.text = options.text || '正在计算中...';
    this.subText = options.subText || '请稍候';
    this.container = options.container || document.body;
    this.overlay = options.overlay || false;

    this.element = null;
    this.taichiContainer = null;
    this.rotationAngle = 0;
    this.animationId = null;
  }

  /**
   * 创建处理中动画元素
   */
  create() {
    const spinnerHtml = `
      <div class="processing">
        <div class="processing-taichi processing-rotating" id="taichiContainer">
          <div class="processing-glow"></div>
          <!-- 阳鱼（白色） -->
          <div class="processing-yang">
            <svg viewBox="0 0 100 100" class="taichi-svg">
              <path d="M 50 0 A 50 50 0 0 0 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0" fill="#ffffff"/>
              <circle cx="50" cy="75" r="12.5" fill="#1a1a1a"/>
            </svg>
          </div>
          <!-- 阴鱼（黑色） -->
          <div class="processing-yin">
            <svg viewBox="0 0 100 100" class="taichi-svg">
              <path d="M 50 0 A 50 50 0 0 1 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0" fill="#1a1a1a"/>
              <circle cx="50" cy="25" r="12.5" fill="#ffffff"/>
            </svg>
          </div>
        </div>
      </div>
    `;

    const textHtml = `
      <p class="processing-text">${this.text}</p>
    `;

    if (this.overlay) {
      // 创建全屏覆盖层
      this.overlayElement = document.createElement('div');
      this.overlayElement.className = 'processing-overlay';
      this.overlayElement.innerHTML = spinnerHtml + textHtml;
      this.element = this.overlayElement;
    } else {
      // 创建普通处理中动画
      this.element = document.createElement('div');
      this.element.className = 'processing-container';
      this.element.innerHTML = spinnerHtml + textHtml;
    }

    // 获取太极容器引用
    this.taichiContainer = this.element.querySelector('#taichiContainer');

    return this.element;
  }

  /**
   * 显示处理中动画
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
   * 隐藏处理中动画
   */
  hide() {
    // 停止旋转动画
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);

      if (this.overlay) {
        document.body.style.overflow = '';
      }
    }

    return this;
  }

  /**
   * 更新文字
   */
  setText(text) {
    this.text = text || this.text;

    if (this.element) {
      const textElement = this.element.querySelector('.processing-text');
      if (textElement) {
        textElement.textContent = this.text;
      }
    }

    return this;
  }

  /**
   * 自动显示并在指定时间后隐藏
   */
  autoShow(duration = 5000) {
    this.show();

    setTimeout(() => {
      this.hide();
    }, duration);

    return this;
  }

  /**
   * 静态方法：快速显示处理中动画
   */
  static show(options = {}) {
    const processor = new ProcessingAnimation(options);
    return processor.show();
  }

  /**
   * 静态方法：快速隐藏所有处理中动画
   */
  static hideAll() {
    const overlays = document.querySelectorAll('.processing-overlay');
    const containers = document.querySelectorAll('.processing-container');

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
  // 演示按钮1：处理3秒
  const demoBtn1 = document.getElementById('demoBtn1');
  if (demoBtn1) {
    demoBtn1.addEventListener('click', () => {
      const processor = new ProcessingAnimation({
        text: '正在计算八字...',
        container: demoBtn1.parentElement
      });

      processor.show();
      setTimeout(() => processor.hide(), 3000);
    });
  }

  // 演示按钮2：处理5秒
  const demoBtn2 = document.getElementById('demoBtn2');
  if (demoBtn2) {
    demoBtn2.addEventListener('click', () => {
      const processor = new ProcessingAnimation({
        text: '正在分析缘分匹配...',
        container: demoBtn2.parentElement
      });

      processor.show();
      setTimeout(() => processor.hide(), 5000);
    });
  }

  // 演示按钮3：全屏显示
  const demoBtn3 = document.getElementById('demoBtn3');
  if (demoBtn3) {
    demoBtn3.addEventListener('click', () => {
      const processor = new ProcessingAnimation({
        text: '正在处理中...',
        overlay: true
      });

      processor.show();
      setTimeout(() => processor.hide(), 5000);
    });
  }
});

// 导出供其他模块使用（改为全局变量方式，兼容浏览器直接引入）
// export default ProcessingAnimation;
