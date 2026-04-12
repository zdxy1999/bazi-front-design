/**
 * 输入框组件交互脚本
 * 实现输入框验证、自动完成、字符计数等功能
 */

// ============================================
// 输入框验证
// ============================================

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean}
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号
 * @returns {boolean}
 */
function validatePhone(phone) {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
}

/**
 * 验证身份证号（中国大陆）
 * @param {string} idCard - 身份证号
 * @returns {boolean}
 */
function validateIdCard(idCard) {
  const re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return re.test(idCard);
}

/**
 * 设置输入框验证状态
 * @param {HTMLElement} input - 输入框元素
 * @param {string} type - 验证类型
 * @param {Function} validator - 验证函数
 * @param {string} errorMessage - 错误消息
 * @param {string} successMessage - 成功消息
 */
function setInputValidation(input, type, validator, errorMessage, successMessage) {
  // 获取或创建消息容器
  let messageEl = input.parentNode.querySelector('.input-error-text, .input-success-text');

  input.addEventListener('blur', function() {
    const value = input.value.trim();

    // 空值不验证
    if (!value) {
      input.classList.remove('input-error', 'input-success');
      if (messageEl) messageEl.remove();
      return;
    }

    // 执行验证
    const isValid = validator(value);

    // 移除旧的状态和消息
    input.classList.remove('input-error', 'input-success');
    if (messageEl) messageEl.remove();

    if (isValid) {
      input.classList.add('input-success');
      if (successMessage) {
        messageEl = document.createElement('span');
        messageEl.className = 'input-success-text';
        messageEl.textContent = successMessage;
        input.parentNode.appendChild(messageEl);
      }
    } else {
      input.classList.add('input-error');
      if (errorMessage) {
        messageEl = document.createElement('span');
        messageEl.className = 'input-error-text';
        messageEl.textContent = errorMessage;
        input.parentNode.appendChild(messageEl);
      }
    }
  });

  // 输入时清除错误状态
  input.addEventListener('input', function() {
    if (input.classList.contains('input-error') || input.classList.contains('input-success')) {
      input.classList.remove('input-error', 'input-success');
      if (messageEl) messageEl.remove();
    }
  });
}

// ============================================
// 字符计数
// ============================================

/**
 * 添加字符计数功能
 * @param {HTMLElement} input - 输入框元素
 * @param {number} maxLength - 最大字符数
 * @param {HTMLElement} container - 容器元素
 */
function addCharCounter(input, maxLength, container = null) {
  const counter = document.createElement('span');
  counter.className = 'input-counter';
  counter.style.cssText = `
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: var(--text-secondary);
    text-align: right;
  `;
  updateCounter();

  const targetContainer = container || input.parentNode;
  targetContainer.appendChild(counter);

  input.addEventListener('input', updateCounter);

  function updateCounter() {
    const length = input.value.length;
    counter.textContent = `${length}/${maxLength}`;

    if (length > maxLength) {
      counter.style.color = 'rgba(248, 113, 113, 0.9)';
    } else if (length >= maxLength * 0.9) {
      counter.style.color = 'rgba(253, 224, 71, 0.9)';
    } else {
      counter.style.color = 'var(--text-secondary)';
    }
  }
}

// ============================================
// 密码强度检测
// ============================================

/**
 * 检测密码强度
 * @param {string} password - 密码
 * @returns {object} {score: 0-4, text: string, color: string}
 */
function checkPasswordStrength(password) {
  let score = 0;

  if (!password) {
    return { score: 0, text: '请输入密码', color: 'rgba(156, 163, 175, 0.9)' };
  }

  // 长度检查
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 包含数字
  if (/\d/.test(password)) score++;

  // 包含小写字母
  if (/[a-z]/.test(password)) score++;

  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;

  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // 限制最大分数为4
  score = Math.min(score, 4);

  const levels = [
    { text: '非常弱', color: 'rgba(248, 113, 113, 0.9)' },
    { text: '弱', color: 'rgba(248, 113, 113, 0.9)' },
    { text: '中等', color: 'rgba(253, 224, 71, 0.9)' },
    { text: '强', color: 'rgba(134, 239, 172, 0.9)' },
    { text: '非常强', color: 'rgba(74, 222, 128, 0.9)' }
  ];

  return {
    score,
    ...levels[score]
  };
}

/**
 * 添加密码强度指示器
 * @param {HTMLElement} input - 密码输入框
 * @param {HTMLElement} container - 容器元素
 */
function addPasswordStrengthIndicator(input, container = null) {
  const wrapper = document.createElement('div');
  wrapper.className = 'password-strength';
  wrapper.style.cssText = `
    margin-top: 8px;
  `;

  const bar = document.createElement('div');
  bar.style.cssText = `
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 6px;
  `;

  const fill = document.createElement('div');
  fill.style.cssText = `
    height: 100%;
    width: 0%;
    transition: all 0.3s ease;
    border-radius: 2px;
  `;
  bar.appendChild(fill);

  const text = document.createElement('span');
  text.style.cssText = `
    font-size: 12px;
    color: var(--text-secondary);
  `;

  wrapper.appendChild(bar);
  wrapper.appendChild(text);

  const targetContainer = container || input.parentNode;
  targetContainer.appendChild(wrapper);

  input.addEventListener('input', function() {
    const result = checkPasswordStrength(input.value);

    fill.style.width = `${(result.score / 4) * 100}%`;
    fill.style.background = result.color;
    text.textContent = result.text;
    text.style.color = result.color;
  });

  // 初始化显示
  const initial = checkPasswordStrength('');
  text.textContent = initial.text;
}

