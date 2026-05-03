/**
 * 翻页容器组件脚本 - Coverflow 3D效果
 * 支持：
 * - PC端：鼠标拖拽 + 点击导航
 * - 移动端：触摸滑动
 * - 中间放大，两侧缩小的3D效果
 */

class Swiper {
  constructor(container, options = {}) {
    this.container = container;
    this.wrapper = container.querySelector('.swiper-wrapper');
    this.slides = Array.from(container.querySelectorAll('.swiper-slide'));
    this.prevButton = container.querySelector('.swiper-button-prev');
    this.nextButton = container.querySelector('.swiper-button-next');
    this.pagination = container.querySelector('.swiper-pagination');

    // console.log('[Swiper Constructor] 创建新实例');
    // console.log('[Swiper Constructor] 容器:', container);
    // console.log('[Swiper Constructor] 是否已有实例:', container.swiperInstance ? 'YES' : 'NO');
    // console.log('[Swiper Constructor] nextButton数量:', document.querySelectorAll('.swiper-button-next').length);

    // 检测是否为简单模式（无3D效果）
    this.simpleMode = container.hasAttribute('data-swiper-simple') ||
                      options.simple === true;

    // 配置参数
    this.options = {
      loop: options.loop || false,
      autoplay: options.autoplay || false,
      simple: this.simpleMode,
      ...options
    };

    // 状态
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.threshold = 50; // 滑动阈值

    // 防止重复执行的标志
    this.isAnimating = false;

    // 初始化
    this.init();

    // 如果是简单模式，添加类标记
    if (this.simpleMode) {
      this.container.classList.add('swiper-simple');
    }
  }

  init() {
    const instanceId = Math.random().toString(36).substring(7);
    // console.log(`[Swiper ${instanceId}] init() 被调用`);
    // console.log(`[Swiper ${instanceId}] 容器ID:`, this.container.id || '无ID');
    // console.log(`[Swiper ${instanceId}] 容器已有实例:`, this.container.swiperInstance ? 'YES' : 'NO');

    // 设置初始状态
    this.updateSlidesClasses();

    // 创建分页指示器
    if (this.pagination) {
      this.createPagination();
    }

    // 绑定事件
    this.bindEvents();

    // 更新导航按钮状态
    this.updateNavigation();

    // console.log(`[Swiper ${instanceId}] init() 完成`);
  }

