# 八字小程序设计系统 - 颜色主题清单

本文档列出了八字小程序中所有需要统一使用的颜色定义，包括五行颜色和九种命卦颜色。

## 使用说明

在组装页面时，请直接引用本文档中定义的颜色变量或具体颜色值，以确保整个应用的视觉主题统一。

---

## 一、五行颜色系统

### 1.1 五行主色调（暗色主题）

| 五行 | 元素 | 颜色名称 | CSS 变量 | HSL 值 | RGB 值 |
|------|------|----------|----------|---------|--------|
| **木** | Wood | 绿色 | `--wood-primary` | hsl(142, 74%, 65%) | `#86efac` |
| **火** | Fire | 红色 | `--fire-primary` | hsl(1, 81%, 68%) | `#f87171` |
| **土** | Earth | 黄色 | `--earth-primary` | hsl(50, 98%, 64%) | `#fde047` |
| **金** | Metal | 白色 | `--metal-primary` | hsl(0, 0%, 98%) | `#fafafa` |
| **水** | Water | 蓝色 | `--water-primary` | hsl(217, 92%, 68%) | `#60a5fa` |

### 1.2 五行主色调（亮色主题）

| 五行 | 元素 | 颜色名称 | CSS 变量 | HSL 值 | RGB 值 |
|------|------|----------|----------|---------|--------|
| **木** | Wood | 深绿色 | `--wood-primary` | hsl(142, 76%, 36%) | `#16a34a` |
| **火** | Fire | 深红色 | `--fire-primary` | hsl(2, 76%, 48%) | `#dc2626` |
| **土** | Earth | 深黄色 | `--earth-primary` | hsl(43, 96%, 41%) | `#ca8a04` |
| **金** | Metal | 深灰色 | `--metal-primary` | hsl(0, 0%, 15%) | `#262626` |
| **水** | Water | 深蓝色 | `--water-primary` | hsl(221, 83%, 53%) | `#2563eb` |

### 1.3 五行次要颜色

用于半透明背景、边框等场景：

```css
/* 暗色主题 */
--wood-secondary: rgba(134, 239, 172, 0.2);
--wood-glow: rgba(134, 239, 172, 0.4);

--fire-secondary: rgba(248, 113, 113, 0.2);
--fire-glow: rgba(248, 113, 113, 0.4);

--earth-secondary: rgba(253, 224, 71, 0.2);
--earth-glow: rgba(253, 224, 71, 0.4);

--metal-secondary: rgba(250, 250, 250, 0.2);
--metal-glow: rgba(250, 250, 250, 0.4);

--water-secondary: rgba(96, 165, 250, 0.2);
--water-glow: rgba(96, 165, 250, 0.4);
```

---

## 二、九种命卦颜色系统

九星命卦根据出生年份和性别计算，每种命卦都有对应的颜色主题。

### 2.1 命卦颜色定义（使用 HSL 色彩空间）

| 命卦 | 卦名 | 五行 | 颜色 | Hue | Saturation | Lightness | RGB 近似值 |
|------|------|------|------|-----|------------|-----------|-----------|
| **一白坎卦** | 坎 | 水 | 白色 | 0° | 0% | 70% | `#b3b3b3` |
| **二黑坤卦** | 坤 | 土 | 黑色 | 0° | 0% | 30% | `#4d4d4d` |
| **三碧震卦** | 震 | 木 | 蓝绿色 | 200° | 75% | 55% | `#22d3ee` |
| **四绿巽卦** | 巽 | 木 | 绿色 | 120° | 70% | 50% | `#4ade80` |
| **五黄中卦** | 中 | 土 | 黄色 | 45° | 90% | 55% | `#facc15` |
| **六白乾卦** | 乾 | 金 | 白色 | 0° | 0% | 70% | `#b3b3b3` |
| **七赤兑卦** | 兑 | 金 | 赤色 | 0° | 80% | 60% | `#f87171` |
| **八白艮卦** | 艮 | 土 | 白色 | 0° | 0% | 85% | `#d9d9d9` |
| **九紫离卦** | 离 | 火 | 紫色 | 275° | 80% | 60% | `#c084fc` |

### 2.2 CSS 使用示例

