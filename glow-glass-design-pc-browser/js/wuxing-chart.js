/**
 * 五行生克图组件
 * 负责渲染五行生克图的动画效果
 */

class WuxingChart {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        // 配置
        this.config = {
            centerX: 300,
            centerY: 300,
            radius: 90,
            elementPercentages: options.elementPercentages || {
                wood: 20,
                fire: 20,
                earth: 20,
                metal: 20,
                water: 20
            },
            dayMaster: options.dayMaster || null, // 'wood', 'fire', 'earth', 'metal', 'water'
            size: options.size || 600
        };

        // 五行元素配置
        this.elements = [
            { id: 'wood', name: '木', color: 'rgba(76, 175, 80, 0.9)', borderColor: '#4CAF50', angle: 198 },
            { id: 'fire', name: '火', color: 'rgba(244, 67, 54, 0.9)', borderColor: '#F44336', angle: 270 },
            { id: 'earth', name: '土', color: 'rgba(255, 193, 7, 0.9)', borderColor: '#FFC107', angle: 342 },
            { id: 'metal', name: '金', color: 'rgba(255, 255, 255, 0.9)', borderColor: '#FFFFFF', angle: 54 },
            { id: 'water', name: '水', color: 'rgba(33, 150, 243, 0.9)', borderColor: '#2196F3', angle: 126 }
        ];

        // 连线配置
        this.connections = [
            // 相生关系
            { from: 0, to: 1, dashed: false }, // 木生火
            { from: 1, to: 2, dashed: false }, // 火生土
            { from: 2, to: 3, dashed: false }, // 土生金
            { from: 3, to: 4, dashed: false }, // 金生水
            { from: 4, to: 0, dashed: false }, // 水生木
            // 相克关系
            { from: 0, to: 2, dashed: true },  // 木克土
            { from: 2, to: 4, dashed: true },  // 土克水
            { from: 4, to: 1, dashed: true },  // 水克火
            { from: 1, to: 3, dashed: true },  // 火克金
            { from: 3, to: 0, dashed: true }   // 金克木
        ];

