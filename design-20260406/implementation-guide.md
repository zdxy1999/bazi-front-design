# 八字命理小程序 - 前端设计实现要点文档

> 本文档记录八字命理小程序前端设计的实现要点，供正式实现时参考。

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [设计系统](#设计系统)
- [组件实现要点](#组件实现要点)
- [页面实现要点](#页面实现要点)
- [公共函数](#公共函数)
- [最佳实践](#最佳实践)

---

## 项目概述

### 项目定位
八字命理小程序是一个以传统中国命理学（八字、五行、命卦等）为主题的前端设计项目。本项目不是完整的前端实现，而是UI设计稿和交互原型。

### 核心功能
1. **档案管理**：用户可创建多个八字档案（最多10个）
2. **八字分析**：基于八字数据进行详细解析
3. **姻缘匹配**：基于八字匹配推荐合适对象
4. **用户系统**：支持邮箱/手机号验证码登录、微信扫码登录

### 设计理念
- **主题风格**：禅意神秘（Mystical Zen）
- **视觉元素**：五行颜色（金木水火土）、太极、八卦
- **交互体验**：流畅动画、玻璃质感、响应式设计

---

## 技术栈

### 前端框架
- **HTML5**：语义化标签
- **CSS3**：原生CSS，无预处理器
- **JavaScript ES6+**：原生JS，无框架
- **响应式设计**：移动端优先，PC端适配

### 外部依赖
- **Marked.js**：Markdown解析
- **Highlight.js**：代码高亮
- **无其他框架依赖**

### 浏览器支持
- Chrome/Edge（最新版）
- Firefox（最新版）
- Safari（最新版）
- 移动端浏览器

---

## 目录结构

```
design-20260406/
├── style/                          # 样式系统
│   ├── tokens.css                 # 设计token（颜色、字体、间距）
│   ├── common.css                 # 公共样式
│   └── themes.css                 # 主题样式
├── components/                     # 组件库
│   ├── background/                # 背景动画组件
│   ├── card/                      # 玻璃卡片组件
│   ├── button/                    # 按钮组件
│   ├── input/                     # 输入框组件
│   ├── selector/                  # 选择器组件
│   ├── swiper/                    # 翻页容器组件
│   ├── menu/                      # 环形菜单组件
│   ├── processing/                # 长时处理动画组件
│   ├── markdown/                  # Markdown解析器组件
│   ├── wuxing-chart/              # 五行生克图组件
│   └── loading-spin/              # 短时加载动画组件
├── src/
│   ├── common/                     # 公共代码
│   │   ├── utils.js               # 工具函数
│   │   └── api.js                 # API请求封装
│   └── pages/                      # 页面
│       ├── home/                   # 首页
│       ├── login/                  # 登录页
│       ├── new-bazi/              # 新建八字
│       ├── analysis/              # 八字解析
│       ├── match/                 # 姻缘匹配
│       └── new-match/             # 新建匹配
└── mock-data/                      # Mock数据
    └── bazi-profiles.json         # 档案数据
```

---

## 设计系统

### 颜色主题

#### 五行颜色（暗色主题）
```css
--wood-primary:    #86efac;    /* 木 - 绿色 */
--fire-primary:    #f87171;    /* 火 - 红色 */
--earth-primary:   #fde047;    /* 土 - 黄色 */
--metal-primary:   #fafafa;    /* 金 - 白色 */
--water-primary:   #60a5fa;    /* 水 - 蓝色 */
```

#### 五行颜色（亮色主题）
```css
--wood-primary:    #16a34a;    /* 木 - 深绿色 */
--fire-primary:    #dc2626;    /* 火 - 深红色 */
--earth-primary:   #ca8a04;    /* 土 - 深黄色 */
--metal-primary:   #262626;    /* 金 - 黑色 */
--water-primary:   #2563eb;    /* 水 - 深蓝色 */
```

#### 命卦颜色（HSL）
| 命卦 | HSL值 | 五行 |
|------|-------|------|
| 1 一白坎 | `hsl(0, 0%, 70%)` | 水 |
| 2 二黑坤 | `hsl(0, 0%, 30%)` | 土 |
| 3 三碧震 | `hsl(200, 75%, 55%)` | 木 |
| 4 四绿巽 | `hsl(120, 70%, 50%)` | 木 |
| 5 五黄中 | `hsl(45, 90%, 55%)` | 土 |
| 6 六白乾 | `hsl(0, 0%, 70%)` | 金 |
| 7 七赤兑 | `hsl(0, 80%, 60%)` | 金 |
| 8 八白艮 | `hsl(0, 0%, 85%)` | 土 |
| 9 九紫离 | `hsl(275, 80%, 60%)` | 火 |

### 间距系统
```css
--spacing-xs:   4px;
--spacing-sm:   8px;
--spacing-md:   16px;
--spacing-lg:   24px;
--spacing-xl:   32px;
--spacing-2xl:  48px;
```

### 字体系统
```css
--font-size-xs:  12px;
--font-size-sm:  14px;
--font-size-md:  16px;
--font-size-lg:  18px;
--font-size-xl:  20px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
```

### 断点系统
```css
--breakpoint-sm:  480px;   /* 移动端 */
--breakpoint-md:  768px;   /* 平板 */
--breakpoint-lg:  1024px;  /* PC */
```

---

## 组件实现要点

### 1. 背景组件 (Background)

**功能**：五行流动动画 + 边缘高光效果

**核心实现**：
- 使用SVG `<animate>` 元素实现5个光晕的随机飘动
- 光晕靠近边缘时触发边缘发光效果
- 毛玻璃垫层隔离背景与内容

**关键代码**：
```html
<svg class="svg-background" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="Gradient1">
      <animate attributeName="fx" dur="34s" values="0%;3%;0%"/>
    </radialGradient>
  </defs>
  <rect fill="url(#Gradient1)">
    <animateTransform type="rotate" from="0 50 50" to="360 50 50"/>
  </rect>
</svg>
```

**要点**：
- SVG viewBox="0 0 100 100"使用百分比定位
- 每个光晕有不同的动画时长（34s, 38s, 42s, 46s, 50s）
- 使用CSS变量控制光晕颜色

**文件**：`components/background/`

---

### 2. 玻璃卡片组件 (Card)

**功能**：液态玻璃质感 + 光晕跟随效果

**核心实现**：
- `backdrop-filter: blur(40px) saturate(180%)` 实现毛玻璃效果
- 内部光晕跟随鼠标/触摸移动
- 边缘光晕玻璃折射效果
- 支持主题颜色定制

**关键CSS**：
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

.glass-card .card-glow {
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    var(--glow-color),
    transparent 50%
  );
}
```

**要点**：
- 使用CSS变量 `--mouse-x` 和 `--mouse-y` 跟踪光晕位置
- PC端：`mousemove` 事件更新光晕位置
- 移动端：`touchmove` 事件 + 随机飘动效果
- 支持通过 `data-*` 属性设置主题色

**文件**：`components/card/`

---

### 3. 按钮组件 (Button)

**功能**：主题色光晕 + 点击波纹效果

**核心实现**：
- 五行主题色按钮（wood/fire/earth/metal/water）
- 点击波纹扩散动画
- 加载状态（带旋转spinner）
- 多种尺寸和变体

**关键CSS**：
```css
.btn {
  backdrop-filter: blur(40px) saturate(180%);
  border-radius: 9999px;  /* 胶囊形状 */
  transition: all 0.3s ease;
}

.btn:active {
  transform: scale(0.95);
}

.btn.ripple::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s ease-out;
}
```

**要点**：
- 胶囊形状：`border-radius: 9999px`
- 波纹效果：使用CSS动画实现
- 加载状态：通过JavaScript动态添加类名
- 禁用状态：降低opacity + 禁用pointer-events

**文件**：`components/button/`

---

### 4. 输入框组件 (Input)

**功能**：边框光晕 + 主题适配

**核心实现**：
- 焦点时外发光效果
- 支持多种类型（text/email/password/tel/date等）
- 自动完成支持
- 表单验证

**关键CSS**：
```css
.input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--water-primary);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}
```

**要点**：
- 焦点状态：边框颜色变化 + 外发光
- 使用 `:autofill` 伪元素处理浏览器自动填充
- 错误状态：红色边框 + 错误图标
- 成功状态：绿色边框 + 成功图标

**文件**：`components/input/`

---

### 5. 选择器组件 (Selector)

**功能**：Radio/Checkbox/Toggle切换

**核心实现**：
- 选中时整个元素点亮（发光效果）
- 五行主题色适配
- 键盘导航支持
- 按钮样式单选框

**关键CSS**：
```css
.radio-button input:checked + .radio-button-text {
  border-color: var(--water-primary);
  color: var(--water-primary);
  box-shadow: 0 0 20px var(--water-primary);
}
```

**要点**：
- 使用 `input:checked + label` 实现状态切换
- 发光效果：`box-shadow` + 颜色过渡
- 亮色主题自动切换为深色主题
- 支持垂直/水平布局

**文件**：`components/selector/`

---

### 6. 环形菜单组件 (Menu)

**功能**：底部展开的环形菜单

**核心实现**：
- 支持3-5个菜单项自动布局
- 环形展开/收起动画
- 五行主题色（木火土金水）
- 键盘导航支持（ESC关闭）

**关键算法**：
```javascript
const angleStep = 360 / menuItems.length;
const radius = isMobile ? 60 : 80;

menuItems.forEach((item, index) => {
  const angle = (angleStep * index - 90) * (Math.PI / 180);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  item.style.transform = `translate(${x}px, ${y}px)`;
});
```

**要点**：
- 使用三角函数计算菜单项位置
- 底部弧形布局：`data-arc="bottom"`
- 点击外部自动关闭
- 支持SVG图标

**文件**：`components/menu/`

---

### 7. 翻页容器组件 (Swiper)

**功能**：PC端3D Coverflow + 移动端滑动

**核心实现**：
- PC端：鼠标拖拽 + 左右按钮
- 移动端：触摸滑动 + 手势识别
- 3D Coverflow效果：两侧缩小旋转
- 循环模式支持

**关键CSS**：
```css
.swiper-slide {
  transition: all 0.5s ease;
}

.swiper-slide-prev {
  transform: translateX(-50%) scale(0.8) rotateY(15deg);
  opacity: 0.5;
}

.swiper-slide-active {
  transform: translateX(0) scale(1) rotateY(0);
  opacity: 1;
}
```

**要点**：
- 使用CSS transform实现3D效果
- 移动端使用 `touchstart/touchmove/touchend` 事件
- PC端使用 `mousedown/mousemove/mouseup` 事件
- 支持无限循环（loop模式）

**文件**：`components/swiper/`

---

### 8. 长时处理动画组件 (Processing)

**功能**：太极旋转 + 外侧辉光

**核心实现**：
- 太极图旋转动画（0.5s/圈）
- 外层辉光扩散效果
- 用于数据计算等待场景

**关键CSS**：
```css
.processing-taichi {
  animation: taichiRotate 0.5s linear infinite;
}

@keyframes taichiRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.processing-glow {
  animation: glowPulse 2s ease-in-out infinite;
}
```

**要点**：
- 太极图由两个SVG组成（阴阳鱼）
- 旋转速度：0.5秒一圈（可调整）
- 使用 `position: fixed` 全屏居中
- 不使用fadeInUp动画（会影响居中）

**文件**：`components/processing/`

---

### 9. Markdown解析器组件 (Markdown)

**功能**：增强的Markdown解析 + 代码高亮

**核心实现**：
- 使用Marked.js解析Markdown
- 使用Highlight.js代码高亮
- 五行主题色适配
- 支持Mermaid图表

**关键代码**：
```javascript
const renderer = new marked.Renderer();
marked.setOptions({
  renderer: renderer,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  }
});
```

**要点**：
- 暗色主题：使用暗色代码主题
- 亮色主题：使用亮色代码主题
- 链接自动添加 `target="_blank"`
- 支持GFM（GitHub Flavored Markdown）

**文件**：`components/markdown/`

---

### 10. 五行生克图组件 (WuxingChart)

**功能**：SVG五行生克图 + 节点飘动

**核心实现**：
- SVG绘制五行相生相克关系
- 节点大小根据占比调整
- 日主星星公转动画
- 节点缓慢随机飘动

**关键算法**：
```javascript
// 五行位置（五边形）
const positions = [
  { x: 300, y: 100 },  // 木（上）
  { x: 471, y: 238 },  // 火（右上）
  { x: 406, y: 438 },  // 土（右下）
  { x: 194, y: 438 },  // 金（左下）
  { x: 129, y: 238 }   // 水（左上）
];

