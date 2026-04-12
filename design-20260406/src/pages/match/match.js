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

    if (!profileId) {
      showError('缺少档案ID');
      setTimeout(() => goBack(), 2000);
      return;
    }

    // 加载档案数据
    await loadProfile(profileId);

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
  const profiles = data.profiles;
  currentProfile = profiles.find(p => p.id === profileId);

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
      showNoResultsState();
      break;
  }
}

/**
 * 显示有结果状态
 */
function showHasResultsState() {
  document.getElementById('hasResultsState').style.display = 'block';

  // 渲染推荐结果
  if (currentProfile.matchResults && currentProfile.matchResults.length > 0) {
    renderMatchResults(currentProfile.matchResults);
  } else {
    // 如果没有结果，显示空状态
    document.getElementById('hasResultsState').style.display = 'none';
    showNoResultsState();
  }
}

/**
 * 渲染推荐结果
 */
function renderMatchResults(matches) {
  const wrapper = document.getElementById('matchSwiperWrapper');
  wrapper.innerHTML = '';

  matches.forEach((match, index) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.dataset.matchId = match.id;
    slide.innerHTML = `
      <div class="glass-card match-summary-card" data-card data-star="${getMinguaNumber(match.name)}">
        <div class="card-edge-glow"></div>
        <div class="card-glow"></div>
        <div class="glass-card-content">
          <div class="glass-card-logo glass-card-logo-center">
            <img src="../../../components/icons/mingua/${getMinguaGua(match.name)}.svg"
                 alt="${match.name}"
                 class="mingua-icon">
          </div>
          <div class="glass-card-body">
            <h3>${match.name}</h3>
            <p>${formatBirthDate(match.birthDate)}</p>
            <div class="bazi-preview">
              <span>${match.bazi.yearPillar.stem}${match.bazi.yearPillar.branch}</span>
              <span>${match.bazi.monthPillar.stem}${match.bazi.monthPillar.branch}</span>
              <span>${match.bazi.dayPillar.stem}${match.bazi.dayPillar.branch}</span>
              <span>${match.bazi.hourPillar.stem}${match.bazi.hourPillar.branch}</span>
            </div>
            <div class="mingua-tag">${match.minguaName}</div>
          </div>
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  // 渲染第一个推荐的匹配理由
  if (matches[0] && matches[0].reason) {
    renderMatchReason(matches[0].reason);
  }
}

/**
 * 渲染匹配理由
 */
async function renderMatchReason(reasonMarkdown) {
  const container = document.getElementById('match-reason');

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
    // TODO: 调用后端API开始匹配
    // await fetch(`/api/profiles/${currentProfile.id}/matches`, { method: 'POST' });

    showCalculatingState();
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
    // TODO: 调用后端API重新计算
    // await fetch(`/api/profiles/${currentProfile.id}/matches/recalculate`, { method: 'POST' });

    showCalculatingState();
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