        this.elementPositions = [];
        this.connectionLines = [];
        this.glowElements = [];
        this.glassBgElements = [];
        this.labelElements = [];
        this.dayMasterStar = null;
        this.dayMasterIndex = -1;
        this.starRotationAngle = 0;
        this.animationFrameId = null;

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.createSVG();
        this.calculatePositions();
        this.drawConnections();
        this.drawElements();
        this.startAnimation();
    }

    /**
     * 创建SVG容器
     */
    createSVG() {
        this.container.innerHTML = '';
        this.container.style.width = `${this.config.size}px`;
        this.container.style.height = `${this.config.size}px`;
        this.container.style.position = 'relative';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'wuxing-chart-svg');
        svg.setAttribute('viewBox', `0 0 ${this.config.size} ${this.config.size}`);
        svg.style.width = '100%';
        svg.style.height = '100%';

        // 添加滤镜定义
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glass-text" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
                <feFlood flood-color="rgba(255,255,255,0.5)" result="glowColor"/>
                <feComposite in="glowColor" in2="offsetBlur" operator="in" result="softGlow"/>
                <feMerge>
                    <feMergeNode in="softGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        `;
        svg.appendChild(defs);

        this.container.appendChild(svg);
        this.svg = svg;
    }

    /**
     * 计算元素位置
     */
    calculatePositions() {
        this.elementPositions = this.elements.map(el => {
            const percentage = this.config.elementPercentages[el.id] || 20;
            return {
                x: this.config.centerX + this.config.radius * Math.cos(el.angle * Math.PI / 180),
                y: this.config.centerY + this.config.radius * Math.sin(el.angle * Math.PI / 180),
                r: this.getCircleRadius(percentage),
                baseX: this.config.centerX + this.config.radius * Math.cos(el.angle * Math.PI / 180),
                baseY: this.config.centerY + this.config.radius * Math.sin(el.angle * Math.PI / 180),
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                speedX: 0.0005 + Math.random() * 0.0005,
                speedY: 0.0005 + Math.random() * 0.0005,
                rangeX: 3 + Math.random() * 3,
                rangeY: 3 + Math.random() * 3,
                time: 0,
                ...el,
                isDayMaster: el.id === this.config.dayMaster
            };
        });
    }

    /**
     * 根据百分比计算圆的半径
     */
    getCircleRadius(percentage) {
        return 20 + percentage * 0.7;
    }

    /**
     * 绘制连线
     */
    drawConnections() {
        this.connections.forEach(conn => {
            const from = this.elementPositions[conn.from];
            const to = this.elementPositions[conn.to];

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke-width', conn.dashed ? '1.5' : '2');
            line.setAttribute('class', 'connection-line');

            if (conn.dashed) {
                line.setAttribute('stroke-dasharray', '5,5');
            }

            this.svg.appendChild(line);
            this.connectionLines.push(line);
        });
    }

    /**
     * 绘制元素
     */
    drawElements() {
        this.elementPositions.forEach((pos, index) => {
            if (pos.isDayMaster) {
                this.dayMasterIndex = index;
            }

            // 光晕
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glow.setAttribute('cx', pos.x);
            glow.setAttribute('cy', pos.y);
            glow.setAttribute('r', pos.r);
            glow.setAttribute('fill', pos.color);
            glow.setAttribute('class', 'element-circle-glow');
            this.svg.appendChild(glow);
            this.glowElements.push(glow);

            // 玻璃背景
            const glassBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glassBg.setAttribute('cx', pos.x);
            glassBg.setAttribute('cy', pos.y);
            glassBg.setAttribute('r', pos.r);
            glassBg.setAttribute('class', 'element-circle-glass-bg');
            this.svg.appendChild(glassBg);
            this.glassBgElements.push(glassBg);

            // 标签
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y);
            label.setAttribute('class', 'element-label');

            const nameSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            nameSpan.setAttribute('x', pos.x);
            nameSpan.setAttribute('dy', '-0.6em');
            nameSpan.textContent = pos.name;
            label.appendChild(nameSpan);

            const percentSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            percentSpan.setAttribute('x', pos.x);
            percentSpan.setAttribute('dy', '1.4em');
            percentSpan.textContent = `${this.config.elementPercentages[pos.id]}%`;
            label.appendChild(percentSpan);

            this.svg.appendChild(label);
            this.labelElements.push(label);

            // 日主星星
            if (pos.isDayMaster) {
                this.createDayMasterStar(pos);
            }
        });
    }

    /**
     * 创建日主星星标记
     */
    createDayMasterStar(pos) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const starOffset = pos.r - 2;
        const starX = pos.x + starOffset;
        const starY = pos.y - starOffset;
        const starSize = 6;

        const starPoints = [];
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * 72 - 90) * Math.PI / 180;
            const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
            starPoints.push(`${starX + starSize * Math.cos(outerAngle)},${starY + starSize * Math.sin(outerAngle)}`);
            starPoints.push(`${starX + starSize * 0.4 * Math.cos(innerAngle)},${starY + starSize * 0.4 * Math.sin(innerAngle)}`);
        }

        star.setAttribute('points', starPoints.join(' '));
        star.setAttribute('class', 'daymaster-star');
        this.svg.appendChild(star);
        this.dayMasterStar = star;
    }

    /**
     * 动画循环
     */
    animate = () => {
        // 更新元素位置
        this.elementPositions.forEach((pos, index) => {
            pos.time += 16;

            const offsetX = Math.sin(pos.phaseX + pos.time * pos.speedX) * pos.rangeX;
            const offsetY = Math.cos(pos.phaseY + pos.time * pos.speedY) * pos.rangeY;

            const newX = pos.baseX + offsetX;
            const newY = pos.baseY + offsetY;

            this.glowElements[index].setAttribute('cx', newX);
            this.glowElements[index].setAttribute('cy', newY);

            this.glassBgElements[index].setAttribute('cx', newX);
            this.glassBgElements[index].setAttribute('cy', newY);

            this.labelElements[index].setAttribute('x', newX);
            this.labelElements[index].setAttribute('y', newY);

            const tspans = this.labelElements[index].querySelectorAll('tspan');
            if (tspans.length >= 2) {
                tspans[0].setAttribute('x', newX);
                tspans[1].setAttribute('x', newX);
            }
        });

        // 更新日主星星
        if (this.dayMasterIndex >= 0 && this.dayMasterStar) {
            this.updateDayMasterStar();
        }

        // 更新连线
        this.updateConnections();

        this.animationFrameId = requestAnimationFrame(this.animate);
    }

    /**
     * 更新日主星星位置
     */
    updateDayMasterStar() {
        const dayMasterPos = this.elementPositions[this.dayMasterIndex];
        const dmOffsetX = Math.sin(dayMasterPos.phaseX + dayMasterPos.time * dayMasterPos.speedX) * dayMasterPos.rangeX;
        const dmOffsetY = Math.cos(dayMasterPos.phaseY + dayMasterPos.time * dayMasterPos.speedY) * dayMasterPos.rangeY;
        const dmNewX = dayMasterPos.baseX + dmOffsetX;
        const dmNewY = dayMasterPos.baseY + dmOffsetY;

        this.starRotationAngle += 0.008;

        const starOrbitRadius = dayMasterPos.r + 3;
        const starX = dmNewX + starOrbitRadius * Math.cos(this.starRotationAngle);
        const starY = dmNewY + starOrbitRadius * Math.sin(this.starRotationAngle);
        const starSize = 6;

        const starPoints = [];
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * 72 - 90 + this.starRotationAngle * 180 / Math.PI) * Math.PI / 180;
            const innerAngle = ((i * 72) + 36 - 90 + this.starRotationAngle * 180 / Math.PI) * Math.PI / 180;
            starPoints.push(`${starX + starSize * Math.cos(outerAngle)},${starY + starSize * Math.sin(outerAngle)}`);
            starPoints.push(`${starX + starSize * 0.4 * Math.cos(innerAngle)},${starY + starSize * 0.4 * Math.sin(innerAngle)}`);
        }

        this.dayMasterStar.setAttribute('points', starPoints.join(' '));
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

            this.connectionLines[index].setAttribute('x1', fromX);
            this.connectionLines[index].setAttribute('y1', fromY);
            this.connectionLines[index].setAttribute('x2', toX);
            this.connectionLines[index].setAttribute('y2', toY);
        });
    }

    /**
     * 开始动画
     */
    startAnimation() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }

    /**
     * 停止动画
     */
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 销毁
     */
    destroy() {
        this.stopAnimation();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default WuxingChart;
