/**
 * 五行生克图组件
 * Wuxing Chart Component
 *
 * 功能：
 * - 显示五行生克关系图
 * - 节点大小根据占比动态调整
 * - 日主元素有旋转星星
 * - 节点随机飘动
 * - 连接线显示生克关系
 */

class WuxingChart {
  /**
   * 构造函数
   * @param {string} svgId - SVG元素的ID
   * @param {Object} elementProportion - 五行占比数据
   * @param {string} dayMasterElement - 日主元素 (wood/fire/earth/metal/water)
   */
  constructor(svgId, elementProportion, dayMasterElement) {
    this.svg = document.getElementById(svgId);
    if (!this.svg) {
      console.error(`SVG element with id "${svgId}" not found`);
      return;
    }

    // 五行元素数据
    this.elements = [
      {
        id: 'wood',
        name: '木',
        color: '#86efac',
        borderColor: 'rgba(134, 239, 172, 0.8)',
        angle: 198, // 从顶部开始顺时针
        percentage: elementProportion.wood.percentage,
        isDayMaster: elementProportion.wood.isDayMaster || false
      },
      {
        id: 'fire',
        name: '火',
        color: '#f87171',
        borderColor: 'rgba(248, 113, 113, 0.8)',
        angle: 270,
        percentage: elementProportion.fire.percentage,
        isDayMaster: elementProportion.fire.isDayMaster || false
      },
      {
        id: 'earth',
        name: '土',
        color: '#fde047',
        borderColor: 'rgba(253, 224, 71, 0.8)',
        angle: 342,
        percentage: elementProportion.earth.percentage,
        isDayMaster: elementProportion.earth.isDayMaster || false
      },
      {
        id: 'metal',
        name: '金',
        color: 'hsl(0, 0%, 90%)',
        borderColor: 'hsla(0, 0%, 90%, 0.8)',
        angle: 54,
        percentage: elementProportion.metal.percentage,
        isDayMaster: elementProportion.metal.isDayMaster || false
      },
      {
        id: 'water',
        name: '水',
        color: '#60a5fa',
        borderColor: 'rgba(96, 165, 250, 0.8)',
        angle: 126,
        percentage: elementProportion.water.percentage,
        isDayMaster: elementProportion.water.isDayMaster || false
      }
    ];

    // 连线配置
    this.connections = [
      // 相生关系（顺时针）
      { from: 0, to: 1, type: 'sheng' }, // 木→火
      { from: 1, to: 2, type: 'sheng' }, // 火→土
      { from: 2, to: 3, type: 'sheng' }, // 土→金
      { from: 3, to: 4, type: 'sheng' }, // 金→水
      { from: 4, to: 0, type: 'sheng' }, // 水→木

      // 相克关系（隔一个）
      { from: 0, to: 2, type: 'ke' },   // 木→土
      { from: 2, to: 4, type: 'ke' },   // 土→水
      { from: 4, to: 1, type: 'ke' },   // 水→火
      { from: 1, to: 3, type: 'ke' },   // 火→金
      { from: 3, to: 0, type: 'ke' }    // 金→木
    ];

    // 布局参数
    this.centerX = 300;
    this.centerY = 300;
    this.radius = 90;

    // 存储元素状态
    this.elementStates = [];
    this.glowElements = [];
    this.glassBgElements = [];
    this.labelElements = [];
    this.percentElements = [];
    this.lineElements = [];
    this.starElement = null;
    this.starAngle = 0;
    this.animationId = null;

    this.init();
  }

  /**
   * 初始化图表
   */
  init() {
    // 清空SVG
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // 添加滤镜定义
    this.addDefs();

    // 计算元素位置
    this.calculateElementPositions();

    // 绘制连线
    this.drawConnections();

    // 绘制元素
    this.drawElements();

    // 启动动画
    this.startAnimation();
  }

