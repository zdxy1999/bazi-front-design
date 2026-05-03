/**
 * 新建姻缘匹配页面逻辑
 * New Match Page Logic
 */

(function() {
  'use strict';

  /**
   * 开始匹配
   */
  async function calculateMatch() {
    const form = document.getElementById('newMatchForm');
    if (!form) return;

    const formData = new FormData(form);

    // 获取表单数据
    const requirements = formData.get('requirements') || '';
    const genderPreference = formData.get('genderPreference') || 'opposite';
    const birthYearStart = formData.get('birthYearStart') || '';
    const birthYearEnd = formData.get('birthYearEnd') || '';

    // 获取URL参数
    const profileId = getUrlParam('profileId');

    // 验证年份范围
    if (birthYearStart && birthYearEnd) {
      const start = parseInt(birthYearStart);
      const end = parseInt(birthYearEnd);

      if (start > end) {
        showError('起始年份不能大于结束年份');
        return;
      }

      const currentYear = new Date().getFullYear();
      if (end > currentYear) {
        showError('结束年份不能大于当前年份');
        return;
      }
    }

    const submitButton = form.querySelector('button[onclick="calculateMatch()"]');

    try {
      // 设置按钮加载状态
      if (submitButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(submitButton, true, '计算中...');
      }

      // 构建匹配参数
      const matchParams = {
        requirements: requirements,
        genderPreference: genderPreference,
        birthYearRange: {
          start: birthYearStart || null,
          end: birthYearEnd || null
        }
      };

      console.log('匹配参数:', matchParams);

      // 调用API开始匹配
      // const response = await window.API?.match.start(profileId, matchParams);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast('正在计算匹配...', 'success');

      // 跳转到匹配页面
      setTimeout(() => {
        const params = new URLSearchParams({
          profileId: profileId || '',
          status: 'calculating'
        });

        window.location.href = `../match/match.html?${params.toString()}`;
      }, 500);

    } catch (error) {
      console.error('匹配失败:', error);
      showToast('匹配失败，请重试', 'error');

      // 恢复按钮状态
      if (submitButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(submitButton, false);
      }
    }
  }

  /**
   * 返回
   */
  function goBack() {
    window.location.href = '../home/home.html';
  }

  /**
   * 获取URL参数
   */
  function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  /**
   * 显示Toast消息
   */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const bgColor = type === 'success'
      ? 'var(--wood-primary)'
      : 'var(--fire-primary)';

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
      animation: toastFadeInOut 3s ease forwards;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
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
  document.head.appendChild(style);

  // 导出到全局
  window.calculateMatch = calculateMatch;
  window.goBack = goBack;
})();
