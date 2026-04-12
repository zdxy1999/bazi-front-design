# 页面结构文档

## 整体结构

```
页面整体
├── 主题切换按钮 (固定在右上角)
├── 页面主体 (动态内容)
└── 背景 (固定在最底层)
    ├── 五行流动层
    ├── 光晕效果层 (5个光晕)
    ├── 边缘发光效果
    └── 毛玻璃垫层
```

---

## 组件层级关系

### 1. 背景组件 ✅
**路径**: `components/background/`
**状态**: 已完成
**被使用于**: 所有页面

**结构**:
```
BackgroundContainer
├── WuxingFlowLayer (五行流动动画)
├── GlowOrb (5个光晕球体)
│   ├── GlowOrb-1 (木)
│   ├── GlowOrb-2 (火)
│   ├── GlowOrb-3 (水)
│   ├── GlowOrb-4 (土)
│   └── GlowOrb-5 (金)
├── EdgeGlow (边缘发光)
└── GlassOverlay (毛玻璃垫层)
```

**关键特性**:
- 五行颜色渐变流动动画
- 5个随机飘动的光晕球
- 光晕靠近边缘时触发边缘发光
- 毛玻璃垫层隔离背景与内容
- 支持暗黑/明亮主题

---

### 2. 环形菜单组件 ✅
**路径**: `components/menu/`
**状态**: 已完成
**被使用于**: 页面导航

**结构**:
```
CircularMenu
├── MenuToggle (主按钮)
│   └── Icon (汉堡菜单图标)
└── MenuItems (菜单项容器)
    ├── MenuItem-1 [color-card]
    ├── MenuItem-2 [color-card]
    ├── MenuItem-3 [color-card]
    └── MenuItem-N [color-card] (支持任意数量)
```

**关键特性**:
- 通用组件，支持任意数量菜单项
- 自动等距排列（360°/n）
- 环形展开/收起动画
- 五行颜色主题（木火土金水）
- 玻璃质感设计
- 触摸和鼠标交互
- 键盘导航支持（ESC关闭）
- 响应式半径（移动端60-70px，PC端80px）
- 可访问性（ARIA属性、焦点管理）

---

### 3. 翻页容器组件 ✅
**路径**: `components/swiper/`
**状态**: 已完成
**被使用于**: 首页、八字解析页面、姻缘匹配页面

**结构**:
```
Swiper
├── SwiperWrapper (幻灯片容器)
│   ├── SwiperSlide-1
│   ├── SwiperSlide-2
│   ├── SwiperSlide-3
│   └── SwiperSlide-N
├── SwiperButtonPrev (上一页按钮，PC端)
├── SwiperButtonNext (下一页按钮，PC端)
└── SwiperPagination (分页指示器)
```

**关键特性**:
- PC端：水平滚动 + 鼠标拖拽
- 移动端：触摸滑动（支持手势识别）
- **3D Coverflow效果**：中间正常，两侧缩小并旋转（15°/25°）
- **循环模式**：支持无限循环滑动（添加`data-swiper-loop`属性）
- 响应式布局：自动适配屏幕大小
- 液态玻璃质感：与整体设计统一
- 平滑过渡动画：流畅的切换效果
- 键盘导航：左右箭头键切换
- 分页指示器：显示当前位置
- 导航按钮：PC端左右翻页
- 暗黑/明亮主题适配

**使用方法**:
```html
<!-- 标准模式 -->
<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">...</div>
    <div class="swiper-slide">...</div>
  </div>
  <button class="swiper-button-prev"></button>
  <button class="swiper-button-next"></button>
  <div class="swiper-pagination"></div>
</div>

<!-- 循环模式 -->
<div class="swiper" data-swiper-loop>
  ...
</div>
```

---

### 4. Markdown解析器组件 ✅
**路径**: `components/markdown/`
**状态**: 已完成
**被使用于**: 八字解析页面、姻缘匹配页面

**结构**:
```
MarkdownRenderer
├── 配置选项（breaks, gfm, highlight）
├── 解析方法（parse）
├── 渲染方法（render）
├── URL加载（loadFromUrl）
└── 实时预览（livePreview）
```

