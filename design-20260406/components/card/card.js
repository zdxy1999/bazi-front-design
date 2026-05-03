/**
 * Card组件逻辑
 * 处理光晕跟随鼠标、边缘高光和移动端平滑飘动效果
 * 参考: https://codepen.io/simeydotme/pen/RNWoPRj
 */

// Card组件 - 处理光晕跟随鼠标、边缘高光和移动端平滑飘动效果

/**
 * 辅助函数: 四舍五入到指定精度
 */
function round(value, precision = 3) {
  return parseFloat(value.toFixed(precision));
}

/**
 * 辅助函数: 限制数值在范围内
 */
function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 计算元素中心点
 */
function centerOfElement(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  return [width / 2, height / 2];
}

/**
 * 计算指针相对于元素的位置（返回像素和百分比）
 */
function pointerPositionRelativeToElement(el, e) {
  const pos = [e.clientX, e.clientY];
  const { left, top, width, height } = el.getBoundingClientRect();
  const x = pos[0] - left;
  const y = pos[1] - top;
  const px = clamp((100 / width) * x);
  const py = clamp((100 / height) * y);
  return { pixels: [x, y], percent: [px, py] };
}

/**
 * 计算从中心点到指针位置的角度（度数）
 */
function angleFromPointerEvent(el, dx, dy) {
  let angleRadians = 0;
  let angleDegrees = 0;
  if (dx !== 0 || dy !== 0) {
    angleRadians = Math.atan2(dy, dx);
    angleDegrees = angleRadians * (180 / Math.PI) + 90;
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
  }
  return angleDegrees;
}

/**
 * 计算距离中心的距离（像素）
 */
function distanceFromCenter(el, x, y) {
  const [cx, cy] = centerOfElement(el);
  return [x - cx, y - cy];
}

/**
 * 计算距离边缘的接近程度 (0 = 中心, 1 = 边缘)
 */
function closenessToEdge(el, x, y) {
  const [cx, cy] = centerOfElement(el);
  const [dx, dy] = distanceFromCenter(el, x, y);
  let k_x = Infinity;
  let k_y = Infinity;
  if (dx !== 0) {
    k_x = cx / Math.abs(dx);
  }
  if (dy !== 0) {
    k_y = cy / Math.abs(dy);
  }
  return clamp((1 / Math.min(k_x, k_y)), 0, 1);
}

class CardComponent {
  constructor() {
    this.cards = document.querySelectorAll('[data-card]');
    this.isMobile = this.checkMobile();
    this.mobileAnimations = new Map(); // 存储移动端的动画实例

    this.init();
  }