// 相生关系（木→火→土→金→水→木）
const shengCycle = [
  ['wood', 'fire'],
  ['fire', 'earth'],
  ['earth', 'metal'],
  ['metal', 'water'],
  ['water', 'wood']
];
```

**要点**：
- 使用SVG绘制图形
- 节点大小：`r = percentage * 0.8`
- 日主星星：圆形轨道旋转动画
- 节点飘动：随机偏移 + 平滑过渡

**文件**：`components/wuxing-chart/`

---

## 页面实现要点

### 1. 首页 (Home)

**布局**：
- 移动端：五行图 + 卡片垂直排列
- PC端：五行图 + 卡片水平排列
- 底部菜单：右下角展开按钮

**核心功能**：
1. **Swiper轮播**：循环展示所有档案
2. **五行图**：每个档案的五行占比
3. **摘要卡片**：命卦颜色 + 八字信息
4. **环形菜单**：八字详解、姻缘匹配、登录、新建档案
5. **默认档案**：设置/取消默认
6. **删除档案**：确认后删除（至少保留1个）

**数据流**：
```
加载Mock数据 → 渲染所有Slide → 初始化Swiper → 绑定事件
```

**要点**：
- 使用事件委托处理开关和删除按钮
- 每个档案独立的数据模型
- 五行图在slide创建后延迟100ms渲染

**文件**：`src/pages/home/`

---

### 2. 登录页 (Login)

**布局**：
- 居中单列布局
- 最大宽度450px
- 玻璃质感卡片

**核心功能**：
1. **三种登录方式**：邮箱验证码、手机号验证码、微信扫码
2. **验证码倒计时**：60秒倒计时，倒计时结束可重新获取
3. **表单验证**：邮箱格式、手机号格式、验证码长度
4. **按钮加载状态**：登录中显示加载动画

**UI结构**：
```
登录标题 + 副标题
登录方式切换标签（单选框）
├── 邮箱登录表单
│   ├── 邮箱输入框
│   ├── 验证码输入框 + 获取验证码按钮
│   └── 登录按钮
├── 手机号登录表单
│   ├── 手机号输入框
│   ├── 验证码输入框 + 获取验证码按钮
│   └── 登录按钮
└── 微信扫码登录
    └── 二维码占位图