  bindEvents() {
    // 触摸事件
    this.container.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
    this.container.addEventListener('touchend', this.touchEnd.bind(this));

    // 鼠标事件（PC端拖拽）
    this.container.addEventListener('mousedown', this.mouseDown.bind(this));

    // 点击幻灯片切换
    this.slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        // console.log(`[Slide Click] slide被点击, index: ${index}, currentIndex: ${this.currentIndex}`);
        if (index !== this.currentIndex) {
          this.slideTo(index);
        } else {
          // console.log(`[Slide Click] 点击的是当前slide，忽略`);
        }
      });
    });

    // 导航按钮 - 防止重复绑定
    if (this.prevButton && !this.prevButton.hasAttribute('data-event-bound')) {
      // console.log('[Swiper] 绑定上一页按钮事件');
      this.prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // console.log('[Swiper] 上一页按钮被点击');
        this.slidePrev();
      });
      this.prevButton.setAttribute('data-event-bound', 'true');
    } else {
      // console.log('[Swiper] 上一页按钮事件已绑定，跳过');
    }
    if (this.nextButton && !this.nextButton.hasAttribute('data-event-bound')) {
      // console.log('[Swiper] 绑定下一页按钮事件');
      this.nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // console.log('[Swiper] 下一页按钮被点击');
        this.slideNext();
      });
      this.nextButton.setAttribute('data-event-bound', 'true');
    } else {
      // console.log('[Swiper] 下一页按钮事件已绑定，跳过');
    }

    // 键盘导航
    this.container.addEventListener('keydown', this.onKeyDown.bind(this));
    this.container.setAttribute('tabindex', '0');
  }

  // 触摸事件处理
  touchStart(event) {
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
  }

  touchMove(event) {
    if (!this.isDragging) return;

    this.currentX = event.touches[0].clientX;
    const diff = this.currentX - this.startX;

    // 如果是水平滑动，阻止默认行为
    if (Math.abs(diff) > 10) {
      event.preventDefault();
    }
  }

  touchEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    const diff = this.currentX - this.startX;

    // 根据滑动距离和方向切换幻灯片
    if (Math.abs(diff) > this.threshold) {
      if (diff > 0) {
        this.slidePrev();
      } else if (diff < 0) {
        this.slideNext();
      }
    }

    this.startX = 0;
    this.currentX = 0;
  }

  // 鼠标事件处理（PC端）
  mouseDown(event) {
    // 记录初始位置，用于可能的拖拽
    this.startX = event.clientX;
    this.isDragging = true;

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      this.currentX = e.clientX;
    };

    const onMouseUp = () => {
      if (!this.isDragging) return;

      const diff = this.currentX - this.startX;

      // 根据拖拽距离切换幻灯片
      if (Math.abs(diff) > this.threshold) {
        if (diff > 0) {
          this.slidePrev();
        } else if (diff < 0) {
          this.slideNext();
        }
      }

      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // 更新幻灯片class
  updateSlidesClasses() {
    // 添加调用栈追踪
    const stack = new Error().stack;
    const caller = stack.split('\n')[2]?.trim() || 'unknown';
    // 调试日志已清理
    // console.log(`[Swiper] updateSlidesClasses调用，currentIndex: ${this.currentIndex}, 简单模式: ${this.simpleMode}`);
    // console.log(`[Swiper] 调用来源: ${caller}`);

    this.slides.forEach((slide, loopIndex) => {
      const slideIndex = parseInt(slide.dataset.index || loopIndex);

      // 移除所有状态class
      slide.classList.remove(
        'swiper-slide-active',
        'swiper-slide-prev',
        'swiper-slide-prev-prev',
        'swiper-slide-next',
        'swiper-slide-next-next',
        'swiper-slide-hidden'
      );

      // 简单模式：只标记active，不使用其他状态
      if (this.simpleMode) {
        if (slideIndex === this.currentIndex) {
          slide.classList.add('swiper-slide-active');
          // console.log(`[Swiper] 标记slide (data-index=${slideIndex}, DOM位置=${loopIndex}) 为active`);
        }
        // 其他slides不添加任何类，CSS会隐藏它们
      } else {
        // 3D模式：添加完整的状态类
        if (slideIndex === this.currentIndex) {
          slide.classList.add('swiper-slide-active');
        } else if (slideIndex === this.currentIndex - 1) {
          slide.classList.add('swiper-slide-prev');
        } else if (slideIndex === this.currentIndex - 2) {
          slide.classList.add('swiper-slide-prev-prev');
        } else if (slideIndex === this.currentIndex + 1) {
          slide.classList.add('swiper-slide-next');
        } else if (slideIndex === this.currentIndex + 2) {
          slide.classList.add('swiper-slide-next-next');
        } else {
          slide.classList.add('swiper-slide-hidden');
        }
      }
    });

    // 触发swiperChange事件
    const event = new CustomEvent('swiperChange', {
      detail: { activeIndex: this.currentIndex },
      bubbles: true
    });
    this.container.dispatchEvent(event);
  }

  // 上一张
  slidePrev() {
    // 防止重复执行
    if (this.isAnimating) {
      // console.log(`[slidePrev] 正在执行中，跳过本次调用`);
      return;
    }

    // console.log(`[slidePrev] 调用，当前currentIndex: ${this.currentIndex}`);
    this.isAnimating = true;

    if (this.currentIndex > 0) {
      this.currentIndex--;
      // console.log(`[slidePrev] currentIndex变为: ${this.currentIndex}`);
    } else if (this.options.loop) {
      // 循环模式：跳到最后一张
      this.currentIndex = this.slides.length - 1;
      // console.log(`[slidePrev] 循环模式，currentIndex变为: ${this.currentIndex}`);
    } else {
      // console.log(`[slidePrev] 已是第一张，无法向前`);
      this.isAnimating = false;
      return;
    }

    this.updateSlidesClasses();
    this.updateNavigation();
    this.updatePagination();

    // 延迟重置标志，确保动画完成
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  // 下一张
  slideNext() {
    // 防止重复执行
    if (this.isAnimating) {
      // console.log(`[slideNext] 正在执行中，跳过本次调用`);
      return;
    }

    // console.log(`[slideNext] 调用，当前currentIndex: ${this.currentIndex}`);
    this.isAnimating = true;

    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      // console.log(`[slideNext] currentIndex变为: ${this.currentIndex}`);
    } else if (this.options.loop) {
      // 循环模式：跳到第一张
      this.currentIndex = 0;
      // console.log(`[slideNext] 循环模式，currentIndex变为: ${this.currentIndex}`);
    } else {
      // console.log(`[slideNext] 已是最后一张，无法向后`);
      this.isAnimating = false;
      return;
    }

    this.updateSlidesClasses();
    this.updateNavigation();
    this.updatePagination();

    // 延迟重置标志，确保动画完成
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  // 跳转到指定幻灯片
  slideTo(index) {
    // console.log(`[slideTo] 调用，目标index: ${index}, 当前currentIndex: ${this.currentIndex}`);
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      // console.log(`[slideTo] currentIndex设置为: ${this.currentIndex}`);
      this.updateSlidesClasses();
      this.updateNavigation();
      this.updatePagination();
    } else {
      // console.log(`[slideTo] index ${index} 超出范围 [0, ${this.slides.length - 1}]`);
    }
  }

  // 更新导航按钮状态
  updateNavigation() {
    // 循环模式下，导航按钮始终可用
    if (this.options.loop) {
      if (this.prevButton) {
        this.prevButton.classList.remove('swiper-button-disabled');
      }
      if (this.nextButton) {
        this.nextButton.classList.remove('swiper-button-disabled');
      }
    } else {
      // 非循环模式，边界处禁用按钮
      if (this.prevButton) {
        if (this.currentIndex === 0) {
          this.prevButton.classList.add('swiper-button-disabled');
        } else {
          this.prevButton.classList.remove('swiper-button-disabled');
        }
      }

      if (this.nextButton) {
        if (this.currentIndex === this.slides.length - 1) {
          this.nextButton.classList.add('swiper-button-disabled');
        } else {
          this.nextButton.classList.remove('swiper-button-disabled');
        }
      }
    }
  }

  // 创建分页指示器
  createPagination() {
    this.pagination.innerHTML = '';

    // 设置pagination容器 - 使用flexbox布局
    this.pagination.style.setProperty('display', 'flex', 'important');
    this.pagination.style.setProperty('flex-direction', 'row', 'important');
    this.pagination.style.setProperty('justify-content', 'center', 'important');
    this.pagination.style.setProperty('align-items', 'center', 'important');
    this.pagination.style.setProperty('gap', '8px', 'important');
    this.pagination.style.setProperty('width', '100%', 'important');

    // 创建bullets
    this.slides.forEach((slide, domIndex) => {
      const bullet = document.createElement('div');
      bullet.className = 'swiper-pagination-bullet';
      bullet.dataset.index = domIndex;
      // 不显示数字，只显示圆点

      if (domIndex === this.currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }

      bullet.addEventListener('click', (e) => {
        e.stopPropagation();
        this.slideTo(domIndex);
      });

      this.pagination.appendChild(bullet);
    });

    // console.log('Pagination创建完成（flexbox模式），bullets数量:', this.pagination.children.length);
  }

  // 更新分页指示器
  updatePagination() {
    if (!this.pagination) return;

    const bullets = this.pagination.querySelectorAll('.swiper-pagination-bullet');

    // 先移除所有active类
    bullets.forEach((bullet) => {
      bullet.classList.remove('swiper-pagination-bullet-active');
    });

    // 根据currentIndex高亮对应的bullet
    bullets.forEach((bullet) => {
      const bulletIndex = parseInt(bullet.dataset.index);
      if (bulletIndex === this.currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
        // console.log(`[Pagination] 高亮bullet ${bulletIndex}`);
      }
    });
  }

  // 键盘导航
  onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      this.slidePrev();
    } else if (event.key === 'ArrowRight') {
      this.slideNext();
    }
  }

  // 销毁
  destroy() {
    // 清空pagination（如果有）
    if (this.pagination) {
      this.pagination.innerHTML = '';
    }

    // 移除导航按钮事件监听器
    if (this.prevButton) {
      const newPrev = this.prevButton.cloneNode(true);
      this.prevButton.parentNode.replaceChild(newPrev, this.prevButton);
    }
    if (this.nextButton) {
      const newNext = this.nextButton.cloneNode(true);
      this.nextButton.parentNode.replaceChild(newNext, this.nextButton);
    }

    // 移除slide事件监听器
    this.slides.forEach(slide => {
      const newSlide = slide.cloneNode(true);
      slide.parentNode.replaceChild(newSlide, slide);
    });
  }
}

