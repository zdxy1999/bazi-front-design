/**
 * 档案页面脚本
 */

import WuxingChart from '../wuxing-chart.js';

// 初始化五行图表
document.addEventListener('DOMContentLoaded', () => {
    // 第一个图表 - 甲木命卦
    const chart1 = new WuxingChart('chart1', {
        elementPercentages: {
            wood: 35,
            fire: 20,
            earth: 15,
            metal: 15,
            water: 15
        },
        dayMaster: 'wood',
        size: 500
    });

    // 第二个图表 - 丙火命卦
    const chart2 = new WuxingChart('chart2', {
        elementPercentages: {
            wood: 15,
            fire: 40,
            earth: 20,
            metal: 10,
            water: 15
        },
        dayMaster: 'fire',
        size: 500
    });
});