```

**要点**：
- 单选框切换登录方式，显示对应表单
- 验证码按钮固定在输入框右侧（absolute定位）
- 手机号输入限制只能输入数字，最多11位
- 使用IIFE避免全局变量污染

**文件**：`src/pages/login/`

---

### 3. 新建八字页 (New-Bazi)

**布局**：
- 居中单列布局
- 最大宽度500px
- 表单垂直排列

**核心功能**：
1. **档案名称**：可选，自动生成（档案_1, 档案_2...）
2. **性别选择**：单选框（男/女）
3. **出生日期**：日期选择器（默认2002-06-01）
4. **出生时辰**：下拉选择（12时辰）
5. **表单验证**：必填项检查

**要点**：
- 使用原生 `<input type="date">` 和 `<select>`
- 提交时按钮显示加载状态
- 创建成功后跳转首页

**文件**：`src/pages/new-bazi/`

---

### 4. 八字解析页 (Analysis)

**布局**：
- 单列垂直布局
- 卡片上下排列，间距40px

**三种状态**：
1. **已完成 (COMPLETED)**：
   - 显示八字详情卡片
   - 显示Markdown解析内容
2. **计算中 (CALCULATING)**：
   - 显示太极动画
   - 每3秒轮询一次状态
3. **未开始 (NOT_STARTED)**：
   - 显示"开始计算"按钮

**核心功能**：
1. **八字详情**：四柱八字、纳音、日主、命卦、五行占比
2. **Markdown渲染**：使用MarkdownRenderer组件渲染
3. **轮询机制**：每3秒检查状态，直到完成
4. **页面卸载**：停止轮询，避免内存泄漏

**数据结构**：
```javascript
{
  bazi: {
    yearPillar: { stem: '庚', branch: '午', nayin: '路旁土' },
    monthPillar: { stem: '辛', branch: '巳', nayin: '白蜡金' },
    dayPillar: { stem: '甲', branch: '寅', nayin: '大溪水' },
    hourPillar: { stem: '壬', branch: '申', nayin: '剑锋金' }
  },
  dayMaster: { element: 'wood', stem: '甲', isDayMaster: true },
  mingua: { name: '一白坎卦', element: 'water', ... },
  elementProportion: { wood: 25, fire: 15, earth: 30, metal: 20, water: 10 }
}
```

**要点**：
- 使用 `setInterval` 实现轮询
- 页面卸载时使用 `clearInterval` 停止轮询
- 使用 `display: flex` 而非 `display: block` 设置计算状态

**文件**：`src/pages/analysis/`

---

### 5. 姻缘匹配页 (Match)

**布局**：
- PC端：左右布局（左侧推荐卡片40%，右侧理由60%）
- 移动端：上下布局

**三种状态**：
1. **有结果 (HAS_RESULTS)**：
   - Swiper展示推荐卡片
   - Markdown渲染匹配理由
2. **计算中 (CALCULATING)**：
   - 显示太极动画
   - 每3秒轮询一次
3. **无结果 (NOT_STARTED)**：
   - 显示"去计算推荐"按钮

**核心功能**：
1. **推荐卡片**：Swiper轮播，每个卡片包含推荐对象的八字和命卦
2. **匹配理由**：Markdown格式，支持富文本
3. **重新计算**：触发新的计算任务
4. **轮询机制**：每3秒检查状态

**推荐卡片数据结构**：
```javascript
{
  id: 'match_xxx',
  name: '推荐对象1',
  birthDate: '1995-03-15T10:30:00',
  bazi: { /* 四柱八字 */ },
  mingua: { /* 命卦信息 */ },
  reason: '## 匹配理由\n...'
}
```

**要点**：
- PC端使用 `flex` 实现左右布局
- 移动端使用媒体查询调整为上下布局
- 轮询结束后自动显示结果

**文件**：`src/pages/match/`

---

### 6. 新建匹配页 (New-Match)

**布局**：
- 居中单列布局
- 最大宽度500px

**核心功能**：
1. **个性化要求**：文本域输入（可选）
2. **开始匹配**：跳转到匹配页面，status=calculating

**要点**：
- 使用 `<textarea>` 输入大段文本
- 提交时显示加载状态
- 成功后跳转并传递status参数

**文件**：`src/pages/new-match/`

---

## 公共函数

### Toast消息提示

**功能**：显示成功/错误消息

**实现**：
```javascript
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const bgColor = type === 'success'
    ? 'var(--wood-primary)'
    : 'var(--fire-primary)';

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: toastFadeInOut 3s ease forwards;
  `;

  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}
```

