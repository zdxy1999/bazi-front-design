/**
 * 八字解析页面逻辑
 * Analysis Page Logic
 */

(function() {
  'use strict';

  let currentProfile = null;
  let pollingInterval = null;

  /**
   * 初始化页面
   */
  async function init() {
    try {
      const profileId = getUrlParam('profileId');

      if (!profileId) {
        showError('缺少档案ID');
        setTimeout(() => goBack(), 2000);
        return;
      }

      await loadProfile(profileId);
      await checkAnalysisStatus();

    } catch (error) {
      console.error('初始化失败:', error);
      showError('加载失败，请返回重试');
    }
  }

  /**
   * 加载档案数据
   */
  async function loadProfile(profileId) {
    const response = await fetch('../../../mock-data/bazi-profiles.json');
    const data = await response.json();
    currentProfile = data.profiles.find(p => p.id === profileId);

    if (!currentProfile) {
      throw new Error('Profile not found');
    }
  }

  /**
   * 检查解析状态
   */
  async function checkAnalysisStatus() {
    const status = currentProfile.analysisStatus;

    switch(status) {
      case 'COMPLETED':
        showCompletedState();
        break;
      case 'CALCULATING':
        showCalculatingState();
        startPolling();
        break;
      case 'NOT_STARTED':
        showNotStartedState();
        break;
    }
  }

  /**
   * 显示已完成状态
   */
  function showCompletedState() {
    const completedState = document.getElementById('completedState');
    if (completedState) {
      completedState.style.display = 'block';
      renderBaziDetail();

      if (currentProfile.analysisResult && window.MarkdownRenderer) {
        const renderer = new window.MarkdownRenderer();
        renderer.render(currentProfile.analysisResult, '#markdown-content');
      }
    }
  }

  /**
   * 渲染八字详情
   */
  function renderBaziDetail() {
    const container = document.getElementById('baziDetailContent');
    if (!container) return;

    const { bazi, dayMaster, mingua, elementProportion } = currentProfile;

    const dayMasterElementNames = {
      'wood': '木',
      'fire': '火',
      'earth': '土',
      'metal': '金',
      'water': '水'
    };

    container.innerHTML = `
      <div class="pillars-display">
        <div class="pillar-item">
          <div class="pillar-label">年柱</div>
          <div class="pillar-value">${bazi.yearPillar.stem}${bazi.yearPillar.branch}</div>
          <div class="pillar-nayin">${bazi.yearPillar.nayin}</div>
        </div>
        <div class="pillar-item">
          <div class="pillar-label">月柱</div>
          <div class="pillar-value">${bazi.monthPillar.stem}${bazi.monthPillar.branch}</div>
          <div class="pillar-nayin">${bazi.monthPillar.nayin}</div>
        </div>
        <div class="pillar-item">
          <div class="pillar-label">日柱</div>
          <div class="pillar-value">${bazi.dayPillar.stem}${bazi.dayPillar.branch}</div>
          <div class="pillar-nayin">${bazi.dayPillar.nayin}</div>
        </div>
        <div class="pillar-item">
          <div class="pillar-label">时柱</div>
          <div class="pillar-value">${bazi.hourPillar.stem}${bazi.hourPillar.branch}</div>
          <div class="pillar-nayin">${bazi.hourPillar.nayin}</div>
        </div>
      </div>

      <div class="daymaster-section">
        <h3>日主：${dayMaster.stem}（${dayMasterElementNames[dayMaster.element]}）</h3>
        <p>${dayMaster.isDayMaster ? '身强' : '身弱'}</p>
      </div>

      <div class="mingua-section">
        <h4>命卦：${mingua.name}（${mingua.element}）</h4>
        <p>位置：${mingua.position} | 方向：${mingua.direction}</p>
      </div>

      <div class="element-proportion">
        <h4>五行占比</h4>
        <div class="proportion-list">
          ${Object.entries(elementProportion).map(([element, data]) => `
            <div class="proportion-item">
              <span class="element-name">${dayMasterElementNames[element]}</span>
              <div class="proportion-bar">
                <div class="proportion-fill" style="width: ${data.percentage}%; background: var(--${element}-primary);"></div>
              </div>
              <span class="proportion-value">${data.percentage}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 显示计算中状态
   */
  function showCalculatingState() {
    const calculatingState = document.getElementById('calculatingState');
    if (calculatingState) {
      calculatingState.style.display = 'flex';
    }
  }

  /**
   * 显示未开始状态
   */
  function showNotStartedState() {
    const notStartedState = document.getElementById('notStartedState');
    if (notStartedState) {
      notStartedState.style.display = 'block';
    }
  }

  /**
   * 隐藏所有状态
   */
  function hideAllStates() {
    const completedState = document.getElementById('completedState');
    const calculatingState = document.getElementById('calculatingState');
    const notStartedState = document.getElementById('notStartedState');

    if (completedState) completedState.style.display = 'none';
    if (calculatingState) calculatingState.style.display = 'none';
    if (notStartedState) notStartedState.style.display = 'none';
  }

  /**
   * 开始轮询
   */
  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(async () => {
      try {
        await loadProfile(currentProfile.id);

        if (currentProfile.analysisStatus === 'COMPLETED') {
          stopPolling();
          hideAllStates();
          showCompletedState();
        }
      } catch (error) {
        console.error('轮询失败:', error);
      }
    }, 3000);
  }

  /**
   * 停止轮询
   */
  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  /**
   * 开始计算
   */
  async function startCalculation() {
    if (!currentProfile) return;

    try {
      const startButton = document.querySelector('#notStartedState button');
      if (startButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(startButton, true, '开始计算...');
      }

      // 调用API开始计算
      // await window.API?.analysis.start(currentProfile.id);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新状态
      currentProfile.analysisStatus = 'CALCULATING';

      hideAllStates();
      showCalculatingState();
      startPolling();

    } catch (error) {
      console.error('开始计算失败:', error);
      showError('开始计算失败，请重试');

      if (startButton && window.ButtonComponent) {
        window.ButtonComponent.setButtonLoading(startButton, false);
      }
    }
  }

  /**
   * 返回
   */
  function goBack() {
    stopPolling();
    window.location.href = '../home/home.html';
  }

  // 辅助函数
  function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background: var(--fire-primary);
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

  // 导出到全局
  window.startCalculation = startCalculation;
  window.goBack = goBack;

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面卸载时停止轮询
  window.addEventListener('beforeunload', stopPolling);
})();
