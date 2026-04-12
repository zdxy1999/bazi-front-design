## TODO list
## 已采纳设计与核心实现

---

## 实现计划 (2026-04-06)

### 阶段1: 设计基础 ✅

#### 1.1 设计Token系统
**文件**: `style/tokens.css`

**内容**:
- 五行颜色系统（木火土金水）
- 主题切换（暗黑/明亮）
- 间距系统（8-point grid）
- 字体系统（字号、行高、字重）
- 圆角、阴影、动画、z-index

**关键设计决策**:
- 暗黑主题: 金→白色, 木→绿色, 水→蓝色, 火→红色, 土→黄色
- 明亮主题: 金→黑色, 木→绿色, 水→蓝色, 火→红色, 土→黄色
- 使用CSS变量实现主题切换，基于`data-theme`属性

#### 1.2 公共样式
**文件**: `style/common.css`

**内容**:
- CSS Reset
- 通用工具类（flex、grid、spacing等）
- 玻璃态基础样式

---

### 阶段2: 基础组件

#### 2.1 背景组件
**文件**: `components/background/background.html`, `components/background/background.css`, `components/background/background.js`

**功能**:
- 五行颜色流动动画（最底层）
- 毛玻璃垫层（隔离动画与组件，根据主题变化）
- 支持主题切换

**参考**: `../glow-glass-design/background/background.html`

**实现要点**:
- 使用Canvas或CSS动画实现颜色流动
- 玻璃垫层使用`backdrop-filter: blur()`
- 性能优化：使用`transform`和`opacity`

#### 2.2 Card组件
**文件**: `components/card/card.html`, `components/card/card.css`, `components/card/card.js`

**功能**:
- 磨砂玻璃质感
- 内部光晕效果
- PC端hover时光晕跟随鼠标
- 移动端内部光晕随机飘动
- 边缘高光玻璃折射效果
- 支持颜色hook（五行色）

**参考**:
- https://codepen.io/Jiironimo/pen/JoRryMw (液态玻璃)
- https://codepen.io/simeydotme/pen/RNWoPRj (边缘高光)
- https://codepen.io/designcouch/pen/MYWjgYM (彩虹光晕)

**实现要点**:
- 使用`backdrop-filter: blur()`实现毛玻璃
- 使用`radial-gradient`实现光晕
- 使用`mousemove`事件跟踪鼠标位置
- 移动端使用`requestAnimationFrame`实现随机飘动

#### 2.3 加载动画Spin
**文件**: `components/loading-spin/loading-spin.html`, `components/loading-spin/loading-spin.css`

**功能**:
- 短时数据加载动画
- 用于API请求等待

**参考**: `../glow-glass-design/transitions/loading/loading.html`

**实现要点**:
- 5个发光点旋转
- 使用`@keyframes`动画
- 支持主题色变化

#### 2.4 处理中动画（太极）
**文件**: `components/processing/processing.html`, `components/processing/processing.css`, `components/processing/processing.js`

**功能**:
- 长时间异步计算任务
- 太极旋转动画
- 外侧辉光效果

**参考**: `../glow-glass-design/transitions/taichi-transition/taichi-transition.html`

**实现要点**:
- 只需要太极旋转和辉光效果
- 不需要阴阳鱼两侧飞入动画
- 使用CSS动画实现旋转
- 外侧辉光使用多层`box-shadow`

#### 2.5 菜单按钮组件
**文件**: `components/menu/menu.html`, `components/menu/menu.css`, `components/menu/menu.js`

**功能**:
- 环形菜单栏
- 展开/收起动画
- 支持4-6个菜单项

**参考**: https://codepen.io/suez/pen/RwqvdK

**实现要点**:
- 主按钮点击展开子菜单
- 子菜单呈环形排列
- 使用`transform`实现展开动画
- 支持触摸和鼠标交互

#### 2.6 翻页容器组件
**文件**: `components/swiper/swiper.html`, `components/swiper/swiper.css`, `components/swiper/swiper.js`

**功能**:
- PC端：scroll翻页效果
- 移动端：swipe滑动翻页
- 支持循环翻页
- 指示器显示当前位置

**参考**:
- PC端: https://codepen.io/GreenSock/pen/LYRwgPo
- 移动端: https://codepen.io/paulnoble/pen/gOVPedz

**实现要点**:
- 检测设备类型（PC/移动端）
- PC端使用滚轮事件
- 移动端使用touch事件
- 使用`transform`实现平滑切换

#### 2.7 Markdown解析器
**文件**: `components/markdown/markdown.js`

**功能**:
- 根据主题渲染markdown
- 支持代码高亮
- 支持表格、列表等

**实现要点**:
- 调研现有markdown库（marked.js、markdown-it等）
- 自定义主题样式
- 确保暗黑/明亮主题下可读性

---

### 阶段3: Mock数据

**文件**: `mock-data/bazi-profiles.json`

**内容**:
- 八字档案数据（1-10个）
- 包含：生辰八字、五行占比、命卦等信息
- 示例数据结构参考bazi-calculator的输出

---

### 阶段4: 页面组装

#### 4.1 首页
**文件**: `src/pages/home/home.html`, `src/pages/home/home.css`, `src/pages/home/home.js`

**结构**:
```
- 滚动翻页容器
  - 档案八字五行profile 1-N
    - 五行生克图
    - 八字与命卦summary card
    - 设置为默认档案按钮
    - 删除档案按钮
  - 新建八字档案按钮
- 档案翻页按钮（PC端）
- 底部menu展开按钮
  - 八字详解
  - 姻缘匹配
  - 新建档案
```

**关键交互**:
- 移动端：上下排列，滑动翻页
- PC端：左右排列，scroll翻页
- 五行图节点大小根据占比调整
- 日主元素旁有星星环绕动画

#### 4.2 新建八字页面
**文件**: `src/pages/new-bazi/new-bazi.html`, `src/pages/new-bazi/new-bazi.css`, `src/pages/new-bazi/new-bazi.js`

**结构**:
```
- 输入表单
  - 男女选择器
  - 生日选择器（默认2002-06-01）
  - 出生时辰选择器
- 创建按钮
- 返回按钮
```

#### 4.3 八字解析页面
**文件**: `src/pages/analysis/analysis.html`, `src/pages/analysis/analysis.css`, `src/pages/analysis/analysis.js`

**结构**:
```
- 八字详情card
- 解析主体（markdown卡片 或 增强markdown解析器）
- 返回按钮

状态1：已有结果
- 显示解析内容（多段落card）

状态2：计算中
- 处理中动画
- 提醒文字
```

#### 4.4 姻缘匹配页面
**文件**: `src/pages/match/match.html`, `src/pages/match/match.css`, `src/pages/match/match.js`

**结构**:
```
状态1：已有推荐结果
- 翻页容器（推荐八字card）
- 推荐理由（markdown卡片 或 增强markdown解析器）
- 重新计算推荐按钮
- 返回按钮

状态2：没有推荐结果
- 去计算推荐按钮
- 返回按钮

状态3：计算中
- 处理中动画
- 提醒文字
- 返回按钮
```

#### 4.5 新建姻缘匹配页面
**文件**: `src/pages/new-match/new-match.html`, `src/pages/new-match/new-match.css`, `src/pages/new-match/new-match.js`

**结构**:
```
- 个性化要求文本输入框
- 去计算推荐按钮
- 返回按钮
```

---

## 实现原则

1. **充分复用**: 所有公共样式抽取到`style/`，所有组件抽取到`components/`
2. **组件优先**: 先实现组件，让用户审核，再组装页面
3. **渐进式实现**: 从基础到复杂，从简单到交互
4. **响应式设计**: 兼顾移动端和PC端
5. **主题支持**: 所有组件支持暗黑/明亮主题切换
6. **性能优化**: 使用`transform`和`opacity`，避免重排重绘

---

## 文件组织规范

```
design-20260406/
├── style/                    # 公共样式
│   ├── tokens.css           # 设计token
│   ├── common.css           # 公共样式
│   └── themes.css           # 主题相关样式
├── components/              # 基础组件
│   ├── background/          # 背景组件
│   ├── card/                # 卡片组件
│   ├── loading-spin/        # 加载动画
│   ├── processing/          # 处理中动画
│   ├── menu/                # 菜单按钮
│   ├── swiper/              # 翻页容器
│   └── markdown/            # Markdown解析器
├── mock-data/               # Mock数据
│   └── bazi-profiles.json   # 八字档案数据
├── src/                     # 页面实现
│   └── pages/
│       ├── home/            # 首页
│       ├── new-bazi/        # 新建八字
│       ├── analysis/        # 八字解析
│       ├── match/           # 姻缘匹配
│       └── new-match/       # 新建姻缘匹配
├── require.md              # 需求文档
├── process.md              # 本文件 - 过程文档
├── structure.md            # 页面结构文档
└── CLAUDE.md               # 项目说明
```

---

## 组件依赖关系

```
背景组件 (无依赖)
    ↓
公共样式 + Token系统
    ↓
Card组件 ← 依赖: 背景、公共样式
    ↓
加载动画 ← 依赖: Card或独立
处理中动画 ← 独立
菜单按钮 ← 独立
翻页容器 ← 依赖: 公共样式
Markdown解析器 ← 独立
    ↓
页面组装 ← 使用所有组件
```

---

## 当前进度

### 阶段1: 设计基础 ✅
- [x] 制定实现计划
- [x] 设计Token系统
- [x] 公共样式

### 阶段2: 基础组件
- [x] 背景组件
- [x] Card组件
- [x] 加载动画
- [x] 处理中动画
- [x] 菜单按钮
- [x] 翻页容器
- [x] Markdown解析器
- [x] 五行生克图组件 (2026-04-11)

### 阶段3: Mock数据
- [x] 创建八字档案JSON数据 (2026-04-11)

### 阶段4: 页面组装
- [x] 首页 (2026-04-11)
- [x] 新建八字页面 (2026-04-11)
- [x] 八字解析页面 (2026-04-11)
- [x] 姻缘匹配页面 (2026-04-11)
- [x] 新建姻缘匹配页面 (2026-04-11)

---

## 已完成组件说明

### 1. 设计Token系统 ✅
**文件**: `style/tokens.css`
- 五行颜色系统（木火土金水）
- 暗黑/明亮主题切换
- 8-point间距系统
- 字体系统
- 动画系统

### 2. 公共样式 ✅
**文件**: `style/common.css`
- CSS Reset
- 工具类（flex、grid、spacing等）
- 玻璃态基础样式
- 五行颜色类
- 响应式工具类

