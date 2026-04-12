// 在home页面的Console中运行这个脚本来调试

console.log('\n========== 开始调试home页面 ==========\n');

// 1. 检查第一个卡片
const firstCard = document.querySelector('.glass-card');
if (firstCard) {
  console.log('✅ 找到第一个卡片');
  
  const inlineStyle = firstCard.getAttribute('style');
  console.log('inline style:', inlineStyle);
  
  const computed = window.getComputedStyle(firstCard);
  const h = computed.getPropertyValue('--theme-hue');
  const s = computed.getPropertyValue('--theme-saturation');
  const l = computed.getPropertyValue('--theme-lightness');
  
  console.log('计算后的CSS变量:');
  console.log('  --theme-hue:', h);
  console.log('  --theme-saturation:', s);
  console.log('  --theme-lightness:', l);
  
  // 检查是否有static-glow类
  console.log('类名:', firstCard.className);
  console.log('有static-glow类:', firstCard.classList.contains('static-glow'));
  
  // 检查.card-glow元素
  const cardGlow = firstCard.querySelector('.card-glow');
  if (cardGlow) {
    const glowStyle = window.getComputedStyle(cardGlow);
    console.log('.card-glow opacity:', glowStyle.opacity);
    console.log('.card-glow display:', glowStyle.display);
    
    // 检查是否有background
    console.log('.card-glow background:', glowStyle.background.substring(0, 100));
  } else {
    console.log('❌ 没有找到.card-glow元素');
  }
  
} else {
  console.log('❌ 没有找到卡片');
}

console.log('\n========== 调试结束 ==========\n');
