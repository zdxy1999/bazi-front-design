/**
 * 选择器组件交互脚本
 * 实现单选、复选、开关的高级功能
 */

// ============================================
// Radio Group 单选组管理
// ============================================

/**
 * 初始化Radio组
 * @param {string} name - radio的name属性
 * @param {Function} callback - 选中回调函数
 */
function initRadioGroup(name, callback) {
  const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);

  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (typeof callback === 'function') {
        callback(this.value, this);
      }
    });
  });

  return radios;
}

/**
 * 获取Radio组选中值
 * @param {string} name - radio的name属性
 * @returns {string|null}
 */
function getRadioValue(name) {
  const selected = document.querySelector(`input[type="radio"][name="${name}"]:checked`);
  return selected ? selected.value : null;
}

/**
 * 设置Radio组选中值
 * @param {string} name - radio的name属性
 * @param {string} value - 要选中的值
 */
function setRadioValue(name, value) {
  const radio = document.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
  }
}

// ============================================
// Checkbox Group 复选框组管理
// ============================================

/**
 * 初始化Checkbox组
 * @param {string} selector - checkbox选择器
 * @param {Function} callback - 状态变化回调
 */
function initCheckboxGroup(selector, callback) {
  const checkboxes = document.querySelectorAll(selector);

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const checked = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

      if (typeof callback === 'function') {
        callback(checked, this);
      }
    });
  });

  return checkboxes;
}

/**
 * 获取Checkbox组选中值
 * @param {string} selector - checkbox选择器
 * @returns {Array}
 */
function getCheckboxValues(selector) {
  const checked = document.querySelectorAll(`${selector}:checked`);
  return Array.from(checked).map(cb => cb.value);
}

/**
 * 设置Checkbox组选中状态
 * @param {string} selector - checkbox选择器
 * @param {Array} values - 要选中的值数组
 */
function setCheckboxValues(selector, values) {
  const checkboxes = document.querySelectorAll(selector);

  checkboxes.forEach(checkbox => {
    checkbox.checked = values.includes(checkbox.value);
    checkbox.dispatchEvent(new Event('change'));
  });
}

/**
 * 全选/取消全选
 * @param {string} selector - 子checkbox选择器
 * @param {boolean} checked - 是否全选
 */
function toggleCheckboxes(selector, checked) {
  const checkboxes = document.querySelectorAll(selector);

  checkboxes.forEach(checkbox => {
    checkbox.checked = checked;
    checkbox.dispatchEvent(new Event('change'));
  });
}

/**
 * 反选
 * @param {string} selector - checkbox选择器
 */
function invertCheckboxes(selector) {
  const checkboxes = document.querySelectorAll(selector);

  checkboxes.forEach(checkbox => {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  });
}

// ============================================
// 全选功能（带不确定状态）
// ============================================

/**
 * 初始化全选功能
 * @param {HTMLElement|string} master - 主复选框（全选）
 * @param {string} selector - 子复选框选择器
 */
function initSelectAll(master, selector) {
  const masterCheckbox = typeof master === 'string'
    ? document.querySelector(master)
    : master;

  if (!masterCheckbox) {
    console.error('主复选框不存在');
    return;
  }

  const subCheckboxes = document.querySelectorAll(selector);

  // 点击主复选框
  masterCheckbox.addEventListener('change', function() {
    const checked = this.checked;
    subCheckboxes.forEach(cb => {
      cb.checked = checked;
      cb.dispatchEvent(new Event('change'));
    });
    updateMasterState();
  });

  // 监听子复选框变化
  subCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateMasterState);
  });

  // 更新主复选框状态
  function updateMasterState() {
    const checkedCount = Array.from(subCheckboxes).filter(cb => cb.checked).length;

    if (checkedCount === 0) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    } else if (checkedCount === subCheckboxes.length) {
      masterCheckbox.checked = true;
      masterCheckbox.indeterminate = false;
    } else {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = true;
    }

    // 触发自定义事件
    masterCheckbox.dispatchEvent(new CustomEvent('selectall-update', {
      detail: {
        checked: checkedCount,
        total: subCheckboxes.length,
        indeterminate: masterCheckbox.indeterminate
      }
    }));
  }

  // 初始化状态
  updateMasterState();
}

// ============================================
// Toggle 开关组管理
// ============================================

/**
 * 初始化Toggle组（只能有一个开启）
 * @param {string} selector - toggle选择器
 * @param {Function} callback - 状态变化回调
 */
