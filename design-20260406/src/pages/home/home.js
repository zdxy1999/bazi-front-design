/**
 * 八字首页逻辑
 * Home Page Logic
 */

(function() {
  'use strict';

  // 全局状态
  let profiles = [];
  let currentProfileIndex = 0;
  let swiperInstance = null;
  let wuxingCharts = [];

  // 命卦图标SVG代码
  const minguaIcons = {
    'kan': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☵</text></svg>',
    'kun': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☷</text></svg>',
    'zhen': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☳</text></svg>',
    'xun': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☴</text></svg>',
    'zhonggong': '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="3" fill="none"/><circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="3" fill="none"/></svg>',
    'qian': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☰</text></svg>',
    'dui': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☱</text></svg>',
    'gen': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☶</text></svg>',
    'li': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☲</text></svg>'
  };

  /**
   * 初始化页面
   */
  async function init() {
    try {
      profiles = await loadProfiles();
      renderProfiles();
      initSwiper();
      initMenu();

    } catch (error) {
      console.error('初始化失败:', error);
      window.ToastUtils?.showError('加载数据失败，请刷新页面重试');
    }
  }

  /**
   * 加载Mock数据
   */
  async function loadProfiles() {
    const response = await fetch('../../../mock-data/bazi-profiles.json');
    if (!response.ok) {
      throw new Error('Failed to load profiles');
    }
    const data = await response.json();
    return data.profiles;
  }

  /**
   * 渲染所有档案卡片
   */
  function renderProfiles() {
    const wrapper = document.getElementById('swiperWrapper');
    if (!wrapper) return;

    wrapper.innerHTML = '';

    profiles.forEach((profile, index) => {
      const slide = createProfileSlide(profile, index);
      wrapper.appendChild(slide);
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
  }

  /**
   * 创建档案卡片Slide
   */
  function createProfileSlide(profile, index) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.dataset.profileId = profile.id;
    slide.dataset.profileIndex = index;

    const { hue, saturation, lightness } = profile.mingua.hsl;

    const dayMasterElementNames = {
      'wood': '木',
      'fire': '火',
      'earth': '土',
      'metal': '金',
      'water': '水'
    };

    const elementCardClassMap = {
      'wood': 'wood-card',
      'fire': 'fire-card',
      'earth': 'earth-card',
      'metal': 'metal-card',
      'water': 'water-card'
    };

    const cardClass = elementCardClassMap[profile.mingua.element] || '';

    slide.innerHTML = `
      <div class="profile-slide">
        <div class="profile-content">
          <div class="wuxing-chart-container">
            <svg id="wuxing-chart-${profile.id}"
                 class="wuxing-chart"
                 viewBox="0 0 600 600"
                 preserveAspectRatio="xMidYMid meet"></svg>
          </div>

          <div class="glass-card ${cardClass} summary-card static-glow"
               data-card
               data-responsive-card
               data-star="${profile.mingua.number}"
               style="--theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};">
            <div class="card-edge-glow"></div>
            <div class="card-glow"></div>
            <div class="glass-card-content">
              <div class="glass-card-logo glass-card-logo-center">
                <div class="mingua-icon">${minguaIcons[profile.mingua.gua]}</div>
              </div>

              <div class="glass-card-body">
                <h3 class="profile-name">${profile.name}</h3>
                <p class="profile-birth">${window.DateUtils?.formatDateTime(profile.birthDate)}</p>

                <div class="bazi-info">
                  <span class="bazi-pillar">${profile.bazi.yearPillar.stem}${profile.bazi.yearPillar.branch}</span>
                  <span class="bazi-pillar">${profile.bazi.monthPillar.stem}${profile.bazi.monthPillar.branch}</span>
                  <span class="bazi-pillar">${profile.bazi.dayPillar.stem}${profile.bazi.dayPillar.branch}</span>
                  <span class="bazi-pillar">${profile.bazi.hourPillar.stem}${profile.bazi.hourPillar.branch}</span>
                </div>

                <div class="mingua-info">
                  <h4 class="mingua-name">${profile.mingua.name}</h4>
                  <p class="mingua-details">${profile.mingua.position} / ${profile.mingua.element}</p>
                </div>

                <div class="daymaster-info">
                  <span class="daymaster-tag">日主：${profile.dayMaster.stem} (${dayMasterElementNames[profile.dayMaster.element]})</span>
                </div>
              </div>

              <div class="glass-card-footer">
                <label class="toggle-switch" style="--toggle-color: hsla(${hue}, ${saturation}, ${lightness}, 0.8);">
                  <input type="checkbox"
                         ${profile.isDefault ? 'checked' : ''}
                         data-profile-id="${profile.id}">
                  <span class="toggle-slider"></span>
                  <span class="toggle-label">设为默认</span>
                </label>

                <button class="btn btn-danger btn-sm"
                        data-action="delete"
                        data-profile-id="${profile.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 渲染五行图
    setTimeout(() => {
      if (window.WuxingChart) {
        const chart = new window.WuxingChart(`wuxing-chart-${profile.id}`, profile.elementProportion);
        wuxingCharts.push({ id: profile.id, chart });
      }
    }, 100);

    return slide;
  }

  /**
   * 初始化Swiper
   */
  function initSwiper() {
    const swiperElement = document.querySelector('.swiper');
    if (!swiperElement) return;

    // 如果已有实例，不要重新创建
    if (swiperElement.swiperInstance) {
      return;
    }

    const loop = swiperElement.hasAttribute('data-swiper-loop');
    const simple = swiperElement.hasAttribute('data-swiper-simple');

    if (window.Swiper) {
      swiperInstance = new window.Swiper(swiperElement, {
        loop: loop,
        simple: simple
      });

      swiperElement.swiperInstance = swiperInstance;

      swiperElement.addEventListener('swiperChange', (e) => {
        currentProfileIndex = e.detail.activeIndex;
      });
    }
  }

  /**
   * 初始化菜单
   */
  function initMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        handleMenuAction(action);
      });
    });

    // 使用事件委托处理开关和删除按钮
    document.addEventListener('change', function(e) {
      if (e.target.matches('.toggle-switch input[type="checkbox"]')) {
        const profileId = e.target.dataset.profileId;
        handleSetDefault(profileId);
      }
    });

    document.addEventListener('click', function(e) {
      const deleteButton = e.target.closest('[data-action="delete"]');
      if (deleteButton) {
        const profileId = deleteButton.dataset.profileId;
        handleDelete(profileId);
      }
    });
  }

  /**
   * 处理菜单操作
   */
  function handleMenuAction(action) {
    const currentProfileId = getCurrentProfileId();

    switch(action) {
      case 'analysis':
        window.location.href = `../analysis/analysis.html?profileId=${currentProfileId}`;
        break;
      case 'match':
        window.location.href = `../match/match.html?profileId=${currentProfileId}`;
        break;
      case 'login':
        window.location.href = '../login/login.html';
        break;
      case 'new-bazi':
        window.location.href = '../new-bazi/new-bazi.html';
        break;
    }
  }

  /**
   * 获取当前显示的档案ID
   */
  function getCurrentProfileId() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    if (activeSlide) {
      return activeSlide.dataset.profileId;
    }

    const defaultProfile = profiles.find(p => p.isDefault);
    return defaultProfile ? defaultProfile.id : profiles[0].id;
  }

  /**
   * 处理设置为默认档案
   */
  function handleSetDefault(profileId) {
    profiles.forEach(profile => {
      profile.isDefault = (profile.id === profileId);
    });

    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = (checkbox.dataset.profileId === profileId);
    });

    window.ToastUtils?.showSuccess('已设置为默认档案');
  }

  /**
   * 处理删除档案
   */
  function handleDelete(profileId) {
    if (profiles.length <= 1) {
      window.ToastUtils?.showError('至少需要保留一个档案');
      return;
    }

    if (confirm('确定要删除这个档案吗？')) {
      profiles = profiles.filter(p => p.id !== profileId);

      if (profiles.length > 0 && !profiles.find(p => p.isDefault)) {
        profiles[0].isDefault = true;
      }

      renderProfiles();

      window.ToastUtils?.showSuccess('档案已删除');
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }
})();
