/**
 * 公共工具函数
 * Common Utility Functions
 */

/**
 * 显示Toast消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success' | 'error'
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // 设置样式
  const bgColor = type === 'success' ? 'var(--wood-primary)' : 'var(--fire-primary)';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: toastFadeInOut 3s ease forwards;
  `;

  document.body.appendChild(toast);

  // 3秒后移除
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
}

/**
 * 显示成功消息
 * @param {string} message - 消息内容
 */
function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * 显示错误消息
 * @param {string} message - 消息内容
 */
function showError(message) {
  showToast(message, 'error');
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean}
 */
function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 格式化日期时间
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string}
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hour}:${minute}`;
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @param {string} url - URL字符串，默认为当前页面URL
 * @returns {string|null}
 */
function getUrlParam(name, url = window.location.href) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(name);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
function throttle(func, wait = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// 添加Toast动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes toastFadeInOut {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    10% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;

// 确保样式只添加一次
if (!document.querySelector('style[data-toast-styles]')) {
  style.setAttribute('data-toast-styles', 'true');
  document.head.appendChild(style);
}

// 导出到全局
window.ToastUtils = {
  showSuccess,
  showError,
  showToast
};

window.ValidationUtils = {
  validateEmail,
  validatePhone
};

window.DateUtils = {
  formatDateTime
};

window.UrlUtils = {
  getUrlParam
};

window.FunctionUtils = {
  debounce,
  throttle
};