```css
/* 为不同命卦的卡片设置主题色 */
.profile-card[data-star="1"] {
  --theme-hue: 0;
  --theme-saturation: 0;
  --theme-lightness: 70;
}

.profile-card[data-star="2"] {
  --theme-hue: 0;
  --theme-saturation: 0;
  --theme-lightness: 30;
}

.profile-card[data-star="3"] {
  --theme-hue: 200;
  --theme-saturation: 75;
  --theme-lightness: 55;
}

.profile-card[data-star="4"] {
  --theme-hue: 120;
  --theme-saturation: 70;
  --theme-lightness: 50;
}

.profile-card[data-star="5"] {
  --theme-hue: 45;
  --theme-saturation: 90;
  --theme-lightness: 55;
}

.profile-card[data-star="6"] {
  --theme-hue: 0;
  --theme-saturation: 0;
  --theme-lightness: 70;
}

.profile-card[data-star="7"] {
  --theme-hue: 0;
  --theme-saturation: 80;
  --theme-lightness: 60;
}

.profile-card[data-star="8"] {
  --theme-hue: 0;
  --theme-saturation: 0;
  --theme-lightness: 85;
}

.profile-card[data-star="9"] {
  --theme-hue: 275;
  --theme-saturation: 80;
  --theme-lightness: 60;
}

/* 使用 HSL 颜色 */
.card-glow {
  background: hsl(
    var(--theme-hue),
    calc(var(--theme-saturation) * 1%),
    calc(var(--theme-lightness) * 1%)
  );
}
```

---

## 三、通用主题颜色

### 3.1 暗色主题

```css
/* 背景色 */
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--bg-tertiary: #141414;
--bg-overlay: rgba(0, 0, 0, 0.6);

/* 文字色 */
--text-primary: #fafafa;      /* 主要文字 */
--text-secondary: #a3a3a3;    /* 次要文字 */
--text-tertiary: #737373;     /* 辅助文字 */
--text-disabled: #525252;     /* 禁用文字 */

/* 玻璃效果 */
--glass-bg: rgba(20, 20, 20, 0.6);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-shadow: rgba(0, 0, 0, 0.3);

/* 边框 */
--border-default: rgba(255, 255, 255, 0.1);
--border-hover: rgba(255, 255, 255, 0.2);
```

### 3.2 亮色主题

```css
/* 背景色 */
--bg-primary: #fafafa;
--bg-secondary: #f5f5f5;
--bg-tertiary: #e5e5e5;
--bg-overlay: rgba(0, 0, 0, 0.4);

/* 文字色 */
--text-primary: #171717;
--text-secondary: #525252;
--text-tertiary: #737373;
--text-disabled: #a3a3a3;

/* 玻璃效果 */
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(0, 0, 0, 0.1);
--glass-shadow: rgba(0, 0, 0, 0.1);

/* 边框 */
--border-default: rgba(0, 0, 0, 0.1);
--border-hover: rgba(0, 0, 0, 0.2);
```

---

## 四、颜色使用指南

### 4.1 五行颜色使用场景

- **个人八字卡片**：根据日主（日干）的五行属性设置主题色
- **五行生克图**：显示五行相生相克关系时使用对应颜色
- **缘分匹配**：显示双方五行属性时使用对应颜色

### 4.2 命卦颜色使用场景

- **命卦卡片**：根据用户命卦（一白到九紫）设置卡片主题色
- **方位提示**：显示命卦对应的方位信息
- **吉凶展示**：根据命卦显示不同颜色的提示信息

### 4.3 颜色适配原则

1. **暗色主题**：使用更亮、更饱和的颜色
2. **亮色主题**：使用更深、对比度更高的颜色
3. **可访问性**：确保文字与背景对比度至少为 4.5:1（WCAG AA 标准）
4. **一致性**：相同含义的内容在整个应用中使用相同颜色

---

## 五、快速参考

### 5.1 五行快速查找

```
木 → #86efac（暗色）/ #16a34a（亮色）
火 → #f87171（暗色）/ #dc2626（亮色）
土 → #fde047（暗色）/ #ca8a04（亮色）
金 → #fafafa（暗色）/ #262626（亮色）
水 → #60a5fa（暗色）/ #2563eb（亮色）
```

### 5.2 命卦快速查找

```
1 一白坎 → hsl(0, 0%, 70%) → 白灰色
2 二黑坤 → hsl(0, 0%, 30%) → 深灰色
3 三碧震 → hsl(200, 75%, 55%) → 蓝绿色
4 四绿巽 → hsl(120, 70%, 50%) → 绿色
5 五黄中 → hsl(45, 90%, 55%) → 黄色
6 六白乾 → hsl(0, 0%, 70%) → 白灰色
7 七赤兑 → hsl(0, 80%, 60%) → 赤红色
8 八白艮 → hsl(0, 0%, 85%) → 浅灰色
9 九紫离 → hsl(275, 80%, 60%) → 紫色
```

---

## 更新记录

- 2026-04-11: 创建初始文档，整理五行和命卦颜色定义

---

**注意**：本文档应与 `style/tokens.css` 保持同步。如有颜色更新，请同步更新两个文件。