  /**
   * 添加SVG滤镜定义
   */
  addDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '4');
    blur.setAttribute('result', 'coloredBlur');

    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const mergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mergeNode1.setAttribute('in', 'coloredBlur');
    const mergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mergeNode2.setAttribute('in', 'SourceGraphic');

    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    this.svg.appendChild(defs);
  }

  /**
   * 计算元素位置
   */
  calculateElementPositions() {
    this.elements.forEach((el) => {
      const x = this.centerX + this.radius * Math.cos(el.angle * Math.PI / 180);
      const y = this.centerY + this.radius * Math.sin(el.angle * Math.PI / 180);
      const r = this.getCircleRadius(el.percentage);

      this.elementStates.push({
        ...el,
        x, y, r,
        baseX: x,
        baseY: y,
        // 动画参数
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.001 + Math.random() * 0.001,
        speedY: 0.001 + Math.random() * 0.001,
        rangeX: 5 + Math.random() * 3,
        rangeY: 5 + Math.random() * 3,
        time: Math.random() * 10000
      });
    });
  }

  /**
   * 根据百分比计算圆的半径
   */
  getCircleRadius(percentage) {
    return 25 + percentage * 0.6;
  }

  /**
   * 绘制连线
   */
  drawConnections() {
    this.connections.forEach((conn) => {
      const from = this.elementStates[conn.from];
      const to = this.elementStates[conn.to];

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.setAttribute('class', `connection-line ${conn.type}`);
      this.svg.appendChild(line);
      this.lineElements.push(line);
    });
  }

  /**
   * 绘制元素
   */
  drawElements() {
    this.elementStates.forEach((state) => {
      // 光晕
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('cx', state.x);
      glow.setAttribute('cy', state.y);
      glow.setAttribute('r', state.r);
      glow.setAttribute('fill', state.color);
      glow.setAttribute('class', 'element-glow');
      this.svg.appendChild(glow);
      this.glowElements.push(glow);

      // 玻璃背景
      const glassBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glassBg.setAttribute('cx', state.x);
      glassBg.setAttribute('cy', state.y);
      glassBg.setAttribute('r', state.r);
      glassBg.setAttribute('class', 'element-glass-bg');
      this.svg.appendChild(glassBg);
      this.glassBgElements.push(glassBg);

      // 元素名称
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', state.x);
      label.setAttribute('y', state.y);
      label.setAttribute('class', 'element-label');
      label.textContent = state.name;
      this.svg.appendChild(label);
      this.labelElements.push(label);

      // 百分比
      const percent = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      percent.setAttribute('x', state.x);
      percent.setAttribute('y', state.y);
      percent.setAttribute('dy', '1.2em');
      percent.setAttribute('class', 'element-percent');
      percent.textContent = `${state.percentage}%`;
      this.svg.appendChild(percent);
      this.percentElements.push(percent);

      // 日主星星
      if (state.isDayMaster) {
        this.createDayMasterStar(state);
      }
    });
  }

  /**
   * 创建日主星星
   */
  createDayMasterStar(state) {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const starSize = 8;

    const points = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * Math.PI / 180;
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
      points.push(`${starSize * Math.cos(outerAngle)},${starSize * Math.sin(outerAngle)}`);
      points.push(`${starSize * 0.4 * Math.cos(innerAngle)},${starSize * 0.4 * Math.sin(innerAngle)}`);
    }

    star.setAttribute('points', points.join(' '));
    star.setAttribute('class', 'daymaster-star');
    this.svg.appendChild(star);
    this.starElement = star;
  }

  /**
   * 启动动画循环
   */
  startAnimation() {
    const animate = () => {
      this.updateElements();
      this.updateConnections();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * 更新元素位置
   */
  updateElements() {
    this.elementStates.forEach((state, index) => {
      // 更新时间
      state.time += 16;

      // 使用正弦波计算轻微浮动
      const offsetX = Math.sin(state.phaseX + state.time * state.speedX) * state.rangeX;
      const offsetY = Math.cos(state.phaseY + state.time * state.speedY) * state.rangeY;

      const newX = state.baseX + offsetX;
      const newY = state.baseY + offsetY;

      // 更新光晕
      this.glowElements[index].setAttribute('cx', newX);
      this.glowElements[index].setAttribute('cy', newY);

      // 更新玻璃背景
      this.glassBgElements[index].setAttribute('cx', newX);
      this.glassBgElements[index].setAttribute('cy', newY);

      // 更新标签
      this.labelElements[index].setAttribute('x', newX);
      this.labelElements[index].setAttribute('y', newY);
      this.percentElements[index].setAttribute('x', newX);
      this.percentElements[index].setAttribute('y', newY);

      // 更新日主星星位置和旋转
      if (state.isDayMaster && this.starElement) {
        this.updateDayMasterStar(newX, newY, state.r);
      }
    });
  }

  /**
   * 更新日主星星
   */
  updateDayMasterStar(x, y, radius) {
    // 更新星星旋转角度（每帧增加1度）
    this.starAngle += 1;

    // 计算星星在圆圈边缘的位置
    const starOffset = radius + 6;
    const starX = x + starOffset * Math.cos(this.starAngle * Math.PI / 180);
    const starY = y + starOffset * Math.sin(this.starAngle * Math.PI / 180);

    // 计算星星的点
    const starSize = 8;
    const points = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * Math.PI / 180;
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
      points.push(`${starX + starSize * Math.cos(outerAngle)},${starY + starSize * Math.sin(outerAngle)}`);
      points.push(`${starX + starSize * 0.4 * Math.cos(innerAngle)},${starY + starSize * 0.4 * Math.sin(innerAngle)}`);
    }

    this.starElement.setAttribute('points', points.join(' '));
  }

  /**
   * 更新连线
   */
  updateConnections() {
    this.connections.forEach((conn, index) => {
      const fromX = parseFloat(this.glowElements[conn.from].getAttribute('cx'));
      const fromY = parseFloat(this.glowElements[conn.from].getAttribute('cy'));
      const toX = parseFloat(this.glowElements[conn.to].getAttribute('cx'));
      const toY = parseFloat(this.glowElements[conn.to].getAttribute('cy'));

      this.lineElements[index].setAttribute('x1', fromX);
      this.lineElements[index].setAttribute('y1', fromY);
      this.lineElements[index].setAttribute('x2', toX);
      this.lineElements[index].setAttribute('y2', toY);
    });
  }

  /**
   * 销毁图表
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.elementStates = [];
    this.glowElements = [];
    this.glassBgElements = [];
    this.labelElements = [];
    this.percentElements = [];
    this.lineElements = [];
    this.starElement = null;
  }
}

// 导出为全局变量
window.WuxingChart = WuxingChart;