  init() {
    this.cards.forEach((card, index) => {
      if (!this.isMobile) {
        // PC端：光晕跟随鼠标 + 边缘高光
        this.initMouseGlow(card);

        // PC端：添加静态边缘发光效果（即使没有hover也能看到颜色）
        this.initStaticGlow(card);

        // 添加类来显示静态光晕
        card.classList.add('static-glow');
      } else {
        // 移动端：添加mobile-glow class，启用自动边缘发光
        card.classList.add('mobile-glow');
        // 移动端：光晕平滑飘动（JavaScript驱动）
        this.initMobileGlow(card);
      }
    });

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = this.checkMobile();

      // 如果设备类型改变，重新初始化
      if (wasMobile !== this.isMobile) {
        this.refresh();
      }
    });
  }

  /**
   * 刷新卡片列表并重新初始化
   * 用于动态添加卡片后重新绑定事件
   */
  refresh() {
    // 停止所有移动端动画
    this.mobileAnimations.forEach((animationId, card) => {
      cancelAnimationFrame(animationId);
    });
    this.mobileAnimations.clear();

    // 重新获取卡片（旧卡片会被DOM移除，事件监听器会自动清理）
    this.cards = document.querySelectorAll('[data-card]');

    // 重新初始化
    this.init();
  }

  /**
   * 检查是否为移动设备
   */
  checkMobile() {
    return window.matchMedia('(hover: none)').matches;
  }

  /**
   * 初始化PC端静态边缘发光效果
   * 让卡片在没有hover时也显示命卦颜色
   */
  initStaticGlow(card) {
    // 设置一个靠近边缘的位置，这样能显示边缘发光
    // 使用右上角附近的位置 (70%, 20%)
    const perx = 70;
    const pery = 20;

    const rect = card.getBoundingClientRect();
    const x = (perx / 100) * rect.width;
    const y = (pery / 100) * rect.height;

    console.log(`🎨 静态光晕计算:`);
    console.log(`  卡片尺寸: ${rect.width}x${rect.height}`);
    console.log(`  位置百分比: x=${perx}%, y=${pery}%`);
    console.log(`  位置像素: x=${x.toFixed(0)}px, y=${y.toFixed(0)}px`);

    // 计算角度和距离
    const [dx, dy] = distanceFromCenter(card, x, y);
    const pointerAngle = angleFromPointerEvent(card, dx, dy);
    const distance = closenessToEdge(card, x, y);

    console.log(`  距离中心: dx=${dx.toFixed(0)}px, dy=${dy.toFixed(0)}px`);
    console.log(`  角度: ${pointerAngle.toFixed(0)}°`);
    console.log(`  距离边缘: ${(distance*100).toFixed(0)}%`);

    // 设置CSS变量
    card.style.setProperty('--pointer-x', `${round(perx)}%`);
    card.style.setProperty('--pointer-y', `${round(pery)}%`);
    card.style.setProperty('--pointer-°', `${round(pointerAngle)}deg`);

    // 关键：设置--pointer-d为一个较大的值，确保opacity不为0
    // opacity公式：clamp((var(--pointer-d) - var(--glow-sens)) / (100 - var(--glow-sens)), 0, 1)
    // 当--glow-sens=30时，如果--pointer-d=60，opacity=clamp(30/70, 0, 1)=0.43
    const pointerD = Math.max(distance * 100, 60); // 至少60，确保可见
    card.style.setProperty('--pointer-d', `${round(pointerD)}`);
  }

  /**
   * 初始化PC端鼠标光晕效果
   */
  initMouseGlow(card) {
    const cardUpdate = (e) => {
      const position = pointerPositionRelativeToElement(card, e);
      const [px, py] = position.pixels;
      const [perx, pery] = position.percent;
      const [dx, dy] = distanceFromCenter(card, px, py);
      const edge = closenessToEdge(card, px, py);
      const angle = angleFromPointerEvent(card, dx, dy);

      // 更新CSS变量
      card.style.setProperty('--pointer-x', `${round(perx)}%`);
      card.style.setProperty('--pointer-y', `${round(pery)}%`);
      card.style.setProperty('--pointer-°', `${round(angle)}deg`);
      card.style.setProperty('--pointer-d', `${round(edge * 100)}`);

      // 移除动画状态
      card.classList.remove('animating');
    };

    card.addEventListener('pointermove', cardUpdate);

    // 鼠标离开时重置位置
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--pointer-x', '50%');
      card.style.setProperty('--pointer-y', '50%');
      card.style.setProperty('--pointer-d', '0%');
    });
  }

  /**
   * 初始化移动端平滑飘动效果
   * 移动端：模拟鼠标沿着边缘缓慢移动，让边缘发光持续显示
   */
  initMobileGlow(card) {
    let frameCount = 0;

    // 创建动画函数
    const animate = () => {
      const rect = card.getBoundingClientRect();
      const time = Date.now() / 1000; // 秒

      // 使用正弦波创建沿着边缘的平滑运动
      // 半径设为45，让虚拟鼠标靠近边缘（距离边缘约55%）
      const angle = time * 0.3; // 速度（更慢）
      const radius = 45; // 半径（百分比）- 靠近边缘

      // 计算位置
      const xPercent = 50 + Math.cos(angle) * radius;
      const yPercent = 50 + Math.sin(angle) * radius;

      // 确保不超出边界
      const clampedX = Math.max(5, Math.min(95, xPercent));
      const clampedY = Math.max(5, Math.min(95, yPercent));

      // 更新光晕位置
      card.style.setProperty('--pointer-x', `${round(clampedX)}%`);
      card.style.setProperty('--pointer-y', `${round(clampedY)}%`);

      // 计算角度和距离
      const [cx, cy] = centerOfElement(card);
      const x = (clampedX / 100) * rect.width;
      const y = (clampedY / 100) * rect.height;
      const [dx, dy] = distanceFromCenter(card, x, y);
      const pointerAngle = angleFromPointerEvent(card, dx, dy);
      const distance = closenessToEdge(card, x, y);

      // 更新边缘高光
      card.style.setProperty('--pointer-°', `${round(pointerAngle)}deg`);
      card.style.setProperty('--pointer-d', `${round(distance * 100)}`);

      frameCount++;

      // 继续动画
      this.mobileAnimations.set(card, requestAnimationFrame(animate));
    };

    // 启动动画
    const animationId = requestAnimationFrame(animate);
    this.mobileAnimations.set(card, animationId);
  }

  /**
   * 清理动画
   */
  cleanup() {
    // 停止所有移动端动画
    this.mobileAnimations.forEach((animationId) => {
      cancelAnimationFrame(animationId);
    });
    this.mobileAnimations.clear();

    // 移除移动端class
    this.cards.forEach(card => {
      card.classList.remove('mobile-glow');
    });

    // 移除所有事件监听器
    this.cards.forEach(card => {
      // 保存所有属性
      const attributes = {};
      for (let attr of card.attributes) {
        attributes[attr.name] = attr.value;
      }

      // 克隆节点以移除所有事件监听器
      const newCard = card.cloneNode(true);

      // 恢复所有属性
      for (let attrName in attributes) {
        newCard.setAttribute(attrName, attributes[attrName]);
      }

      card.parentNode.replaceChild(newCard, card);
    });
  }

  /**
   * 为卡片添加点击回调
   */
  static onCardClick(card, callback) {
    if (!card || typeof callback !== 'function') return;

    if (card.classList.contains('clickable')) {
      card.addEventListener('click', (e) => {
        callback(e, card);
      });
    }
  }

  /**
   * 播放初始动画（可选）
   */
  playIntroAnimation(card) {
    const angleStart = 110;
    const angleEnd = 465;

    card.style.setProperty('--pointer-°', `${angleStart}deg`);
    card.classList.add('animating');

    // 动画1: 距离从0增加到50
    this.animateNumber({
      ease: this.easeOutCubic,
      duration: 500,
      onUpdate: (v) => {
        card.style.setProperty('--pointer-d', v);
      }
    });

    // 动画2: 角度从110度旋转到中间位置
    this.animateNumber({
      ease: this.easeInCubic,
      delay: 0,
      duration: 1500,
      endValue: 50,
      onUpdate: (v) => {
        const d = (angleEnd - angleStart) * (v / 100) + angleStart;
        card.style.setProperty('--pointer-°', `${d}deg`);
      }
    });

    // 动画3: 角度继续旋转到终点
    this.animateNumber({
      ease: this.easeOutCubic,
      delay: 1500,
      duration: 2250,
      startValue: 50,
      endValue: 100,
      onUpdate: (v) => {
        const d = (angleEnd - angleStart) * (v / 100) + angleStart;
        card.style.setProperty('--pointer-°', `${d}deg`);
      }
    });

    // 动画4: 距离从50减少到0
    this.animateNumber({
      ease: this.easeInCubic,
      duration: 1500,
      delay: 2500,
      startValue: 100,
      endValue: 0,
      onUpdate: (v) => {
        card.style.setProperty('--pointer-d', v);
      },
      onEnd: () => {
        card.classList.remove('animating');
      }
    });
  }

  /**
   * 缓动函数: easeOutCubic
   */
  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * 缓动函数: easeInCubic
   */
  easeInCubic(x) {
    return x * x * x;
  }

  /**
   * 数字动画辅助函数
   */
  animateNumber(options) {
    const {
      startValue = 0,
      endValue = 100,
      duration = 1000,
      delay = 0,
      onUpdate = () => {},
      ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      onStart = () => {},
      onEnd = () => {},
    } = options;

    const startTime = performance.now() + delay;

    const update = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1); // Normalize to [0, 1]
      const easedValue = startValue + (endValue - startValue) * ease(t); // Apply easing

      onUpdate(easedValue);

      if (t < 1) {
        requestAnimationFrame(update); // Continue the animation
      } else if (t >= 1) {
        onEnd();
      }
    };

    setTimeout(() => {
      onStart();
      requestAnimationFrame(update); // Start the animation after the delay
    }, delay);
  }
}

// 导出CardComponent类供外部使用
window.CardComponent = CardComponent;
