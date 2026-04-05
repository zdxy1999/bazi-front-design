# 简约版八字命理小程序设计规范

> 本目录是八字命理小程序的简约版设计，专注于可维护性和持久性。移除了容易过时的复杂效果，保留核心的视觉语言。

## 设计原则

### 核心理念
- **简洁优先**：去除不必要的装饰，专注内容本身
- **代码可维护性**：使用 Design Token 系统，便于统一修改
- **性能优化**：减少复杂的动画和效果
- **可访问性**：确保对比度符合 WCAG AA 标准

### 与原设计的对比

| 特性 | 原设计 (glow-glass) | 简化设计 (simple) |
|------|-------------------|-------------------|
| 背景效果 | 5个旋转光晕 + 边缘高光 | 纯色渐变背景 |
| 卡片效果 | 多层玻璃 + 复杂光晕 | 单层毛玻璃 + 简洁边框 |
| 按钮效果 | 玻璃 + 五色辉光 | 纯色 + 简单 hover 效果 |
| 动画 | 复杂的呼吸/旋转动画 | 简单的过渡动画 |
| 代码复杂度 | 高 | 低 |

## Design Token 系统

所有设计变量都定义在 `tokens.css` 中，包含：

- **颜色系统**：五行颜色、语义颜色、主题颜色
- **间距系统**：8-point grid
- **字体系统**：统一的字号和行高
- **圆角系统**：统一的圆角大小
- **阴影系统**：简洁的阴影层级
- **动画系统**：统一的缓动函数和时长

## 页面结构

### 1. 背景
**文件**：`assets/background.html`
- 深色主题：`#0a0a0f` → `#1a1a1f` 渐变
- 浅色主题：`#ffffff` → `#f5f5f5` 渐变
- 无复杂光晕效果

### 2. 档案主页
**文件**：`pages/profile.html`
- 五行生克图：简化版，无复杂动画
- 八字命卦卡片：毛玻璃效果 + 简洁边框

### 3. 功能菜单
**文件**：`components/menu-buttons.html`
- 按钮：纯色背景 + hover 放大效果
- 五行颜色：保持五行颜色系统

### 4. 八字详情/分析/匹配
**文件**：`pages/detail.html`、`pages/analysis.html`、`pages/match.html`
- 统一的卡片样式
- 简洁的文字排版

## 组件规范

### 卡片组件
```css
.simple-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

### 按钮组件
```css
.simple-btn {
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  transition: all var(--transition-fast);
}

.simple-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

## 五行颜色系统

保持五行颜色不变：
- 木（绿）：`--color-wood: #4CAF50`
- 火（红）：`--color-fire: #F44336`
- 土（黄）：`--color-earth: #FFC107`
- 金（白）：`--color-metal: #FFFFFF`
- 水（蓝）：`--color-water: #2196F3`

## 动画规范

只保留必要的过渡效果：
- **Hover**：150ms ease-out
- **页面切换**：300ms ease-in-out
- **状态变化**：200ms ease-out

## 性能优化

- 移除所有 requestAnimationFrame 动画
- 使用 CSS transition 代替 JavaScript 动画
- 减少层级和滤镜效果
- 简化选择器

## 可访问性

- 所有文字对比度 ≥ 4.5:1
- 触摸目标 ≥ 44×44px
- 支持键盘导航
- 支持屏幕阅读器

## 浏览器兼容性

- iOS Safari 14+
- Android Chrome 90+
- 微信浏览器（最新版）
