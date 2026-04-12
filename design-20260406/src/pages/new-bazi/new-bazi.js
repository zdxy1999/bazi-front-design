/**
 * 新建八字页面逻辑
 */

/**
 * 创建档案
 */
async function createProfile() {
  const form = document.getElementById('newBaziForm');
  const formData = new FormData(form);

  const profileData = {
    name: formData.get('profileName') || generateAutoName(),
    gender: formData.get('gender'),
    birthDate: formData.get('birthDate'),
    birthHour: parseInt(formData.get('birthHour'))
  };

  // 验证
  if (!profileData.birthDate) {
    showError('请选择出生日期');
    return;
  }

  try {
    // TODO: 调用后端API创建档案
    // const response = await fetch('/api/profiles', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profileData)
    // });

    // 模拟创建成功
    console.log('创建档案:', profileData);
    showSuccess('档案创建成功');

    // 延迟跳转
    setTimeout(() => {
      window.location.href = '../home/home.html';
    }, 1000);

  } catch (error) {
    console.error('创建失败:', error);
    showError('创建失败，请重试');
  }
}

/**
 * 生成自动名称
 */
function generateAutoName() {
  const count = localStorage.getItem('profileCount') || 0;
  const newCount = parseInt(count) + 1;
  localStorage.setItem('profileCount', newCount.toString());
  return `档案_${newCount}`;
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