### 3. 背景组件 ✅
**文件**: `components/background/`
- **SVG五行流动渐变动画**（参考CodePen实现）
  - 6个SVG径向渐变，使用`<animate>`元素实现焦点点移动
  - 6个旋转的`<rect>`元素，位置和旋转动画独立
  - 使用CSS变量引用五行颜色，支持主题切换
  - 完全由SVG原生动画驱动，无需JavaScript
- 边缘发光效果（CSS实现）
- 毛玻璃垫层（backdrop-filter: blur(40px)）
- 主题切换支持（暗黑/明亮）

**预览**: `components/background/background.html`

**实现细节**:
- 动画参考: https://codepen.io/thanks2music/pen/VmJjaG
- 每个渐变有不同的动画周期（34s-54s）创造有机流动感
- 五行颜色通过CSS变量传递给SVG的`stop-color`属性
- 透明度设置为0.15以提供微妙背景效果

### 4. Card组件 ✅
**文件**: `components/card/`

**组件结构** (2026-04-07更新):
```html
<div class="glass-card [color-card]" data-card>
  <div class="card-edge-glow"></div>
  <div class="card-glow"></div>
  <div class="glass-card-content">
    <!-- 可选: Logo -->
    <div class="glass-card-logo [size]">...</div>

    <!-- 可选: 标题 -->
    <div class="glass-card-header">
      <h3 class="glass-card-title">标题</h3>
      <p class="glass-card-subtitle">副标题</p>
    </div>

    <!-- 必须: 主体 -->
    <div class="glass-card-body">
      <p class="glass-card-text">内容...</p>
    </div>

    <!-- 可选: 页脚 -->
    <div class="glass-card-footer">
      <div class="glass-card-footer-start">...</div>
      <div class="glass-card-footer-end">...</div>
    </div>
  </div>
</div>
```

**组件部分**:
- **Logo** (可选): `.glass-card-logo`, 支持小/默认/大三种尺寸
- **标题** (可选): `.glass-card-header`, 包含 `.glass-card-title` 和 `.glass-card-subtitle`
- **主体** (必须): `.glass-card-body`, 卡片主要内容区域
- **页脚** (可选): `.glass-card-footer`, 包含 `.glass-card-footer-start` 和 `.glass-card-footer-end`

**液态玻璃质感** (2026-04-07更新):
- `::before` 伪元素: 半透明主题色背景 + `backdrop-filter: blur(40px) saturate(180%)`
- 边框和内阴影效果: 暗色主题只有内部高光, 亮色主题有外部白色发光
- `::after` 伪元素: 主题色渐变叠加层,使用 `mix-blend-mode: overlay`
- **边缘高光反射** (2026-04-07新增):
  - `.card-edge-glow`: 线性渐变边缘发光
  - 脉动动画 (4秒周期,透明度0.4-0.7, 亮色主题1.0)
- **边缘高光指向鼠标方向**: conic-gradient楔形mask
- **边缘发光效果**: 14层box-shadow, 亮色主题使用白色发光
- PC端hover时效果跟随指针（基于`--pointer-°`和`--pointer-d`变量）
- 移动端光晕平滑飘动（JavaScript驱动，使用requestAnimationFrame）

**五行颜色主题**:
- 木: `--theme-hue: 120`, 绿色
- 火: `--theme-hue: 0`, 红色
- 土: `--theme-hue: 45`, 黄色
- 金: `--theme-hue: 210`, 白色/灰色
- 水: `--theme-hue: 210`, 蓝色