function initToggleGroup(selector, callback) {
  const toggles = document.querySelectorAll(selector);

  toggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      if (this.checked) {
        // 关闭其他toggle
        toggles.forEach(t => {
          if (t !== this) {
            t.checked = false;
            t.dispatchEvent(new Event('change'));
          }
        });
      }

      if (typeof callback === 'function') {
        callback(this.checked, this);
      }
    });
  });

  return toggles;
}

/**
 * 获取Toggle选中状态
 * @param {string} selector - toggle选择器
 * @returns {Object}
 */
function getToggleStates(selector) {
  const toggles = document.querySelectorAll(selector);
  const states = {};

  toggles.forEach(toggle => {
    const name = toggle.name || toggle.id;
    states[name] = toggle.checked;
  });

  return states;
}

// ============================================
// 表单验证辅助
// ============================================

/**
 * 确保至少选中一个复选框
 * @param {string} selector - checkbox选择器
 * @param {string} message - 错误消息
 * @returns {boolean}
 */
function requireOneChecked(selector, message = '请至少选择一项') {
  const checked = document.querySelectorAll(`${selector}:checked`);

  if (checked.length === 0) {
    alert(message);
    return false;
  }

  return true;
}

/**
 * 确保只能选择指定数量的复选框
 * @param {string} selector - checkbox选择器
 * @param {number} max - 最大可选数量
 * @param {string} message - 错误消息
 * @returns {boolean}
 */
function limitCheckboxSelection(selector, max, message) {
  const checkboxes = document.querySelectorAll(selector);

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        const checked = document.querySelectorAll(`${selector}:checked`);
        if (checked.length > max) {
          this.checked = false;
          if (message) {
            alert(message);
          }
        }
      }
    });
  });
}

// ============================================
// 动态生成选项
// ============================================

/**
 * 动态生成Radio选项
 * @param {string} container - 容器选择器
 * @param {Array} options - 选项数组 [{value, label, checked}]
 * @param {string} name - radio组名称
 * @param {string} className - 可选的CSS类名
 */
function generateRadioOptions(container, options, name, className = 'radio') {
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!containerEl) {
    console.error('容器不存在');
    return;
  }

  options.forEach(option => {
    const label = document.createElement('label');
    label.className = className;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = option.value;
    if (option.checked) {
      input.checked = true;
    }
    if (option.disabled) {
      input.disabled = true;
    }

    const text = document.createElement('span');
    text.className = `${className}-text`;
    text.textContent = option.label;

    label.appendChild(input);
    label.appendChild(text);
    containerEl.appendChild(label);
  });
}

/**
 * 动态生成Checkbox选项
 * @param {string} container - 容器选择器
 * @param {Array} options - 选项数组 [{value, label, checked}]
 * @param {string} name - checkbox组名称
 * @param {string} className - 可选的CSS类名
 */
function generateCheckboxOptions(container, options, name, className = 'checkbox') {
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!containerEl) {
    console.error('容器不存在');
    return;
  }

  options.forEach(option => {
    const label = document.createElement('label');
    label.className = className;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = option.value;
    if (option.checked) {
      input.checked = true;
    }
    if (option.disabled) {
      input.disabled = true;
    }

    const text = document.createElement('span');
    text.className = `${className}-text`;
    text.textContent = option.label;

    label.appendChild(input);
    label.appendChild(text);
    containerEl.appendChild(label);
  });
}

// ============================================
// 全局初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // 为所有radio和checkbox添加键盘导航提示
  const selectors = '.radio input[type="radio"], .checkbox input[type="checkbox"], .toggle input[type="checkbox"]';

  document.querySelectorAll(selectors).forEach(input => {
    input.addEventListener('keydown', function(e) {
      // 空格键切换状态
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.click();
      }
    });
  });

  console.log('选择器组件初始化完成');
});

// ============================================
// 导出供外部使用
// ============================================

window.SelectorUtils = {
  // Radio
  initRadioGroup,
  getRadioValue,
  setRadioValue,

  // Checkbox
  initCheckboxGroup,
  getCheckboxValues,
  setCheckboxValues,
  toggleCheckboxes,
  invertCheckboxes,
  initSelectAll,

  // Toggle
  initToggleGroup,
  getToggleStates,

  // Validation
  requireOneChecked,
  limitCheckboxSelection,

  // Dynamic Generation
  generateRadioOptions,
  generateCheckboxOptions
};