// ============================================
// 自动完成
// ============================================

/**
 * 添加自动完成功能
 * @param {HTMLElement} input - 输入框元素
 * @param {Array} suggestions - 建议列表
 * @param {Function} onSelect - 选中回调
 */
function addAutocomplete(input, suggestions, onSelect) {
  const list = document.createElement('div');
  list.className = 'autocomplete-list';
  list.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
  `;

  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(list);

  let currentIndex = -1;

  input.addEventListener('input', function() {
    const value = input.value.toLowerCase().trim();

    if (!value) {
      list.style.display = 'none';
      return;
    }

    const filtered = suggestions.filter(s =>
      s.toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
      list.style.display = 'none';
      return;
    }

    list.innerHTML = '';
    filtered.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = suggestion;
      item.style.cssText = `
        padding: 10px 16px;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.2s ease;
      `;

      item.addEventListener('mouseenter', () => {
        currentIndex = index;
        highlightItem();
      });

      item.addEventListener('click', () => {
        input.value = suggestion;
        list.style.display = 'none';
        if (typeof onSelect === 'function') {
          onSelect(suggestion);
        }
      });

      list.appendChild(item);
    });

    list.style.display = 'block';
    currentIndex = -1;
  });

  // 键盘导航
  input.addEventListener('keydown', function(e) {
    if (list.style.display === 'none') return;

    const items = list.querySelectorAll('.autocomplete-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = Math.min(currentIndex + 1, items.length - 1);
      highlightItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      highlightItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0 && items[currentIndex]) {
        items[currentIndex].click();
      }
    } else if (e.key === 'Escape') {
      list.style.display = 'none';
    }
  });

  function highlightItem() {
    const items = list.querySelectorAll('.autocomplete-item');
    items.forEach((item, index) => {
      if (index === currentIndex) {
        item.style.background = 'rgba(255, 255, 255, 0.1)';
      } else {
        item.style.background = 'transparent';
      }
    });
  }

  // 点击外部关闭
  document.addEventListener('click', function(e) {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.style.display = 'none';
    }
  });
}

// ============================================
// 浮动标签
// ============================================

/**
 * 添加浮动标签效果
 * @param {HTMLElement} input - 输入框元素
 * @param {HTMLElement} label - 标签元素
 */
function addFloatingLabel(input, label) {
  input.addEventListener('focus', () => {
    label.classList.add('input-label-floating');
  });

  input.addEventListener('blur', () => {
    if (!input.value) {
      label.classList.remove('input-label-floating');
    }
  });

  // 初始化状态
  if (input.value) {
    label.classList.add('input-label-floating');
  }
}

// ============================================
// 清空按钮
// ============================================

/**
 * 添加清空按钮
 * @param {HTMLElement} input - 输入框元素
 */
function addClearButton(input) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper';
  wrapper.style.position = 'relative';

  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const button = document.createElement('button');
  button.className = 'input-clear-btn';
  button.type = 'button';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  button.style.cssText = `
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    display: ${input.value ? 'block' : 'none'};
  `;

  wrapper.appendChild(button);

  // 显示/隐藏按钮
  input.addEventListener('input', () => {
    button.style.display = input.value ? 'block' : 'none';
    button.style.opacity = input.value ? '1' : '0';
    button.style.pointerEvents = input.value ? 'auto' : 'none';
  });

  input.addEventListener('focus', () => {
    if (input.value) {
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
    }
  });

  input.addEventListener('blur', () => {
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';
  });

  // 清空输入
  button.addEventListener('click', () => {
    input.value = '';
    input.focus();
    button.style.display = 'none';
    input.dispatchEvent(new Event('input'));
  });
}

// ============================================
// 表单验证
// ============================================

/**
 * 验证整个表单
 * @param {HTMLElement} form - 表单元素
 * @returns {boolean}
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    const value = input.value.trim();

    if (!value) {
      isValid = false;
      input.classList.add('input-error');

      // 添加错误消息
      let messageEl = input.parentNode.querySelector('.input-error-text');
      if (!messageEl) {
        messageEl = document.createElement('span');
        messageEl.className = 'input-error-text';
        messageEl.textContent = '此字段为必填项';
        input.parentNode.appendChild(messageEl);
      }

      // 焦点到第一个错误输入框
      if (isValid === false) {
        input.focus();
      }
    } else {
      input.classList.remove('input-error');
      const messageEl = input.parentNode.querySelector('.input-error-text');
      if (messageEl) messageEl.remove();
    }
  });

  return isValid;
}

// ============================================
// 全局初始化
// ============================================

// 自动为带特定类名的输入框添加功能
document.addEventListener('DOMContentLoaded', function() {
  // 邮箱验证
  document.querySelectorAll('input[type="email"].validate').forEach(input => {
    setInputValidation(
      input,
      'email',
      validateEmail,
      '请输入有效的邮箱地址',
      '邮箱格式正确'
    );
  });

  // 电话验证
  document.querySelectorAll('input[type="tel"].validate').forEach(input => {
    setInputValidation(
      input,
      'tel',
      validatePhone,
      '请输入有效的手机号',
      '手机号格式正确'
    );
  });

  // 表单提交验证
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
});

// 导出供外部使用
window.InputUtils = {
  validateEmail,
  validatePhone,
  validateIdCard,
  setInputValidation,
  addCharCounter,
  addPasswordStrengthIndicator,
  addAutocomplete,
  addFloatingLabel,
  addClearButton,
  validateForm,
  checkPasswordStrength
};
