# 八字命理 - PC浏览器版本

这是八字命理小程序的PC浏览器版本，采用现代化的玻璃拟态设计风格，包含完整的动画效果和主题切换功能。

## 设计理念

- **整体基调**：简洁、神秘、现代融合传统
- **背景**：太极阴阳（黑白）渐变背景
- **元素**：五行元素代表色（金木水火土 → 白绿蓝红黄）
- **组件**：现代感的玻璃质感卡片与按钮
- **动效**：神秘感的光晕、五色按钮闪光、太极过渡动画

## 项目结构

```
glow-glass-design-pc-browser/
├── css/                          # 样式文件
│   ├── variables.css            # CSS变量定义（颜色、尺寸等）
│   ├── base.css                 # 基础样式重置
│   ├── background.css           # 背景光晕系统
│   ├── glass-card.css           # 玻璃质感卡片
│   ├── buttons.css              # 玻璃质感按钮
│   ├── theme.css                # 主题切换样式
│   ├── transitions.css          # 过渡动画样式
│   └── pages.css                # 页面特定样式
├── js/                           # JavaScript文件
│   ├── main.js                  # 主入口文件
│   ├── theme.js                 # 主题切换模块
│   ├── background.js            # 背景光晕动画
│   ├── transitions.js           # 过渡动画控制
│   ├── glass-card.js            # 玻璃卡片交互
│   ├── wuxing-chart.js          # 五行生克图组件
│   └── pages/                   # 页面脚本
│       ├── profile.js           # 档案页面
│       └── bazi-match.js        # 缘分匹配页面
├── pages/                        # HTML页面
│   ├── profile.html             # 命卦档案页
│   ├── bazi-detail.html         # 八字详情页
│   ├── bazi-analysis.html       # 命盘分析页
│   └── bazi-match.html          # 缘分匹配页
└── index.html                    # 主页
```

## 核心功能

### 1. 背景光晕系统
- 5个旋转的光晕，代表五行元素
- 随机运动轨迹，营造神秘氛围
- 边缘高光效果，光晕靠近屏幕边缘时显示

### 2. 玻璃质感组件
- 玻璃卡片：半透明、模糊背景、边框光泽
- 玻璃按钮：五色辉光效果（金木水火土）
- 鼠标跟随辉光效果

### 3. 五行生克图
- SVG绘制的动态图表
- 端点缓慢移动，营造动感
- 日主标记（星星环绕）
- 相生相克关系连线

### 4. 主题切换
- 深色主题（默认）
- 浅色主题
- 自动保存用户偏好
- 平滑过渡效果

### 5. 过渡动画
- 太极汇聚动画（长时间加载时使用）
- 五行小点加载动画（组件加载时使用）

## 使用方法

### 直接打开
直接用浏览器打开 `index.html` 即可查看。

### 本地服务器
推荐使用本地服务器运行，以避免某些浏览器的跨域限制：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 技术特点

### 模块化设计
- CSS按功能分离，便于维护
- JavaScript采用ES6模块化
- 组件可复用（如五行生克图、玻璃卡片）

### 性能优化
- 使用 `requestAnimationFrame` 实现流畅动画
- CSS变量统一管理，便于主题切换
- 事件委托减少监听器数量

### 响应式设计
- 适配桌面和移动端
- 使用 `clamp()` 实现流畅的字体缩放
- Grid和Flex布局自适应

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要支持以下特性：
  - CSS自定义属性（变量）
  - Backdrop Filter（玻璃效果）
  - ES6模块
  - SVG

## 自定义配置

### 修改颜色
编辑 `css/variables.css` 中的CSS变量：

```css
:root {
    /* 修改五行颜色 */
    --wood-color: rgba(76, 175, 80, 0.9);
    --fire-color: rgba(244, 67, 54, 0.9);
    /* ... */
}
```

### 修改动画速度
编辑 `js/background.js`：

```javascript
this.rotationSpeed = 0.008; // 旋转速度
this.orbitRadius = 160;     // 旋转半径
```

### 修改五行数据
编辑对应页面的JS文件，修改 `elementPercentages`：

```javascript
const chart1 = new WuxingChart('chart1', {
    elementPercentages: {
        wood: 35,
        fire: 20,
        earth: 15,
        metal: 15,
        water: 15
    },
    dayMaster: 'wood'
});
```

## 注意事项

1. **不要使用emoji**：所有图标都使用SVG
2. **保持玻璃质感**：所有卡片和按钮都应有玻璃效果
3. **五色辉光**：按钮点击时需要五色光效
4. **背景一致性**：所有页面都需要背景光晕效果
5. **主题适配**：新增组件需要同时适配深浅两种主题

## 后续开发建议

1. 添加更多页面（如输入表单页、设置页等）
2. 接入后端API，实现真实的八字计算
3. 添加用户登录和数据保存功能
4. 优化移动端交互体验
5. 添加更多动画效果和微交互

## 许可证

本项目为设计展示项目，仅供学习参考使用。
