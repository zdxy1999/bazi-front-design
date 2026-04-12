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

    // 初始化
    this.init();

    // 如果是简单模式，添加类标记
    if (this.simpleMode) {
      this.container.classList.add('swiper-simple');
      console.log('Swiper简单模式已启用');
    }
  }

  init() {
    console.log('[Swiper] init()开始执行');
    console.log('[Swiper] slides数量:', this.slides.length);
    console.log('[Swiper] 当前索引:', this.currentIndex);
    console.log('[Swiper] 简单模式:', this.simpleMode);

    // 设置初始状态
    console.log('[Swiper] 调用updateSlidesClasses()...');
    this.updateSlidesClasses();
    console.log('[Swiper] updateSlidesClasses()完成');

    // 创建分页指示器
    if (this.pagination) {
      this.createPagination();
    }

    // 绑定事件
    this.bindEvents();

    // 更新导航按钮状态
    this.updateNavigation();

    console.log('[Swiper] init()完成');
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
        if (index !== this.currentIndex) {
          this.slideTo(index);
        }
      });
    });

    // 导航按钮
    if (this.prevButton) {
      console.log('[Swiper] 找到上一页按钮，绑定事件');
      this.prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('[Swiper] 点击上一页');
        this.slidePrev();
      });
    } else {
      console.warn('[Swiper] 未找到上一页按钮');
    }
    if (this.nextButton) {
      console.log('[Swiper] 找到下一页按钮，绑定事件');
      this.nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('[Swiper] 点击下一页');
        this.slideNext();
      });
    } else {
      console.warn('[Swiper] 未找到下一页按钮');
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
    console.log(`[Swiper] updateSlidesClasses调用，当前索引: ${this.currentIndex}, 简单模式: ${this.simpleMode}`);

    this.slides.forEach((slide, index) => {
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
        if (index === this.currentIndex) {
          slide.classList.add('swiper-slide-active');
          console.log(`[Swiper] 标记slide ${index} 为active`);
        }
        // 其他slides不添加任何类，CSS会隐藏它们
      } else {
        // 3D模式：添加完整的状态类
        if (index === this.currentIndex) {
          slide.classList.add('swiper-slide-active');
        } else if (index === this.currentIndex - 1) {
          slide.classList.add('swiper-slide-prev');
        } else if (index === this.currentIndex - 2) {
          slide.classList.add('swiper-slide-prev-prev');
        } else if (index === this.currentIndex + 1) {
          slide.classList.add('swiper-slide-next');
        } else if (index === this.currentIndex + 2) {
          slide.classList.add('swiper-slide-next-next');
        } else {
          slide.classList.add('swiper-slide-hidden');
        }
      }
    });

    console.log(`[Swiper] updateSlidesClasses完成，active slide数量: ${document.querySelectorAll('.swiper-slide-active').length}`);

    // 触发swiperChange事件
    const event = new CustomEvent('swiperChange', {
      detail: { activeIndex: this.currentIndex },
      bubbles: true
    });
    this.container.dispatchEvent(event);
    console.log(`[Swiper] 触发swiperChange事件，activeIndex: ${this.currentIndex}`);
  }

  // 上一张
  slidePrev() {
    console.log('[Swiper] slidePrev调用，当前索引:', this.currentIndex, 'slides总数:', this.slides.length);
    if (this.currentIndex > 0) {
      this.currentIndex--;
      console.log('[Swiper] 切换到索引:', this.currentIndex);
    } else if (this.options.loop) {
      // 循环模式：跳到最后一张
      this.currentIndex = this.slides.length - 1;
      console.log('[Swiper] 循环模式，跳到最后一张，索引:', this.currentIndex);
    } else {
      console.log('[Swiper] 已是第一张，无法向前');
      return;
    }
    this.updateSlidesClasses();
    this.updateNavigation();
    this.updatePagination();
  }

  // 下一张
  slideNext() {
    console.log('[Swiper] slideNext调用，当前索引:', this.currentIndex, 'slides总数:', this.slides.length);
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      console.log('[Swiper] 切换到索引:', this.currentIndex);
    } else if (this.options.loop) {
      // 循环模式：跳到第一张
      this.currentIndex = 0;
      console.log('[Swiper] 循环模式，跳到第一张，索引:', this.currentIndex);
    } else {
      console.log('[Swiper] 已是最后一张，无法向后');
      return;
    }
    this.updateSlidesClasses();
    this.updateNavigation();
    this.updatePagination();
  }

  // 跳转到指定幻灯片
  slideTo(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.updateSlidesClasses();
      this.updateNavigation();
      this.updatePagination();
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
    this.slides.forEach((_, index) => {
      const bullet = document.createElement('div');
      bullet.className = 'swiper-pagination-bullet';
      if (index === 0) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', (e) => {
        e.stopPropagation();
        this.slideTo(index);
      });
      this.pagination.appendChild(bullet);
    });
  }

  // 更新分页指示器
  updatePagination() {
    if (!this.pagination) return;

    const bullets = this.pagination.querySelectorAll('.swiper-pagination-bullet');
    bullets.forEach((bullet, index) => {
      if (index === this.currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      } else {
        bullet.classList.remove('swiper-pagination-bullet-active');
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
    // 移除事件监听器（简化版）
    this.slides.forEach(slide => {
      slide.replaceWith(slide.cloneNode(true));
    });
  }
}

// 初始化所有swiper实例
function initSwipers() {
  const swiperContainers = document.querySelectorAll('.swiper');

  swiperContainers.forEach(container => {
    // 检查是否启用循环模式
    const loop = container.hasAttribute('data-swiper-loop');
    const autoplay = container.hasAttribute('data-swiper-autoplay');
    const simple = container.hasAttribute('data-swiper-simple');

    // 创建swiper实例
    const swiper = new Swiper(container, {
      loop: loop,
      autoplay: autoplay,
      simple: simple
    });

    // 将实例保存到容器上
    container.swiperInstance = swiper;
  });

  console.log(`已初始化 ${swiperContainers.length} 个swiper实例`);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwipers);
} else {
  initSwipers();
}

// 导出供外部使用
window.Swiper = Swiper;
window.initSwipers = initSwipers;
