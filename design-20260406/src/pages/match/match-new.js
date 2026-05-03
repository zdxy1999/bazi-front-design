/**
 * 姻缘匹配页面逻辑 - 完全复制home.js的成功模式
 * Match Page Logic
 */

(function() {
  'use strict';

  let currentProfile = null;
  let currentMatches = [];
  let pollingInterval = null;
  let swiperInstance = null;
  let cardComponent = null;

  /**
   * 初始化页面
   */
  async function init() {
    try {
      const profileId = getUrlParam('profileId');
      const status = getUrlParam('status');

      if (!profileId) {
        showError('缺少档案ID');
        setTimeout(() => goBack(), 3000);
        return;
      }

      await loadProfile(profileId);

      if (status === 'calculating') {
        showCalculatingState();
        startPolling();
      } else {
        await checkMatchStatus();
      }

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
   * 检查匹配状态
   */
  async function checkMatchStatus() {
    const status = currentProfile.matchStatus;

    switch(status) {
      case 'HAS_RESULTS':
        showHasResultsState();
        break;
      case 'CALCULATING':
        showCalculatingState();
        startPolling();
        break;
      case 'NOT_STARTED':
      default:
        showNoResultsState();
        break;
    }
  }

  /**
   * 显示有结果状态
   */
  function showHasResultsState() {
    // console.log('[match-new.js] showHasResultsState() 被调用');
    const hasResultsState = document.getElementById('hasResultsState');
    if (hasResultsState) {
      // console.log('[match-new.js] 显示hasResultsState');
      hasResultsState.style.display = 'flex';
      // console.log('[match-new.js] 开始renderMatches()');
      renderMatches();
      // console.log('[match-new.js] renderMatches()完成，开始initSwiper()');
      initSwiper();
      // console.log('[match-new.js] initSwiper()完成');
    }
  }

  /**
   * 渲染匹配结果 - 完全模仿home.js的renderProfiles
   */
  function renderMatches() {
    const wrapper = document.getElementById('matchSwiperWrapper');
    if (!wrapper) return;

    const matches = currentProfile.matchResults || [];
    currentMatches = matches;

    // 清空现有内容
    wrapper.innerHTML = '';

    // 如果没有匹配结果，隐藏swiper容器
    if (matches.length === 0) {
      const swiperContainer = document.querySelector('.swiper');
      if (swiperContainer) {
        swiperContainer.style.display = 'none';
      }
      return;
    }

    // 确保swiper容器可见
    const swiperContainer = document.querySelector('.swiper');
    if (swiperContainer) {
      swiperContainer.style.display = 'block';
    }

    // **关键修复**：先清空slides数组和重新获取，确保顺序
    // 生成匹配卡片
    matches.forEach((match, index) => {
      const slide = createMatchSlide(match, index);
      wrapper.appendChild(slide);
    });

    // **验证slides顺序**
    // console.log('Slides创建后DOM顺序:');
    const allSlides = wrapper.querySelectorAll('.swiper-slide');
    allSlides.forEach((slide, i) => {
      // console.log(`  slide[${i}]:`, {
      //   matchIndex: slide.dataset.matchIndex,
      //   textContent: slide.querySelector('.profile-name')?.textContent
      // });
    });

    // 刷新卡片组件
    setTimeout(() => {
      if (window.CardComponent) {
        if (window.cardComponent) {
          window.cardComponent.cleanup();
        }
        window.cardComponent = new window.CardComponent();
      }
    }, 100);

    // 渲染第一个匹配理由
    if (matches.length > 0 && matches[0].reason && window.MarkdownRenderer) {
      const renderer = new window.MarkdownRenderer();
      renderer.render(matches[0].reason, '#match-reason');
    }
  }

<arg_value>/**
 * 创建匹配卡片Slide - 完全模仿home.js的createProfileSlide
 */
function createMatchSlide(match, index) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.dataset.matchId = match.id;
  slide.dataset.matchIndex = index;
  slide.dataset.index = index; // 关键：添加这个属性

  const { hue, saturation, lightness } = match.mingua.hsl;

    slide.innerHTML = `
      <div class="match-card-container">
        <div class="glass-card ${match.mingua.element}-card" data-card
             style="--theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};">
          <div class="card-edge-glow"></div>
          <div class="card-glow"></div>
          <div class="glass-card-content">
            <div class="glass-card-header">
              <h3 class="profile-name">${match.name}</h3>
              <p class="profile-birth">${formatDateTime(match.birthDate)}</p>
            </div>

            <div class="glass-card-body">
              <div class="bazi-info">
                <span class="bazi-pillar">${match.bazi.yearPillar.stem}${match.bazi.yearPillar.branch}</span>
                <span class="bazi-pillar">${match.bazi.monthPillar.stem}${match.bazi.monthPillar.branch}</span>
                <span class="bazi-pillar">${match.bazi.dayPillar.stem}${match.bazi.dayPillar.branch}</span>
                <span class="bazi-pillar">${match.bazi.hourPillar.stem}${match.bazi.hourPillar.branch}</span>
              </div>

              <div class="mingua-info">
                <h4 class="mingua-name">${match.mingua.name}</h4>
                <p class="mingua-details">${match.mingua.position} / ${match.mingua.element}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return slide;
  }

  /**
   * 初始化Swiper - 完全复制home.js的initSwiper
   */
  function initSwiper() {
    // console.log('[match-new.js] initSwiper() 被调用');
    const swiperElement = document.querySelector('.swiper');
    if (!swiperElement) {
      // console.log('[match-new.js] 没有找到.swiper元素');
      return;
    }

    // console.log('[match-new.js] swiperElement已有实例:', swiperElement.swiperInstance ? 'YES' : 'NO');

    // 如果已有实例，不要重新创建，直接返回
    if (swiperElement.swiperInstance) {
      // console.log('[match-new.js] Swiper实例已存在，跳过创建');
      return;
    }

    const loop = swiperElement.hasAttribute('data-swiper-loop');
    const simple = swiperElement.hasAttribute('data-swiper-simple');
    // console.log('[match-new.js] loop:', loop, 'simple:', simple);

    if (window.Swiper) {
      // console.log('[match-new.js] 创建新的Swiper实例');
      swiperInstance = new window.Swiper(swiperElement, {
        loop: loop,
        simple: simple
      });

      swiperElement.swiperInstance = swiperInstance;
      // console.log('[match-new.js] Swiper实例已创建并保存');

      // 监听切换事件，更新推荐理由
      swiperElement.addEventListener('swiperChange', (e) => {
        const index = e.detail.activeIndex;
        updateMatchReason(index);
      });
      // console.log('[match-new.js] swiperChange事件监听器已添加');
    }
  }

  /**
   * 更新匹配理由
   */
  function updateMatchReason(index) {
    if (!currentMatches || currentMatches.length === 0) return;

    const match = currentMatches[index];
    if (!match || !match.reason) return;

    if (window.MarkdownRenderer) {
      const renderer = new window.MarkdownRenderer();
      renderer.render(match.reason, '#match-reason');
    }
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
   * 显示无结果状态
   */
  function showNoResultsState() {
    const noResultsState = document.getElementById('noResultsState');
    if (noResultsState) {
      noResultsState.style.display = 'block';
    }
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

        if (currentProfile.matchStatus === 'HAS_RESULTS') {
          stopPolling();
          hideAllStates();
          showHasResultsState();
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
   * 隐藏所有状态
   */
  function hideAllStates() {
    document.getElementById('hasResultsState').style.display = 'none';
    document.getElementById('calculatingState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
  }

  /**
   * 计算匹配
   */
  function calculateMatch() {
    window.location.href = `../new-match/new-match.html?profileId=${currentProfile.id}`;
  }

  /**
   * 重新计算匹配
   */
  function recalculateMatch() {
    window.location.href = `../new-match/new-match.html?profileId=${currentProfile.id}`;
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
  window.calculateMatch = calculateMatch;
  window.recalculateMatch = recalculateMatch;
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
