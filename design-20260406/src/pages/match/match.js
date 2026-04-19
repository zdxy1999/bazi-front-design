/**
 * 姻缘匹配页面逻辑
 */

let currentProfile = null;
let pollingInterval = null;

/**
 * 初始化页面
 */
async function init() {
  try {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('profileId');
    const status = urlParams.get('status');

    console.log('[Match] 初始化参数:', { profileId, status });

    if (!profileId) {
      console.error('[Match] 缺少档案ID');
      showError('缺少档案ID，将从首页选择一个档案');
      setTimeout(() => goBack(), 3000);
      return;
    }

    // 加载档案数据
    await loadProfile(profileId);
    console.log('[Match] 档案数据已加载:', currentProfile);

    // 检查匹配状态
    if (status === 'calculating') {
      showCalculatingState();
      startPolling();
    } else {
      await checkMatchStatus();
    }

    // 初始化主题切换
    initThemeToggle();

  } catch (error) {
    console.error('[Match] 初始化失败:', error);
    showError('加载失败，请返回重试');
  }
}

/**
 * 加载档案数据
 */
async function loadProfile(profileId) {
  console.log('[Match] 正在加载档案:', profileId);

  try {
    const response = await fetch('../../../mock-data/bazi-profiles.json');
    const data = await response.json();
    const profiles = data.profiles;
    currentProfile = profiles.find(p => p.id === profileId);

    if (!currentProfile) {
      console.error('[Match] 找不到档案:', profileId);
      throw new Error('Profile not found');
    }

    console.log('[Match] 档案加载成功:', {
      name: currentProfile.name,
      matchStatus: currentProfile.matchStatus,
      matchResultsCount: currentProfile.matchResults?.length || 0
    });
  } catch (error) {
    console.error('[Match] 加载档案失败:', error);
    throw error;
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
      showNoResultsState();
      break;
  }
}

/**
 * 显示有结果状态
 */
function showHasResultsState() {
  console.log('[Match] ========== showHasResultsState 开始 ==========');
  console.log('[Match] currentProfile:', currentProfile);
  console.log('[Match] matchResults:', currentProfile?.matchResults);

  const hasResultsState = document.getElementById('hasResultsState');
  if (!hasResultsState) {
    console.error('[Match] 找不到hasResultsState元素');
    return;
  }

  hasResultsState.style.display = 'block';
  console.log('[Match] hasResultsState display设置为block');

  // 渲染推荐结果
  if (currentProfile.matchResults && currentProfile.matchResults.length > 0) {
    console.log('[Match] 开始渲染推荐结果，数量:', currentProfile.matchResults.length);
    renderMatchResults(currentProfile.matchResults);
  } else {
    console.warn('[Match] 没有推荐结果');
    // 如果没有结果，显示空状态
    hasResultsState.style.display = 'none';
    showNoResultsState();
  }

  console.log('[Match] ========== showHasResultsState 完成 ==========');
}

/**
 * 渲染推荐结果
 */
