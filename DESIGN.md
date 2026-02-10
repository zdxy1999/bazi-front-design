# 八字小程序前端设计文档

## 设计概述

本项目是一个八字小程序的前端设计，采用现代化的玻璃拟态（Glassmorphism）设计风格，支持明暗双主题切换。设计过程采用渐进式组件化方法，每个组件都完整继承并保留之前设计的效果。

---

## 第一阶段：背景光晕效果设计

### 设计目标
创建一个动态的、具有视觉吸引力的背景系统，为后续组件提供统一的视觉基础。

### 核心功能
- 五色旋转光晕（红、黄、绿、蓝、白）
- 边缘光晕效果（光晕靠近边缘时产生高光）
- 中心暗淡、边缘明亮的遮罩系统
- 明暗双主题支持

### 技术实现

#### 1. 五色旋转光晕
```css
.orbiting-glow {
    position: absolute;
    width: calc(var(--spotlight-size) * 1.5);
    height: calc(var(--spotlight-size) * 1.5);
    border-radius: 50%;
    background: radial-gradient(...);
    filter: blur(20px);
    animation: breathe 3s ease-in-out infinite;
}
```

五个光晕的颜色配置：
- 红色：`hsl(0, 70%, 20%)`
- 黄色：`hsl(60, 90%, 30%)`
- 绿色：`hsl(120, 90%, 20%)`
- 蓝色：`hsl(210, 90%, 30%)`
- 白色：`hsl(0, 0%, 30%)`

#### 2. 边缘光晕系统
五个独立的边缘高光层，跟随旋转光晕在边缘产生彩色光晕：

```css
.card-glow-highlight-1::before {
    background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.6) at
        calc(var(--highlight-x-1) * 1px)
        calc(var(--highlight-y-1) * 1px),
        hsl(var(--orbit-glow-1-hue) ...),
        transparent 100%
    );
    opacity: var(--orbit-edge-opacity-1);
}
```

JavaScript 实时计算光晕与边缘的距离，动态更新高光位置和透明度。

#### 3. 中心遮罩系统
两层遮罩系统实现中心暗淡、边缘明亮的效果：

**内部遮罩层** (`card-glow-inner`)
- 提供纯色背景覆盖
- 深色主题：黑色到深灰渐变
- 浅色主题：白色到浅灰渐变
- 边缘内缩 4px，让边缘光晕可见

**可见性蒙版** (`glow-visibility-mask`)
- 径向渐变实现中心到边缘的透明度过渡
- 深色主题：中心完全不透明 → 边缘逐渐透明
- 浅色主题：中心半透明白色 → 边缘完全透明

#### 4. 主题切换
通过 `.light-theme` 类实现主题切换：
- 背景渐变色切换
- 光晕饱和度和亮度调整
- 边缘高光透明度增强

### 文件结构
```
background/
└── glow-card.html          # 背景光晕效果演示
```

---

## 第二阶段：功能模块按钮组件设计

### 设计目标
设计小程序主界面的功能入口按钮，与背景系统完美融合。

### 设计原则
1. **完整继承**：新组件必须完整保留背景的所有效果
2. **玻璃质感**：与背景风格统一的玻璃拟态设计
3. **明暗适配**：支持双主题，视觉协调
4. **交互反馈**：点击时产生五色辉光效果

### 核心功能
- 2列网格布局，正方形按钮卡片
- SVG 矢量图标（替代 emoji）
- 鼠标悬停光晕效果
- 点击时五色辉光扩散动画

### 技术实现

#### 1. 按钮卡片布局
```css
.button-cards-container {
    display: grid;
    grid-template-columns: repeat(2, var(--button-card-size));
    gap: var(--button-card-gap);
    padding: 40px;
}

.button-card {
    width: var(--button-card-size);      /* 160px */
    height: var(--button-card-size);
    border-radius: var(--button-card-radius);  /* 20px */
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### 2. SVG 图标系统
使用纯色线性图标，支持明暗主题：

```css
.button-card-icon svg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.9);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

body.light-theme .button-card-icon svg {
    stroke: rgba(0, 0, 0, 0.7);
}
```

六个功能模块图标：
1. **命盘分析** - 罗盘风格（圆形+辐射线）
2. **八字排盘** - 网格盘面（方形+九宫格）
3. **姻缘配对** - 心形
4. **运势预测** - 趋势线
5. **事业财运** - 层叠财富
6. **健康养生** - 心率线

#### 3. 悬停效果
```css
.button-card:hover {
    transform: translateY(-4px) scale(1.02);
    background: rgba(255, 255, 255, 0.08);
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1);
}
```

鼠标跟随光晕：
```css
.button-card::before {
    background: radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.15) 0%,
        transparent 60%
    );
}
```

#### 4. 五色辉光点击效果

**波纹扩散**
五个彩色波纹依次扩散，延迟 0.08s：

```css
.glow-ripple-1 {
    background: radial-gradient(...);
    animation-delay: 0s;
}