**关键特性**:
- 使用**Marked.js**解析Markdown
- 使用**Highlight.js**进行代码语法高亮
- 支持所有标准Markdown语法（标题、列表、代码块、表格、引用等）
- 暗黑/明亮主题自动适配（代码高亮主题切换）
- 玻璃质感样式：与整体设计统一
- 响应式设计：移动端友好
- 支持从URL加载Markdown文件
- 支持实时预览模式
- 链接自动添加target="_blank"
- 可访问性优化

**外部依赖**:
- Marked.js: https://cdn.jsdelivr.net/npm/marked/marked.min.js
- Highlight.js: https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js

---

### 5. 按钮组件 ✅
**路径**: `components/button/`
**状态**: 已完成
**被使用于**: 所有页面

**结构**:
```
Button
├── 变体（Variants）
│   ├── primary - 主要按钮
│   ├── secondary - 次要按钮
│   ├── danger - 危险按钮
│   └── ghost - 幽灵按钮
├── 尺寸（Sizes）
│   ├── sm - 小按钮
│   ├── 默认 - 标准按钮
│   ├── lg - 大按钮
│   └── xl - 超大按钮
├── 五行主题色
│   ├── wood - 木（绿色）
│   ├── fire - 火（红色）
│   ├── earth - 土（黄色）
│   ├── metal - 金（白色）
│   └── water - 水（蓝色）
├── 状态
│   ├── loading - 加载中
│   ├── disabled - 禁用
│   └── active - 激活
└── 变体
    ├── icon - 图标按钮
    └── circle - 圆形按钮
```

**关键特性**:
- **液态玻璃质感**：`backdrop-filter: blur(40px) saturate(180%)`
- **胶囊形状**：`border-radius: 9999px` 左右圆润，上下直边
- **光晕跟随效果**：鼠标移动时显示渐变光晕
- **点击波纹效果**：点击时显示扩散波纹动画
- **多种变体**：primary、secondary、danger、ghost
- **多种尺寸**：sm、默认、lg、xl
- **五行主题色**：wood、fire、earth、metal、water
- **图标按钮**：支持仅图标和圆形图标按钮
- **加载状态**：带旋转spinner的加载动画
- **禁用状态**：降低不透明度，禁用指针
- **按钮组**：支持单选行为
- **确认对话框**：危险操作可添加确认
- **暗黑/明亮主题适配**
- **响应式设计**
- **可访问性优化**：键盘导航、焦点管理、ARIA属性

**API方法**:
- `setButtonLoading(button, loading, loadingText)` - 切换加载状态
- `setButtonDisabled(button, disabled)` - 切换禁用状态
- `initButtonGroup(container, callback)` - 初始化按钮组单选
- `initButtonConfirm(button, message, callback)` - 添加确认对话框

---

### 6. 输入框组件 ✅
**路径**: `components/input/`
**状态**: 已完成
**被使用于**: 表单页面、八字输入页面

**结构**:
```
Input
├── 类型
│   ├── text - 文本输入
│   ├── password - 密码输入
│   ├── email - 邮箱输入
│   ├── number - 数字输入
│   ├── tel - 电话输入
│   ├── url - 网址输入
│   ├── date - 日期输入
│   ├── select - 下拉选择
│   └── textarea - 多行文本
├── 尺寸（Sizes）
│   ├── sm - 小输入框
│   ├── 默认 - 标准输入框
│   └── lg - 大输入框
├── 状态
│   ├── focus - 焦点状态
│   ├── disabled - 禁用状态
│   ├── readonly - 只读状态
│   ├── error - 错误状态
│   └── success - 成功状态
├── 五行主题色
│   ├── wood - 木（绿色）
│   ├── fire - 火（红色）
│   ├── earth - 土（黄色）
│   ├── metal - 金（白色）
│   └── water - 水（蓝色）
└── 附加元素
    ├── label - 标签
    ├── icon - 图标
    ├── prefix - 前缀
    └── suffix - 后缀
```

