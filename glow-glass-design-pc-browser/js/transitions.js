/**
 * 过渡动画模块
 * 负责处理太极过场动画
 */

class TransitionManager {
    constructor() {
        this.transitionInProgress = false;
        this.rotationStartTime = 0;
        this.currentRotation = 0;
        this.rotationFrameId = null;
        this.flyInDuration = 600;
        this.accelDuration = 400;
    }

    /**
     * 开始过渡动画
     * @param {number} minLoadTime - 最小加载时间（毫秒）
     */
    start(minLoadTime = 2000) {
        if (this.transitionInProgress) return;
        this.transitionInProgress = true;

        const overlay = document.getElementById('transitionOverlay');
        const taichiContainer = document.getElementById('taichiContainer');
        const pageContent = document.getElementById('pageContent');

        if (!overlay || !taichiContainer) {
            console.error('Transition elements not found');
            return;
        }

        // 停止之前的旋转
        if (this.rotationFrameId) {
            cancelAnimationFrame(this.rotationFrameId);
            this.rotationFrameId = null;
        }

        // 重置状态
        this.rotationStartTime = 0;
        this.currentRotation = 0;
        taichiContainer.style.transform = 'rotate(0deg)';

        // 移除所有类
        overlay.classList.remove('active', 'show', 'assemble', 'fade-out');
        taichiContainer.classList.remove('rotating');

        // 1. 隐藏页面内容
        if (pageContent) {
            pageContent.classList.add('hidden');
        }

        // 2. 显示过场层
        overlay.classList.add('active');

        // 3. 显示太极容器
        setTimeout(() => {
            overlay.classList.add('show');
        }, 50);

        // 4. 阴阳鱼从左右飞入
        setTimeout(() => {
            overlay.classList.add('assemble');
        }, 300);

        // 5. 飞入完成后，开始旋转
        setTimeout(() => {
            taichiContainer.classList.add('rotating');
            this.rotationFrameId = requestAnimationFrame(this.updateRotation);
        }, 300 + this.flyInDuration);

        // 6. 旋转指定时间后，渐隐
        setTimeout(() => {
            overlay.classList.add('fade-out');
        }, 300 + this.flyInDuration + minLoadTime);

        // 7. 隐藏过场层并显示页面内容
        const fadeOutDuration = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--fade-out-duration')
        ) * 1000;

        setTimeout(() => {
            if (this.rotationFrameId) {
                cancelAnimationFrame(this.rotationFrameId);
                this.rotationFrameId = null;
            }
            overlay.classList.remove('active', 'show', 'assemble', 'fade-out');
            taichiContainer.classList.remove('rotating');
            taichiContainer.style.transform = 'rotate(0deg)';

            if (pageContent) {
                pageContent.classList.remove('hidden');
            }

            this.transitionInProgress = false;
        }, 300 + this.flyInDuration + minLoadTime + fadeOutDuration + 100);
    }

    /**
     * 更新旋转角度
     */
    updateRotation = (timestamp) => {
        if (!this.rotationStartTime) this.rotationStartTime = timestamp;
        const elapsed = timestamp - this.rotationStartTime;

        let speed;
        if (elapsed < this.accelDuration) {
            // 加速阶段
            const progress = elapsed / this.accelDuration;
            speed = 360 * 1.2 * progress;
        } else {
            // 匀速旋转
            speed = 360 * 1.2;
        }

        this.currentRotation -= speed * 0.016;
        const taichiContainer = document.getElementById('taichiContainer');
        if (taichiContainer) {
            taichiContainer.style.transform = `rotate(${this.currentRotation}deg)`;
        }

        this.rotationFrameId = requestAnimationFrame(this.updateRotation);
    }

    /**
     * 设置过渡时间
     * @param {number} duration - 过渡时间（秒）
     */
    setTransitionDuration(duration) {
        document.documentElement.style.setProperty('--transition-duration', `${duration}s`);
    }
}

// 导出单例
const transitionManager = new TransitionManager();
export default transitionManager;