// 全局Swiper实例计数器
if (!window.globalSwiperInstanceCount) {
  window.globalSwiperInstanceCount = 0;
}

// 初始化所有swiper实例
function initSwipers() {
  // console.log('[initSwipers] 函数被调用');
  const swiperContainers = document.querySelectorAll('.swiper');
  // console.log(`[initSwipers] 找到 ${swiperContainers.length} 个swiper容器`);

  swiperContainers.forEach((container, index) => {
    // console.log(`[initSwipers] 处理容器 ${index}`);
    // console.log(`[initSwipers] 容器 ${index} 已有实例:`, container.swiperInstance ? 'YES' : 'NO');

    // 检查是否已有实例（避免重复初始化）
    if (container.swiperInstance) {
      // console.log(`[initSwipers] 容器 ${index} 已有实例，跳过`);
      return; // 跳过已有实例的容器
    }

    // 检查是否启用循环模式
    const loop = container.hasAttribute('data-swiper-loop');
    const autoplay = container.hasAttribute('data-swiper-autoplay');
    const simple = container.hasAttribute('data-swiper-simple');

    // console.log(`[initSwipers] 创建swiper实例 ${window.globalSwiperInstanceCount}`);
    // 创建swiper实例
    const swiper = new Swiper(container, {
      loop: loop,
      autoplay: autoplay,
      simple: simple
    });

    window.globalSwiperInstanceCount++;
    // console.log(`[initSwipers] 全局swiper实例总数: ${window.globalSwiperInstanceCount}`);

    // 将实例保存到容器上
    container.swiperInstance = swiper;
  });
}

// 页面加载完成后不再自动初始化（由页面手动控制）
// 注释掉自动初始化，避免和页面手动初始化冲突
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', initSwipers);
// } else {
//   initSwipers();
// }

// 导出供外部使用
window.Swiper = Swiper;
window.initSwipers = initSwipers;