**关键特性**:
- **液态玻璃质感**：`backdrop-filter: blur(40px) saturate(180%)`
- **胶囊形状**：`border-radius: 9999px` 左右圆润
- **焦点动画**：焦点时显示外发光效果
- **多种尺寸**：sm、默认、lg
- **多种状态**：焦点、禁用、只读、错误、成功
- **五行主题色**：wood、fire、earth、metal、water
- **支持图标**：左侧图标提示
- **前后缀支持**：URL前缀、单位后缀等
- **文本域**：多行文本输入，可调整大小
- **下拉选择**：原生select美化
- **日期选择**：原生date输入
- **完整表单支持**：label、required、验证提示
- **暗黑/明亮主题适配**
- **响应式设计**
- **可访问性优化**：键盘导航、焦点管理、ARIA属性

**JavaScript功能**:
- `validateEmail(email)` - 验证邮箱格式
- `validatePhone(phone)` - 验证手机号格式
- `validateIdCard(idCard)` - 验证身份证号格式
- `setInputValidation(input, type, validator, errorMsg, successMsg)` - 设置输入验证
- `addCharCounter(input, maxLength, container)` - 添加字符计数
- `addPasswordStrengthIndicator(input, container)` - 添加密码强度指示器
- `addAutocomplete(input, suggestions, onSelect)` - 添加自动完成
- `addFloatingLabel(input, label)` - 添加浮动标签效果
- `addClearButton(input)` - 添加清空按钮
- `validateForm(form)` - 验证整个表单

---

### 8. 图标资源 ✅
**路径**: `components/icons/mingua/`
**状态**: 已完成
**被使用于**: 命盘详情页、命盘分析页

**图标列表**:
- `kan.svg` - 坎命 ☵
- `kun.svg` - 坤命 ☷
- `zhen.svg` - 震命 ☳
- `xun.svg` - 巽命 ☴
- `zhonggong.svg` - 中宫命（两个同心圆）
- `qian.svg` - 乾命 ☰
- `dui.svg` - 兑命 ☱
- `gen.svg` - 艮命 ☶
- `li.svg` - 离命 ☲

**特点**:
- 使用 `currentColor` 继承父元素颜色
- 无内置颜色，可自由着色
- SVG矢量格式，支持任意尺寸缩放

**使用方法**:
```html
<!-- 继承文字颜色 -->
<span style="color: #60a5fa">
  <img src="components/icons/mingua/kan.svg" width="48" height="48">
</span>

<!-- 使用CSS控制颜色 -->
<img src="components/icons/mingua/kan.svg"
     style="color: #60a5fa; width: 48px; height: 48px;">
```

---

### 7. 选择器组件 ✅
**路径**: `components/selector/`
**状态**: 已完成
**被使用于**: 表单页面、设置页面

**结构**:
```
Selector
├── Radio 单选框
│   ├── 基础样式 - 圆形单选按钮（选中时整个圆圈填充发光）
│   ├── 按钮样式 - 胶囊按钮单选（选中时边框发光）
│   ├── 垂直/水平排列
│   ├── 禁用状态
│   └── 五行主题色
├── Checkbox 复选框
│   ├── 基础样式 - 方形复选框（选中时整个方框填充发光）
│   ├── 垂直/水平排列
│   ├── 禁用状态
│   └── 五行主题色
└── Toggle 开关
    ├── 基础样式 - iOS风格开关
    ├── 禁用状态
    └── 五行主题色
```

**关键特性**:
- **统一选中效果**：所有选择器选中时整个内部点亮（发光效果）
  - Radio: 整个圆圈填充并发光，文字颜色变化
  - Checkbox: 整个方框填充并发光，文字颜色变化
  - Radio Button: 边框发光（保持透明内部），文字颜色变化
  - Toggle: 滑块轨道填充并发光，文字颜色变化
- **液态玻璃质感**：`backdrop-filter: blur(40px) saturate(180%)`
- **多层光晕效果**：20px 外发光 + 40px 中等光晕 + inset 内部光效
- **五行主题色**：wood、fire、earth、metal、water
  - 暗色主题：使用亮色系（rgba高亮度）
  - 亮色主题：使用深色系（确保可读性）
