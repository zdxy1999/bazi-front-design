/**
 * 八字首页逻辑
 * Home Page Logic
 */

console.log('✅✅✅ [home.js] 文件开始加载 ✅✅✅');

// 全局状态
let profiles = [];
let currentProfileIndex = 0;
let swiperInstance = null;
let wuxingCharts = [];

// 命卦图标SVG代码（直接内联，支持CSS color属性）
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

// 添加调试日志
console.log('🏠 home.js 已加载');
console.log('准备初始化首页...');

/**
 * 初始化页面
 */
async function init() {
  console.log('🚀 init() 函数被调用');

  try {
    console.log('📂 开始加载Mock数据...');
    // 加载Mock数据
    profiles = await loadProfiles();
    console.log('✅ Mock数据加载完成，档案数量:', profiles.length);

    // 渲染所有档案卡片
    console.log('🎨 开始渲染档案卡片...');
    renderProfiles();
    console.log('✅ 档案卡片渲染完成');

    // 初始化Swiper
    console.log('🎠 初始化Swiper...');
    initSwiper();
    console.log('✅ Swiper初始化完成');

    // 初始化菜单
    console.log('🔄 初始化菜单...');
    initMenu();
    console.log('✅ 菜单初始化完成');

    // 主题切换由background.js处理，无需在这里初始化

    console.log('🎉 首页初始化全部完成！');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    showError('加载数据失败，请刷新页面重试');
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

  console.log('🎨 开始渲染档案卡片，档案数量:', profiles.length);

  // 清空现有内容
  wrapper.innerHTML = '';

  profiles.forEach((profile, index) => {
    console.log(`创建档案 ${index + 1}/${profiles.length}: ${profile.name}`, profile);
    const slide = createProfileSlide(profile, index);
    wrapper.appendChild(slide);
    console.log(`Slide ${index + 1} 已添加到DOM`);
  });

  // 检查是否有[data-card]元素
  const cardElements = document.querySelectorAll('[data-card]');
  console.log(`📊 DOM中[data-card]元素数量: ${cardElements.length}`);

  // 检查第一个卡片的CSS变量
  if (cardElements.length > 0) {
    const firstCard = cardElements[0];
    const inlineStyle = firstCard.style;
    const hue = inlineStyle.getPropertyValue('--theme-hue');
    const sat = inlineStyle.getPropertyValue('--theme-saturation');
    const light = inlineStyle.getPropertyValue('--theme-lightness');
    console.log('🎨 第一个卡片的inline CSS变量:', { hue, sat, light });
    console.log('🎨 完整的style属性:', inlineStyle.cssText);

    // 检查计算后的样式
    const computedStyle = window.getComputedStyle(firstCard);
    const computedHue = computedStyle.getPropertyValue('--theme-hue');
    const computedSat = computedStyle.getPropertyValue('--theme-saturation');
    const computedLight = computedStyle.getPropertyValue('--theme-lightness');
    console.log('🎨 第一个卡片的computed CSS变量:', { computedHue, computedSat, computedLight });
  }

  // 刷新卡片组件（重新绑定事件和动画）
  // 使用setTimeout确保DOM已经更新
  setTimeout(() => {
    console.log('🔍 ===== 开始初始化卡片效果 =====');

    // 查找所有卡片
    const cardElements = document.querySelectorAll('[data-card]');
    console.log('📊 找到卡片数量:', cardElements.length);

    if (cardElements.length === 0) {
      console.warn('⚠️ 没有找到卡片元素');
      return;
    }

    // 检查第一张卡片的CSS变量
    const firstCard = cardElements[0];
    const computedStyle = window.getComputedStyle(firstCard);
    console.log('🎨 第一张卡片的CSS变量:');
    console.log('  --theme-hue:', computedStyle.getPropertyValue('--theme-hue'));
    console.log('  --theme-saturation:', computedStyle.getPropertyValue('--theme-saturation'));
    console.log('  --theme-lightness:', computedStyle.getPropertyValue('--theme-lightness'));

    // 尝试使用CardComponent
    if (window.CardComponent) {
      console.log('✅ CardComponent类存在，创建新实例...');

      try {
        // 销毁旧实例
        if (window.cardComponent) {
          console.log('🗑️ 销毁旧实例...');
          window.cardComponent.cleanup();
        }

        // 创建新实例
        console.log('🔧 创建新实例...');
        window.cardComponent = new window.CardComponent();
        console.log('✅ 新实例创建成功! 卡片数量:', window.cardComponent.cards.length);

        // 为每个卡片添加边缘光晕
        cardElements.forEach((card, index) => {
          console.log(`🎴 卡片${index} CSS变量:`, card.getAttribute('style'));

          // 检查卡片是否有static-glow类
          console.log(`  卡片${index} 类名:`, card.className);
          console.log(`  卡片${index} 有static-glow类:`, card.classList.contains('static-glow'));

          // 检查.card-glow元素是否存在
          const cardGlow = card.querySelector('.card-glow');
          console.log(`  卡片${index} 有.card-glow元素:`, !!cardGlow);

          if (cardGlow) {
            const glowStyle = window.getComputedStyle(cardGlow);
            console.log(`  .card-glow opacity:`, glowStyle.opacity);
          }
        });

      } catch (error) {
        console.error('❌ CardComponent初始化失败:', error);
        console.error('错误堆栈:', error.stack);
      }
    } else {
      console.error('❌ CardComponent类不存在，跳过卡片效果初始化');
      console.log('当前window对象中包含card的属性:', Object.keys(window).filter(k => k.toLowerCase().includes('card')));
    }

    console.log('====================================');
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

  // 命卦颜色HSL值（直接使用带%的字符串）
  const { hue, saturation, lightness } = profile.mingua.hsl;
  console.log(`🎨 创建slide ${index}, 命卦: ${profile.mingua.name}, HSL:`, { hue, saturation, lightness });
  console.log(`🎨 CSS变量字符串: --theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};`);

  // 日主元素信息
  const dayMasterElement = profile.dayMaster.element;
  const dayMasterStem = profile.dayMaster.stem;
  const dayMasterElementNames = {
    'wood': '木',
    'fire': '火',
    'earth': '土',
    'metal': '金',
    'water': '水'
  };

  // 命卦五行对应的CSS类名
  const elementCardClassMap = {
    'wood': 'wood-card',
    'fire': 'fire-card',
    'earth': 'earth-card',
    'metal': 'metal-card',
    'water': 'water-card'
  };
  const cardClass = elementCardClassMap[profile.mingua.element] || '';
  console.log(`🏷️ 命卦五行: ${profile.mingua.element} -> CSS类: ${cardClass}`);

  slide.innerHTML = `
    <div class="profile-slide">
      <div class="profile-content">
        <!-- 五行生克图 -->
        <div class="wuxing-chart-container">
          <svg id="wuxing-chart-${profile.id}"
               class="wuxing-chart"
               viewBox="0 0 600 600"
               preserveAspectRatio="xMidYMid meet"></svg>
        </div>

        <!-- 摘要卡片 -->
        <div class="glass-card ${cardClass} summary-card static-glow"
             data-card
             data-responsive-card
             data-star="${profile.mingua.number}"
             style="--theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};">
          <div class="card-edge-glow"></div>
          <div class="card-glow"></div>
          <div class="glass-card-content">
            <!-- 命卦图标 -->
            <div class="glass-card-logo glass-card-logo-center">
              <div class="mingua-icon">${minguaIcons[profile.mingua.gua]}</div>
            </div>

            <!-- 卡片内容 -->
            <div class="glass-card-body">
              <h3 class="profile-name">${profile.name}</h3>
              <p class="profile-birth">${formatBirthDate(profile.birthDate)}</p>

              <!-- 八字信息 -->
              <div class="bazi-info">
                <span class="bazi-pillar">${profile.bazi.yearPillar.stem}${profile.bazi.yearPillar.branch}</span>
                <span class="bazi-pillar">${profile.bazi.monthPillar.stem}${profile.bazi.monthPillar.branch}</span>
                <span class="bazi-pillar">${profile.bazi.dayPillar.stem}${profile.bazi.dayPillar.branch}</span>
                <span class="bazi-pillar">${profile.bazi.hourPillar.stem}${profile.bazi.hourPillar.branch}</span>
              </div>

              <!-- 命卦信息 -->
              <div class="mingua-info">
                <h4 class="mingua-name">${profile.mingua.name}</h4>
                <p class="mingua-details">${profile.mingua.position} / ${profile.mingua.element}</p>
              </div>

              <!-- 日主信息 -->
              <div class="daymaster-info">
                <span class="daymaster-tag">日主：${dayMasterStem} (${dayMasterElementNames[dayMasterElement]})</span>
              </div>
            </div>

            <!-- 卡片底部 -->
            <div class="glass-card-footer">
              <!-- 设置为默认档案开关 -->
              <label class="toggle-switch" style="--toggle-color: hsla(${hue}, ${saturation}, ${lightness}, 0.8);">
                <input type="checkbox"
                       ${profile.isDefault ? 'checked' : ''}
                       data-profile-id="${profile.id}">
                <span class="toggle-slider"></span>
                <span class="toggle-label">设为默认</span>
              </label>

              <!-- 删除按钮 -->
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
    renderWuxingChart(profile.id, profile.elementProportion);
  }, 100);

  return slide;
}

/**
 * 渲染五行图
 */
function renderWuxingChart(profileId, elementProportion) {
  const svgId = `wuxing-chart-${profileId}`;
  const chart = new WuxingChart(svgId, elementProportion);
  wuxingCharts.push({ id: profileId, chart });
}

/**
 * 初始化Swiper
 */
function initSwiper() {
  console.log('🎠 [initSwiper] 开始初始化Swiper...');

  const swiperElement = document.querySelector('.swiper');
  if (!swiperElement) {
    console.warn('⚠️ [initSwiper] 未找到.swiper元素');
    return;
  }

  console.log('✅ [initSwiper] 找到.swiper元素');

  // 如果已有实例，先销毁
  if (swiperElement.swiperInstance) {
    console.log('🗑️ [initSwiper] 销毁旧实例');
    swiperElement.swiperInstance.destroy();
  }

  // 重新初始化swiper（因为slides是动态创建的）
  console.log('🔧 [initSwiper] 重新初始化Swiper实例...');

  // 检查swiper容器的配置
  const loop = swiperElement.hasAttribute('data-swiper-loop');
  const simple = swiperElement.hasAttribute('data-swiper-simple');
  console.log(`[initSwiper] 配置: loop=${loop}, simple=${simple}`);

  // 创建新的swiper实例
  const swiperInstance = new Swiper(swiperElement, {
    loop: loop,
    simple: simple
  });

  // 保存实例到容器
  swiperElement.swiperInstance = swiperInstance;

  console.log('✅ [initSwiper] Swiper初始化完成');
  console.log(`📊 [initSwiper] slides数量: ${swiperInstance.slides.length}`);

  // 监听slideChange事件来更新当前档案索引
  swiperElement.addEventListener('swiperChange', (e) => {
    currentProfileIndex = e.detail.activeIndex;
  });
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
    case 'new-bazi':
      window.location.href = '../new-bazi/new-bazi.html';
      break;
  }
}

/**
 * 获取当前显示的档案ID
 */
function getCurrentProfileId() {
  // 如果有Swiper实例，获取当前slide的档案ID
  const activeSlide = document.querySelector('.swiper-slide-active');
  if (activeSlide) {
    return activeSlide.dataset.profileId;
  }

  // 否则返回默认档案ID
  const defaultProfile = profiles.find(p => p.isDefault);
  return defaultProfile ? defaultProfile.id : profiles[0].id;
}

/**
 * 处理设置为默认档案
 */
function handleSetDefault(profileId) {
  // 取消其他档案的默认状态
  profiles.forEach(profile => {
    profile.isDefault = (profile.id === profileId);
  });

  // 更新UI
  document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = (checkbox.dataset.profileId === profileId);
  });

  // 显示提示
  showSuccess('已设置为默认档案');
}

/**
 * 处理删除档案
 */
function handleDelete(profileId) {
  if (profiles.length <= 1) {
    showError('至少需要保留一个档案');
    return;
  }

  if (confirm('确定要删除这个档案吗？')) {
    // 删除档案
    profiles = profiles.filter(p => p.id !== profileId);

    // 如果删除的是默认档案，设置第一个档案为默认
    if (profiles.length > 0 && !profiles.find(p => p.isDefault)) {
      profiles[0].isDefault = true;
    }

    // 重新渲染
    renderProfiles();

    showSuccess('档案已删除');
  }
}

/**
 * 格式化出生日期
 */
function formatBirthDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hour}:${minute}`;
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
  // 简单的toast实现
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: var(--wood-primary);
    color: white;
    border-radius: 8px;
    z-index: 1000;
    animation: fadeInOut 3s ease forwards;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

/**
 * 显示错误消息
 */
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
    z-index: 1000;
    animation: fadeInOut 3s ease forwards;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
console.log('📄 [home.js] 文件加载完成，准备初始化');
console.log('📄 [home.js] document.readyState:', document.readyState);
console.log('📄 [home.js] window.cardComponent:', !!window.cardComponent);
console.log('📄 [home.js] window.CardComponent:', typeof window.CardComponent);

if (document.readyState === 'loading') {
  console.log('📄 [home.js] 等待DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [home.js] DOMContentLoaded触发');
    console.log('📄 [home.js] 延迟500ms后执行init()，确保所有脚本加载完成');
    setTimeout(init, 500);
  });
} else {
  console.log('📄 [home.js] DOM已加载，延迟500ms后执行init()');
  setTimeout(init, 500);
}
