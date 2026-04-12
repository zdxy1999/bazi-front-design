/**
 * 按钮组件交互脚本
 * 实现按钮的光晕跟随效果、点击波纹效果等
 */

// ============================================
// 按钮光晕跟随效果
// ============================================

function initButtonGlowEffect() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('mousemove', function(e) {
      const rect = button.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      button.style.setProperty('--mouse-x', `${x}%`);
      button.style.setProperty('--mouse-y', `${y}%`);
    });

    button.addEventListener('mouseleave', function() {
      button.style.setProperty('--mouse-x', `50%`);
      button.style.setProperty('--mouse-y', `50%`);
    });
  });

  console.log(`已初始化 ${buttons.length} 个按钮的光晕效果`);
}

// ============================================
// 按钮点击波纹效果
// ============================================

function initButtonRippleEffect() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 如果按钮是禁用状态或加载状态，不显示波纹
      if (button.disabled || button.classList.contains('btn-loading')) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 创建波纹元素
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');

      // 设置波纹位置和大小
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      // 添加到按钮
      button.appendChild(ripple);

      // 动画结束后移除
      ripple.addEventListener('animationend', function() {
        ripple.remove();
      });
    });
  });

  console.log(`已初始化 ${buttons.length} 个按钮的波纹效果`);
}

// ============================================
// 按钮加载状态切换
// ============================================

/**
 * 设置按钮加载状态
 * @param {HTMLElement|string} button - 按钮元素或选择器
 * @param {boolean} loading - 是否加载中
 * @param {string} loadingText - 加载中文字
 */
function setButtonLoading(button, loading = true, loadingText = '加载中...') {
  const btn = typeof button === 'string'
    ? document.querySelector(button)
    : button;

  if (!btn) {
    console.error('按钮元素不存在:', button);
    return;
  }

  if (loading) {
    // 保存原始内容
    if (!btn.hasAttribute('data-original-text')) {
      btn.setAttribute('data-original-text', btn.textContent.trim());
    }

    // 添加加载状态
    btn.classList.add('btn-loading');

    // 添加加载指示器和文字
    const spinner = document.createElement('span');
    spinner.classList.add('btn-spinner');
    spinner.setAttribute('data-spinner', '');

    const text = document.createElement('span');
    text.textContent = loadingText;
    text.setAttribute('data-loading-text', '');

    // 清空按钮并添加加载内容
    btn.innerHTML = '';
    btn.appendChild(spinner);
    btn.appendChild(text);
  } else {
    // 移除加载状态
    btn.classList.remove('btn-loading');

    // 恢复原始内容
    const originalText = btn.getAttribute('data-original-text');
    if (originalText) {
      btn.textContent = originalText;
      btn.removeAttribute('data-original-text');
    }
  }
}

// ============================================
// 按钮禁用状态切换
// ============================================

/**
 * 设置按钮禁用状态
 * @param {HTMLElement|string} button - 按钮元素或选择器
 * @param {boolean} disabled - 是否禁用
 */
function setButtonDisabled(button, disabled = true) {
  const btn = typeof button === 'string'
    ? document.querySelector(button)
    : button;

  if (!btn) {
    console.error('按钮元素不存在:', button);
    return;
  }

  btn.disabled = disabled;

  if (disabled) {
    btn.classList.add('disabled');
  } else {
    btn.classList.remove('disabled');
  }
}

// ============================================
// 按钮组单选行为
// ============================================

/**
 * 初始化按钮组单选行为
 * @param {HTMLElement|string} container - 按钮组容器或选择器
 * @param {Function} callback - 选中回调函数
 */
function initButtonGroup(container, callback) {
  const group = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!group) {
    console.error('按钮组容器不存在:', container);
    return;
  }

  const buttons = group.querySelectorAll('.btn');

  buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // 如果按钮被禁用或加载中，不处理
      if (button.disabled || button.classList.contains('btn-loading')) {
        return;
      }

      // 移除所有按钮的激活状态
      buttons.forEach(btn => btn.classList.remove('btn-active'));

      // 激活当前按钮
      button.classList.add('btn-active');

      // 调用回调
      if (typeof callback === 'function') {
        callback(button, index);
      }
    });
  });

  console.log(`已初始化按钮组单选行为，共 ${buttons.length} 个按钮`);
}

// ============================================
// 按钮确认对话框
// ============================================

/**
 * 为危险按钮添加确认对话框
 * @param {HTMLElement|string} button - 按钮元素或选择器
 * @param {string} message - 确认消息
 * @param {Function} callback - 确认后回调
 */
function initButtonConfirm(button, message = '确定要执行此操作吗？', callback) {
  const btn = typeof button === 'string'
    ? document.querySelector(button)
    : button;

  if (!btn) {
    console.error('按钮元素不存在:', button);
    return;
  }

  btn.addEventListener('click', function(e) {
    e.preventDefault();

    if (confirm(message)) {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });

  console.log('已为按钮添加确认对话框');
}

// ============================================
// 全局初始化
// ============================================

// 页面加载完成后初始化所有效果
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initButtonGlowEffect();
    initButtonRippleEffect();
  });
} else {
  initButtonGlowEffect();
  initButtonRippleEffect();
}

// 导出供外部使用
window.ButtonUtils = {
  setButtonLoading,
  setButtonDisabled,
  initButtonGroup,
  initButtonConfirm,
  initButtonGlowEffect,
  initButtonRippleEffect
};

// ============================================
// 按钮演示功能
// ============================================

// 为演示页面的按钮添加点击反馈
document.addEventListener('DOMContentLoaded', function() {
  // 所有按钮点击后显示提示
  const allButtons = document.querySelectorAll('.btn:not(.btn-loading):not(:disabled)');

  allButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 如果是演示按钮，显示点击效果
      console.log('按钮被点击:', button.textContent.trim());

      // 如果是加载按钮，模拟加载状态
      if (button.classList.contains('btn-loading')) {
        console.log('按钮进入加载状态');
      }
    });
  });
});