- **自定义颜色**：通过 CSS 变量 `--accent-primary` 轻松自定义
- **动画效果**：选中/取消选中的弹性动画（scale + opacity）
- **键盘导航**：空格键切换状态
- **完整表单支持**：与input、button组件无缝集成
- **暗黑/明亮主题适配**：
  - 暗色主题：五行主题色使用高亮度版本
  - 亮色主题：五行主题色自动切换为深色版本，确保可读性
- **响应式设计**
- **可访问性优化**：键盘导航、焦点管理、ARIA属性

**JavaScript功能**:
- `initRadioGroup(name, callback)` - 初始化单选组
- `getRadioValue(name)` - 获取选中值
- `setRadioValue(name, value)` - 设置选中值
- `initCheckboxGroup(selector, callback)` - 初始化复选框组
- `getCheckboxValues(selector)` - 获取所有选中值
- `setCheckboxValues(selector, values)` - 设置选中状态
- `toggleCheckboxes(selector, checked)` - 全选/取消全选
- `invertCheckboxes(selector)` - 反选
- `initSelectAll(master, selector)` - 初始化全选功能（带不确定状态）
- `initToggleGroup(selector, callback)` - 初始化开关组（互斥）
- `requireOneChecked(selector, message)` - 验证至少选中一项
- `limitCheckboxSelection(selector, max, message)` - 限制选择数量
- `generateRadioOptions(container, options, name)` - 动态生成单选项
- `generateCheckboxOptions(container, options, name)` - 动态生成复选项

---

## 文件结构

```
design-20260406/
├── style/                          ✅
│   ├── tokens.css                 ✅ 设计token
│   ├── common.css                 ✅ 公共样式
│   └── themes.css                 ✅ 主题样式
├── components/                     ✅
│   ├── background/                ✅ 背景组件
│   │   ├── background.html
│   │   ├── background.css
│   │   └── background.js
│   ├── card/                      ✅ 卡片组件
│   ├── loading-spin/              ✅ 加载动画
│   ├── processing/                ✅ 处理中动画
│   ├── menu/                      ✅ 菜单按钮
│   ├── swiper/                    ✅ 翻页容器
│   ├── markdown/                  ✅ Markdown解析器
│   ├── button/                    ✅ 按钮组件
│   ├── input/                     ✅ 输入框组件
│   ├── selector/                  ✅ 选择器组件
│   └── icons/                     ✅ 图标资源
│       └── mingua/               ✅ 命卦图标
│           ├── kan.svg           ✅ 坎命 ☵
│           ├── kun.svg           ✅ 坤命 ☷
│           ├── zhen.svg          ✅ 震命 ☳
│           ├── xun.svg           ✅ 巽命 ☴
│           ├── zhonggong.svg     ✅ 中宫命 ⚪
│           ├── qian.svg          ✅ 乾命 ☰
│           ├── dui.svg           ✅ 兑命 ☱
│           ├── gen.svg           ✅ 艮命 ☶
│           └── li.svg            ✅ 离命 ☲
├── mock-data/                      ✅
│   └── bazi-profiles.json        ✅ Mock数据 (9个档案)
├── src/                            ✅
│   └── pages/
│       ├── home/                  ✅ 首页
│       ├── new-bazi/              ✅ 新建八字
│       ├── analysis/              ✅ 八字解析
│       ├── match/                 ✅ 姻缘匹配
│       └── new-match/             ✅ 新建姻缘匹配
├── require.md                     ✅ 需求文档
├── process.md                     ✅ 过程文档
├── structure.md                   ✅ 本文件 - 结构文档
└── CLAUDE.md                      ✅ 项目说明
```

---

## 图例

- ✅ 已完成
- 🚧 进行中或待实现
- 📋 规划中

---

## 页面实现状态 (2026-04-11完成)

### 首页 ✅
**路径**: `src/pages/home/`
**文件**: home.html, home.css, home.js

