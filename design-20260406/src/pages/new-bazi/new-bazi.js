/**
 * 新建八字页面逻辑
 * New Bazi Page Logic
 */

(function() {
  'use strict';

  /**
   * 创建档案
   */
  async function createProfile() {
    const form = document.getElementById('newBaziForm');
    if (!form) return;

    const formData = new FormData(form);
    const profileData = {
      name: formData.get('profileName') || generateAutoName(),
      gender: formData.get('gender'),
      birthDate: formData.get('birthDate'),
      birthHour: parseInt(formData.get('birthHour'))
    };

    // 验证
    if (!profileData.birthDate) {
      window.ToastUtils?.showError('请选择出生日期');
      return;
    }

    if (!profileData.gender) {
      window.ToastUtils?.showError('请选择性别');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    try {
      // 设置按钮加载状态
      if (submitButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(submitButton, true, '创建中...');
      }

      // 调用API创建档案
      // const response = await window.API?.profile.create(profileData);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新档案计数
      const count = parseInt(localStorage.getItem('profileCount') || '0') + 1;
      localStorage.setItem('profileCount', count.toString());

      window.ToastUtils?.showSuccess('档案创建成功');

      // 跳转回首页
      setTimeout(() => {
        window.location.href = '../home/home.html';
      }, 500);

    } catch (error) {
      console.error('创建失败:', error);
      window.ToastUtils?.showError('创建失败，请重试');

      // 恢复按钮状态
      if (submitButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(submitButton, false);
      }
    }
  }

  /**
   * 生成自动名称
   */
  function generateAutoName() {
    const count = parseInt(localStorage.getItem('profileCount') || '0') + 1;
    return `档案_${count}`;
  }

  /**
   * 返回
   */
  function goBack() {
    window.location.href = '../home/home.html';
  }

  // 导出到全局
  window.createProfile = createProfile;
  window.goBack = goBack;
})();
