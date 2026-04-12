/**
 * 八字解析页面逻辑
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

    if (!profileId) {
      showError('缺少档案ID');
      setTimeout(() => goBack(), 2000);
      return;
    }

    // 加载档案数据
    await loadProfile(profileId);

    // 检查解析状态
    await checkAnalysisStatus();

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
  document.getElementById('completedState').style.display = 'block';

  // 渲染八字详情
  renderBaziDetail();

  // 渲染Markdown
  if (currentProfile.analysisResult) {
    renderMarkdown(currentProfile.analysisResult);
  }
}

/**
 * 渲染八字详情
 */
function renderBaziDetail() {
  const container = document.getElementById('baziDetailContent');

  const { bazi, dayMaster, mingua, elementProportion } = currentProfile;

  const dayMasterElementNames = {
    'wood': '木',
    'fire': '火',
    'earth': '土',
    'metal': '金',
    'water': '水'
  };

  container.innerHTML = `
    <!-- 四柱八字 -->
    <div class="pillars-display">
      <div class="pillar-item">
        <span class="pillar-label">年柱</span>
        <span class="pillar-value">${bazi.yearPillar.stem}${bazi.yearPillar.branch}</span>
        <span class="pillar-nayin">${bazi.yearPillar.nayin}</span>
      </div>
      <div class="pillar-item">
        <span class="pillar-label">月柱</span>
        <span class="pillar-value">${bazi.monthPillar.stem}${bazi.monthPillar.branch}</span>
        <span class="pillar-nayin">${bazi.monthPillar.nayin}</span>
      </div>
      <div class="pillar-item">
        <span class="pillar-label">日柱</span>
        <span class="pillar-value">${bazi.dayPillar.stem}${bazi.dayPillar.branch}</span>
        <span class="pillar-nayin">${bazi.dayPillar.nayin}</span>
      </div>
      <div class="pillar-item">
        <span class="pillar-label">时柱</span>
        <span class="pillar-value">${bazi.hourPillar.stem}${bazi.hourPillar.branch}</span>
        <span class="pillar-nayin">${bazi.hourPillar.nayin}</span>
      </div>
    </div>

    <!-- 日主信息 -->
    <div class="daymaster-section">
      <h3>日主：${dayMaster.stem} (${dayMasterElementNames[dayMaster.element]})</h3>
      <p>命卦：${mingua.name} - ${mingua.position}</p>
    </div>

    <!-- 五行占比 -->
    <div class="element-proportion">
      <h4>五行占比</h4>
      <div class="proportion-list">
        <div class="proportion-item">
          <span class="element-name">木</span>
          <div class="proportion-bar">
            <div class="proportion-fill" style="width: ${elementProportion.wood.percentage}%; background: var(--wood-primary);"></div>
          </div>
          <span class="proportion-value">${elementProportion.wood.percentage}%</span>
        </div>
        <div class="proportion-item">
          <span class="element-name">火</span>
          <div class="proportion-bar">
            <div class="proportion-fill" style="width: ${elementProportion.fire.percentage}%; background: var(--fire-primary);"></div>
          </div>
          <span class="proportion-value">${elementProportion.fire.percentage}%</span>
        </div>
        <div class="proportion-item">
          <span class="element-name">土</span>
          <div class="proportion-bar">
            <div class="proportion-fill" style="width: ${elementProportion.earth.percentage}%; background: var(--earth-primary);"></div>
          </div>
          <span class="proportion-value">${elementProportion.earth.percentage}%</span>
        </div>
        <div class="proportion-item">
          <span class="element-name">金</span>
          <div class="proportion-bar">
            <div class="proportion-fill" style="width: ${elementProportion.metal.percentage}%; background: var(--metal-primary);"></div>
          </div>
          <span class="proportion-value">${elementProportion.metal.percentage}%</span>
        </div>
        <div class="proportion-item">
          <span class="element-name">水</span>
          <div class="proportion-bar">
            <div class="proportion-fill" style="width: ${elementProportion.water.percentage}%; background: var(--water-primary);"></div>
          </div>
          <span class="proportion-value">${elementProportion.water.percentage}%</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染Markdown
 */
async function renderMarkdown(markdownContent) {
  const container = document.getElementById('markdown-content');

  // 使用MarkdownRenderer组件
  if (window.MarkdownRenderer) {
    const renderer = new MarkdownRenderer({
      breaks: true,
      gfm: true,
      highlight: true
    });

    await renderer.render(markdownContent, '#markdown-content');
  } else {
    // 简单的fallback
    container.innerHTML = `<pre>${markdownContent}</pre>`;
  }
}

/**
 * 显示计算中状态
 */
function showCalculatingState() {
  document.getElementById('calculatingState').style.display = 'block';
}

/**
 * 显示未开始状态
 */
function showNotStartedState() {
  document.getElementById('notStartedState').style.display = 'block';
}

/**
 * 开始解析
 */
async function startAnalysis() {
  try {
    // TODO: 调用后端API开始计算
    // await fetch(`/api/profiles/${currentProfile.id}/analysis`, { method: 'POST' });

    // 模拟状态更新
    currentProfile.analysisStatus = 'CALCULATING';
    showCalculatingState();
    startPolling();

  } catch (error) {
    console.error('启动解析失败:', error);
    showError('启动解析失败，请重试');
  }
}

/**
 * 开始轮询
 */
function startPolling() {
  pollingInterval = setInterval(async () => {
    try {
      // TODO: 从后端API获取状态
      // const response = await fetch(`/api/profiles/${currentProfile.id}/analysis-status`);
      // const data = await response.json();

      // 模拟轮询结果（3次后完成）
      const random = Math.random();
      if (random > 0.7) {
        currentProfile.analysisStatus = 'COMPLETED';
        currentProfile.analysisResult = '# 八字解析\n\n## 命盘概述\n解析已完成...\n\n## 五行分析\n您的五行配置如下...\n\n## 性格特点\n根据您的八字分析...';

        clearInterval(pollingInterval);
        location.reload();
      }

    } catch (error) {
      console.error('轮询失败:', error);
    }
  }, 3000);
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