**功能**:
- Swiper循环翻页展示8-10个档案
- 每个档案包含五行生克图 + 摘要卡片
- 响应式布局：移动端垂直，PC端水平
- 环形菜单：八字详解、姻缘匹配、新建档案
- 设置默认档案 + 删除档案功能

**关键组件集成**:
- Swiper组件 (循环翻页、3D效果)
- WuxingChart组件 (五行生克图)
- Card组件 (摘要卡片)
- Menu组件 (环形菜单)
- Background组件 (五行流动背景)

### 新建八字页面 ✅
**路径**: `src/pages/new-bazi/`
**文件**: new-bazi.html, new-bazi.css, new-bazi.js

**功能**:
- 档案名称输入（可选，自动生成）
- 性别选择（男/女）
- 出生日期选择（默认2002-06-01）
- 出生时辰选择（12时辰）
- 表单验证和提交

**关键组件集成**:
- Input组件（文本、日期、下拉选择）
- Selector组件（性别单选）
- Button组件（主要、次要按钮）
- Background组件

### 八字解析页面 ✅
**路径**: `src/pages/analysis/`
**文件**: analysis.html, analysis.css, analysis.js

**功能**:
- 状态1：已完成 - 显示八字详情 + Markdown解析
- 状态2：计算中 - 太极动画 + 轮询
- 状态3：未开始 - 开始计算按钮
- 四柱八字展示、日主信息、命卦信息、五行占比
- 轮询机制（3秒间隔）

**关键组件集成**:
- Card组件（详情卡片、Markdown卡片）
- Processing组件（太极动画）
- Markdown组件（解析内容渲染）
- Background组件

### 姻缘匹配页面 ✅
**路径**: `src/pages/match/`
**文件**: match.html, match.css, match.js

**功能**:
- 状态1：有结果 - Swiper推荐卡片 + Markdown理由
- 状态2：计算中 - 太极动画 + 轮询
- 状态3：无结果 - 去计算推荐按钮
- 推荐卡片翻页展示
- 重新计算功能

**关键组件集成**:
- Swiper组件（推荐卡片翻页）
- Card组件（推荐卡片、理由卡片）
- Processing组件（太极动画）
- Markdown组件（匹配理由渲染）
- Background组件

### 新建姻缘匹配页面 ✅
**路径**: `src/pages/new-match/`
**文件**: new-match.html, new-match.css, new-match.js

**功能**:
- 个性化要求输入（可选）
- 开始匹配按钮
- 返回按钮

**关键组件集成**:
- Input组件（文本域）
- Button组件
- Background组件

## 数据流设计

### Mock数据结构
```json
{
  "profiles": [
    {
      "id": "profile_xxx",
      "name": "用户_坎卦",
      "gender": "male/female",
      "birthDate": "ISO 8601",
      "bazi": {
        "yearPillar": { "stem": "庚", "branch": "午", "nayin": "路旁土" },
        "monthPillar": { "stem": "辛", "branch": "巳", "nayin": "白蜡金" },
        "dayPillar": { "stem": "甲", "branch": "寅", "nayin": "大溪水" },
        "hourPillar": { "stem": "壬", "branch": "申", "nayin": "剑锋金" }
      },
      "dayMaster": { "element": "wood", "stem": "甲", "isDayMaster": true },
      "mingua": {
        "number": 1,
        "name": "一白坎卦",
        "gua": "kan",
        "element": "water",
        "position": "east",
        "colorName": "白",
        "hsl": { "hue": 0, "saturation": 0, "lightness": 70 },
        "direction": "北"
      },
      "elementProportion": {
        "wood": { "percentage": 25, "isDayMaster": true },
        "fire": { "percentage": 15 },
        "earth": { "percentage": 30 },
        "metal": { "percentage": 20 },
        "water": { "percentage": 10 }
      },
      "isDefault": true/false,
      "analysisStatus": "COMPLETED/CALCULATING/NOT_STARTED",
      "analysisResult": "# Markdown内容",
      "matchStatus": "HAS_RESULTS/CALCULATING/NOT_STARTED",
      "matchResults": [
        {
          "id": "match_xxx",
          "name": "推荐对象1",
          "reason": "## Markdown理由"
        }
      ]
    }
  ]
}
```