**使用**：
```javascript
window.ToastUtils.showSuccess('操作成功');
window.ToastUtils.showError('操作失败');
```

**文件**：`src/common/utils.js`

---

### 表单验证

**邮箱验证**：
```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**手机号验证**：
```javascript
function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}
```

**使用**：
```javascript
if (!window.ValidationUtils.validateEmail(email)) {
  window.ToastUtils.showError('请输入正确的邮箱格式');
}
```

**文件**：`src/common/utils.js`

---

### URL参数获取

**功能**：获取URL查询参数

**实现**：
```javascript
function getUrlParam(name, url = window.location.href) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(name);
}
```

**使用**：
```javascript
const profileId = window.UrlUtils.getUrlParam('profileId');
```

**文件**：`src/common/utils.js`

---

### API请求封装

**功能**：统一的HTTP请求封装

**实现**：
```javascript
async function request(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

**API接口定义**：
```javascript
const API = {
  user: {
    loginByEmail: (email, code) => post('/user/login/email', { email, code }),
    getInfo: () => get('/user/info')
  },
  profile: {
    list: () => get('/profiles'),
    create: (data) => post('/profiles', data)
  },
  analysis: {
    start: (profileId) => post(`/analysis/${profileId}/start`)
  },
  match: {
    start: (profileId, requirements) => post(`/match/${profileId}/start`, { requirements })
  }
};
```

**使用**：
```javascript
const response = await window.API.profile.list();
const result = await window.API.analysis.start(profileId);
```

**文件**：`src/common/api.js`

---

## 最佳实践

### 1. 代码组织

**使用IIFE避免全局变量污染**：
```javascript
(function() {
  'use strict';

  // 私有变量和函数
  let privateVar = '';

  function privateFunction() {}

  // 导出到全局
  window.publicFunction = function() {};
})();
```

**使用模块化加载顺序**：
```html
<!-- 1. 组件脚本 -->
<script src="../../../components/background/background.js"></script>
<script src="../../../components/card/card.js"></script>

<!-- 2. 公共函数 -->
<script src="../../common/utils.js"></script>
<script src="../../common/api.js"></script>

<!-- 3. 页面逻辑 -->
<script src="home.js"></script>
```

---

### 2. 性能优化

**使用CSS动画而非JavaScript动画**：
```css
/* 推荐：CSS动画 */
.element {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**使用事件委托减少事件监听器**：
```javascript
// 推荐：事件委托
document.addEventListener('click', (e) => {
  const deleteButton = e.target.closest('[data-action="delete"]');
  if (deleteButton) {
    handleDelete(deleteButton.dataset.id);
  }
});

// 不推荐：为每个按钮绑定事件
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => { });
});
```

**使用防抖和节流**：
```javascript
// 防抖：频繁触发只执行最后一次
const debouncedSearch = window.FunctionUtils.debounce((value) => {
  performSearch(value);
}, 300);