.glow-ripple-2 {
    animation-delay: 0.08s;
}

/* ... */
```

深色主题颜色：
- 红色：`hsl(0, 70%, 50%)`
- 黄色：`hsl(60, 90%, 60%)`
- 绿色：`hsl(120, 90%, 50%)`
- 蓝色：`hsl(210, 90%, 60%)`
- 白色：`hsl(0, 0%, 100%)`

浅色主题颜色（90% 高亮度）：
- 金色：`hsl(45, 100%, 90%)`
- 红色：`hsl(0, 100%, 90%)`
- 蓝色：`hsl(210, 100%, 90%)`
- 金黄：`hsl(50, 100%, 90%)`
- 白色：`100%`

**外部辉光脉冲**
```css
@keyframes cardGlowPulse {
    50% {
        box-shadow:
            0 0 30px hsl(0, 70%, 50%),
            0 0 60px hsl(60, 90%, 60%),
            0 0 90px hsl(120, 90%, 50%),
            0 0 120px hsl(210, 90%, 60%);
    }
}
```

**触发机制**
```javascript
function triggerGlow(event, card) {
    card.classList.remove('clicking');
    void card.offsetWidth;  // 强制重绘
    card.classList.add('clicking');
    setTimeout(() => {
        card.classList.remove('clicking');
    }, 800);
}
```

#### 5. 背景效果完整保留

新组件的 HTML 结构中完整包含了背景的所有元素：

```html
<div class="card">
    <!-- 旋转光晕 -->
    <div class="orbiting-glow orbiting-glow-1"></div>
    <div class="orbiting-glow orbiting-glow-2"></div>
    <div class="orbiting-glow orbiting-glow-3"></div>
    <div class="orbiting-glow orbiting-glow-4"></div>
    <div class="orbiting-glow orbiting-glow-5"></div>

    <!-- 背景系统 -->
    <div class="card-glow-border"></div>
    <div class="card-glow-inner"></div>
    <div class="glow-visibility-mask"></div>

    <!-- 边缘高光 -->
    <div class="card-glow-highlight-1"></div>
    <div class="card-glow-highlight-2"></div>
    <div class="card-glow-highlight-3"></div>
    <div class="card-glow-highlight-4"></div>
    <div class="card-glow-highlight-5"></div>
</div>

<!-- 按钮卡片容器 -->
<div class="button-cards-container">
    <!-- 按钮卡片 -->
</div>
```

#### 6. 响应式设计
```css
@media (max-width: 480px) {
    :root {
        --button-card-size: 140px;
        --button-card-gap: 16px;
        --button-card-radius: 16px;
    }
}

@media (max-width: 360px) {
    :root {
        --button-card-size: 120px;
    }
}
```

### 文件结构
```
components/
└── module-buttons.html     # 功能模块按钮组件（含完整背景）
```

---

## 设计系统总结

### 颜色系统

#### 深色主题
- 背景渐变：`#000000` → `#0a0a0f`
- 文本颜色：`rgba(255, 255, 255, 0.9)`
- 按钮背景：`rgba(255, 255, 255, 0.05-0.08)`
- 边框：`rgba(255, 255, 255, 0.1-0.2)`

#### 浅色主题
- 背景渐变：`#ffffff` → `#f5f5f5`
- 文本颜色：`rgba(0, 0, 0, 0.8)`
- 按钮背景：`rgba(255, 255, 255, 0.4-0.6)`
- 边框：`rgba(0, 0, 0, 0.08-0.15)`

### 五色光晕系统

#### 用途
- 旋转光晕：背景氛围
- 边缘高光：边缘光晕效果
- 点击辉光：按钮交互反馈

#### 深色主题
| 颜色 | 色相 | 饱和度 | 亮度 |
|------|------|--------|------|
| 红 | 0° | 70% | 20-50% |
| 黄 | 60° | 90% | 30-60% |
| 绿 | 120° | 90% | 20-50% |
| 蓝 | 210° | 90% | 30-60% |
| 白 | 0° | 0% | 30-100% |

#### 浅色主题（点击辉光）
| 颜色 | 色相 | 饱和度 | 亮度 |
|------|------|--------|------|
| 金 | 45° | 100% | 90% |
| 红 | 0° | 100% | 90% |
| 蓝 | 210° | 100% | 90% |
| 金黄 | 50° | 100% | 90% |
| 白 | 0° | 0% | 100% |

### 尺寸规范

#### 按钮卡片
- 桌面端：160px × 160px
- 小屏（≤480px）：140px × 140px
- 超小屏（≤360px）：120px × 120px