### 页面跳转流程

```
首页 (home)
  ├─→ 八字详解按钮 → analysis.html?profileId=xxx
  ├─→ 姻缘匹配按钮 → match.html?profileId=xxx
  ├─→ 新建档案按钮 → new-bazi.html
  └─→ 删除档案 → 刷新页面

新建八字 (new-bazi)
  └─→ 创建成功 → home.html

八字解析 (analysis)
  ├─→ NOT_STARTED → 点击"开始计算" → CALCULATING → COMPLETED
  ├─→ CALCULATING → 轮询 → COMPLETED
  ├─→ COMPLETED → 显示完整内容
  └─→ 返回按钮 → home.html

姻缘匹配 (match)
  ├─→ NO_RESULTS → 点击"去计算推荐" → new-match.html
  ├─→ CALCULATING → 轮询 → HAS_RESULTS
  ├─→ HAS_RESULTS → 显示推荐 + 理由
  ├─→ 重新计算 → CALCULATING → HAS_RESULTS
  └─→ 返回按钮 → home.html

新建匹配 (new-match)
  └─→ 开始匹配 → match.html?status=calculating
```

## 组件依赖关系更新

```
Background组件 (无依赖)
    ↓
公共样式 + Token系统
    ↓
Card组件 ← 依赖: 背景、公共样式
    ↓
其他组件 ← Button, Input, Selector, Menu, Swiper, Markdown, Processing
    ↓
WuxingChart组件 ← 独立组件
    ↓
页面组装 ← 使用所有组件 + Mock数据
```

## 响应式断点总结

| 断点 | 屏幕宽度 | 布局特点 |
|------|----------|----------|
| 移动端 | < 480px | 单列布局，卡片垂直排列 |
| 小屏 | 480px - 767px | 单列布局，间距稍大 |
| 平板 | 768px - 1023px | 两列布局（首页PC模式） |
| PC | ≥ 1024px | 两列布局，五行图+卡片水平排列 |

## 主题系统

### 暗色主题 (默认)
- 金 → 白色 (#fafafa)
- 木 → 绿色 (#86efac)
- 水 → 蓝色 (#60a5fa)
- 火 → 红色 (#f87171)
- 土 → 黄色 (#fde047)

### 亮色主题
- 金 → 黑色 (#262626)
- 木 → 绿色 (#16a34a)
- 水 → 蓝色 (#2563eb)
- 火 → 红色 (#dc2626)
- 土 → 黄色 (#ca8a04)

## 性能优化要点

1. **SVG背景动画**: 使用原生SVG `<animate>` 元素，无需JavaScript
2. **Swiper懒加载**: 按需加载slide内容
3. **Markdown渲染**: 使用marked.js缓存机制
4. **CSS动画**: 使用 `transform` 和 `opacity`，GPU加速
5. **事件委托**: 动态元素使用事件委托减少监听器数量

## 浏览器测试清单

### 功能测试
- [ ] 所有页面正常加载
- [ ] Mock数据正确获取和显示
- [ ] 五行图动画流畅运行
- [ ] Swiper翻页正常工作
- [ ] 表单提交和验证正常
- [ ] 页面跳转正确传参
- [ ] 轮询逻辑正常触发
- [ ] Markdown内容正确渲染
- [ ] 主题切换正常工作
- [ ] 环形菜单展开/收起正常

### 视觉测试
- [ ] 暗色主题下所有元素可读
- [ ] 亮色主题下所有元素可读
- [ ] 玻璃效果正常显示
- [ ] 边缘发光效果正常
- [ ] 五行流动背景正常
- [ ] 命卦颜色正确显示
- [ ] 命卦图标正确加载
- [ ] 五行图节点大小正确

### 兼容性测试
- [ ] Chrome/Edge (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] 移动端 Chrome
- [ ] 移动端 Safari
