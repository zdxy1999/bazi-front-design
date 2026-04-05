/**
 * 背景光晕动画模块
 * 负责处理5个旋转光晕的动画和边缘高光效果
 */

class BackgroundAnimation {
    constructor() {
        this.orbitRadius = 160;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.008;
        this.centerMoveSpeed = 0.002;
        this.centerAngle = 0;
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.centerTargetX = this.centerX;
        this.centerTargetY = this.centerY;
        this.animationFrameId = null;
        this.maxDistance = 300;

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.start();
        this.bindResize();
    }

    /**
     * 绑定窗口大小改变事件
     */
    bindResize() {
        window.addEventListener('resize', () => {
            this.centerX = window.innerWidth / 2;
            this.centerY = window.innerHeight / 2;
            this.centerTargetX = this.centerX;
            this.centerTargetY = this.centerY;
        });
    }

    /**
     * 更新随机运动中心点的位置
     */
    updateRandomCenter() {
        this.centerAngle += this.centerMoveSpeed;

        const maxRangeX = window.innerWidth * 0.4;
        const maxRangeY = window.innerHeight * 0.4;

        this.centerTargetX = window.innerWidth / 2 +
            Math.sin(this.centerAngle) * maxRangeX +
            Math.sin(this.centerAngle * 0.7) * (maxRangeX * 0.5);
        this.centerTargetY = window.innerHeight / 2 +
            Math.cos(this.centerAngle * 0.8) * maxRangeY +
            Math.cos(this.centerAngle * 1.3) * (maxRangeY * 0.5);

        this.centerX += (this.centerTargetX - this.centerX) * 0.01;
        this.centerY += (this.centerTargetY - this.centerY) * 0.01;
    }

    /**
     * 更新旋转光晕的位置
     */
    updateOrbitingGlows() {
        const glows = document.querySelectorAll('.orbiting-glow');

        glows.forEach((glow, index) => {
            const angle = this.rotationAngle + (index * Math.PI * 2 / 5);
            const offsetX = Math.cos(angle) * this.orbitRadius;
            const offsetY = Math.sin(angle) * this.orbitRadius;

            const glowWidth = parseFloat(getComputedStyle(glow).width);
            const glowHeight = parseFloat(getComputedStyle(glow).height);

            glow.style.left = `${this.centerX + offsetX - glowWidth / 2}px`;
            glow.style.top = `${this.centerY + offsetY - glowHeight / 2}px`;
        });
    }

    /**
     * 更新边缘高光
     */
    updateEdgeHighlight() {
        const glows = document.querySelectorAll('.orbiting-glow');
        const container = document.querySelector('.background-container');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();

        glows.forEach((glow, index) => {
            const rect = glow.getBoundingClientRect();
            const glowCenterX = rect.left + rect.width / 2;
            const glowCenterY = rect.top + rect.height / 2;

            const distToLeft = glowCenterX - containerRect.left;
            const distToRight = containerRect.right - glowCenterX;
            const distToTop = glowCenterY - containerRect.top;
            const distToBottom = containerRect.bottom - glowCenterY;

            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

            let edgeOpacity = Math.max(0, 1 - (minDist / this.maxDistance));
            edgeOpacity = edgeOpacity * edgeOpacity;
            edgeOpacity = Math.min(3, edgeOpacity);

            if (document.body.classList.contains('light-theme')) {
                edgeOpacity *= 5;
            }

            let highlightX = glowCenterX;
            let highlightY = glowCenterY;

            if (minDist === distToLeft) {
                highlightX = containerRect.left;
            } else if (minDist === distToRight) {
                highlightX = containerRect.right;
            } else if (minDist === distToTop) {
                highlightY = containerRect.top;
            } else {
                highlightY = containerRect.bottom;
            }

            const highlightIndex = index + 1;
            document.documentElement.style.setProperty(`--highlight-x-${highlightIndex}`, highlightX.toFixed(2));
            document.documentElement.style.setProperty(`--highlight-y-${highlightIndex}`, highlightY.toFixed(2));
            document.documentElement.style.setProperty(`--orbit-edge-opacity-${highlightIndex}`, edgeOpacity.toFixed(2));
        });
    }

    /**
     * 动画循环
     */
    animate = () => {
        this.rotationAngle += this.rotationSpeed;
        this.updateRandomCenter();
        this.updateOrbitingGlows();
        this.updateEdgeHighlight();

        this.animationFrameId = requestAnimationFrame(this.animate);
    }

    /**
     * 启动动画
     */
    start() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }

    /**
     * 停止动画
     */
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

// 导出单例
const backgroundAnimation = new BackgroundAnimation();
export default backgroundAnimation;
