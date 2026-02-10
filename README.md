# 八字命理小程序 - 组件化设计

## 项目结构

```
bazi-front-design/
├── README.md                    # 项目说明
├── PLAN.md                      # 设计流程说明
├── 01-项目规划.md               # 功能、页面结构
├── 02-设计系统规范.md           # 完整设计Token
├── 03-组件清单.md               # 23个组件列表
├── 04-背景与布局设计.md         # 布局系统设计文档
│
├── background/                  # 背景组件
│   └── background.html         # 可交互原型
│
├── components/
│   ├── base/                   # 原子级基础组件
│   │   ├── button.html
│   │   ├── input.html
│   │   ├── tag.html
│   │   └── ...
│   │
│   ├── business/               # 业务组件
│   │   ├── destiny-plate.html      # 八字命盘
│   │   ├── five-elements.html      # 五行分析
│   │   ├── yearly-fortune.html     # 流年运势
│   │   └── ...
│   │
│   └── layout/                 # 布局组件
│       ├── navbar.html
│       ├── tabbar.html
│       └── ...
```

## 设计理念

**Mystical Zen（禅意神秘）**
- 东方神秘主义 + 数字禅意
- 五行流光特效（唯一识别点）
- 简洁现代 + 神秘氛围

## 快速开始

### 查看背景效果
```bash
open background/background.html
```

### 设计系统
详见 `02-设计系统规范.md`

### 组件清单
详见 `03-组件清单.md`

## 下一步

按顺序设计组件：
1. ✅ 背景
2. ⏭️ 基础组件（按钮、输入框、标签）
3. ⏭️ 布局组件（导航、TabBar）
4. ⏭️ 业务组件（命盘、五行分析、流年运势）
