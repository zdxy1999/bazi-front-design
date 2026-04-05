# 八字命理小程序 - 简约设计版

这是一个简约、易维护的八字命理小程序设计系统，移除了原设计中复杂的动画和效果，专注于可维护性和性能。

## 目录结构

```
simple-design/
├── design-thesis.md       # 设计理念和规范文档
├── tokens.css            # Design Tokens（设计令牌）
├── README.md            # 本文件
├── assets/
│   └── background.html  # 简约背景示例
├── components/
│   ├── card.html       # 卡片组件示例
│   └── button.html     # 按钮组件示例
└── pages/
    ├── profile.html    # 档案主页（含五行图）
    └── wuxing-chart.html # 五行生克图
```

## 设计特点

### 与原设计对比

| 特性 | 原设计 | 简化设计 |
|------|-------------------|-------------------|
| 背景效果 | 5个旋转光晕 + 边缘高光 | 纯色渐变背景 |
| 卡片效果 | 多层玻璃 + 复杂光晕 | 单层毛玻璃 + 简洁边框 |
| 按钮效果 | 玻璃 + 五色辉光 | 纯色 + 简单 hover 效果 |
| 动画 | 复杂的呼吸/旋转动画 | 简单的过渡动画 |
| 代码复杂度 | 高 | 低 |

### 核心优势

1. **更易维护**：使用 Design Token 系统，所有变量集中管理
2. **性能更好**：移除了复杂的 JavaScript 动画，减少资源消耗
3. **不易过时**：简约的设计风格更加持久
4. **易于定制**：清晰的代码结构，方便后续修改

## 快速开始

### 1. 引入 Design Tokens

所有页面都需要引入 `tokens.css`：

```html
<link rel="stylesheet" href="tokens.css">
```

### 2. 使用主题颜色

```css
.custom-element {
  background: var(--theme-card-bg);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-card-border);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

### 3. 使用五行颜色

```css
.wood-theme { color: var(--color-wood); }
.fire-theme { color: var(--color-fire); }
.earth-theme { color: var(--color-earth); }
.metal-theme { color: var(--color-metal); }
.water-theme { color: var(--color-water); }
```

## 组件使用

### 卡片组件

参考 `components/card.html`，使用时：

```html
<div class="simple-card">
  <h3 class="card-title">标题</h3>
  <p class="card-content">内容</p>
</div>
```

### 按钮组件

参考 `components/button.html`，使用时：

```html
<button class="simple-btn btn-primary">主按钮</button>
<button class="simple-btn btn-wood">木</button>
<button class="simple-btn btn-fire">火</button>
```

### 五行生克图

参考 `pages/wuxing-chart.html`，已封装为可复用的 SVG 组件。

### 档案主页

参考 `pages/profile.html`，整合了五行图和命卦卡片，支持滑动切换。

## Design Token 速查

### 颜色系统

```css
/* 五行颜色 */
--color-wood: #4CAF50;    /* 木 - 绿 */
--color-fire: #F44336;    /* 火 - 红 */
--color-earth: #FFC107;   /* 土 - 黄 */
--color-metal: #FFFFFF;   /* 金 - 白 */
--color-water: #2196F3;   /* 水 - 蓝 */

/* 主题颜色（深色/浅色自动切换） */
--theme-bg-primary: #0a0a0f;        /* 主背景 */
--theme-bg-secondary: #1a1a1f;      /* 次背景 */
--theme-text-primary: #ffffff;      /* 主文字 */
--theme-text-secondary: rgba(255, 255, 255, 0.7); /* 次文字 */
--theme-border: rgba(255, 255, 255, 0.12); /* 边框 */
--theme-card-bg: rgba(255, 255, 255, 0.08); /* 卡片背景 */
```

### 间距系统（8-point grid）

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### 字体系统

```css
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
```

### 圆角系统

```css
--radius-md: 0.5rem;  /* 8px */
--radius-lg: 1rem;    /* 16px */
--radius-xl: 1.5rem;  /* 24px */
--radius-full: 9999px;
```

## 主题切换

所有组件都支持深色/浅色主题切换：

```javascript
function toggleTheme() {
  document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('theme',
    document.documentElement.classList.contains('light-theme') ? 'light' : 'dark'
  );
}

// 加载保存的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-theme');
}
```

## 浏览器兼容性

- iOS Safari 14+
- Android Chrome 90+
- 微信浏览器（最新版）

## 性能优化

1. **移除所有 requestAnimationFrame 动画**
2. **使用 CSS transition 代替 JavaScript 动画**
3. **减少层级和滤镜效果**
4. **简化选择器**

## 可访问性

- 所有文字对比度 ≥ 4.5:1
- 触摸目标 ≥ 44×44px
- 支持键盘导航
- 支持屏幕阅读器

## 下一步

1. 根据实际需求调整 Design Tokens
2. 基于 tokens.css 创建更多组件
3. 集成到实际的小程序框架中
4. 添加必要的交互逻辑

## 与原设计共存

两个设计版本可以共存：
- `glow-glass-design/` - 复杂光晕玻璃效果（原设计）
- `simple-design/` - 简约设计（当前设计）

根据项目需求选择合适的设计风格。