// 节流：固定时间间隔执行
const throttledScroll = window.FunctionUtils.throttle(() => {
  handleScroll();
}, 100);
```

---

### 3. 可访问性

**使用语义化HTML**：
```html
<!-- 推荐：语义化 -->
<button class="btn" aria-label="关闭对话框">
  <svg aria-hidden="true">...</svg>
</button>

<!-- 不推荐：无语义 -->
<div class="btn" onclick="closeDialog()">
  <span>✕</span>
</div>
```

**键盘导航支持**：
```javascript
// ESC键关闭弹窗
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Tab键焦点管理
modal.querySelector('button').focus();
```

---

### 4. 错误处理

**使用try-catch捕获异常**：
```javascript
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载失败:', error);
    window.ToastUtils?.showError('加载失败，请重试');
    return null;
  }
}
```

**清理定时器和事件监听器**：
```javascript
// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
```

---

### 5. 版本控制

**使用版本号清除缓存**：
```html
<script src="home.js?v=19"></script>
<link rel="stylesheet" href="home.css?v=21">
```

**每次修改后更新版本号**：
- 小修改：版本号+1
- 大改动：版本号+10

---

### 6. 调试技巧

**使用条件编译**：
```javascript
const DEBUG = false;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[Debug]', ...args);
  }
}
```

**生产环境移除console.log**：
- 正式部署时使用压缩工具移除调试代码
- 或使用条件编译

---

## 响应式设计

### 移动端优先

**CSS媒体查询**：
```css
/* 移动端（默认） */
.container {
  padding: 10px;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* PC */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
  }
}
```

### 触摸优化

**增大触摸目标**：
```css
.button {
  min-height: 44px;  /* Apple推荐最小触摸目标 */
  min-width: 44px;
  padding: 12px 24px;
}
```

**禁用双击缩放**：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## 性能优化建议

### 图片优化
- 使用SVG矢量图标（可缩放、文件小）
- 压缩PNG/JPG图片
- 使用WebP格式（如果浏览器支持）

### 字体优化
- 使用系统字体栈
- 避免引入外部字体文件

### 资源加载
- 组件脚本按需加载
- 使用 `defer` 或 `async` 加载非关键脚本

---

## 浏览器兼容性

### CSS前缀
使用Autoprefixer自动添加：
```css
.element {
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
}
```

### Polyfill
- `classList`（IE9+）
- `fetch` API（使用whatwg-fetch polyfill）
- `Promise`（使用promise-polyfill）

---

## 安全建议

### XSS防护
- 避免使用 `innerHTML` 插入用户输入
- 使用 `textContent` 代替
- 如果必须使用HTML，进行转义

### CSRF防护
- 使用CSRF token
- 验证Referer头

---

## 部署建议

### 静态资源
- 启用Gzip压缩
- 设置长期缓存策略（组件脚本）
- 使用CDN加速

### API代理
- 配置反向代理避免CORS问题
- 使用HTTPS加密传输

---

## 总结

本文档记录了八字命理小程序前端设计的核心实现要点，包括：

1. **设计系统**：五行颜色主题、间距系统、字体系统
2. **组件实现**：10个核心组件的关键代码和实现要点
3. **页面实现**：6个页面的布局、功能和数据流
4. **公共函数**：工具函数和API封装
5. **最佳实践**：代码组织、性能优化、可访问性等

在正式实现时，请参考本文档的要点，结合实际需求进行调整。

---

**文档版本**：v1.0
**最后更新**：2025-05-03
**维护者**：Design Team