function renderMatchResults(matches) {
  console.log('[Match] 开始渲染推荐结果，数量:', matches.length);

  const wrapper = document.getElementById('matchSwiperWrapper');
  if (!wrapper) {
    console.error('[Match] 找不到swiperWrapper容器');
    return;
  }

  wrapper.innerHTML = '';

  if (!matches || matches.length === 0) {
    console.warn('[Match] 没有推荐结果');
    showNoResultsState();
    return;
  }

  // 命卦图标SVG代码（与home页面一致）
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

  matches.forEach((match, index) => {
    console.log(`[Match] 渲染推荐 ${index + 1}:`, match.name);

    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.dataset.matchId = match.id;
    slide.dataset.matchIndex = index;

    // 安全检查：确保必需数据存在
    const hasCompleteData = match.bazi &&
                            match.bazi.yearPillar &&
                            match.bazi.monthPillar &&
                            match.bazi.dayPillar &&
                            match.bazi.hourPillar &&
                            match.mingua &&
                            match.dayMaster &&
                            match.elementProportion;

    if (!hasCompleteData) {
      console.warn(`[Match] 推荐 ${match.name} 数据不完整`, match);
    }

    // 使用与home页面完全相同的卡片结构
    const { hue, saturation, lightness } = match.mingua?.hsl || { hue: 0, saturation: '0%', lightness: '70%' };
    const dayMasterElement = match.dayMaster?.element || 'wood';
    const dayMasterStem = match.dayMaster?.stem || '甲';
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
    const cardClass = elementCardClassMap[match.mingua?.element] || '';

    slide.innerHTML = `
      <div class="match-card-container">
        <div class="glass-card ${cardClass} summary-card static-glow"
             data-card
             data-responsive-card
             data-star="${match.mingua?.number || 1}"
             style="--theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};">
          <div class="card-edge-glow"></div>
          <div class="card-glow"></div>
          <div class="glass-card-content">
            <!-- 命卦图标 -->
            <div class="glass-card-logo glass-card-logo-center">
              <div class="mingua-icon">${minguaIcons[match.mingua?.gua] || minguaIcons['kan']}</div>
            </div>

            <!-- 卡片内容 -->
            <div class="glass-card-body">
              <h3 class="profile-name">${match.name}</h3>
              <p class="profile-birth">${formatBirthDate(match.birthDate)}</p>

              <!-- 八字信息 -->
              <div class="bazi-info">
                <span class="bazi-pillar">${match.bazi?.yearPillar?.stem || ''}${match.bazi?.yearPillar?.branch || ''}</span>
                <span class="bazi-pillar">${match.bazi?.monthPillar?.stem || ''}${match.bazi?.monthPillar?.branch || ''}</span>
                <span class="bazi-pillar">${match.bazi?.dayPillar?.stem || ''}${match.bazi?.dayPillar?.branch || ''}</span>
                <span class="bazi-pillar">${match.bazi?.hourPillar?.stem || ''}${match.bazi?.hourPillar?.branch || ''}</span>
              </div>

              <!-- 命卦信息 -->
              <div class="mingua-info">
                <h4 class="mingua-name">${match.mingua?.name || '命卦未知'}</h4>
                <p class="mingua-details">${match.mingua?.position || '未知'} / ${match.mingua?.element || '未知'}</p>
              </div>

              <!-- 日主信息 -->
              <div class="daymaster-info">
                <span class="daymaster-tag">日主：${dayMasterStem} (${dayMasterElementNames[dayMasterElement]})</span>
              </div>
            </div>

            <!-- 卡片底部 - 空白，推荐卡片不需要操作按钮 -->
            <div class="glass-card-footer" style="justify-content: center;">
              <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">系统推荐匹配</p>
            </div>
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(slide);
  });

  console.log('[Match] 推荐卡片渲染完成');

  // 重新初始化swiper（因为slides是动态生成的）
  setTimeout(() => {
    const swiperContainer = document.querySelector('.match-container .swiper');
    if (swiperContainer) {
      console.log('[Match] 开始重新初始化swiper...');

      // 销毁旧实例
      if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy();
        console.log('[Match] 已销毁旧swiper实例');
      }

      // 重新初始化
      try {
        // 使用swiper组件的初始化逻辑
        if (window.SwiperComponent) {
          window.SwiperComponent.initSwiper(swiperContainer);
          console.log('[Match] swiper通过SwiperComponent重新初始化');
        } else {
          // 手动初始化
          const slides = swiperContainer.querySelectorAll('.swiper-slide');
          console.log('[Match] 找到slides数量:', slides.length);

          // 显示所有slides（简单模式）
          slides.forEach((slide, index) => {
            if (index === 0) {
              slide.classList.add('swiper-slide-active');
            } else {
              slide.classList.remove('swiper-slide-active');
            }
          });

          // 绑定按钮事件
          const prevBtn = swiperContainer.querySelector('.swiper-button-prev');
          const nextBtn = swiperContainer.querySelector('.swiper-button-next');

          if (prevBtn) {
            prevBtn.style.display = 'flex';
            prevBtn.onclick = (e) => {
              e.preventDefault();
              console.log('[Match] 点击上一页按钮');
              switchToSlide('prev');
            };
          }

          if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.onclick = (e) => {
              e.preventDefault();
              console.log('[Match] 点击下一页按钮');
              switchToSlide('next');
            };
          }

          console.log('[Match] swiper手动初始化完成');
        }
      } catch (error) {
        console.error('[Match] swiper重新初始化失败:', error);
      }
    }
  }, 100);

  // 重新初始化卡片效果（光晕跟随鼠标）
  setTimeout(() => {
    if (window.CardComponent) {
      try {
        // 销毁旧实例
        if (window.matchCardComponent) {
          window.matchCardComponent.cleanup();
        }
        // 创建新实例
        window.matchCardComponent = new window.CardComponent();
        console.log('[Match] CardComponent重新初始化完成');
      } catch (error) {
        console.error('[Match] CardComponent初始化失败:', error);
      }
    }
  }, 150);

  // 渲染第一个推荐的匹配理由
  if (matches[0] && matches[0].reason) {
    console.log('[Match] 渲染第一个推荐的匹配理由');
    renderMatchReason(matches[0].reason, matches[0].mingua);
  }

  // 等待swiper初始化完成后，添加slideChange事件监听
  setTimeout(() => {
    const swiperContainer = document.querySelector('.match-container .swiper');
    if (swiperContainer && swiperContainer.swiper) {
      console.log('[Match] swiper已初始化，添加slideChange监听');
      swiperContainer.swiper.on('slideChange', function() {
        const activeIndex = this.activeIndex;
        const activeSlide = this.slides[activeIndex];
        const matchIndex = activeSlide?.dataset.matchIndex;

        console.log(`[Match] 切换到推荐 ${parseInt(matchIndex) + 1}`);

        if (matchIndex !== undefined && matches[matchIndex] && matches[matchIndex].reason) {
          renderMatchReason(matches[matchIndex].reason, matches[matchIndex].mingua);
        }
      });
    } else {
      console.warn('[Match] swiper未正确初始化');
    }
  }, 200);
}

/**
 * 渲染匹配理由
 */
async function renderMatchReason(reasonMarkdown, matchMingua = null) {
  const container = document.getElementById('match-reason');

  // 清除之前的主题类
  container.className = 'markdown-body';

  // 如果有命卦信息，添加对应的主题类
  if (matchMingua && matchMingua.element) {
    const elementThemeMap = {
      'wood': 'theme-wood',
      'fire': 'theme-fire',
      'earth': 'theme-earth',
      'metal': 'theme-metal',
      'water': 'theme-water'
    };
    const themeClass = elementThemeMap[matchMingua.element];
    if (themeClass) {
      container.classList.add(themeClass);
    }

    // 如果命卦有自定义HSL值，也应用它们
    if (matchMingua.hsl) {
      container.style.setProperty('--theme-hue', matchMingua.hsl.hue);
      container.style.setProperty('--theme-saturation', matchMingua.hsl.saturation);
      container.style.setProperty('--theme-lightness', matchMingua.hsl.lightness);
    }
  }

  if (window.MarkdownRenderer) {
    const renderer = new MarkdownRenderer({
      breaks: true,
      gfm: true,
      highlight: true
    });

    await renderer.render(reasonMarkdown, '#match-reason');
  } else {
    container.innerHTML = `<pre>${reasonMarkdown}</pre>`;
  }
}

/**
 * 获取命卦数字（用于卡片星星效果）
 */
function getMinguaNumber(name) {
  // 简化处理，随机返回1-9
  return Math.floor(Math.random() * 9) + 1;
}

/**
 * 获取命卦卦象
 */
function getMinguaGua(name) {
  const guas = ['kan', 'kun', 'zhen', 'xun', 'zhonggong', 'qian', 'dui', 'gen', 'li'];
  return guas[Math.floor(Math.random() * guas.length)];
}

/**
 * 显示计算中状态
 */
function showCalculatingState() {
  document.getElementById('calculatingState').style.display = 'block';
}

/**
 * 显示无结果状态
 */
function showNoResultsState() {
  document.getElementById('noResultsState').style.display = 'block';
}

/**
 * 开始匹配
 */
async function calculateMatch() {
  try {
    console.log('[Match] 开始计算匹配...');

    // 获取当前显示的状态
    const noResultsState = document.getElementById('noResultsState');
    const calculatingState = document.getElementById('calculatingState');

    // 淡出当前内容
    if (noResultsState && noResultsState.style.display !== 'none') {
      noResultsState.style.transition = 'opacity 0.5s ease-out';
      noResultsState.style.opacity = '0';

      // 等待淡出完成
      await new Promise(resolve => setTimeout(resolve, 500));

      // 隐藏无结果状态
      noResultsState.style.display = 'none';
      noResultsState.style.opacity = '1';
    }

    // TODO: 调用后端API开始匹配
    // await fetch(`/api/profiles/${currentProfile.id}/matches`, { method: 'POST' });

    // 显示计算中状态（先隐藏，用于淡入效果）
    if (calculatingState) {
      calculatingState.style.display = 'block';
      calculatingState.style.opacity = '0';
      calculatingState.style.transition = 'opacity 0.8s ease-out';

      // 强制重绘
      calculatingState.offsetHeight;

      // 淡入计算中状态
      requestAnimationFrame(() => {
        calculatingState.style.opacity = '1';
      });
    }

    // 开始轮询
    startPolling();

  } catch (error) {
    console.error('启动匹配失败:', error);
    showError('启动匹配失败，请重试');
  }
}

/**
 * 重新计算匹配
 */
async function recalculateMatch() {
  try {
    console.log('[Match] 开始重新计算...');

    // 获取当前显示的状态
    const hasResultsState = document.getElementById('hasResultsState');
    const calculatingState = document.getElementById('calculatingState');

    // 淡出当前内容
    if (hasResultsState && hasResultsState.style.display !== 'none') {
      hasResultsState.style.transition = 'opacity 0.5s ease-out';
      hasResultsState.style.opacity = '0';

      // 等待淡出完成
      await new Promise(resolve => setTimeout(resolve, 500));

      // 隐藏结果状态
      hasResultsState.style.display = 'none';
      hasResultsState.style.opacity = '1';
    }

    // TODO: 调用后端API重新计算
    // await fetch(`/api/profiles/${currentProfile.id}/matches/recalculate`, { method: 'POST' });

    // 显示计算中状态（先隐藏，用于淡入效果）
    if (calculatingState) {
      calculatingState.style.display = 'block';
      calculatingState.style.opacity = '0';
      calculatingState.style.transition = 'opacity 0.8s ease-out';

      // 强制重绘
      calculatingState.offsetHeight;

      // 淡入计算中状态
      requestAnimationFrame(() => {
        calculatingState.style.opacity = '1';
      });
    }

    // 开始轮询
    startPolling();

  } catch (error) {
    console.error('重新计算失败:', error);
    showError('重新计算失败，请重试');
  }
}

/**
 * 开始轮询
 */
function startPolling() {
  pollingInterval = setInterval(async () => {
    try {
      // TODO: 从后端API获取状态
      // const response = await fetch(`/api/profiles/${currentProfile.id}/match-status`);
      // const data = await response.json();

      // 模拟轮询结果
      const random = Math.random();
      if (random > 0.7) {
        currentProfile.matchStatus = 'HAS_RESULTS';
        currentProfile.matchResults = [
          {
            id: 'match_001',
            name: '推荐对象1',
            birthDate: '1992-03-15T10:30:00',
            bazi: {
              yearPillar: { stem: '壬', branch: '申' },
              monthPillar: { stem: '甲', branch: '寅' },
              dayPillar: { stem: '乙', branch: '卯' },
              hourPillar: { stem: '丙', branch: '辰' }
            },
            minguaName: '一白坎卦',
            reason: '## 匹配理由\n\n五行相生，性格互补。根据八字分析，你们的命盘配置较为和谐。'
          }
        ];

        clearInterval(pollingInterval);
        location.reload();
      }

    } catch (error) {
      console.error('轮询失败:', error);
    }
  }, 3000);
}

/**
 * 格式化出生日期
 */
function formatBirthDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

/**
 * 返回首页
 */
function goBack() {
  window.location.href = '../home/home.html';
}

/**
 * 显示错误消息
 */
function showError(message) {
  const toast = document.createElement('div');
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
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

/**
 * 初始化主题切换
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', function() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/**
 * 切换slide
 */
function switchToSlide(direction) {
  console.log('[Match] ========== switchToSlide 开始 ==========');
  console.log('[Match] 方向:', direction);

  const swiperContainer = document.querySelector('.match-container .swiper');
  if (!swiperContainer) {
    console.error('[Match] 找不到swiper容器');
    return;
  }

  const slides = Array.from(swiperContainer.querySelectorAll('.swiper-slide'));
  console.log('[Match] 找到slides数量:', slides.length);
  slides.forEach((slide, i) => console.log(`  Slide ${i}:`, slide.textContent.substring(0, 50)));

  if (slides.length === 0) {
    console.error('[Match] 没有找到slides');
    return;
  }

  const activeSlide = swiperContainer.querySelector('.swiper-slide-active');
  const currentIndex = slides.indexOf(activeSlide);
  console.log('[Match] 当前active slide索引:', currentIndex);

  let nextIndex;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % slides.length;
  } else if (direction === 'prev') {
    nextIndex = (currentIndex - 1 + slides.length) % slides.length;
  } else {
    console.error('[Match] 无效的方向:', direction);
    return;
  }

  console.log(`[Match] 切换: ${currentIndex} -> ${nextIndex}`);

  // 移除所有active类，隐藏所有slides
  slides.forEach((slide, index) => {
    slide.classList.remove('swiper-slide-active');
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
    slide.style.visibility = 'hidden';
    slide.style.position = 'absolute';
    console.log(`  隐藏slide ${index}`);
  });

  // 显示新的active slide
  slides[nextIndex].classList.add('swiper-slide-active');
  slides[nextIndex].style.opacity = '1';
  slides[nextIndex].style.pointerEvents = 'auto';
  slides[nextIndex].style.visibility = 'visible';
  slides[nextIndex].style.position = 'relative';
  console.log(`  显示slide ${nextIndex}`);

  // 更新匹配理由
  const matchIndex = slides[nextIndex].dataset.matchIndex;
  console.log('[Match] 新的matchIndex:', matchIndex);

  if (currentProfile.matchResults && currentProfile.matchResults[matchIndex]) {
    const match = currentProfile.matchResults[matchIndex];
    if (match.reason) {
      console.log('[Match] 更新匹配理由');
      renderMatchReason(match.reason, match.mingua);
    }
  } else {
    console.warn('[Match] 找不到matchIndex对应的推荐对象');
  }

  console.log('[Match] ========== switchToSlide 完成 ==========');
}

// 清理轮询
window.addEventListener('beforeunload', () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
