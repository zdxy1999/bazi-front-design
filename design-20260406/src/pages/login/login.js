/**
 * 登录页面逻辑
 * Login Page Logic
 */

(function() {
  'use strict';

  // 全局变量
  let countdownTimer = null;
  let countdown = 0;

  /**
   * 初始化页面
   */
  function init() {
    initLoginMethodSwitch();
    initEmailLoginForm();
    initPhoneLoginForm();
  }

  /**
   * 初始化登录方式切换
   */
  function initLoginMethodSwitch() {
    const methodRadios = document.querySelectorAll('input[name="loginMethod"]');
    const forms = {
      email: document.getElementById('emailLoginForm'),
      phone: document.getElementById('phoneLoginForm'),
      wechat: document.getElementById('wechatLoginForm')
    };

    methodRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const method = this.value;
        Object.values(forms).forEach(form => form?.classList.remove('active'));
        forms[method]?.classList.add('active');
      });
    });
  }

  /**
   * 初始化邮箱登录表单
   */
  function initEmailLoginForm() {
    const emailForm = document.getElementById('emailLoginForm');
    if (!emailForm) return;

    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleEmailLogin();
    });

    const sendCodeBtn = emailForm.querySelector('.send-code-btn[data-type="email"]');
    sendCodeBtn?.addEventListener('click', () => {
      handleSendCode('email', sendCodeBtn);
    });
  }

  /**
   * 初始化手机号登录表单
   */
  function initPhoneLoginForm() {
    const phoneForm = document.getElementById('phoneLoginForm');
    if (!phoneForm) return;

    phoneForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePhoneLogin();
    });

    const sendCodeBtn = phoneForm.querySelector('.send-code-btn[data-type="phone"]');
    sendCodeBtn?.addEventListener('click', () => {
      handleSendCode('phone', sendCodeBtn);
    });

    const phoneInput = document.getElementById('phone');
    phoneInput?.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '').slice(0, 11);
    });
  }

  /**
   * 处理邮箱登录
   */
  function handleEmailLogin() {
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('emailCode');
    const submitButton = emailInput?.form?.querySelector('button[type="submit"]');

    const email = emailInput?.value?.trim() || '';
    const code = codeInput?.value?.trim() || '';

    if (!email) {
      window.ToastUtils?.showError('请输入邮箱');
      emailInput?.focus();
      return;
    }

    if (!window.ValidationUtils?.validateEmail(email)) {
      window.ToastUtils?.showError('请输入正确的邮箱格式');
      emailInput?.focus();
      return;
    }

    if (!code) {
      window.ToastUtils?.showError('请输入验证码');
      codeInput?.focus();
      return;
    }

    if (code.length !== 6) {
      window.ToastUtils?.showError('验证码应为6位数字');
      codeInput?.focus();
      return;
    }

    setLoading(submitButton, true, '登录中...');

    // 模拟登录请求
    setTimeout(() => {
      setLoading(submitButton, false);
      window.ToastUtils?.showSuccess('登录成功！');
      setTimeout(() => {
        window.location.href = '../home/home.html';
      }, 1000);
    }, 1500);
  }

  /**
   * 处理手机号登录
   */
  function handlePhoneLogin() {
    const phoneInput = document.getElementById('phone');
    const codeInput = document.getElementById('phoneCode');
    const submitButton = phoneInput?.form?.querySelector('button[type="submit"]');

    const phone = phoneInput?.value?.trim() || '';
    const code = codeInput?.value?.trim() || '';

    if (!phone) {
      window.ToastUtils?.showError('请输入手机号');
      phoneInput?.focus();
      return;
    }

    if (!window.ValidationUtils?.validatePhone(phone)) {
      window.ToastUtils?.showError('请输入正确的手机号');
      phoneInput?.focus();
      return;
    }

    if (!code) {
      window.ToastUtils?.showError('请输入验证码');
      codeInput?.focus();
      return;
    }

    if (code.length !== 6) {
      window.ToastUtils?.showError('验证码应为6位数字');
      codeInput?.focus();
      return;
    }

    setLoading(submitButton, true, '登录中...');

    // 模拟登录请求
    setTimeout(() => {
      setLoading(submitButton, false);
      window.ToastUtils?.showSuccess('登录成功！');
      setTimeout(() => {
        window.location.href = '../home/home.html';
      }, 1000);
    }, 1500);
  }

  /**
   * 发送验证码
   */
  function handleSendCode(type, button) {
    let identifier = '';
    let inputId = type === 'email' ? 'email' : 'phone';
    const input = document.getElementById(inputId);

    if (!input) return;

    identifier = input.value.trim();

    if (!identifier) {
      window.ToastUtils?.showError(`请输入${type === 'email' ? '邮箱' : '手机号'}`);
      input.focus();
      return;
    }

    const isValid = type === 'email'
      ? window.ValidationUtils?.validateEmail(identifier)
      : window.ValidationUtils?.validatePhone(identifier);

    if (!isValid) {
      window.ToastUtils?.showError(`请输入正确的${type === 'email' ? '邮箱' : '手机号'}格式`);
      input.focus();
      return;
    }

    // 开始倒计时
    button.disabled = true;
    countdown = 60;
    updateCountdown(button);

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        button.disabled = false;
        button.textContent = '获取验证码';
      } else {
        updateCountdown(button);
      }
    }, 1000);

    window.ToastUtils?.showSuccess(`验证码已发送到${type === 'email' ? '邮箱' : '手机号'}`);
  }

  /**
   * 更新倒计时显示
   */
  function updateCountdown(button) {
    button.textContent = `${countdown}秒后重试`;
  }

  /**
   * 设置按钮加载状态
   */
  function setLoading(button, isLoading, text = '') {
    if (!button || !window.ButtonComponent) return;

    if (isLoading) {
      window.ButtonComponent.setButtonLoading(button, true, text);
    } else {
      window.ButtonComponent.setButtonLoading(button, false);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