#### 圆角
- 按钮卡片：20px
- 图标容器：16px
- 小屏：16px
- 超小屏：自适应

#### 间距
- 桌面端：24px
- 小屏：16px

### 动画参数

#### 旋转光晕
- 呼吸动画：3s ease-in-out infinite
- 旋转速度：0.008 弧度/帧
- 旋转半径：160px

#### 悬停效果
- 过渡时间：0.3-0.4s cubic-bezier(0.4, 0, 0.2, 1)
- 上浮距离：4px
- 放大比例：1.02

#### 点击辉光
- 波纹扩散：0.8s ease-out
- 脉冲动画：0.6s ease-out
- 波纹延迟：0.08s 间隔

---

## 设计演进

### 迭代过程

#### 背景光晕效果
1. ✅ 初始设计：五色旋转光晕
2. ✅ 添加边缘光晕系统
3. ✅ 添加中心遮罩
4. ✅ 支持明暗主题

#### 功能模块按钮
1. ✅ 初始设计：使用 emoji 图标
2. ✅ 改用 SVG 线性图标
3. ✅ 添加点击辉光效果（深色主题）
4. ✅ 优化浅色主题辉光（金黄色系 → 多彩色系）
5. ✅ 调整浅色主题辉光亮度（90%）
6. ✅ 移除绿色辉光
7. ✅ 完整集成背景系统（边缘光晕 + 中心遮罩）

### 关键决策

#### 1. SVG 替代 Emoji
**问题**：Emoji 在不同平台显示不一致，不够专业

**解决方案**：
- 使用 SVG 线性图标
- 统一样式：stroke-based，1.5px 线宽
- 支持明暗主题颜色切换

#### 2. 浅色主题辉光颜色
**迭代过程**：
- 初始：金黄色系 → 用户反馈太单调
- 尝试：金+红+蓝+绿+白 → 用户反馈太红
- 优化：金+红+蓝+绿 → 用户反馈不要绿色
- 最终：金+红+蓝+金黄+白，全部 90% 亮度

#### 3. 背景效果完整性
**问题**：新组件缺少边缘光晕和中心遮罩

**解决方案**：
- 完整复制背景系统的 HTML 结构
- 添加所有 CSS 样式
- 保留 JavaScript 逻辑
- 确保 z-index 层级正确

---

## 技术栈

### HTML5
- 语义化标签
- SVG 图标

### CSS3
- CSS 变量（自定义属性）
- CSS Grid 布局
- Backdrop-filter（毛玻璃效果）
- CSS 动画（@keyframes）
- 径向渐变（radial-gradient）

### JavaScript
- CSS 变量动态更新
- requestAnimationFrame 动画循环
- 事件处理（mousemove, click, mouseleave）
- LocalStorage 主题持久化

---

## 浏览器兼容性

### 关键特性兼容性
- `backdrop-filter`：Chrome 76+, Safari 9+
- CSS 变量：Chrome 49+, Firefox 31+, Safari 9.1+
- CSS Grid：Chrome 57+, Firefox 52+, Safari 10.1+

### 降级方案
如需支持旧浏览器，可添加：
- backdrop-filter 降级为半透明背景
- CSS Grid 降级为 Flexbox
- CSS 变量降级为预处理器变量

---

## 性能优化

### 动画性能
- 使用 `transform` 和 `opacity`（GPU 加速）
- 避免布局抖动（使用 `will-change`）
- `requestAnimationFrame` 同步屏幕刷新率

### 资源优化
- SVG 内联（减少 HTTP 请求）
- CSS 动画替代 JavaScript 动画
- 使用 CSS 变量减少样式计算

---

## 未来扩展

### 计划组件
1. **命盘展示组件** - 八字命盘可视化
2. **详细信息卡片** - 展示分析结果
3. **导航栏组件** - 页面导航
4. **表单组件** - 用户输入

### 设计原则
- 所有新组件必须完整继承背景系统
- 统一的玻璃拟态风格
- 支持明暗双主题
- 保持交互动画一致性

---

## 文件清单

```
bazi-front-design/
├── background/
│   └── glow-card.html          # 背景光晕效果
├── components/
│   └── module-buttons.html     # 功能模块按钮（含背景）
└── DESIGN.md                   # 本设计文档
```

---

## 总结

本项目采用渐进式组件化设计方法，从背景系统开始，逐步构建功能组件。每个新组件都完整保留并继承之前的设计效果，确保视觉一致性和用户体验的连贯性。

核心设计特点：
1. **五色光晕系统**贯穿整个设计
2. **玻璃拟态风格**统一视觉语言
3. **明暗双主题**支持不同场景
4. **渐进式设计**保证组件完整性

通过这种设计方法，每个组件既能独立存在，又能完美融合，形成统一的整体体验。
