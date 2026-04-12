/**
 * 新建姻缘匹配页面逻辑
 */

/**
 * 开始匹配
 */
async function calculateMatch() {
  const form = document.getElementById('newMatchForm');
  const formData = new FormData(form);

  const matchData = {
    requirements: formData.get('requirements') || ''
  };

  try {
    // TODO: 调用后端API开始匹配
    // const response = await fetch('/api/matches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(matchData)
    // });

    console.log('开始匹配:', matchData);
    showSuccess('正在计算匹配...');

    // 延迟跳转到匹配页面
    setTimeout(() => {
      window.location.href = '../match/match.html?status=calculating';
    }, 1000);

  } catch (error) {
    console.error('匹配失败:', error);
    showError('匹配失败，请重试');
  }
}

/**
 * 返回
 */
function goBack() {
  window.location.href = '../home/home.html';
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
  const toast = document.createElement('div');
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

// 初始化主题切换
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