**亮色主题优化** (2026-04-07):
- 外部白色发光效果, 无黑色阴影
- 文字颜色调整为深色 (#1a1a1a)
- 五行颜色亮度提升
- 边缘高光反射透明度提升至1.0
- **关键修复**（2026-04-06）：
  1. **CSS变量格式修复** - `--glow-color`格式错误导致box-shadow无法解析
     - 错误：`--glow-color: hsla(105, 80%, 65%, 1);`
     - 正确：`--glow-color: 105deg 80% 65%;`  （只包含三个数值）
     - 详见：`CRITICAL_GLOW_COLOR_FIX.md`
  2. 禁用`::before`和`::after`的彩色mesh gradient效果
     - 用户只需要**边缘发光**，不需要**卡片彩色效果**
     - 详见：`EDGE_GLOW_ONLY_FIX.md`
  3. 添加完整的玻璃质感
     - `backdrop-filter: blur(10px) saturate(120%)`
     - 让五行流动背景隐约透过卡片可见
- 五行颜色变体（木火土金水）
- 3种尺寸（sm、default、lg）

**演示页面**:
- `glass-glow-demo.html` - 完整演示（玻璃质感 + 背景动画 + 边缘发光）
- `simple-glow-test.html` - 简化测试页面（带调试面板）
- `final-edge-test.html` - 边缘发光测试页面
- `card.html` - 完整组件展示

**参考**: `codepen-original.html`（CodePen原始实现，包含彩色效果）

**实现细节**:
- 参考CodePen: https://codepen.io/simeydotme/pen/RNWoPRj
- HTML结构需包含`.card-glow`元素（伪元素`::before`和`::after`自动生成）
- **核心改进** (2026-04-06):
  - ✅ **完全透明玻璃质感**: 使用`background: transparent`，不使用`backdrop-filter: blur()`
  - ✅ **边缘高光局部显示**: 使用`conic-gradient(from var(--pointer-°) at center, ...)`创建指向鼠标方向的楔形高光
  - ✅ **双层阈值系统**:
    - `--glow-sens: 30` - .card-glow开始显示的阈值
    - `--color-sens: 50` - ::before和::after开始显示的阈值
  - ✅ **渐进式显示**：
    - 距离 < 30%：所有层完全隐藏
    - 距离 30-50%：只有.card-glow显示（外部发光）
    - 距离 > 50%：所有层显示（完整边缘高光）
  - ✅ **恢复CodePen原版实现**：使用conic-gradient而非自定义radial-gradient
- **Mask技术实现**:
  ```css
  /* ::before - 楔形边框 */
  mask-image: conic-gradient(
    from var(--pointer-°) at center,
    black 25%,        /* 显示 */
    transparent 40%,  /* 隐藏 */
    transparent 60%,  /* 隐藏 */
    black 75%         /* 显示 */
  );

  /* ::after - 内部挖空 + 指向性高光 */
  mask-image:
    linear-gradient(to bottom, black, black),           /* 基础层 */
    radial-gradient(ellipse at 50% 50%, black 30%, transparent 50%),  /* 中心挖空 */
    radial-gradient(...) × 4,                          /* 四角光晕 */
    conic-gradient(from var(--pointer-°) at center, ...);  /* 指向性边缘高光 */

  mask-composite: subtract, add, add, add, add, add;

  /* .card-glow - 外部发光 */
  mask-image: conic-gradient(
    from var(--pointer-°) at center,
    black 2.5%,
    transparent 10%,
    transparent 90%,
    black 97.5%
  );
  ```
- JavaScript辅助函数（参考实现完全匹配）：
  - `round(value, precision)`: 四舍五入到指定精度
  - `clamp(value, min, max)`: 限制数值在范围内
  - `centerOfElement(el)`: 计算元素中心点
  - `pointerPositionRelativeToElement(el, e)`: 计算指针相对于元素的位置（返回像素和百分比）
  - `angleFromPointerEvent(el, dx, dy)`: 计算从中心到指针位置的角度（度数）
  - `distanceFromCenter(el, x, y)`: 计算距离中心的距离（像素）
  - `closenessToEdge(el, x, y)`: 计算距离边缘的接近程度（0=中心, 1=边缘）
- PC端使用`pointermove`事件跟踪指针位置，更新`--pointer-x`, `--pointer-y`, `--pointer-°`, `--pointer-d`变量
- 移动端使用正弦波创建平滑的圆形运动轨迹
- 混合模式：
  - `::after`: `mix-blend-mode: soft-light`柔和光晕
  - `.card-glow`: `mix-blend-mode: plus-lighter`增强发光
- 透明度计算：`clamp((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)), 0, 1)`

**测试验证**:
- 打开`final-edge-test.html`
- Hover卡片并在中心移动：应该完全没有光晕（距离<30%）
- 向边缘移动：外部发光逐渐出现（距离30-50%）
- 继续靠近边缘：边缘高光指向鼠标方向（距离>50%）
- 调试面板显示实时距离和透明度数据

### 5. 加载动画Spin ✅ (2026-04-07完全重写)
**文件**: `components/loading-spin/`
- 5个五行发光点均匀分布旋转
- 用于短时数据加载
- 3种尺寸（sm: 60px, default: 100px, lg: 140px）
- 支持全屏覆盖层
- 可自定义加载文字
- **完全重写**: 照抄`glow-glass-design`的实现

**重写内容** (2026-04-07):
- 完全照抄参考文件`/Users/zdxy/codes/bazi-mini-programme/bazi-front-design/glow-glass-design/transitions/loading/loading.html`
- 5个点使用相同的定位方式：`transform: translate(-50%, -50%) rotate() translateY(-22px)`
- 所有点从中心开始，通过`rotate()`旋转不同角度（0°/72°/144°/216°/288°），然后向外平移
- HTML结构简化：
  ```html
  <div class="loading-spin">
    <div class="loading-spin-dot"></div>
    <div class="loading-spin-dot"></div>
    <div class="loading-spin-dot"></div>
    <div class="loading-spin-dot"></div>
    <div class="loading-spin-dot"></div>
  </div>
  ```
- 旋转动画直接应用到`.loading-spin`容器上（1.2s linear infinite）
- 移除了`.loading-spin-ring`和`.loading-spin-center`结构
- 深色主题：红黄蓝绿白（火土水金木）
- 浅色主题：红黄蓝绿黑（火土水金木）
- 尺寸变体通过`translateY()`的平移距离调整（sm: -18px, lg: -26px）

**预览**: `components/loading-spin/loading-spin.html`

### 6. 处理中动画 ✅ (2026-04-07完全重写)
**文件**: `components/processing/`
- 太极旋转动画（阴阳鱼SVG）
- 外侧五行辉光（conic-gradient彩虹光晕）
- 用于长时间计算任务
- 支持全屏覆盖层
- **完全重写**: 照抄`glow-glass-design`的太极实现

**重写内容** (2026-04-07):
- 完全照抄参考文件`/Users/zdxy/codes/bazi-mini-programme/bazi-front-design/glow-glass-design/transitions/taichi-transition/taichi-transition.html`
- 使用SVG绘制阴阳鱼：
  - 阳鱼（白色）：`<path d="M 50 0 A 50 50 0 0 0 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0" fill="#ffffff"/>`
  - 阴鱼（黑色）：`<path d="M 50 0 A 50 50 0 0 1 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0" fill="#1a1a1a"/>`
- HTML结构：
  ```html
  <div class="processing-taichi processing-rotating">
    <div class="processing-glow"></div>
    <div class="processing-yang"><!-- 阳鱼SVG --></div>
    <div class="processing-yin"><!-- 阴鱼SVG --></div>
  </div>
  ```
- 旋转动画：3秒匀速旋转（`animation: taichiRotate 3s linear infinite`）
- 外圈辉光：conic-gradient彩虹渐变 + blur(15px)模糊
- 辉光动画：淡入（1s）+ 脉冲（3s ease-in-out infinite）
- 浅色主题：颜色调整为`#2a2a2a`替代纯黑
- 只有一个尺寸：200px（按要求不提供变体）
- 支持全屏显示

**预览**: `components/processing/processing.html`

### 7. Profile Card组件 ✅
**文件**: `components/card/profile-card.html`, `components/card/profile-card.css`

**功能**:
- 5个旋转光晕（红黄绿蓝白）
- 5个边缘高光层（不同位置的高光点）
- 光晕可见性蒙版（中心暗淡，边缘明亮）
- 九星命卦颜色主题（data-star="1"到"9"）
- 五行标签样式（木火土金水）
- 玻璃质感背景
- 响应式设计（移动端适配）
- 主题切换支持（暗黑/明亮）

**九星命卦主题**:
1. 一白坎卦 - 水命，白色，北方
2. 二黑坤卦 - 土命，黑色，西南
3. 三碧震卦 - 木命，碧绿，东方
4. 四绿巽卦 - 木命，绿色，东南
5. 五黄中宫 - 土命，黄色，中央
6. 六白乾卦 - 金命，白色，西北
7. 七赤兑卦 - 金命，赤色，西方
8. 八白艮卦 - 土命，白色，东北
9. 九紫离卦 - 火命，紫色，南方

**预览**: `components/card/profile-card.html`

**实现细节**:
- 5个旋转光晕使用不同的动画时长（2.5s-3.5s）创造有机流动感
- 5个边缘高光层使用radial-gradient在不同位置创建高光点
- 光晕可见性蒙版使用radial-gradient从中心到边缘渐变透明
- 九星命卦主题通过CSS变量`--theme-hue`、`--theme-saturation`、`--theme-lightness`控制
- 五行标签使用不同的背景色和边框色区分
- 亮色主题下使用白色背景和深色文字

### 8. 通用Card组件 ✅ (2026-04-07完成)
**文件**: `components/card/card.html`, `components/card/card.css`, `components/card/card.js`

**功能**:
- 液态玻璃质感（backdrop-filter模糊）
- 内部主题色叠加层（::after伪元素，overlay混合模式）
- 鼠标跟随光晕效果（PC端）
- 移动端自动飘动光晕（requestAnimationFrame驱动）
- 边缘高光方向指示（conic-gradient蒙版）
- 五行颜色主题系统
- 亮色/暗色主题切换
- 无阴影设计（仅保留高光）

**组件结构**:
- **Logo部分**（可选）
  - 支持3种尺寸：small(32px), medium(48px), large(64px)
  - 支持3种对齐：left/center/right
- **Header部分**（可选）
  - 标题+副标题
  - 支持3种对齐：left/center/right
- **Body部分**（必须）
  - 主要内容区域
  - 文本样式：glass-card-text, glass-card-text-small, glass-card-text-muted
  - 列表样式：glass-card-list
- **Header-Top部分**（可选）
  - 左上页眉：glass-card-header-left
  - 右上页眉：glass-card-header-right
- **Footer部分**（可选）
  - 左下页脚：glass-card-footer-start
  - 右下页脚：glass-card-footer-end

**设计参考**:
- 液态玻璃质感: `../glow-glass-design/pages/profile/bazi-profile-card.html`
- Ant Design Card组件结构: https://ant.design/components/card

**预览**: `components/card/card.html`

**实现细节**:
- 液态玻璃使用`::before`伪元素：`backdrop-filter: blur(40px) saturate(180%)`
- 主题色叠加使用`::after`伪元素：`mix-blend-mode: overlay`
- 亮色主题：白色光晕`0 0 20px rgba(255,255,255,0.5)`，无黑色阴影
- 暗色主题：仅保留内部高光`inset 0 1px 0 rgba(255,255,255,0.3)`
- 五行颜色通过CSS变量控制：`--theme-hue`, `--theme-saturation`, `--theme-lightness`
- 鼠标跟踪使用`pointermove`事件更新4个CSS变量
- 移动端动画使用正弦波计算圆形轨迹，每帧更新位置

**HTML示例**（完整结构）:
```html
<div class="glass-card [color-card]" data-card>
  <div class="card-edge-glow"></div>
  <div class="card-glow"></div>
  <div class="glass-card-content">
    <!-- 可选: Logo -->
    <div class="glass-card-logo glass-card-logo-[align]">...</div>

    <!-- 可选: 标题 -->
    <div class="glass-card-header glass-card-header-[align]">
      <h3 class="glass-card-title">标题</h3>
      <p class="glass-card-subtitle">副标题</p>
    </div>

    <!-- 必须: 主体 -->
    <div class="glass-card-body">
      <p class="glass-card-text">内容...</p>
    </div>

    <!-- 可选: 页眉（顶部左右） -->
    <div class="glass-card-header-top">
      <div class="glass-card-header-left">左上页眉</div>
      <div class="glass-card-header-right">右上页眉</div>
    </div>

    <!-- 可选: 页脚（底部左右） -->
    <div class="glass-card-footer">
      <div class="glass-card-footer-start">左下页脚</div>
      <div class="glass-card-footer-end">右下页脚</div>
    </div>
  </div>
</div>
```

**对齐方式class**:
- Logo: `glass-card-logo-left` / `glass-card-logo-center` / `glass-card-logo-right`
- 标题: `glass-card-header-left` / `glass-card-header-center` / `glass-card-header-right`

**完成内容**:
- ✅ 液态玻璃质感实现
- ✅ 五行主题色系统
- ✅ 主题切换优化（亮色白色光晕，暗色无阴影）
- ✅ 移除随机内部光晕
- ✅ Logo/标题对齐方式支持（left/center/right）
- ✅ 四个区域布局（左上页眉、右上页眉、左下页脚、右下页脚）
- ✅ 组件HTML示例（对齐示例、完整四区域示例）
- ✅ 响应式设计（移动端/PC端）
- ✅ 简化组件结构（移除Profile专用部分）

### 9. 环形菜单组件 ✅ (2026-04-07完成)
**文件**: `components/menu/menu.html`, `components/menu/menu.css`, `components/menu/menu.js`

**功能**:
- 通用环形菜单，支持任意数量菜单项
- 自动等距排列（360°/n）
- 环形展开/收起动画
- 五行颜色主题（木火土金水）
- 玻璃质感设计
- 触摸和鼠标交互
- 键盘导航支持
- 响应式设计

**核心特性**:
- **动态角度计算**：根据菜单项数量自动计算角度间隔
- **CSS变量定位**：使用`--translate-x`和`--translate-y`控制位置
- **延迟动画**：每个菜单项依次展开（transitionDelay）
- **可访问性**：ESC键关闭、焦点管理、ARIA属性
- **响应式半径**：根据屏幕大小调整展开半径（移动端60px/70px，PC端80px）

**HTML结构**:
```html
<div class="circular-menu" data-menu="4">
  <button class="menu-toggle" aria-label="打开菜单">
    <svg><!-- 图标 --></svg>
  </button>
  <div class="menu-items">
    <button class="menu-item [color-card]" aria-label="菜单项1">
      <svg><!-- 图标 --></svg>
    </button>
    <!-- 更多菜单项 -->
  </div>
</div>
```

**五行颜色主题**:
- 木: `.wood-card` - 绿色边框和悬停效果
- 火: `.fire-card` - 红色边框和悬停效果
- 土: `.earth-card` - 黄色边框和悬停效果
- 金: `.metal-card` - 白色/灰色边框和悬停效果
- 水: `.water-card` - 蓝色边框和悬停效果

**JavaScript API**:
```javascript
// 创建菜单实例
const menu = new CircularMenu(element, {
  radius: 80  // 展开半径（可选）
});

// 方法
menu.open()           // 打开菜单
menu.close()          // 关闭菜单
menu.toggle()         // 切换状态
menu.updateRadius(n)  // 更新半径
menu.destroy()        // 销毁实例

// 事件监听
menu.addEventListener('menuItemClick', (e) => {
  console.log(e.detail);  // { item, index, label }
});
```

**预览**: `components/menu/menu.html`

**演示内容**:
- 3个菜单项示例
- 4个菜单项示例（八字详解、姻缘匹配、新建档案、设置）
- 5个菜单项示例
- 使用说明和代码示例

**实现细节**:
- 角度计算：`angle = startAngle + (index * (360 / itemCount))`
- 位置计算：`x = cos(radians) * radius`, `y = sin(radians) * radius`
- 起始角度：-90°（从正上方开始）
- 展开/收起：使用CSS transform和opacity
- 点击外部关闭：document级click事件监听
- 移动端优化：缩小展开半径（60-70px）
- 防止误触：touchmove距离检测（<10px视为点击）

**可访问性**:
- 键盘导航：Tab键聚焦，Enter激活
- ESC键关闭菜单
- 焦点管理：打开后聚焦第一个菜单项，关闭后返回主按钮
- ARIA属性：`aria-label`, `aria-expanded`
- 工具提示：悬停显示`aria-label`内容

**响应式断点**:
- <480px: 半径60px，按钮52px，菜单项40px
- <768px: 半径70px，按钮56px，菜单项44px
- ≥768px: 半径80px，按钮60px，菜单项48px

---

## 2026-04-11 页面组装完成总结

### 实施方案执行情况

✅ **Phase 1: 基础设施**
- 创建Mock数据 (9个档案，覆盖所有命卦)
- 创建页面目录结构

✅ **Phase 2: 组件完善**
- 提取五行生克图为独立可复用组件
- 创建 `wuxing-chart.js` 类组件

✅ **Phase 3-7: 页面实现**
- 首页: Swiper + 五行图 + 环形菜单集成
- 新建八字: 表单页面
- 八字解析: 3状态 + Markdown + 轮询
- 姻缘匹配: 3状态 + Swiper + Markdown
- 新建匹配: 简单表单

✅ **Phase 8: 联调优化**
- 页面跳转逻辑完整
- 主题切换一致性
- 响应式布局适配
- Mock数据集成
- SVG背景代码完善

### 新增组件 (2026-04-11)

#### 五行生克图组件 ✅
**文件**: `components/wuxing-chart/wuxing-chart.css`, `components/wuxing-chart/wuxing-chart.js`

**功能**:
- SVG-based 五行生克关系图 (600x600 viewBox)
- 节点大小根据占比动态调整 (10-30%)
- 日主元素有旋转星星公转动画
- 节点随机飘动效果
- 相生相克连线 (实线/虚线)
- 光晕效果和玻璃质感
- 可复用组件类 `WuxingChart`

**API**:
```javascript
const chart = new WuxingChart(svgId, elementProportion, dayMasterElement);
// elementProportion: { wood: {percentage, isDayMaster}, fire: {...}, ... }
```

### 新增页面 (2026-04-11)

#### 1. 首页 ✅
**文件**: `src/pages/home/home.{html,css,js}`

**功能**:
- Swiper循环翻页，3D Coverflow效果
- 档案卡片包含五行图 + 摘要卡片
- 响应式布局 (移动端垂直，PC端水平)
- 环形菜单 (八字详解、姻缘匹配、新建档案)
- 设置默认档案开关 + 删除档案
- 从Mock数据加载9个档案

#### 2. 新建八字页面 ✅
**文件**: `src/pages/new-bazi/new-bazi.{html,css,js}`

**功能**:
- 档案名称输入 (可选，自动生成)
- 性别单选按钮 (男/女)
- 出生日期选择器 (默认2002-06-01)
- 出生时辰下拉选择 (12时辰)
- 表单验证
- 创建后跳转首页

#### 3. 八字解析页面 ✅
**文件**: `src/pages/analysis/analysis.{html,css,js}`

**功能**:
- 3种状态显示 (已完成/计算中/未开始)
- 八字详情卡片 (四柱、日主、命卦、五行占比)
- Markdown解析器集成
- 处理中动画 (太极旋转)
- 轮询机制 (3秒间隔)
- 开始计算按钮

**状态管理**:
- `COMPLETED`: 显示完整解析
- `CALCULATING`: 显示动画 + 轮询
- `NOT_STARTED`: 显示开始按钮

#### 4. 姻缘匹配页面 ✅
**文件**: `src/pages/match/match.{html,css,js}`

**功能**:
- 3种状态显示 (有结果/计算中/无结果)
- Swiper推荐卡片翻页
- Markdown匹配理由渲染
- 重新计算按钮
- 轮询机制

**推荐卡片**:
- 命卦图标显示
- 八字预览
- 命卦标签
- 玻璃卡片效果

#### 5. 新建姻缘匹配页面 ✅
**文件**: `src/pages/new-match/new-match.{html,css,js}`

**功能**:
- 个性化要求文本输入框 (可选，5行)
- 开始匹配按钮
- 返回按钮
- 提交后跳转到匹配页面 (计算中状态)

### Mock数据 (2026-04-11)

**文件**: `mock-data/bazi-profiles.json`

**内容**:
- 9个示例档案，覆盖所有9种命卦
- 每个档案包含完整数据结构
- 支持所有3种解析状态
- 支持所有3种匹配状态
- 五行占比 (10-35%)
- 命卦HSL颜色值

**数据结构**:
```json
{
  "id": "profile_xxx",
  "name": "用户_坎卦",
  "gender": "male/female",
  "birthDate": "ISO 8601",
  "bazi": { "yearPillar", "monthPillar", "dayPillar", "hourPillar" },
  "dayMaster": { "element", "stem", "isDayMaster" },
  "mingua": { "number", "name", "gua", "element", "hsl" },
  "elementProportion": { "wood", "fire", "earth", "metal", "water" },
  "isDefault": true/false,
  "analysisStatus": "COMPLETED/CALCULATING/NOT_STARTED",
  "matchStatus": "HAS_RESULTS/CALCULATING/NOT_STARTED"
}
```

### 技术亮点

- **Swiper集成**: 循环翻页，3D Coverflow效果
- **动态卡片生成**: JS根据数据生成HTML
- **状态管理**: 3种状态的显示和切换
- **轮询模拟**: 3秒间隔检查计算状态
- **主题适配**: 所有页面支持暗黑/明亮主题
- **玻璃质感**: 统一的设计系统应用
- **SVG背景**: 五行流动渐变动画
- **边缘发光**: 动态光晕效果

### 文件清单

**新增组件 (2个文件)**:
- components/wuxing-chart/wuxing-chart.css
- components/wuxing-chart/wuxing-chart.js

**Mock数据 (1个文件)**:
- mock-data/bazi-profiles.json

**新增页面 (15个文件)**:
- src/pages/home/home.{html,css,js}
- src/pages/new-bazi/new-bazi.{html,css,js}
- src/pages/analysis/analysis.{html,css,js}
- src/pages/match/match.{html,css,js}
- src/pages/new-match/new-match.{html,css,js}

**总计**: 18个新文件创建

### 遗留工作 (TODO)

- [ ] 接入真实后端API替换Mock数据
- [ ] 添加更详细的表单验证
- [ ] 完善错误处理和用户提示
- [ ] 添加加载骨架屏优化体验
- [ ] 性能优化 (图片懒加载、代码分割)
- [ ] 可访问性增强 (ARIA标签、键盘导航)
- [ ] 单元测试编写
- [ ] E2E测试覆盖
- [ ] 在浏览器中测试所有功能

### 测试检查清单

- [ ] 首页: 8-10个档案正确显示，所有命卦颜色正确
- [ ] 首页: Swiper循环翻页，3D效果正常
- [ ] 首页: 五行图节点大小根据占比动态调整
- [ ] 首页: 日主元素有旋转星星
- [ ] 首页: 环形菜单3个按钮，点击跳转正确
- [ ] 首页: 设置默认档案开关功能正常
- [ ] 新建八字: 表单验证通过，能创建档案
- [ ] 八字解析: 3种状态正确显示
- [ ] 八字解析: Markdown内容正确渲染
- [ ] 八字解析: 轮询逻辑正常（计算中→已完成）
- [ ] 姻缘匹配: 3种状态正确显示
- [ ] 姻缘匹配: 推荐结果Swiper翻页正常
- [ ] 姻缘匹配: 匹配理由Markdown渲染正常
- [ ] 移动端: 五行图在上，卡片在下（垂直）
- [ ] PC端: 五行图在左，卡片在右（水平）
- [ ] 命卦卡片颜色正确（1-9命卦对应颜色）
- [ ] 命卦图标正确显示（9种卦象）
- [ ] 暗色/亮色主题切换正常
- [ ] 背景光晕效果正常

---

## 2026-04-12 调试卡片渲染问题

### 问题症状
- 首页显示背景和翻页按钮,但档案卡片不显示
- Console显示: `卡片数量: 0`
- 用户反馈: "看上去是卡片和五行图重叠在一起了"

### 根本原因
**CardComponent初始化时机问题**:

1. `card.js`在DOMContentLoaded时自动初始化
2. `home.js`也在DOMContentLoaded时开始创建slides
3. DOMContentLoaded只触发一次,card.js先执行
4. card.js查询`[data-card]`元素时,slides还没被创建
5. 结果: card.js找到0个卡片,并完成初始化
6. 之后home.js创建slides,但card.js不会重新初始化

### 解决方案

**修改1**: `components/card/card.js`
- 添加`refresh()`公共方法,用于重新获取卡片并初始化
- 清理移动端动画,避免内存泄漏
- 重新查询DOM中的`[data-card]`元素
- 重新调用`init()`

**关键代码**:
```javascript
refresh() {
  // 停止所有移动端动画
  this.mobileAnimations.forEach((animationId, card) => {
    cancelAnimationFrame(animationId);
  });
  this.mobileAnimations.clear();

  // 重新获取卡片（旧卡片会被DOM移除，事件监听器会自动清理）
  this.cards = document.querySelectorAll('[data-card]');
  console.log('CardComponent刷新, isMobile:', this.isMobile, '新卡片数量:', this.cards.length);

  // 重新初始化
  this.init();
}
```

**修改2**: `src/pages/home/home.js`
- 在`renderProfiles()`函数末尾调用`window.cardComponent.refresh()`
- 确保slides创建后刷新卡片组件

**关键代码**:
```javascript
function renderProfiles() {
  const wrapper = document.getElementById('swiperWrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '';

  profiles.forEach((profile, index) => {
    const slide = createProfileSlide(profile, index);
    wrapper.appendChild(slide);
  });

  // 刷新卡片组件（重新绑定事件和动画）
  if (window.cardComponent && typeof window.cardComponent.refresh === 'function') {
    console.log('刷新 CardComponent...');
    window.cardComponent.refresh();
  }
}
```

**修改3**: `src/pages/home/home-test.html`
- 更新测试页面,同样调用`refresh()`方法
- 确保测试页面能验证修复

### 验证步骤
1. 打开首页,应能看到多个档案卡片
2. Console应显示: `CardComponent刷新, isMobile: false, 新卡片数量: 9`
3. 卡片应有鼠标跟随光晕效果(PC端)
4. 移动端应有平滑飘动光晕
5. Swiper翻页功能正常
6. 五行图正常渲染

### 技术要点
- **全局变量暴露**: `window.cardComponent`让其他模块可以访问
- **事件监听器清理**: 旧DOM元素被移除时,事件监听器自动清理
- **requestAnimationFrame清理**: 必须手动cancel避免内存泄漏
- **调试日志**: 添加console.log跟踪初始化过程

### 相关文件
- `components/card/card.js` (添加refresh方法)
- `src/pages/home/home.js` (调用refresh)
- `src/pages/home/home-test.html` (测试页面)

---

## 2026-04-12 修复Home页面卡片边缘高光效果

### 问题症状
- 卡片边缘高光颜色和卡片颜色没有根据命卦颜色动态设置
- PC端鼠标hover时边缘高光应该跟随鼠标
- 移动端边缘应该随机飘动亮起

### 根本原因

1. **home.js测试代码残留**（第178-181行）
   - 给所有卡片添加了红色边框和阴影
   - 严重影响视觉效果

2. **home.css过于强制性的transform规则**（第516-520行）
   ```css
   .home-container .swiper-slide *,
   .home-container .swiper-slide::before,
   .home-container .swiper-slide::after {
     transform: none !important;
   }
   ```
   - 这会禁止所有transform，包括卡片伪元素的transform
   - 卡片的玻璃质感效果依赖伪元素，会被破坏

### 解决方案

**修改1**: `src/pages/home/home.js`
- 删除测试边框代码（第178-181行）

**修改2**: `src/pages/home/home.css`
- 修改transform规则，只对swiper容器生效，允许卡片内部效果
- 新规则：
  ```css
  /* 确保swiper容器不影响卡片，但允许卡片内部的transform效果 */
  .home-container .swiper-slide > .profile-slide,
  .home-container .swiper-slide > .profile-slide > * {
    transform: none !important;
  }

  /* 允许卡片内部的伪元素使用transform（用于玻璃效果） */
  .home-container .glass-card::before,
  .home-container .glass-card::after,
  .home-container .glass-card > .card-glow,
  .home-container .glass-card > .card-edge-glow {
    transform: none !important;
  }
  ```

### 预期效果

**PC端**（hover: hover）:
- 鼠标hover时，边缘高光跟随鼠标位置
- 使用`conic-gradient`创建指向鼠标方向的楔形高光
- 光晕根据`--pointer-d`变量控制透明度
- 亮起位置由`--pointer-°`变量控制角度

**移动端**（hover: none）:
- 使用`requestAnimationFrame`驱动平滑飘动
- 正弦波创建圆形轨迹（半径45%）
- 靠近边缘时高光亮起
- 持续显示命卦颜色

**静态效果**（非hover状态）:
- PC端：添加`static-glow`类显示淡色边缘发光
- 使用命卦HSL颜色值
- 位置在右上角附近（70%, 20%）

### 卡片颜色设置

卡片通过inline style设置命卦颜色：
```javascript
style="--theme-hue: ${hue}; --theme-saturation: ${saturation}%; --theme-lightness: ${lightness}%;"
```

这些CSS变量会被以下CSS规则使用：
- `::before`伪元素的背景色
- `::after`伪元素的渐变色
- `.card-edge-glow`的边缘发光
- `.card-glow`的外部发光

### 验证步骤
1. 打开首页，检查卡片是否有命卦颜色的边缘高光
2. PC端：hover卡片，边缘高光应跟随鼠标移动
3. 移动端：边缘应该平滑飘动亮起
4. 切换不同档案，每个档案的命卦颜色应不同
5. 检查Console，确认CardComponent正确初始化

### 相关文件
- `src/pages/home/home.js` (删除测试代码)
- `src/pages/home/home.css` (修改transform规则)
- `components/card/card.css` (增强颜色效果)

---

## 2026-04-12 调试卡片颜色问题

### 问题
用户反馈："旁边的卡片还是没有颜色，chart大小倒是对了"

### 可能原因
1. CardComponent没有被正确初始化
2. CSS变量没有正确设置
3. 浏览器缓存问题
4. CSS选择器优先级问题

### 调试方案

创建了4个测试页面来诊断问题：

1. **test-card-color.html**
   - 测试不同命卦（1坎、3震、9离、5中宫）的卡片颜色
   - 每个卡片手动设置HSL颜色值
   - 检查CSS变量和伪元素样式

2. **debug-card-simple.html**
   - 单个卡片的简单调试页面
   - 检查CardComponent初始化流程
   - 输出详细的调试信息

3. **test-static-glow.html**
   - 手动添加static-glow类的测试
   - 对比有/无static-glow类的效果
   - 测试不同命卦颜色

4. **test-full-flow.html**
   - 完整流程测试，模拟home.js的执行
   - 动态创建卡片并初始化CardComponent
   - 右侧浮动调试面板，实时显示日志

### 测试步骤

请按顺序打开以下测试页面：

1. 打开 `test-static-glow.html`
   - 应该看到3个有颜色的卡片（红、绿、黄）
   - 左边第一个卡片没有颜色（对照组）
   - 检查console输出

2. 打开 `test-card-color.html`
   - 应该看到4个不同命卦的卡片
   - 每个卡片有明显的命卦颜色
   - 检查调试信息面板

3. 打开 `debug-card-simple.html`
   - 单个卡片，右侧有调试面板
   - 检查CardComponent是否正确初始化
   - 检查static-glow类是否被添加

4. 打开 `test-full-flow.html`
   - 完整模拟home.js的流程
   - 右侧浮动调试面板显示详细日志
   - 检查每一步的执行情况

### 预期结果

如果测试页面都显示正常颜色，说明card.css没有问题。问题可能是：
- home.html缓存问题
- CardComponent初始化时机问题
- CSS变量传递问题

### 下一步

根据测试结果：
- 如果测试页面有颜色 → 说明是home.html或home.js的问题
- 如果测试页面没颜色 → 说明是card.css的问题

---

## 2026-04-12 修复CSS变量语法和光晕尺寸问题

### 问题发现

从test-full-flow.html的调试日志发现：
```
::before背景色: rgba(0, 0, 0, 0)
::after背景: rgba(0, 0, 0, 0)
```

CSS变量没有正确应用到伪元素上，导致背景色透明。

### 根本原因

**CSS变量语法错误**：使用了`calc(var(--theme-saturation) * 1%)`，但当`--theme-saturation`的值是"90%"时，calc()会导致解析失败。

**光晕尺寸问题**：`.card-glow`使用了`--outset: var(--pads)`（40px），导致光晕比卡片大了一圈。

### 解决方案

**修改1**: 修复CSS变量语法（components/card/card.css）

**修改前**：
```css
background: hsl(var(--theme-hue) calc(var(--theme-saturation) * 1%) calc(var(--theme-lightness) * 1%) / 0.15);
```

**修改后**：
```css
background: hsl(var(--theme-hue), var(--theme-saturation), var(--theme-lightness) / 0.15);
```

HSL函数会自动处理百分比单位，不需要calc()。

**修改2**: 修复静态光晕尺寸（components/card/card.css）

```css
.glass-card.static-glow > .card-glow {
  --outset: 0px; /* 静态光晕严格贴合卡片边缘 */
  opacity: 1 !important;
}
```

**修改位置**：
- `.glass-card::before` - ::before背景色
- `.glass-card::after` - ::after背景色
- `.glass-card .card-edge-glow` - 边缘高光
- `.glass-card > .card-glow::before` - 发光层box-shadow
- `.glass-card.static-glow > .card-glow` - 静态光晕
- `.glass-card.static-glow > .card-glow::before` - 静态光晕发光层

### 测试页面

创建了test-css-vars.html来测试CSS变量是否正确应用：
- 不依赖任何外部CSS文件
- 直接在HTML中定义CSS变量
- 检查伪元素背景色是否正确

### 验证步骤

1. 打开`test-css-vars.html`，检查CSS变量是否正确应用
2. 打开`test-static-glow.html`，检查光晕是否严格贴合边缘
3. 打开`test-full-flow.html`，检查伪元素背景色是否不再是rgba(0, 0, 0, 0)
4. 清除缓存并刷新`home.html`，检查卡片是否有颜色

---

## 2026-04-12 修复五行图尺寸和增强卡片颜色效果

### 问题症状
- 五行图变得太小
- 卡片边缘和内部颜色不明显

### 根本原因

1. **home.css中五行图width被覆盖**（第508-511行）
   ```css
   .home-container .wuxing-chart {
     width: auto !important;  /* 这会覆盖五行图的width: 100% */
   }
   ```

2. **卡片颜色透明度太低**
   - ::before伪元素背景透明度只有0.05
   - ::after伪元素渐变透明度只有0.08/0.03
   - .card-edge-glow透明度只有0.6
   - 用户很难看到命卦颜色效果

### 解决方案

**修改1**: `src/pages/home/home.css`
- 移除五行图的`width: auto !important;`规则
- 优化transform规则，只对swiper容器生效，不影响卡片伪元素

**修改2**: `components/card/card.css`
- 增强::before伪元素背景透明度（0.05 → 0.15）
- 增强::after伪元素渐变透明度（0.08/0.03 → 0.20/0.10）
- 增强.card-edge-glow透明度（0.6 → 0.8）
- 增强脉冲效果（0.4-0.7 → 0.6-1.0）

### 预期效果

**五行图**：
- 恢复到正常尺寸（700px / 500px移动端）
- 宽度为100%，自适应容器

**卡片颜色**：
- ::before伪元素显示明显的命卦颜色背景
- ::after伪元素显示命卦颜色渐变叠加
- .card-edge-glow显示脉动的命卦颜色边缘高光
- 用户可以清晰看到每个档案的命卦颜色

### 验证步骤
1. 打开首页，检查五行图尺寸是否恢复正常
2. 检查卡片是否有明显的命卦颜色背景
3. 检查卡片边缘是否有脉动的命卦颜色高光
4. 切换不同档案，每个档案的命卦颜色应该明显不同

---

## 2026-04-12 修复CSS函数语法错误

### 问题

用户反馈："静态测试页面也没颜色了"，说明我之前的修复把问题弄得更严重了。

### 根本原因

使用了错误的HSL函数语法：
```css
/* 错误 - hsl()不能直接跟/表示alpha */
hsl(var(--theme-hue), var(--theme-saturation), var(--theme-lightness) / 0.15)

/* 错误 - hsla()不能使用/语法 */
hsla(var(--theme-hue), var(--theme-saturation), var(--theme-lightness) / 0.3)
```

### 正确语法

**hsl()函数**：没有alpha参数
```css
hsl(hue, saturation, lightness)
```

**hsla()函数**：第4个参数是alpha（0-1的小数）
```css
hsla(hue, saturation, lightness, alpha)
```

### 修复方案

将所有使用CSS变量的颜色函数从`hsl(..., / ...)`改为`hsla(..., ...)`

**修复位置**：
1. `.glass-card::before` - 背景色
2. `.glass-card::after` - 渐变色
3. `.glass-card .card-edge-glow` - 边缘高光
4. `.glass-card > .card-glow::before` - box-shadow
5. `.glass-card.static-glow > .card-glow` - 静态光晕背景和边框
6. `.glass-card.static-glow > .card-glow::before` - 静态光晕box-shadow

**示例**：
```css
/* 修复前 */
background: hsla(var(--theme-hue), var(--theme-saturation), var(--theme-lightness) / 0.15);

/* 修复后 */
background: hsla(var(--theme-hue), var(--theme-saturation), var(--theme-lightness), 0.15);
```

### 测试

刷新以下测试页面验证修复：
1. `test-css-vars.html` - 简单的CSS变量测试
2. `test-static-glow.html` - 静态光晕测试
3. `test-full-flow.html` - 完整流程测试

预期结果：卡片应该显示命卦颜色背景。

---

## 2026-04-12 最终修复卡片颜色显示问题 ✅

### 问题症状

- 首页卡片完全透明，看不到任何命卦颜色
- 测试页面也显示 `beforeBg: 'rgba(0, 0, 0, 0)'`
- 所有卡片的`::before`、`::after`、`.card-edge-glow`、`.card-glow`都是透明状态

### 根本原因

**CSS变量格式与hsla()函数语法不匹配**

hsla()函数的正确语法：
```css
hsla(hue, saturation%, lightness%, alpha)
```
- saturation和lightness**必须带%单位**
- alpha是0-1的小数，**不带%单位**

但代码存在三处不一致：

1. **home.js (line 232)** - 内联样式添加了%
   ```javascript
   style="--theme-hue: ${hue}; --theme-saturation: ${saturation}%; --theme-lightness: ${lightness}%;"
   ```

2. **card.css五行颜色类** - 定义时不带%
   ```css
   .glass-card.wood-card {
     --theme-hue: 120;
     --theme-saturation: 60;      /* 不带% */
     --theme-lightness: 40;       /* 不带% */
   }
   ```

3. **card.css使用hsla()时** - 有些地方加了%，有些地方没加
   ```css
   /* 某些地方（错误） */
   background: hsla(var(--theme-hue), var(--theme-saturation), var(--theme-lightness), 0.15);

   /* 某些地方（正确） */
   background: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.15);
   ```

### 最终解决方案

**统一标准：CSS变量定义为纯数字，在hsla()函数中添加%**

#### 修复1: home.js (line 232)

```javascript
// 修复前
style="--theme-hue: ${hue}; --theme-saturation: ${saturation}%; --theme-lightness: ${lightness}%;"

// 修复后
style="--theme-hue: ${hue}; --theme-saturation: ${saturation}; --theme-lightness: ${lightness};"
```

#### 修复2: card.css - 所有hsla()调用添加%

涉及以下位置：

1. **`.glass-card::before`** (line 50, 63)
   ```css
   background: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.15);
   ```

2. **`.glass-card::after`** (line 84, 85, 98, 99)
   ```css
   background: linear-gradient(
     135deg,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.20) 0%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.10) 100%
   );
   ```

3. **`.glass-card .card-edge-glow`** (line 115-117, 129-131)
   ```css
   background: linear-gradient(
     135deg,
     transparent 0%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.5) 25%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.6) 50%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.5) 75%,
     transparent 100%
   );
   ```

4. **`.glass-card > .card-glow::before`** (line 191-197, 208-210)
   ```css
   box-shadow:
     inset 0 0 0 1px hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1),
     inset 0 0 1px 0 hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.6),
     inset 0 0 3px 0 hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.5),
     /* ...更多box-shadow */
   ```

5. **`.glass-card.static-glow > .card-glow`** (line 232-238)
   ```css
   background: radial-gradient(
     circle at 70% 20%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.3) 0%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.15) 30%,
     transparent 60%
   ) !important;
   border: 2px solid hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.6) !important;
   ```

6. **`.glass-card.static-glow > .card-glow::before`** (line 247-256)
   ```css
   border: 2px solid hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.5);
   background: radial-gradient(
     circle at 70% 20%,
     hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.2) 0%,
     transparent 50%
   );
   box-shadow:
     inset 0 0 0 1px hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1),
     inset 0 0 1px 0 hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.6),
     inset 0 0 3px 0 hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.5);
   ```

### 技术要点

1. **CSS变量定义**：纯数字，不带单位
   ```css
   --theme-saturation: 60;  /* 正确 */
   --theme-saturation: 60%; /* 错误 */
   ```

2. **hsla()函数使用**：添加%单位
   ```css
   hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.15)
   ```

3. **一致性原则**：
   - 五行颜色类定义：不带%
   - 内联样式设置：不带%
   - hsla()函数使用：带%

### 验证步骤

1. 清除浏览器缓存（Ctrl+Shift+R / Cmd+Shift+R）
2. 打开`test-color-fix.html` - 应该看到3张有颜色的卡片（红、黄、绿）
3. 打开`home.html` - 卡片应该显示命卦对应的颜色
4. 检查Console，伪元素背景色不再显示`rgba(0, 0, 0, 0)`

### 预期效果

**卡片颜色**：
- ::before伪元素显示半透明命卦颜色背景（15%透明度）
- ::after伪元素显示命卦颜色渐变叠加（20%-10%透明度）
- .card-edge-glow显示脉动的命卦颜色边缘高光（80%透明度）
- .card-glow显示静态光晕（30%-15%渐变）

**不同命卦的颜色**：
- 乾卦（金）：白色/灰色 (hue: 210, sat: 20%, light: 90%)
- 坤卦（土）：黄色 (hue: 45, sat: 90%, light: 50%)
- 震卦（木）：绿色 (hue: 120, sat: 60%, light: 40%)
- 等等...

### 相关文件

- `src/pages/home/home.js` (line 232) - 移除内联样式的%
- `components/card/card.css` (6处修改) - 添加hsla()函数的%

### 测试文件

- `src/pages/home/test-color-fix.html` - 颜色修复验证页面

---

## 2026-04-12 首页UI调整

### 修改内容

**1. 删除多余的主题切换按钮**
- **位置**: `src/pages/home/home.html` (line 100-112)
- **修改**: 删除了右下角的主题切换按钮HTML
- **同时删除**: `src/pages/home/home.js` 中的 `initThemeToggle()` 函数及其调用

**2. 命卦图标使用主题色**
- **位置**: `src/pages/home/home.css` (line 204-209)
- **修改前**: `color: var(--text-primary);`
- **修改后**: `color: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1);`
- **效果**: 命卦图标（如☵☲等）现在显示为命卦对应的颜色

**3. 日主标签颜色调整**
- **位置**: `src/pages/home/home.css` (line 267-281)
- **修改前**: 黄色背景和边框 `background: rgba(255, 215, 0, 0.2); border: 1px solid rgba(255, 215, 0, 0.5); color: #ffd700;`
- **修改后**: 白色/灰色背景和边框
  ```css
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  ```
- **亮色主题**: 相应调整为黑色系

**4. 翻页组件垂直居中**
- **位置**: `src/pages/home/home.css` (line 7-17)
- **修改前**: `padding: 80px 20px 100px 20px;` (顶部留80px空间给主题按钮)
- **修改后**: `padding: 20px;` (移除顶部和底部的大间距)
- **效果**: Swiper翻页组件现在在高度上居中显示

**5. 环形菜单z-index调整**
- **位置**: `src/pages/home/home.css` (line 345-368)
- **修改**: 提高环形菜单及其子元素的z-index
  ```css
  .home-container .circular-menu {
    z-index: 1000 !important; /* 从100提高到1000 */
  }
  .home-container .menu-toggle {
    z-index: 1001 !important; /* 新增 */
  }
  .home-container .menu-items {
    z-index: 1002 !important; /* 新增 */
  }
  .home-container .menu-item {
    z-index: 1002 !important; /* 新增 */
  }
  ```
- **效果**: 确保菜单按钮始终显示在最上层，不被其他元素遮挡

### 验证步骤

1. 刷新首页，检查：
   - 右下角没有多余的主题切换按钮
   - 命卦图标显示为命卦对应的颜色（如坎卦蓝色、离卦红色等）
   - 日主标签为白色/灰色，不是黄色
   - 翻页组件在页面高度上居中
   - 右下角有环形菜单按钮（圆形的"+"按钮）

2. 点击环形菜单按钮，应该展开3个子菜单项：
   - 八字详解（文档图标）
   - 姻缘匹配（心形图标）
   - 新建档案（圆形加号图标）

### 相关文件

- `src/pages/home/home.html` - 删除主题切换按钮
- `src/pages/home/home.js` - 删除initThemeToggle函数
- `src/pages/home/home.css` - 4处样式调整

---

## 2026-04-12 修复首页UI问题（第二轮）

### 修改内容

**1. 重新添加主题切换按钮（右上角）**
- **位置**: `src/pages/home/home.html` (line 171-185)
- **修改**: 在`</main>`标签后、`<script>`标签前添加主题切换按钮
- **z-index**: 9999，确保在所有内容之上
- **位置**: 右上角（通过common.css的`.theme-toggle`样式控制）
- **同时**: 恢复`home.js`中的`initThemeToggle()`函数和调用

**2. 减少翻页组件顶部间距**
- **位置**: `src/pages/home/home.css` (line 7-17)
- **修改前**: `padding: 20px;`
- **修改后**: `padding: 0 20px;`
- **效果**: 移除上下padding，只保留左右间距，让Swiper在垂直方向上真正居中

**3. 修复五黄中宫图标显示**
- **位置**: `components/icons/mingua/zhonggong.svg`
- **修改前**: SVG元素没有`stroke`属性
- **修改后**: 添加`stroke="currentColor"`和`class="zhonggong-stroke"`
- **效果**: 图标现在可以使用CSS的`color`属性改变颜色

**4. 增强命卦图标颜色效果**
- **位置**: `src/pages/home/home.css` (line 204-220)
- **新增CSS规则**:
  ```css
  /* 确保SVG内部元素也使用主题色 */
  .summary-card .mingua-icon svg,
  .summary-card .mingua-icon svg *,
  .summary-card .mingua-icon text {
    color: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1) !important;
    fill: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1) !important;
    stroke: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 1) !important;
  }
  ```
- **使用!important**: 确保覆盖SVG默认的黑色样式

**5. 命卦信息文字居中**
- **位置**: `src/pages/home/home.css` (line 249-271)
- **修改**: 为`.mingua-info`、`.mingua-name`、`.mingua-details`添加`text-align: center;`
- **效果**: 所有命卦相关文字（名称、位置、五行）都居中对齐

### 验证步骤

1. 刷新首页，检查：
   - 右上角有主题切换按钮（太阳/月亮图标）
   - 点击可以切换暗黑/明亮主题
   - 翻页组件在页面垂直方向上居中
   - 五黄中宫的卡片显示双圆圈图标
   - 所有命卦图标显示对应的颜色（不再是黑色）
   - 命卦信息文字居中对齐

### 技术要点

**SVG颜色控制**：
- SVG的`text`元素：使用`fill`和`color`属性
- SVG的`circle`等形状：使用`stroke`属性
- 添加`class`方便后续CSS控制
- 使用`currentColor`让SVG继承CSS的`color`值

**CSS优先级**：
- 使用`!important`确保覆盖SVG内联样式和默认样式
- 同时设置`color`、`fill`、`stroke`确保所有SVG元素都受影响

### 相关文件

- `src/pages/home/home.html` - 添加主题切换按钮
- `src/pages/home/home.js` - 恢复initThemeToggle函数
- `src/pages/home/home.css` - 3处修改（padding、icon颜色、文字居中）
- `components/icons/mingua/zhonggong.svg` - 添加stroke属性

---

## 2026-04-12 修复首页UI问题（第三轮）

### 修改内容

**1. 删除重复的主题切换逻辑**
- **位置**: `src/pages/home/home.js`
- **修改**: 删除了`initThemeToggle()`函数
- **原因**: `background.js`已经处理了主题切换，不需要重复处理
- **避免冲突**: 防止多个事件监听器绑定到同一个按钮

**2. 修复命卦图标颜色**
- **位置**: `src/pages/home/home.css` (line 204-227)
- **问题**: CSS选择器不够具体，导致样式没有应用
- **修改前**: `.summary-card .mingua-icon`
- **修改后**:
  ```css
  .summary-card .glass-card-logo .mingua-icon,
  .glass-card .glass-card-logo .mingua-icon
  ```
- **效果**: 图标现在正确显示命卦主题色

**3. 增强环形菜单显示效果**
- **位置**: `src/pages/home/home.css` (line 345-395)
- **新增样式**:
  ```css
  .home-container .circular-menu .menu-toggle {
    opacity: 1 !important;
    visibility: visible !important;
    background: rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-radius: 50% !important;
    width: 60px !important;
    height: 60px !important;
  }
  ```
- **效果**: 确保环形菜单按钮始终可见，有玻璃质感背景

### 问题分析

**用户反馈的问题**：
1. "左下角的主题多余的切换按钮还在"
2. "menu还是没有显示"
3. "card上的icon还是没有颜色"

**实际情况**：
1. **主题切换按钮位置**: common.css定义的`.theme-toggle`在右上角（`top: var(--space-4); right: var(--space-4);`），不是左下角
   - 可能是浏览器缓存问题
   - 或者用户看到的是其他页面（home-debug.html）

2. **环形菜单不显示**: CSS选择器不够具体，导致样式被覆盖
   - menu.js中的z-index较低
   - 需要用!important强制应用样式

3. **图标没有颜色**: CSS选择器不够具体
   - 之前的选择器`.summary-card .mingua-icon`没有考虑到`.glass-card-logo`层级
   - 需要更具体的选择器

### 验证步骤

1. **清除浏览器缓存**：
   - Chrome/Edge: Ctrl+Shift+Delete 或 Cmd+Shift+Delete
   - 或者使用Ctrl+Shift+R（Windows）/ Cmd+Shift+R（Mac）强制刷新

2. **检查主题切换按钮**：
   - 应该在右上角（不是左下角）
   - 只有一个主题切换按钮
   - 点击可以切换暗黑/明亮主题

3. **检查环形菜单**：
   - 应该在右下角
   - 显示一个圆形的"+"按钮
   - 点击后展开3个子菜单项

4. **检查命卦图标颜色**：
   - 每个卡片的图标应该显示命卦对应的颜色
   - 例如：坎卦蓝色、离卦红色、坤卦黄色等

### 技术要点

**CSS选择器优先级**：
- 选择器越具体，优先级越高
- `.A.B` 比 `.A .B` 更具体
- 使用`!important`可以覆盖内联样式和其他样式

**避免重复初始化**：
- background.js已经在DOMContentLoaded时初始化主题切换
- 不需要在home.js中再次初始化
- 多个初始化会导致事件监听器重复绑定

### 相关文件

- `src/pages/home/home.js` - 删除initThemeToggle函数
- `src/pages/home/home.css` - 2处修改（icon颜色、menu显示）
- `style/common.css` - theme-toggle默认样式（右上角）

---

## 2026-04-12 修复icon颜色和显示问题（第四轮）

### 核心问题发现

通过查看`example.html`发现了关键问题：

**问题1: 使用`<img>`标签加载SVG**
- **home.js原代码**: `<img src="${minguaIcons[profile.mingua.gua]}" class="mingua-icon">`
- **问题**: `<img>`标签创建独立文档，不继承父元素的CSS `color`属性
- **example.html做法**: 直接内联SVG代码，如：
  ```html
  <svg class="mingua-icon" viewBox="0 0 48 48">
    <text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☵</text>
  </svg>
  ```

**问题2: zhonggong.svg缺少fill/stroke**
- SVG只有`<circle>`元素，需要`stroke="currentColor"`来继承颜色

### 修改内容

**1. 修改home.js - 使用内联SVG**
- **位置**: `src/pages/home/home.js` (line 14-25)
- **修改前**:
  ```javascript
  const minguaIcons = {
    'kan': '../../../components/icons/mingua/kan.svg',
    // ... 其他SVG文件路径
  };
  ```
- **修改后**:
  ```javascript
  const minguaIcons = {
    'kan': '<svg viewBox="0 0 48 48"><text x="24" y="24" font-size="32" text-anchor="middle" dominant-baseline="central">☵</text></svg>',
    // ... 其他内联SVG代码
  };
  ```
- **优势**: SVG代码直接嵌入HTML，可以继承CSS的color属性

**2. 修改HTML结构**
- **位置**: `src/pages/home/home.js` (line 233-238)
- **修改前**: `<img src="${minguaIcons[profile.mingua.gua]}" class="mingua-icon">`
- **修改后**: `<div class="mingua-icon">${minguaIcons[profile.mingua.gua]}</div>`

**3. 更新CSS样式**
- **位置**: `src/pages/home/home.css` (line 204-240)
- **新增规则**:
  ```css
  .summary-card .glass-card-logo .mingua-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .summary-card .glass-card-logo .mingua-icon svg text,
  .summary-card .glass-card-logo .mingua-icon svg circle,
  .summary-card .glass-card-logo .mingua-icon svg ellipse {
    color: inherit !important;
    fill: currentColor !important;
    stroke: currentColor !important;
  }
  ```

**4. 修复zhonggong.svg**
- **位置**: `components/icons/mingua/zhonggong.svg`
- **修改**: 添加`stroke="currentColor"`
- **效果**: 圆圈现在可以继承父元素的color属性

### 测试文件

创建了`test-icon-fix.html`来验证修复：
- 红色卡片（离卦火）- 应该显示红色离卦图标
- 黄色卡片（中宫土）- 应该显示黄色双圆圈图标

### 验证步骤

1. **打开测试页面**: `src/pages/home/test-icon-fix.html`
   - 应该看到2个卡片，分别显示红色和黄色的图标

2. **打开首页**: `src/pages/home/home.html`
   - 所有命卦图标应该显示对应的颜色
   - 中宫用户应该显示双圆圈图标

3. **检查颜色**:
   - 坎卦（水）: 蓝色 ☵
   - 离卦（火）: 红色 ☲
   - 中宫（土）: 黄色 ⊙
   - 其他卦象也应该有对应颜色

### 关于"右下角的主题按钮"

根据检查：
- `common.css`中的`.theme-toggle`定位在**右上角**（`top: var(--space-4); right: var(--space-4);`）
- 页面中应该只有1个主题切换按钮，在右上角
- 如果看到"右下角的按钮"，可能是：
  1. 环形菜单按钮（也在右下角）
  2. 浏览器缓存问题

建议清除缓存后刷新页面。

### 相关文件

- `src/pages/home/home.js` - 内联SVG代码
- `src/pages/home/home.css` - 更新icon样式
- `components/icons/mingua/zhonggong.svg` - 添加currentColor
- `src/pages/home/test-icon-fix.html` - 测试页面

---

## 2026-04-12 添加static-glow类修复card颜色

### 问题发现

用户反馈card颜色又消失了，检查发现：
- home.js生成的卡片HTML中**缺少`static-glow`类**
- `static-glow`类是显示卡片颜色的关键

### 修复内容

**修改home.js - 添加static-glow类**
- **位置**: `src/pages/home/home.js` (line 227)
- **修改前**: `<div class="glass-card summary-card"`
- **修改后**: `<div class="glass-card summary-card static-glow"`

### 关于"右下角的主题切换按钮"

经过检查：
1. **home.html中只有1个theme-toggle按钮**（line 158）
2. **common.css定义它在右上角**（`top: var(--space-4); right: var(--space-4);`）
3. **环形菜单按钮在右下角**（通过home.css的`.circular-menu`定义）

**用户看到的"右下角的主题切换按钮"可能是**：
- 环形菜单的menu-toggle按钮（圆形，"+"图标）
- 或者是浏览器缓存了旧版本

### 测试文件

创建了`test-simple.html`来验证icon颜色：
- 红色离卦☲
- 蓝色坎卦☵
- 黄色中宫⊙

### 验证步骤

1. **清除浏览器缓存并强制刷新**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

2. **打开首页**:
   - 卡片应该有命卦颜色的背景和边缘光晕
   - 图标应该显示命卦对应的颜色
   - 右上角有主题切换按钮（太阳/月亮图标）
   - 右下角有环形菜单按钮（圆形"+"图标）

3. **如果问题仍然存在**:
   - 打开开发者工具（F12）
   - 检查Console是否有错误
   - 检查Elements面板，查看卡片的class列表是否包含`static-glow`
   - 检查inline style是否正确设置了CSS变量

### 相关文件

- `src/pages/home/home.js` - 添加static-glow类
- `src/pages/home/test-simple.html` - 简单icon颜色测试

---

## 2026-04-12 修复menu.js错误和更换图标

### 问题发现

**menu.js第29行错误**: `this.toggle is not a function`
- **原因**: `this.toggle`既是DOM元素（按钮），又是方法名（toggle()）
- 在第9行：`this.toggle = this.menu.querySelector('.menu-toggle')`
- 这覆盖了toggle()方法，导致调用时出错

### 修复内容

**1. 修复menu.js的命名冲突**
- **位置**: `components/menu/menu.js`
- **修改**: 将按钮元素从`this.toggle`重命名为`this.toggleButton`
- **涉及位置**:
  - line 9: `this.toggleButton = this.menu.querySelector('.menu-toggle')`
  - line 26: 事件绑定
  - line 52: focus()调用
  - line 112: setAttribute调用
  - line 129: setAttribute调用
  - line 154: focus()调用
  - line 199: removeEventListener调用

**2. 更换menu图标**
- **位置**: `src/pages/home/home.html` (line 125-130)
- **修改前**: 太阳图标（圆形+射线），容易和主题切换按钮混淆
- **修改后**: 汉堡菜单图标（三条横线）
  ```html
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
  ```

**3. 创建调试页面**
- **文件**: `src/pages/home/debug-colors.html`
- **功能**: 检查卡片class、inline style、::before背景色、icon颜色
- **用途**: 诊断为什么卡片和icon没有颜色

### 验证步骤

1. **强制刷新页面**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

2. **测试menu按钮**:
   - 右下角应该显示汉堡菜单图标（三条横线）
   - 点击后应该展开3个子菜单项

3. **打开调试页面**: `src/pages/home/debug-colors.html`
   - 查看检测结果
   - 如果::before背景色是`rgba(0, 0, 0, 0)`，说明CSS变量没有生效
   - 如果icon颜色是`rgb(0, 0, 0)`或黑色，说明颜色继承有问题

4. **如果debug页面显示正常**:
   - 说明card.css和icon.css都正常
   - 问题可能在于home.js的CSS变量设置

5. **检查浏览器Console**:
   - 是否有CSS解析错误
   - 是否有JavaScript错误

### 可能的问题和解决方案

**问题1**: 浏览器缓存了旧版本
- **解决**: 强制刷新或清除缓存

**问题2**: CSS变量格式错误
- **检查**: inline style是否正确设置了CSS变量
- **验证**: 打开开发者工具，查看卡片的inline style

**问题3**: CSS优先级问题
- **检查**: 是否有其他CSS规则覆盖了样式
- **验证**: 使用开发者工具检查computed styles

### 相关文件

- `components/menu/menu.js` - 修复命名冲突
- `src/pages/home/home.html` - 更换menu图标
- `src/pages/home/debug-colors.html` - 调试页面

---

## 2026-04-12 修复菜单位置和添加测试

### 修改内容

**1. 修复menu按钮位置**
- **位置**: `src/pages/home/home.css`
- **修改前**: `right: 40px; bottom: 40px;`（右下角）
- **修改后**: `bottom: 20px; left: 50%; transform: translateX(-50%);`（正下方居中）
- **效果**: menu按钮现在显示在页面正下方

**2. 添加调试日志**
- **位置**: `src/pages/home/home.js` (line 202)
- **添加**: 输出CSS变量字符串的日志
- **用途**: 帮助诊断CSS变量是否正确生成

**3. 创建测试页面**
- **文件**: `test-inline-style.html`
- **功能**: 测试inline style中的CSS变量是否生效
- **测试**:
  ```html
  style="--theme-hue: 0; --theme-saturation: 70; --theme-lightness: 55;"
  ```

### 验证步骤

1. **强制刷新**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

2. **测试inline style页面**:
   ```
   src/pages/home/test-inline-style.html
   ```
   - 查看Console输出
   - 应该看到红色和绿色两张有颜色的卡片
   - 如果有颜色，说明card.css工作正常

3. **测试首页**:
   - 打开 `src/pages/home/home.html`
   - 查看Console中的调试日志
   - 应该看到类似这样的输出：
     ```
     🎨 CSS变量字符串: --theme-hue: 0; --theme-saturation: 70; --theme-lightness: 55;
     ```

4. **检查menu按钮**:
   - 应该在页面**正下方**居中显示
   - 图标是**三条横线**（汉堡菜单）
   - 点击应该展开菜单

5. **如果还是没有颜色**:
   - 打开开发者工具（F12）
   - 选择一个卡片
   - 查看Elements面板
   - 检查是否有`style`属性，值应该是：
     ```
     --theme-hue: 数字; --theme-saturation: 数字; --theme-lightness: 数字;
     ```
   - 把结果告诉我

### 关于menu按钮点击没反应

如果点击menu按钮没反应，检查Console是否有错误：
- 应该会看到`[CircularMenu] 主按钮被点击`的日志
- 如果有JavaScript错误，请告诉我错误信息

### 相关文件

- `src/pages/home/home.css` - 修改menu按钮位置
- `src/pages/home/home.js` - 添加调试日志
- `src/pages/home/test-inline-style.html` - inline style测试页面

---

## 2026-04-12 修复菜单上半圆显示和卡片颜色问题

### 问题1: 菜单项改为上半圆弹出

**修改文件**: `components/menu/menu.js`

**修改内容** (line 66-91):
```javascript
// 修改前：使用360度全圆
const angleStep = 360 / this.itemCount;
const startAngle = -90;

// 修改后：只使用180度上半圆
const totalAngleSpan = 180;
const angleStep = this.itemCount > 1 ? totalAngleSpan / (this.itemCount - 1) : 0;
const startAngle = 180;
```

**效果**:
- 3个菜单项现在分布在：
  - 180° (左侧)
  - 270° (顶部中央)
  - 0°/360° (右侧)
- 菜单项只在页面上方半圆展开，不会向下遮挡内容

### 问题2: 修复卡片无颜色 - saturation: 0问题

**根本原因**: 4个profile的HSL值中saturation为0，导致颜色为灰色/白色

**修改文件**: `mock-data/bazi-profiles.json`

**修复内容**:

1. **profile_001 (坎卦-水)**:
   - 修改前: `{"hue": 0, "saturation": 0, "lightness": 70}`
   - 修改后: `{"hue": 210, "saturation": 80, "lightness": 60}` (蓝色)

2. **profile_002 (坤卦-土)**:
   - 修改前: `{"hue": 0, "saturation": 0, "lightness": 30}`
   - 修改后: `{"hue": 45, "saturation": 90, "lightness": 50}` (黄色)

3. **profile_006 (乾卦-金)**:
   - 修改前: `{"hue": 0, "saturation": 0, "lightness": 70}`
   - 修改后: `{"hue": 220, "saturation": 15, "lightness": 90}` (白色/灰色)

4. **profile_008 (艮卦-土)**:
   - 修改前: `{"hue": 0, "saturation": 0, "lightness": 85}`
   - 修改后: `{"hue": 45, "saturation": 85, "lightness": 60}` (黄色)

### 验证步骤

1. **强制刷新**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

2. **检查菜单展开**:
   - 点击页面底部的menu按钮
   - 菜单项应该只在上方半圆弹出
   - 3个菜单项呈弧形分布在上方

3. **检查卡片颜色**:
   - 打开 `src/pages/home/home.html`
   - 所有9张卡片都应该有颜色
   - 每张卡片的颜色应该与命卦的五行元素对应：
     - 坎卦(水) - 蓝色
     - 坤卦(土) - 黄色
     - 震卦(木) - 绿色
     - 巽卦(木) - 绿色
     - 中宫(土) - 黄色
     - 乾卦(金) - 白色/灰色
     - 兑卦(金) - 红色
     - 艮卦(土) - 黄色
     - 离卦(火) - 紫色

### 相关文件

- `components/menu/menu.js` - 菜单定位算法
- `mock-data/bazi-profiles.json` - 修复4个profile的HSL值

---

## 2026-04-12 修复卡片颜色显示 - CSS变量格式问题

### 问题根源

经过测试发现：CSS变量在hsla()函数中使用时，**变量的值需要包含%符号**，而不是在使用时加%。

**错误的方式**（不工作）:
```javascript
// JSON
{ "saturation": 80, "lightness": 60 }

// CSS
background: hsla(var(--theme-hue), var(--theme-saturation)%, var(--theme-lightness)%, 0.3);
```

**正确的方式**（工作）:
```javascript
// JSON
{ "saturation": "80%", "lightness": "60%" }

// CSS
background: hsla(var(--theme-hue), var(--theme-saturation), var(--theme-lightness), 0.3);
```

### 修复内容

**1. 修复JSON数据** - `mock-data/bazi-profiles.json`
- 所有9个profile的HSL值改为带%的字符串
- 坎卦(水): `{"hue": 210, "saturation": "80%", "lightness": "60%"}`
- 坤卦(土): `{"hue": 45, "saturation": "90%", "lightness": "50%"}`
- 震卦(木): `{"hue": 200, "saturation": "75%", "lightness": "55%"}`
- 巽卦(木): `{"hue": 120, "saturation": "70%", "lightness": "50%"}`
- 中宫(土): `{"hue": 45, "saturation": "90%", "lightness": "55%"}`
- 乾卦(金): `{"hue": 220, "saturation": "15%", "lightness": "90%"}`
- 兑卦(金): `{"hue": 0, "saturation": "80%", "lightness": "60%"}`
- 艮卦(土): `{"hue": 45, "saturation": "85%", "lightness": "60%"}`
- 离卦(火): `{"hue": 275, "saturation": "80%", "lightness": "60%"}`

**2. 修复CSS** - `components/card/card.css`
- 移除所有hsla()中CSS变量后的%符号
- 修改前: `var(--theme-saturation)%`
- 修改后: `var(--theme-saturation)`
- 共修改约40处

**3. 验证**
- 创建了3个测试页面来诊断问题：
  - `test-card-border.html` - 硬编码颜色（工作✅）
  - `test-css-vars.html` - CSS变量测试（发现问题❌）
  - `test-hsla-fix.html` - 修复方案验证（工作✅）

### 测试步骤

1. **强制刷新浏览器**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

2. **打开首页**: `src/pages/home/home.html`
   - 所有9张卡片应该显示颜色
   - 每张卡片颜色对应命卦的五行元素

3. **验证颜色**:
   - 坎卦(水) - 蓝色
   - 坤卦(土) - 黄色
   - 震卦(木) - 蓝绿色
   - 巽卦(木) - 绿色
   - 中宫(土) - 黄色
   - 乾卦(金) - 白色/灰色
   - 兑卦(金) - 红色
   - 艮卦(土) - 黄色
   - 离卦(火) - 紫色

### 相关文件

- `mock-data/bazi-profiles.json` - 修复HSL值格式
- `components/card/card.css` - 移除CSS变量后的%
- `src/pages/home/test-css-vars.html` - CSS变量测试
- `src/pages/home/test-hsla-fix.html` - 修复验证测试